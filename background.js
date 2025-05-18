browser.contextMenus.create({
  id: "hide-element",
  title: "Hide Element",
  contexts: ["all"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "hide-element") {
    browser.tabs.sendMessage(tab.id, { action: "hideElement" });
  }
});
