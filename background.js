// Event listener for clicks on context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addnote") {
        chrome.tabs
            .query({
                active: true,
                currentWindow: true
            }).then((tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "addNote" }).then(() => {
                    console.log('Note added');
                }).catch((error) => {
                    console.error('Error adding note:', error);
                });
            });
    } else if (info.menuItemId === "linkremove") {
        console.log('Context menu clicked to remove link');
        chrome.tabs
            .query({
                active: true,
                currentWindow: true
            }).then((tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "removeLink", linkUrl: info.linkUrl }).then(() => {
                    console.log('Link removed');
                }).catch((error) => {
                    console.error('Error removing link:', error);
                });
            });
    }
    else if (info.menuItemId === "synctheme") {
        var synctheme = info.checked;
        chrome.tabs
            .query({
                active: true,
                currentWindow: true
            }).then((tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "syncTheme", sync: synctheme }).then(() => {
                    console.log('Theme sync status updated:', synctheme);
                }).catch((error) => {
                    console.error('Error updating theme sync status:', error);
                });
            });
    }
    else if (info.menuItemId === "undodeleted") {
        chrome.tabs
            .query({
                active: true,
                currentWindow: true
            }).then((tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "undoDelete" }).then(() => {
                    console.log('Undo delete action triggered');
                }).catch((error) => {
                    console.error('Error undoing delete:', error);
                });
            });
    }
});

// Listener for message from content script
chrome.runtime.onMessage.addListener((request, sendResponse) => {
    if (request.action === "undoDelete") {
        chrome.contextMenus.update("undodeleted", { enabled: request.enabled });
    } else if (request.action === "updateSyncTheme") {
        chrome.contextMenus.update("synctheme", { checked: request.checked });
    }
});

// Add context menu Items
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "addnote",
        title: "Add Note",
        contexts: ["action"],
    });
    chrome.contextMenus.create({
        id: "linkremove",
        title: "Remove link",
        contexts: ["link"],
    });
    chrome.contextMenus.create({
        id: "synctheme",
        title: "Sync Theme across all Notes",
        contexts: ["action"],
        checked: false,
        type: "checkbox"
    });
    chrome.contextMenus.create({
        id: "undodeleted",
        title: "Undo Delete Note",
        enabled: false,
        contexts: ["action"],
    });
    chrome.contextMenus.create({
        id: "creditforicon",
        title: "Notepad icons by vectorspoint - Flaticon",
        enabled: false,
        contexts: ["action"]
    })
});