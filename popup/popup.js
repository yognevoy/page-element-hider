document.addEventListener('DOMContentLoaded', function () {
    const showAllButton = document.querySelector('#page-element-hider-popup .show-all-button');
    const autoHideButton = document.querySelector('#page-element-hider-popup .auto-hide-button');
    const optionsButton = document.querySelector('#page-element-hider-popup .options-button');
    const helpLink = document.querySelector('#page-element-hider-popup .help-link');

    autoHideButton.addEventListener('click', function () {
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                const currentUrl = tabs[0].url;
                browser.storage.local.set({ autoHideUrl: currentUrl }).then(() => {
                    browser.runtime.openOptionsPage();
                    window.close();
                });
            });
    });

    showAllButton.addEventListener('click', function () {
        browser.tabs.query({ active: true, currentWindow: true })
            .then(tabs => {
                return browser.tabs.sendMessage(tabs[0].id, {
                    action: "showAllElements"
                });
            })
            .then(response => {
                showAllButton.disabled = false;
            })
            .catch(error => {
                showAllButton.disabled = false;
            });
    });

    optionsButton.addEventListener('click', function () {
        browser.runtime.openOptionsPage().then(() => {
            window.close();
        });
    });

    helpLink.addEventListener('click', function () {
        browser.tabs.create({
            url: "../help/help.html"
        });
    });
});
