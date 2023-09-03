[English](README_en.md)|[中文](README.md)
# 自定义页面滚动 Chrome 扩展

## 概览

自定义页面滚动扩展允许用户使用键盘快捷键在网页上滚动特定元素。这是一个方便的工具，通过给您更多地控制如何导航网页内容来增强您的浏览体验。

## 功能

- 自定义 Page Up 和 Page Down 的滚动距离。
- 自动检测页面上可滚动的元素。
- 设置中有易于使用的弹出界面。
- 适用于所有网站。

## 安装

1. 在 https://chrome.google.com/webstore/ 中搜索 pagedownup-modifier。
2. 安装。

> **注意**：安装后，您需要刷新所有打开的标签页或重新启动浏览器以使扩展正常工作。

## 使用方法

1. 使用键盘快捷键向上或向下滚动：

   - 向下滚动：`Alt+PageDown`
   - 向上滚动：`Alt+PageUp`

2. 要自定义滚动距离，请点击扩展图标以打开弹出界面。您可以为 Page Up 和 Page Down 设置距离。

## 技术细节

该扩展是使用以下技术构建的：

- Vue 3
- TypeScript
- Tailwind CSS
- Chrome APIs

## 贡献

随时欢迎提出问题和拉取请求！

## 许可证

MIT

## 对开发者的说明

### 文件夹

- `src` - 主源代码。
  - `content-script` - 作为 `content_script` 注入的脚本和组件。
    - `iframe` - 将被注入页面的内容脚本 iframe vue3 应用。
  - `background` - 后台脚本。
  - `popup` - 弹出 vuejs 应用程序根目录。
    - `pages` - 弹出页面。
  - `options` - 选项 vuejs 应用程序根目录。
    - `pages` - 选项页面。
  - `pages` - 应用程序页面，适用于所有视图（关于、联系、身份验证等）。
  - `components` - 在弹出和选项页面中共享的自动导入的 Vue 组件。
  - `assets` - 用于 Vue 组件的资产。

### 开发

```bash
pnpm dev
```

然后**用 `dist/` 文件夹在浏览器中加载扩展**。

### 构建

要构建扩展，请运行

```bash
pnpm build
```

然后打包 `dist` 下的文件，您可以将 `dist.crx` 或 `dist.xpi` 上传到适当的扩展商店。"# ChatGPT-AutoLayoutFixer" 
