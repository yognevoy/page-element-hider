# Page Element Hider

A Firefox extension that gives you control over what appears on websites, allowing you to create a cleaner, more focused browsing experience by hiding distracting or unwanted elements.

[![Release](https://img.shields.io/badge/release-v.1.0.0-blue.svg)](https://github.com/yognevoy/page-element-hider/releases/tag/v1.0.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/yognevoy/page-element-hider/blob/master/LICENSE.txt)
![Mozilla Add-on Rating](https://img.shields.io/amo/rating/page-element-hider)

## Features

Page Element Hider provides powerful and simple tools to customize your web browsing experience:
**Simple Element Hiding** - Right-click on any webpage element and select the hiding option from the context menu to instantly remove distracting content. 

**Multiple Hiding Methods** - Choose how elements disappear:
- Hide Completely: Removes the element from view
- Conceal: Makes the element transparent while preserving page layout
- Remove: Physically removes the element from the DOM

**Visual Selection Feedback** - When selecting elements, a brief highlighting effect with customizable border color and thickness helps identify exactly what you're targeting.

**Site-Specific Rules** - Create persistent hiding rules for your frequently visited websites. Add domains to your auto-hide list, define specific CSS selectors, and have rules automatically applied whenever you visit those sites. 

**Settings Page** - Easily manage all your preferences in one organized interface.

## Getting started

### Installation

You can install Page Element Hider directly from the Mozilla Add-ons store:
1. Visit the [Page Element Hider page](https://addons.mozilla.org/ru/firefox/addon/page-element-hider/) on Mozilla Add-ons 
2. Click "Add to Firefox"
3. Follow the prompts to complete installation

For development purposes, you can install it manually:
```bash
git clone https://github.com/yourusername/page-element-hider.git
```

## Usage

### Basic Usage

Page Element Hider integrates seamlessly with your browsing experience. To hide an element, simply navigate to any webpage, right-click on the element you want to hide, and select "Hide Element" from the context menu. The element will be hidden according to your default hiding method.

### Customizing Hiding Method

You can choose different hiding methods for different situations. Right-click on an element, hover over "Hide Element" in the context menu, and select your preferred method: Hide Completely, Conceal (transparent), or Remove from DOM.

### Managing Site Rules

The extension allows you to set up persistent rules for websites you visit frequently. Click the Page Element Hider icon in your browser toolbar and navigate to the "Site Rules" tab. Here you can view all your existing rules, add new rules by domain and CSS selector, edit existing rules, or delete rules you no longer need.

### Configuring Settings

Customize Page Element Hider to work exactly how you want. Click the extension icon in your browser toolbar, navigate to the "Settings" tab, and adjust your preferences for default hiding method, selection highlight color and thickness, and other extension options.

## Browser/OS Compatibility

Page Element Hider currently works with Firefox browsers. We don't have any guarantees of compatibility for other browsers,
but we will verify and add more to the list as soon as possible.
Some of these browsers present minor issues that are reported in our
[issues](https://github.com/yognevoy/page-element-hider/issues) list.

## How to Contribute

If you find a bug or have a feature request, please check the [Issues page](https://github.com/yognevoy/page-element-hider/issues) before creating a new one. For code contributions, fork the repository, make your changes on a new branch, and submit a pull request with a clear description of the changes. Please make sure to test your changes thoroughly before submitting.

## License
This project is licensed under the MIT License - see the [LICENSE.txt](https://github.com/yognevoy/page-element-hider/blob/master/LICENSE.txt) file for details.
