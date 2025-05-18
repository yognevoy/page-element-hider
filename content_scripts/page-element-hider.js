let targetElement = null;

document.addEventListener("contextmenu", function(event) {
  targetElement = event.target;
}, true);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "hideElement" && targetElement) {
    targetElement.style.display = "none";
    targetElement = null;
  }
});
