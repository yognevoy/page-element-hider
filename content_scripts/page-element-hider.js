let hiddenElements = [];
let targetElement = null;
let highlightedElement = null;
let highlightTimeout = null;
let highlightListener = null;

document.addEventListener("contextmenu", async function (event) {
  targetElement = event.target;

  // Highlight the element when right-clicked
  const settings = await loadSettings();
  highlightElement(targetElement, settings);
}, true);

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === "hideElement" && targetElement) {
    const settings = await loadSettings();
    hideElement(targetElement, settings);
    targetElement = null;
    return { hiddenCount: hiddenElements.length };
  }

  if (message.action === "showAllElements") {
    const count = hiddenElements.length;

    hiddenElements.forEach(item => {
      switch (item.hideType) {
        case 'hide':
          item.element.style.display = item.originalDisplay;
          break;
        case 'conceal':
          item.element.style.visibility = item.originalVisibility;
          break;
        case 'remove':
          // Can't restore removed elements
          break;
      }
    });

    hiddenElements = [];

    return { shownCount: count };
  }
});


// Load settings
async function loadSettings() {
  try {
    const result = await browser.storage.local.get('pageElementHiderSettings');
    if (result.pageElementHiderSettings) {
      return result.pageElementHiderSettings;
    } else {
      return {
        generalSettings: {
          hideType: 'hide',
          showBorder: true,
          borderColor: '#ff0000',
          borderStyle: 'solid',
          borderWidth: 1
        },
        siteSettings: []
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    return getDefaultSettings();
  }
}

// Get default user settings
function getDefaultSettings() {
  return {
    generalSettings: {
      hideType: 'hide',
      showBorder: false,
      borderColor: '#000000',
      borderStyle: 'solid',
      borderWidth: 1
    },
    siteSettings: []
  };
}

// Hide element based on settings
function hideElement(element, settings) {
  const originalState = {
    element: element,
    originalDisplay: element.style.display || '',
    originalVisibility: element.style.visibility || '',
    hideType: settings.generalSettings.hideType
  };

  hiddenElements.push(originalState);

  switch (settings.generalSettings.hideType) {
    case 'hide':
      element.style.display = 'none';
      break;
    case 'conceal':
      element.style.visibility = 'hidden';
      break;
    case 'remove':
      element.remove();
      break;
  }
}

function highlightElement(element, settings) {
  if (!settings.generalSettings.showBorder) return;

  if (highlightedElement && highlightListener) {
    highlightedElement.removeEventListener('transitionend', highlightListener);
    highlightListener = null;
  }

  // Clear any existing highlight
  if (highlightedElement) {
    if (highlightedElement.parentNode) {
      document.body.removeChild(highlightedElement);
    }
    highlightedElement = null;
  }

  if (highlightTimeout) {
    clearTimeout(highlightTimeout);
    highlightTimeout = null;
  }

  const rect = element.getBoundingClientRect();

  // Create highlight div
  const highlightDiv = document.createElement('div');
  highlightDiv.style.position = 'absolute';
  highlightDiv.style.left = `${rect.left + window.scrollX}px`;
  highlightDiv.style.top = `${rect.top + window.scrollY}px`;
  highlightDiv.style.width = `${rect.width}px`;
  highlightDiv.style.height = `${rect.height}px`;
  highlightDiv.style.border = `${settings.generalSettings.borderWidth}px ${settings.generalSettings.borderStyle} ${settings.generalSettings.borderColor}`;
  highlightDiv.style.boxSizing = 'border-box';
  highlightDiv.style.pointerEvents = 'none';
  highlightDiv.style.zIndex = '2147483647';

  highlightDiv.style.transition = 'none';
  highlightDiv.style.opacity = '1';

  document.body.appendChild(highlightDiv);
  highlightedElement = highlightDiv;

  // Force reflow to ensure opacity is applied before transition
  highlightDiv.offsetHeight;

  highlightDiv.style.transition = 'opacity 1000ms';

  highlightTimeout = setTimeout(() => {
    if (highlightedElement) {
      highlightedElement.style.opacity = '0';

      highlightListener = function () {
        if (highlightedElement && highlightedElement.parentNode) {
          document.body.removeChild(highlightedElement);
          highlightedElement = null;
        }
        highlightListener = null;
      };

      highlightedElement.addEventListener('transitionend', highlightListener);
    }
  }, 0);
}
