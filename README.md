# Markdown Annotator

VS Code Markdown 标注插件 —— 添加高亮、注释，导出笔记。

## ✨ 功能特点

- 🎨 **彩色高亮** — 5种颜色标记重点内容
- 💬 **添加注释** — 为选中文字添加批注（以 HTML 注释形式保存）
- ⚡ **快速高亮** — 不弹窗，直接用默认颜色高亮
- 📋 **查看标注** — 列出当前文件所有标注，点击跳转
- 🗑️ **清除高亮** — 一键清除当前文件所有高亮
- 📤 **导出标注** — 导出为 JSON 文件，方便备份和分享

---

## 📦 安装

### 方法一：直接安装 .vsix（推荐）

1. 去 [Releases 页面](https://github.com/Jack-Long-2022/vscode-markdown-annotator/releases) 下载最新的 `.vsix` 文件

2. VS Code 安装：
   - 按 `Ctrl+Shift+P` 打开命令面板
   - 输入 `Extensions: Install from VSIX...`
   - 选择下载的 `.vsix` 文件
   - 重启 VS Code

### 方法二：从源码安装（开发者）

```bash
git clone https://github.com/Jack-Long-2022/vscode-markdown-annotator.git
cd vscode-markdown-annotator
npm install
code .
# 按 F5 启动调试
```

---

## 🎮 快捷键

| 功能 | Windows/Linux | macOS | 说明 |
|------|---------------|-------|------|
| **快速高亮** | `Ctrl+H` | `Cmd+H` | 直接用默认颜色高亮，不弹窗 |
| **添加高亮** | `Ctrl+Alt+H` | `Cmd+Alt+H` | 弹出颜色选择器 |
| **添加注释** | `Ctrl+Alt+C` | `Cmd+Alt+C` | 输入注释内容 |
| **查看标注** | `Ctrl+Alt+L` | `Cmd+Alt+L` | 列出所有标注 |
| **清除高亮** | `Ctrl+Alt+Delete` | `Cmd+Alt+Backspace` | 清除当前文件高亮 |
| **导出标注** | `Ctrl+Alt+E` | `Cmd+Alt+E` | 导出为 JSON |

也可以通过命令面板调用：`Ctrl+Shift+P` → 输入 `Markdown Annotator`

---

## ⚙️ 配置选项

打开 VS Code 设置，搜索 `Markdown Annotator`：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `highlightColor` | `yellow` | 默认高亮颜色（快速高亮用） |
| `alwaysShowColorPicker` | `true` | 添加高亮时是否总是显示颜色选择器 |
| `showInPreview` | `true` | 是否在预览模式显示标注（实验性） |
| `enableShortcuts` | `true` | 是否启用快捷键 |

### 修改默认高亮颜色

1. `Ctrl+,` 打开设置
2. 搜索 `markdownAnnotator.highlightColor`
3. 选择：`yellow` / `green` / `blue` / `pink` / `orange`

---

## 🔧 快捷键冲突怎么办？

如果快捷键与其他软件或 VS Code 插件冲突，有几种解决方案：

### 方案一：修改快捷键

1. `Ctrl+K Ctrl+S` 打开键盘快捷方式
2. 搜索 `markdownAnnotator`
3. 双击要修改的命令，按下新的快捷键

### 方案二：禁用插件快捷键

在设置中关闭 `markdownAnnotator.enableShortcuts`，然后使用：
- 命令面板 `Ctrl+Shift+P`
- 右键菜单（仅限编辑 Markdown 时）

### 方案三：使用右键菜单

在 Markdown 文件中选中文字 → 右键 → 选择标注功能

---

## 📝 使用说明

### 添加高亮

1. 在 `.md` 文件中选中文字
2. 按 `Ctrl+H`（快速高亮）或 `Ctrl+Alt+H`（选择颜色）
3. 高亮效果会立即显示

> 💡 **注意**：高亮是临时的装饰效果，关闭文件后会消失。如果需要保存，请使用"导出标注"功能。

### 添加注释

1. 选中要注释的文字
2. 按 `Ctrl+Alt+C`
3. 输入注释内容
4. 注释会以 HTML 注释形式插入到文件中：
   ```markdown
   这是一段被选中的文字
   <!-- 💬 [2026-03-29 09:30] 这是我的注释 -->
   ```
5. HTML 注释在 Markdown 预览中不可见，但会保存在文件中

### 查看所有标注

1. 按 `Ctrl+Alt+L`
2. 在列表中点击任意标注，跳转到对应位置

### 导出标注

1. 按 `Ctrl+Alt+E`
2. 选择保存位置
3. 导出格式示例：
   ```json
   {
     "exportedAt": "2026-03-29 09:30",
     "totalFiles": 1,
     "files": {
       "/path/to/file.md": {
         "annotationCount": 3,
         "annotations": [
           {
             "type": "highlight",
             "color": "yellow",
             "text": "高亮的文字",
             "timestamp": 1743212400000
           }
         ]
       }
     }
   }
   ```

---

## 🖥️ 关于编辑模式和预览模式

### 编辑模式（默认）
✅ 完全支持所有功能

### 预览模式（Preview）
⚠️ **目前不支持**在预览模式中添加标注。

**原因**：VS Code 的预览是只读的渲染视图，无法直接编辑。

**替代方案**：
1. 使用分屏：左边编辑，右边预览
2. 在编辑模式添加标注后，切到预览模式查看效果

**未来计划**：正在研究在预览模式中显示标注的方案。

---

## ❓ 常见问题

### Q: 安装后找不到命令？
A: 确保打开的是 `.md` 文件，插件只在 Markdown 文件中激活。

### Q: 高亮消失了？
A: 高亮是临时装饰，关闭文件会消失。用"导出标注"保存记录。

### Q: 注释在哪里？
A: 注释是 HTML 注释 `<!-- ... -->`，预览看不到，但文件里有。可以 `Ctrl+/` 搜索。

### Q: 快捷键不生效？
A: 可能与其他软件冲突，参见上面的"快捷键冲突"章节。

---

## 🗺️ 路线图

- [ ] 预览模式显示标注
- [ ] 标注持久化到文件元数据
- [ ] 支持自定义高亮颜色
- [ ] 标注搜索功能
- [ ] 标注统计面板

---

## 📄 License

MIT

---

## 🙏 反馈

有问题或建议？欢迎 [提 Issue](https://github.com/Jack-Long-2022/vscode-markdown-annotator/issues)！
