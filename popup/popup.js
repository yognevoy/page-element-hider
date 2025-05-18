document.addEventListener('DOMContentLoaded', function () {
    const showAllButton = document.querySelector('#page-element-hider-popup .show-all-button');

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

});
