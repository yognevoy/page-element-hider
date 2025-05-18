document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const hideTypeSelect = document.getElementById('hideType');
    const showBorderCheckbox = document.getElementById('showBorder');
    const borderSettingsDiv = document.getElementById('borderSettings');
    const borderColorInput = document.getElementById('borderColor');
    const borderStyleSelect = document.getElementById('borderStyle');
    const borderWidthInput = document.getElementById('borderWidth');
    const siteList = document.getElementById('siteList');
    const addSiteBtn = document.getElementById('addSiteBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');

    // Modal Elements
    const siteConfigModal = document.getElementById('siteConfigModal');
    const modalTitle = document.getElementById('modalTitle');
    const siteUrlInput = document.getElementById('siteUrl');
    const siteHideTypeSelect = document.getElementById('siteHideType');
    const selectorsList = document.getElementById('selectorsList');
    const addSelectorBtn = document.getElementById('addSelectorBtn');
    const clearSelectorsBtn = document.getElementById('clearSelectorsBtn');
    const cancelSiteBtn = document.getElementById('cancelSiteBtn');
    const saveSiteBtn = document.getElementById('saveSiteBtn');

    const selectorModal = document.getElementById('selectorModal');
    const selectorModalTitle = document.getElementById('selectorModalTitle');
    const selectorValueInput = document.getElementById('selectorValue');
    const cancelSelectorBtn = document.getElementById('cancelSelectorBtn');
    const saveSelectorBtn = document.getElementById('saveSelectorBtn');

    const confirmModal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const confirmBtn = document.getElementById('confirmBtn');

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close-modal');

    const defaultSettings = {
        generalSettings: {
            hideType: 'hide',
            showBorder: true,
            borderColor: '#ff0000',
            borderStyle: 'solid',
            borderWidth: 1
        },
        siteSettings: []
    };

    let currentSettings = {};

    let currentSiteIndex = -1;
    let currentSelectors = [];
    let currentSelectorIndex = -1;
    let confirmCallback = null;

    // Load settings
    function loadSettings() {
        browser.storage.local.get('pageElementHiderSettings')
            .then(result => {
                if (result.pageElementHiderSettings) {
                    currentSettings = result.pageElementHiderSettings;
                } else {
                    currentSettings = JSON.parse(JSON.stringify(defaultSettings));
                    saveSettings();
                }
                updateUI();
            })
            .catch(error => {
                console.error('Error loading settings:', error);
                currentSettings = JSON.parse(JSON.stringify(defaultSettings));
                updateUI();
            });
    }

    // Save settings
    function saveSettings() {
        browser.storage.local.set({
            pageElementHiderSettings: currentSettings
        }).catch(error => {
            console.error('Error saving settings:', error);
        });
    }

    // Update UI based on current settings
    function updateUI() {
        const { generalSettings } = currentSettings;

        hideTypeSelect.value = generalSettings.hideType;
        showBorderCheckbox.checked = generalSettings.showBorder;
        borderColorInput.value = generalSettings.borderColor;
        borderStyleSelect.value = generalSettings.borderStyle;
        borderWidthInput.value = generalSettings.borderWidth;

        borderSettingsDiv.style.display = generalSettings.showBorder ? 'block' : 'none';

        updateSiteList();
    }

    // Update the site list UI
    function updateSiteList() {
        siteList.innerHTML = '';

        if (currentSettings.siteSettings.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>No sites configured yet</p>';
            siteList.appendChild(emptyState);
            return;
        }

        currentSettings.siteSettings.forEach((site, index) => {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';

            const siteInfo = document.createElement('div');

            const siteUrl = document.createElement('div');
            siteUrl.className = 'site-url';
            siteUrl.textContent = site.url;

            const siteDetails = document.createElement('div');
            siteDetails.className = 'site-info';
            siteDetails.textContent = `${site.selectors.length} selector(s) | ${getHideTypeLabel(site.hideType)}`;

            siteInfo.appendChild(siteUrl);
            siteInfo.appendChild(siteDetails);

            const actions = document.createElement('div');
            actions.className = 'site-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-small';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                openSiteModal(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-small btn-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                showConfirmDialog(
                    `Are you sure you want to delete the rules for ${site.url}?`,
                    () => {
                        currentSettings.siteSettings.splice(index, 1);
                        saveSettings();
                        updateSiteList();
                    }
                );
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            siteItem.appendChild(siteInfo);
            siteItem.appendChild(actions);

            siteList.appendChild(siteItem);
        });
    }

    // Update selectors list in the modal
    function updateSelectorsList() {
        selectorsList.innerHTML = '';

        if (currentSelectors.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-selectors';
            emptyState.innerHTML = '<p>No selectors added yet</p>';
            selectorsList.appendChild(emptyState);
            return;
        }

        currentSelectors.forEach((selector, index) => {
            const selectorItem = document.createElement('div');
            selectorItem.className = 'selector-item';

            const selectorText = document.createElement('div');
            selectorText.textContent = selector;

            const actions = document.createElement('div');
            actions.className = 'site-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-small';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                openSelectorModal(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-small btn-danger';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                currentSelectors.splice(index, 1);
                updateSelectorsList();
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            selectorItem.appendChild(selectorText);
            selectorItem.appendChild(actions);

            selectorsList.appendChild(selectorItem);
        });
    }

    // Helper function to get readable label for hide type
    function getHideTypeLabel(hideType) {
        switch (hideType) {
            case 'hide': return 'Hide completely';
            case 'conceal': return 'Hide';
            case 'remove': return 'Remove';
            case 'default': return 'Use default';
            default: return 'Unknown';
        }
    }

    // Open site configuration modal
    function openSiteModal(siteIndex = -1) {
        currentSiteIndex = siteIndex;

        if (siteIndex === -1) {
            modalTitle.textContent = 'Add Site';
            siteUrlInput.value = '';
            siteHideTypeSelect.value = 'default';
            currentSelectors = [];
        } else {
            const site = currentSettings.siteSettings[siteIndex];
            modalTitle.textContent = 'Edit Site';
            siteUrlInput.value = site.url;
            siteHideTypeSelect.value = site.hideType;
            currentSelectors = [...site.selectors];
        }

        updateSelectorsList();
        siteConfigModal.style.display = 'block';
    }

    // Open selector input modal
    function openSelectorModal(selectorIndex = -1) {
        currentSelectorIndex = selectorIndex;

        if (selectorIndex === -1) {
            selectorModalTitle.textContent = 'Add Selector';
            selectorValueInput.value = '';
        } else {
            selectorModalTitle.textContent = 'Edit Selector';
            selectorValueInput.value = currentSelectors[selectorIndex];
        }

        selectorModal.style.display = 'block';
    }

    // Show confirmation dialog
    function showConfirmDialog(message, callback) {
        confirmMessage.textContent = message;
        confirmCallback = callback;
        confirmModal.style.display = 'block';
    }

    // Event Listeners

    // Show/hide border settings based on checkbox
    showBorderCheckbox.addEventListener('change', function () {
        const showBorder = this.checked;
        borderSettingsDiv.style.display = showBorder ? 'block' : 'none';
        currentSettings.generalSettings.showBorder = showBorder;
        saveSettings();
    });

    borderWidthInput.addEventListener('focusout', function () {
        let value = parseInt(this.value);
        if (isNaN(value)) value = 1;
        if (value < 1) value = 1;
        if (value > 10) value = 10;

        if (value !== parseInt(this.value)) {
            this.value = value;
        }

        currentSettings.generalSettings.borderWidth = value;
        saveSettings();
    });

    // Save general settings changes
    hideTypeSelect.addEventListener('change', function () {
        currentSettings.generalSettings.hideType = this.value;
        saveSettings();
    });

    borderColorInput.addEventListener('change', function () {
        currentSettings.generalSettings.borderColor = this.value;
        saveSettings();
    });

    borderStyleSelect.addEventListener('change', function () {
        currentSettings.generalSettings.borderStyle = this.value;
        saveSettings();
    });

    // Add new site button
    addSiteBtn.addEventListener('click', function () {
        openSiteModal();
    });

    // Reset all settings button
    resetAllBtn.addEventListener('click', function () {
        showConfirmDialog(
            'Are you sure you want to reset all settings to default? This cannot be undone.',
            () => {
                currentSettings = JSON.parse(JSON.stringify(defaultSettings));
                saveSettings();
                updateUI();
            }
        );
    });

    // Add selector button
    addSelectorBtn.addEventListener('click', function () {
        openSelectorModal();
    });

    // Clear all selectors button
    clearSelectorsBtn.addEventListener('click', function () {
        if (currentSelectors.length > 0) {
            showConfirmDialog(
                'Are you sure you want to clear all selectors?',
                () => {
                    currentSelectors = [];
                    updateSelectorsList();
                }
            );
        }
    });

    // Save site button
    saveSiteBtn.addEventListener('click', function () {
        const url = siteUrlInput.value.trim();

        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        const siteData = {
            url: url,
            hideType: siteHideTypeSelect.value,
            selectors: [...currentSelectors]
        };

        if (currentSiteIndex === -1) {
            currentSettings.siteSettings.push(siteData);
        } else {
            currentSettings.siteSettings[currentSiteIndex] = siteData;
        }

        saveSettings();
        updateSiteList();
        siteConfigModal.style.display = 'none';
    });

    // Cancel site button
    cancelSiteBtn.addEventListener('click', function () {
        siteConfigModal.style.display = 'none';
    });

    // Save selector button
    saveSelectorBtn.addEventListener('click', function () {
        const selectorValue = selectorValueInput.value.trim();

        if (!selectorValue) {
            alert('Please enter a valid CSS selector');
            return;
        }

        if (currentSelectorIndex === -1) {
            currentSelectors.push(selectorValue);
        } else {
            currentSelectors[currentSelectorIndex] = selectorValue;
        }

        updateSelectorsList();
        selectorModal.style.display = 'none';
    });

    // Cancel selector button
    cancelSelectorBtn.addEventListener('click', function () {
        selectorModal.style.display = 'none';
    });

    // Confirm dialog buttons
    confirmBtn.addEventListener('click', function () {
        if (confirmCallback) {
            confirmCallback();
            confirmCallback = null;
        }
        confirmModal.style.display = 'none';
    });

    cancelConfirmBtn.addEventListener('click', function () {
        confirmCallback = null;
        confirmModal.style.display = 'none';
    });

    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            siteConfigModal.style.display = 'none';
            selectorModal.style.display = 'none';
            confirmModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === siteConfigModal) {
            siteConfigModal.style.display = 'none';
        } else if (event.target === selectorModal) {
            selectorModal.style.display = 'none';
        } else if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });

    loadSettings();
});
