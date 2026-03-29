# Markdown Annotator

A VS Code extension for adding annotations, highlights, and comments to Markdown documents.

## Features

- 🎨 **Highlight Text**: Add colored highlights to important text
- 💬 **Add Comments**: Attach comments to selected text (inserted as HTML comments)
- 🧹 **Clear All**: Remove all annotations from the current file
- 📤 **Export Annotations**: Export all annotations to JSON file

---

## 安装和使用（普通用户）

### 方法一：直接安装 .vsix 文件（推荐）

1. **下载插件文件**
   
   去 [Releases 页面](https://github.com/Jack-Long-2022/vscode-markdown-annotator/releases) 下载最新的 `vscode-markdown-annotator-x.x.x.vsix` 文件

2. **在 VS Code 中安装**
   
   - 打开 VS Code
   - 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）打开命令面板
   - 输入 `Extensions: Install from VSIX...` 并选择
   - 选择刚才下载的 `.vsix` 文件
   - 安装完成后重启 VS Code

3. **开始使用**
   
   打开任意 `.md` 文件：
   - 选中文字，按 `Ctrl+Alt+H` 添加高亮
   - 选中文字，按 `Ctrl+Alt+C` 添加注释

### 方法二：从源码安装（开发者）

如果你想在本地修改代码或调试：

```bash
# 1. 克隆仓库
git clone https://github.com/Jack-Long-2022/vscode-markdown-annotator.git
cd vscode-markdown-annotator

# 2. 安装依赖
npm install

# 3. 用 VS Code 打开项目
code .

# 4. 按 F5 启动调试
# 会打开一个新的 VS Code 窗口，在里面测试插件
```

**注意**：F5 调试需要先安装 `npm install`，否则会报错。

---

## 使用说明

### 添加高亮
1. 在 Markdown 文件中选中要高亮的文字
2. 按 `Ctrl+Alt+H`（Mac: `Cmd+Alt+H`）
3. 选择高亮颜色（黄色/绿色/蓝色/粉色/橙色）

### 添加注释
1. 在 Markdown 文件中选中要注释的文字
2. 按 `Ctrl+Alt+C`（Mac: `Cmd+Alt+C`）
3. 在输入框中输入注释内容
4. 注释会以 HTML 注释的形式插入到选中文字后面

### 清除所有标注
- 按 `Ctrl+Shift+P`，输入 `Markdown Annotator: Clear All Annotations`

### 导出标注
- 按 `Ctrl+Shift+P`，输入 `Markdown Annotator: Export Annotations`
- 选择保存位置，所有标注会导出为 JSON 文件

---

## 快捷键

| 功能 | Windows/Linux | macOS |
|------|---------------|-------|
| 添加高亮 | `Ctrl+Alt+H` | `Cmd+Alt+H` |
| 添加注释 | `Ctrl+Alt+C` | `Cmd+Alt+C` |

---

## 配置选项

在 VS Code 设置中搜索 `Markdown Annotator`：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `markdownAnnotator.highlightColor` | `yellow` | 默认高亮颜色 |
| `markdownAnnotator.showInPreview` | `true` | 是否在预览中显示标注 |

---

## 常见问题

### Q: 安装后找不到命令？
A: 重启 VS Code，确保打开的是 `.md` 文件（只有 Markdown 文件才会激活插件）

### Q: 高亮消失了？
A: 高亮是临时的（基于装饰器），关闭文件后会消失。如果需要持久化，请使用"导出标注"功能保存。

### Q: 注释在哪里？
A: 注释会作为 HTML 注释 `<!-- ... -->` 插入到 Markdown 文件中，在预览模式下不可见，但会保存在文件里。

---

## License

MIT
