document.addEventListener('DOMContentLoaded', function () {
    const showAllButton = document.querySelector('#page-element-hider-popup .show-all-button');
    const optionsButton = document.querySelector('#page-element-hider-popup .options-button');

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
});
