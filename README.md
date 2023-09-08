[English](README_en.md)|[中文](README.md)

# Chrome插件：优化网页布局和文本格式

## 简介

这个Chrome插件旨在优化ChatGPT网页布局和文本格式，以提供更好的阅读体验。它自动调整文本的宽度和边距，确保文本能够自动换行和适应屏幕。

## 功能

- 自动调整文本宽度和边距
- 支持自动换行和适应屏幕
- 提供快捷键以在全屏和标准视图之间切换
- 实时应用更改，感谢内置的Mutation Observer

## 安装

1. [chrome store](https://chrome.google.com/webstore/detail/chatgpt-web-modifier/cigmahfmggnpedigkgcadmniogngeamm/related?hl=zh-CN&authuser=0)

## 使用

- 使用快捷键（默认为Ctrl+Shift+F）在全屏和标准视图之间切换。

## 开发

这个项目使用原生JavaScript和Chrome API。

## 贡献

欢迎任何形式的贡献！请确保在提交Pull Request之前测试你的更改。

## 许可

这个项目使用MIT许可证



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

然后打包 `dist` 下的文件，您可以将 `dist.crx` 或 `dist.xpi` 上传到适当的扩展商店。
