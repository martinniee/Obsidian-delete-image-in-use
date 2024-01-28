import { Menu, MenuItem, Notice, Plugin, TFile } from "obsidian";
import { addCommand } from "./config/addCommand-config";
import { NathanImageCleanerSettingsTab } from "./settings";
import { NathanImageCleanerSettings, DEFAULT_SETTINGS } from "./settings";
import * as Util from "./utils/util";
import { getMouseEventTarget } from "./utils/handlerEvent";
import { DeleteAllLogsModal } from "./modals/deletionPrompt";

interface Listener {
	(this: Document, ev: Event): any;
}

export default class NathanImageCleaner extends Plugin {
	settings: NathanImageCleanerSettings;

	async onload() {
		console.log("Fast file Cleaner plugin loaded...");

		this.addSettingTab(new NathanImageCleanerSettingsTab(this.app, this));

		await this.loadSettings();
		this.registerDocument(document);

		app.workspace.on("window-open", (workspaceWindow, window) => {
			this.registerDocument(window.document);
		});
		// add contextmenu on file context
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFile) {
					const addMenuItem = (item: MenuItem) => {
						item.setTitle("Delete the file and its all attachments")
							.setIcon("trash-2")
							.setSection("danger");
						item.onClick(async () => {
							const modal = new DeleteAllLogsModal(file, this);
							modal.open();
						});
					};
					menu.addItem(addMenuItem);
				}
			})
		);
		// register all commands in addCommand function
		addCommand(this);
	}

	onunload() {
		console.log("Fast file Cleaner plugin unloaded...");
	}

	onElement(
		el: Document,
		event: keyof HTMLElementEventMap,
		selector: string,
		listener: Listener,
		options?: { capture?: boolean }
	) {
		el.on(event, selector, listener, options);
		return () => el.off(event, selector, listener, options);
	}

	registerDocument(document: Document) {
		this.register(
			this.onElement(
				document,
				"contextmenu" as keyof HTMLElementEventMap,
				"img, iframe, video, div.file-embed-title,audio",
				this.onClick.bind(this)
			)
		);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	registerEscapeButton(menu: Menu, document: Document = activeDocument) {
		menu.register(
			this.onElement(
				document,
				"keydown" as keyof HTMLElementEventMap,
				"*",
				(e: KeyboardEvent) => {
					if (e.key === "Escape") {
						e.preventDefault();
						e.stopPropagation();
						menu.hide();
					}
				}
			)
		);
	}

	addMenu = (menu: Menu, imgPath: string, currentMd: TFile) => {
		menu.addItem((item: MenuItem) =>
			item
				.setIcon("trash-2")
				.setTitle("clear file and referenced link")
				.onClick(async () => {
					try {
						Util.handlerDelFile(imgPath, currentMd, this);
					} catch {
						new Notice("Error, could not clear the file!");
					}
				})
		);
	};

	onClick(event: MouseEvent) {
		const target = getMouseEventTarget(event);
		const nodeType = target.localName;

		const currentMd = app.workspace.getActiveFile() as TFile;

		const menu = new Menu();
		let imgPath = "";
		const delTargetType = ["img", "iframe", "video", "div", "audio"];

		if (delTargetType.includes(nodeType)) {
			imgPath = target.parentElement?.getAttribute("src") as string;
			this.addMenu(menu, imgPath, currentMd);
		}
		this.registerEscapeButton(menu);
		menu.showAtPosition({ x: event.pageX, y: event.pageY - 40 });
		this.app.workspace.trigger("NL-fast-file-cleaner:contextmenu", menu);
	}
}
