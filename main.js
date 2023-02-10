/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => NathanDeleteImage
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  deleteOption: ".trash",
  logsModal: true
};
var NathanDeleteImageSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Fast Image Cleaner Settings" });
    new import_obsidian.Setting(containerEl).setName("Deleted Image Destination").setDesc("Select where you want images to be moved once they are deleted").addDropdown((dropdown) => {
      dropdown.addOption("permanent", "Delete Permanently");
      dropdown.addOption(".trash", "Move to Obsidian Trash");
      dropdown.addOption("system-trash", "Move to System Trash");
      dropdown.setValue(this.plugin.settings.deleteOption);
      dropdown.onChange((option) => {
        this.plugin.settings.deleteOption = option;
        this.plugin.saveSettings();
      });
    });
  }
};

// src/util.ts
var import_obsidian2 = require("obsidian");
var SUCCESS_NOTICE_TIMEOUT = 1800;
var getAllImgDivs = () => {
  var _a;
  const leaf_active = document.getElementsByClassName("workspace-leaf mod-active");
  const preview_content = leaf_active[0].getElementsByClassName("markdown-source-view cm-s-obsidian mod-cm6 is-folding is-live-preview node-insert-event");
  const embed_divs = (_a = preview_content[0]) == null ? void 0 : _a.getElementsByClassName("internal-embed media-embed image-embed is-loaded");
  return embed_divs;
};
var trimFromRegExp = (origin_str, regex) => {
  const matching_array = Array.from(origin_str.matchAll(regex));
  for (let i = 0; i < matching_array.length; i++) {
    origin_str = origin_str.replace(matching_array[i][0], "");
  }
  return origin_str;
};
var removeReferenceLink = async (imagePath, mdFile) => {
  const origin_filecontents = await app.vault.read(mdFile);
  const new_filecontents = [];
  const fileContents_array = origin_filecontents.split("\n");
  for (const fileContent of fileContents_array) {
    const regRefLink1 = new RegExp("!\\[(.*)?\\]\\(((.*\\/)+)?" + imagePath + "\\)", "gm");
    const regRefLink2 = new RegExp("!\\[\\[.*?" + imagePath + "\\]\\]", "gm");
    const isEscaped = fileContent.includes("%20");
    const fileContent_decode = decodeURI(fileContent);
    const isIncludeImage = fileContent_decode.includes(imagePath);
    const isMarkdownStyle = fileContent_decode.match(regRefLink1) != null;
    const isWikiStyle = fileContent_decode.match(regRefLink2) != null;
    if (isEscaped) {
      if (isIncludeImage && isMarkdownStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink1));
      } else if (isIncludeImage && isWikiStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink2));
      } else {
        new_filecontents.push(fileContent);
      }
    } else {
      if (isIncludeImage && isMarkdownStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink1));
      } else if (isIncludeImage && isWikiStyle) {
        new_filecontents.push(trimFromRegExp(fileContent_decode, regRefLink2));
      } else {
        new_filecontents.push(fileContent);
      }
    }
  }
  app.vault.adapter.write(mdFile.path, new_filecontents.join("\n"));
};
var addDelBtn = (img_list) => {
  for (let index = 0; index < (img_list == null ? void 0 : img_list.length); index++) {
    const btn_del = document.createElement("button");
    btn_del.setAttribute("class", "btn-delete");
    btn_del.setAttribute("aria-label", "Delete current image");
    btn_del.innerHTML = '<svg fill="#ff0000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48px" height="48px"><path d="M 28 7 C 25.243 7 23 9.243 23 12 L 23 15 L 13 15 C 11.896 15 11 15.896 11 17 C 11 18.104 11.896 19 13 19 L 15.109375 19 L 16.792969 49.332031 C 16.970969 52.510031 19.600203 55 22.783203 55 L 41.216797 55 C 44.398797 55 47.029031 52.510031 47.207031 49.332031 L 48.890625 19 L 51 19 C 52.104 19 53 18.104 53 17 C 53 15.896 52.104 15 51 15 L 41 15 L 41 12 C 41 9.243 38.757 7 36 7 L 28 7 z M 28 11 L 36 11 C 36.552 11 37 11.449 37 12 L 37 15 L 27 15 L 27 12 C 27 11.449 27.448 11 28 11 z M 19.113281 19 L 44.886719 19 L 43.212891 49.109375 C 43.153891 50.169375 42.277797 51 41.216797 51 L 22.783203 51 C 21.723203 51 20.846109 50.170328 20.787109 49.111328 L 19.113281 19 z M 32 23.25 C 31.033 23.25 30.25 24.034 30.25 25 L 30.25 45 C 30.25 45.966 31.033 46.75 32 46.75 C 32.967 46.75 33.75 45.966 33.75 45 L 33.75 25 C 33.75 24.034 32.967 23.25 32 23.25 z M 24.642578 23.251953 C 23.677578 23.285953 22.922078 24.094547 22.955078 25.060547 L 23.652344 45.146484 C 23.685344 46.091484 24.462391 46.835938 25.400391 46.835938 C 25.421391 46.835938 25.441891 46.835938 25.462891 46.835938 C 26.427891 46.801938 27.183391 45.991391 27.150391 45.025391 L 26.453125 24.939453 C 26.419125 23.974453 25.606578 23.228953 24.642578 23.251953 z M 39.355469 23.251953 C 38.388469 23.224953 37.580875 23.974453 37.546875 24.939453 L 36.849609 45.025391 C 36.815609 45.991391 37.571109 46.801938 38.537109 46.835938 C 38.558109 46.836938 38.578609 46.835938 38.599609 46.835938 C 39.537609 46.835938 40.314656 46.091484 40.347656 45.146484 L 41.044922 25.060547 C 41.078922 24.094547 40.321469 23.285953 39.355469 23.251953 z" /></svg>';
    img_list[index].appendChild(btn_del);
  }
};
var clearAllDelBtns = () => {
  const btn_dels = document.getElementsByClassName("btn-delete");
  Array.from(btn_dels).forEach((btn_del) => {
    var _a;
    (_a = btn_del.parentNode) == null ? void 0 : _a.removeChild(btn_del);
  });
};
var isRemoveImage = (imageName) => {
  const currentMd = app.workspace.getActiveFile();
  const de_img = getImageFileByName(currentMd, imageName);
  const md_path = [];
  let cur_md_path = "";
  let ref_num = 0;
  const resolvedLinks = app.metadataCache.resolvedLinks;
  for (const [mdFile, links] of Object.entries(resolvedLinks)) {
    if (currentMd.path === mdFile) {
      cur_md_path = currentMd.path;
      md_path.unshift(cur_md_path);
    }
    for (const [filePath, nr] of Object.entries(links)) {
      if (de_img.path === filePath) {
        ref_num++;
        if (nr > 1) {
          ref_num += 1;
        }
        md_path.push(mdFile);
      }
    }
  }
  const result = ref_num > 1 ? false : true;
  return [result, md_path];
};
var getImageFileByName = (currentMd, imageName) => {
  const resolvedLinks = app.metadataCache.resolvedLinks;
  for (const [mdFile, links] of Object.entries(resolvedLinks)) {
    if (currentMd.path === mdFile) {
      for (const [filePath, nr] of Object.entries(links)) {
        if (filePath.includes(imageName)) {
          try {
            const imageFile = app.vault.getAbstractFileByPath(filePath);
            if (imageFile instanceof import_obsidian2.TFile) {
              return imageFile;
            }
          } catch (error) {
            new import_obsidian2.Notice(` cannot get the image file`);
            return void 0;
          }
        }
      }
    }
  }
};
var deleteImg = (targetImg, imageName, plugin) => {
  const deleteOption = plugin.settings.deleteOption;
  let file;
  const imgType = targetImg.localName;
  switch (imgType) {
    case "img": {
      const imageUrl = targetImg.currentSrc;
      const thisURL = new URL(imageUrl);
      const currentMd = app.workspace.getActiveFile();
      file = getImageFileByName(currentMd, imageName);
      if (file == void 0) {
        console.error(" cannot get image file ");
      }
      const Proto = thisURL.protocol;
      switch (Proto) {
        case "app:":
        case "data:":
        case "http:":
        case "https:":
          removeReferenceLink(imageName, app.workspace.getActiveFile());
          if (deleteOption === ".trash") {
            app.vault.trash(file, false);
            new import_obsidian2.Notice("Image moved to Obsidian Trash !", SUCCESS_NOTICE_TIMEOUT);
          } else if (deleteOption === "system-trash") {
            app.vault.trash(file, true);
            new import_obsidian2.Notice("Image moved to System Trash !", SUCCESS_NOTICE_TIMEOUT);
          } else if (deleteOption === "permanent") {
            app.vault.delete(file);
            new import_obsidian2.Notice("Image deleted Permanently !", SUCCESS_NOTICE_TIMEOUT);
          }
          break;
        default:
          new import_obsidian2.Notice(`no handler for ${Proto} protocol`);
          return;
      }
      break;
    }
    default:
      new import_obsidian2.Notice("No handler for this image type!");
      return;
  }
};

// src/modals.ts
var import_obsidian3 = require("obsidian");
var LogsModal = class extends import_obsidian3.Modal {
  constructor(currentMd, imgBaseName, textToView, app2) {
    super(app2);
    this.textToView = textToView;
    this.currentMd = currentMd;
    this.imgBaseName = imgBaseName;
  }
  getLog() {
    const fistEle = this.textToView.shift();
    const cur_md = "The md document that currently references the image: </br>" + fistEle + "</br></br>";
    let other_md = this.textToView.join("</br>");
    other_md = "List of all documents that reference this image: </br>" + other_md;
    const log = cur_md + other_md;
    return log;
  }
  onOpen() {
    const { contentEl } = this;
    const myModal = this;
    const headerWrapper = contentEl.createEl("div");
    headerWrapper.addClass("fast-image-cleaner-center-wrapper");
    const headerEl = headerWrapper.createEl("h1", {
      text: " Detection of multiple image reference links - logs "
    });
    headerEl.addClass("modal-title");
    const logs = contentEl.createEl("div");
    logs.addClass("fast-image-cleaner-log");
    logs.innerHTML = this.getLog();
    const buttonWrapper = contentEl.createEl("div");
    buttonWrapper.addClass("fast-image-cleaner-center-wrapper");
    const closeButton = buttonWrapper.createEl("button", { text: "close" });
    const removeLinkButton = buttonWrapper.createEl("button", {
      text: "remove link"
    });
    closeButton.addClass("unused-images-button");
    closeButton.setAttribute("aria-label", "close the window");
    removeLinkButton.addClass("unused-images-button");
    removeLinkButton.setAttribute("aria-label", "Continue to remove the reference link to the current image in the current document");
    closeButton.addEventListener("click", () => {
      myModal.close();
    });
    removeLinkButton.addEventListener("click", () => {
      removeReferenceLink(this.imgBaseName, this.currentMd);
      myModal.close();
    });
  }
};

// src/main.ts
var img_target;
var NathanDeleteImage = class extends import_obsidian4.Plugin {
  async onload() {
    console.log("Fast Image Cleaner plugin loaded...");
    this.addSettingTab(new NathanDeleteImageSettingsTab(this.app, this));
    await this.loadSettings();
    this.registerDocument(document);
    app.workspace.on("window-open", (workspaceWindow, window2) => {
      this.registerDocument(window2.document);
    });
    app.workspace.on("file-open", () => {
      clearAllDelBtns();
      addDelBtn(getAllImgDivs());
    });
    app.workspace.on("editor-change", () => {
      clearAllDelBtns();
      addDelBtn(getAllImgDivs());
    });
    app.workspace.on("active-leaf-change", () => {
      clearAllDelBtns();
      addDelBtn(getAllImgDivs());
    });
    this.registerInterval(window.setInterval(() => console.log("setInterval"), 5 * 60 * 1e3));
  }
  onunload() {
    console.log("Fast Image Cleaner plugin unloaded...");
  }
  onElement(el, event, selector, listener, options) {
    el.on(event, selector, listener, options);
    return () => el.off(event, selector, listener, options);
  }
  registerDocument(document2) {
    this.register(this.onElement(document2, "click", ".btn-delete", this.onClick.bind(this)));
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  onClick(event) {
    var _a, _b;
    event.preventDefault();
    const target = event.target;
    const nodeType = target.localName;
    let del_btn = document.createElement("button");
    if (nodeType === "button" || nodeType === "svg" || nodeType === "path") {
      del_btn = target.closest(".btn-delete");
      img_target = (_a = del_btn.parentNode) == null ? void 0 : _a.querySelector("img");
      const currentMd = app.workspace.getActiveFile();
      const imgBaseName = (_b = img_target.parentElement) == null ? void 0 : _b.getAttribute("src");
      if (isRemoveImage(imgBaseName)[0]) {
        deleteImg(img_target, imgBaseName, this);
      } else {
        const logs = isRemoveImage(imgBaseName)[1];
        const modal = new LogsModal(currentMd, imgBaseName, logs, this.app);
        modal.open();
      }
    }
  }
};
