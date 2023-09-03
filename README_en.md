[English](README_en.md)|[Chinese](README.md) 

## Chrome Plugin: Optimize Web Layout and Text Formatting 

## Introduction 

This Chrome plugin is designed to optimize ChatGPT web page layout and text formatting to provide a better reading experience. It automatically adjusts the width and margins of the text to ensure that the text automatically line breaks and adapts to the screen. 

## Features 

- Automatically adjusts text width and margins 
- Supports automatic line breaks and screen adaptation 
- Provides shortcuts to switch between full screen and standard view .
- Apply changes in real time, thanks to the built-in Mutation Observer .

## Installation 

1. Clone this repository locally 
2. Open Chrome and go to `chrome://extensions/`. 3 .
3. Turn on "Developer Mode". 4 .
4. Click "Load Extracted Extensions" and select the folder of this project .

## Using 

- Use the shortcut (Ctrl+Shift+F by default) to switch between full screen and standard view .

## Developing 

This project uses native JavaScript and the Chrome API .

## Contribute 

Contributions of any kind are welcome! Be sure to test your changes before submitting a Pull Request. 

## License 

This project uses the MIT license! 



## Instructions for developers 

### Folders 

- `src` - The main source code .
  - `content-script` - Scripts and components injected as `content_script` .
    - `iframe` - The content script that will be injected into the page iframe vue3 application .
  - `background` - The background script .
  - `popup` - Popup of the vuejs application root directory .
    - `pages` - Popup pages .
  - `options` - Options for the vuejs application root .
    - `pages` - The options page .
  - `pages` - Application pages for all views (about, contact, authentication, etc.) .
  - `components` - Automatically imported Vue components shared in popups and options pages .
  - `assets` - Assets for Vue components .

### Development 

``bash 
pnpm dev 
``

Then **use the ``dist/`` folder to load the extension in the browser**. 

### Build 

To build the extension, run 

```bash 
pnpm build 
``

Then package the files under ``dist`` and you can upload ``dist.crx`` or ``dist.xpi`` to the appropriate extension store .