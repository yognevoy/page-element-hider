let hiddenElements = [];
let targetElement = null;

document.addEventListener("contextmenu", function(event) {
  targetElement = event.target;
}, true);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "hideElement" && targetElement) {
    hiddenElements.push({
      element: targetElement,
      originalDisplay: targetElement.style.display || ''
    });
    
    targetElement.style.display = "none";
    targetElement = null;
    
    return Promise.resolve({ hiddenCount: hiddenElements.length });
  }
  
  if (message.action === "showAllElements") {
    hiddenElements.forEach(item => {
      item.element.style.display = item.originalDisplay;
    });
    
    const count = hiddenElements.length;
    hiddenElements = [];
    
    return Promise.resolve({ shownCount: count });
  }
});
