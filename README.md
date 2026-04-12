# Markdown Annotator

VS Code Markdown 标注插件 —— 添加高亮、注释，导出为 AI 可读的 JSON 格式。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| ⚡ 快速高亮 | 一键高亮，使用默认颜色（Ctrl+Alt+H） |
| 🔴🟡🟢🔵🟠 颜色快捷高亮 | 5 种颜色快捷键，直接高亮不弹窗 |
| 🎨 选择颜色高亮 | 5 种颜色，代表不同重要性 |
| 💬 添加注释 | 为选中文字添加批注 |
| 📋 查看所有标注 | 列出当前文件所有标注 |
| 🗑️ 清除高亮 | 清除当前文件高亮（保留注释） |
| 📤 导出并归档 | 导出标注到同目录 + 自动清理文件 |
| 📥 导入标注 | 从 JSON 恢复高亮和注释 |

---

## ⌨️ 快捷键

| 快捷键 | Windows/Linux | macOS | 功能 |
|--------|---------------|-------|------|
| 快速高亮 | `Ctrl+Alt+H` | `Cmd+Alt+H` | 默认黄色高亮 |
| 红色高亮 | `Ctrl+Alt+1` | `Cmd+Alt+1` | 红色高亮 |
| 黄色高亮 | `Ctrl+Alt+2` | `Cmd+Alt+2` | 黄色高亮 |
| 绿色高亮 | `Ctrl+Alt+3` | `Cmd+Alt+3` | 绿色高亮 |
| 蓝色高亮 | `Ctrl+Alt+4` | `Cmd+Alt+4` | 蓝色高亮 |
| 橙色高亮 | `Ctrl+Alt+5` | `Cmd+Alt+5` | 橙色高亮 |
| 添加注释 | `Ctrl+Alt+=` | `Cmd+Alt+=` | 添加文字标注 |
| 导出归档 | `Ctrl+Alt+E` | `Cmd+Alt+E` | 导出 + 清理 |
| 导入标注 | `Ctrl+Alt+I` | `Cmd+Alt+I` | 导入恢复标注 |

---

## 🎨 高亮颜色含义

| 颜色 | 含义 | 使用场景 | 快捷键 |
|------|------|----------|--------|
| 🔴 红色 | 重要/关键 | 关键内容、必须注意的地方 | `Ctrl+Alt+1` |
| 🟡 黄色 | 一般重点 | 需要注意的内容 | `Ctrl+Alt+2` / `Ctrl+Alt+H` |
| 🟢 绿色 | 正确/确认 | 关键信息、正确答案 | `Ctrl+Alt+3` |
| 🔵 蓝色 | 信息/参考 | 参考链接、补充信息 | `Ctrl+Alt+4` |
| 🟠 橙色 | 待办/问题 | TODO、疑问、待解决 | `Ctrl+Alt+5` |

---

## 🚀 核心功能：导出与导入

### 导出并归档（Ctrl+Alt+E）

1. 将标注保存为 `{文件名}.annotations.json`（与 Markdown 文件同目录）
2. 自动清理 Markdown 文件中的 `<!-- 💬 -->` 注释
3. 清除所有高亮装饰
4. 无需手动选择保存路径

### 导入标注（Ctrl+Alt+I）

1. 自动查找同目录下的 `{文件名}.annotations.json`
2. 如果未找到，弹出文件选择框
3. 恢复高亮装饰和 HTML 注释
4. 支持新旧两种 JSON 格式

### 导出的 JSON 格式

```json
{
  "_ai_instructions": {
    "purpose": "此文件包含用户对 Markdown 文档的标注信息",
    "how_to_read": {
      "highlights": "高亮标记：用户认为重要的内容",
      "color_meaning": {
        "red": "重要/关键",
        "yellow": "一般重点",
        "green": "正确/确认",
        "blue": "信息/参考",
        "orange": "待办/问题"
      }
    }
  },
  "document": {
    "path": "/path/to/example.md",
    "name": "example.md",
    "annotation_count": { "total": 5, "highlights": 3, "comments": 2 }
  },
  "annotations": [
    {
      "type": "highlight",
      "text": "重要的内容",
      "location": { "line": 10, "start_char": 0, "end_char": 6 },
      "color": "red",
      "importance": "critical"
    }
  ]
}
```

---

## 📦 安装

1. 去 [Releases](https://github.com/Jack-Long-2022/vscode-markdown-annotator/releases) 下载 `.vsix` 文件
2. VS Code 按 `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. 选择下载的文件，重启 VS Code

---

## 🖱️ 右键菜单

在 Markdown 文件中选中文字右键：

| 命令 | 说明 |
|------|------|
| ⚡ 快速高亮 | 默认颜色高亮 |
| 🎨 选择颜色高亮 | 选择颜色后高亮 |
| 💬 添加注释 | 插入 HTML 注释 |
| 📋 查看所有标注 | 列出并跳转 |
| 🗑️ 清除高亮 | 清除装饰 |
| 📤 导出并归档 | 导出 + 清理 |
| 📥 导入标注 | 从 JSON 恢复 |

---

## 📖 工作流程

```
┌────────────────────────────────────────────────────┐
│              Markdown 标注工作流                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  1️⃣ 阅读文档，标注重点                             │
│      - 选中文字 → Ctrl+Alt+1~5 快捷高亮            │
│      - 选中文字 → Ctrl+Alt+= 添加注释              │
│      ↓                                             │
│  2️⃣ 继续阅读，持续标注                             │
│      - Ctrl+Alt+H 快速黄色高亮                     │
│      - 右键 → 查看所有标注                          │
│      ↓                                             │
│  3️⃣ 标注完成，导出归档 (Ctrl+Alt+E)               │
│      - 自动保存 JSON 到同目录                      │
│      - Markdown 文件被清理干净                     │
│      ↓                                             │
│  4️⃣ 需要时导入恢复 (Ctrl+Alt+I)                   │
│      - 自动匹配同目录 JSON                         │
│      - 恢复高亮和注释，继续编辑                     │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 💡 使用场景

### 场景 1：学习笔记

1. 阅读 Markdown 教程/文档
2. 用快捷键高亮标记重点（红色=关键，黄色=一般）
3. 对不理解的地方添加注释
4. 导出 JSON，发给 AI 解释不懂的地方

### 场景 2：代码审查

1. 打开代码文档的 Markdown
2. 用红色高亮标记关键问题
3. 用橙色高亮标记需要修改的地方
4. 添加注释说明修改建议
5. 导出 JSON，生成审查报告

### 场景 3：内容优化

1. 打开需要优化的 Markdown 文档
2. 高亮需要改写的内容
3. 添加注释说明改写方向
4. 导出 JSON，让 AI 根据标注优化文档

---

## ⚙️ 配置

打开 VS Code 设置（`Ctrl+,`），搜索 `Markdown Annotator`：

| 设置项 | 默认值 | 说明 |
|--------|--------|------|
| `highlightColor` | `yellow` | 快速高亮的默认颜色 |

---

## 📄 License

MIT

---

## 🙏 反馈

有问题或建议？[提 Issue](https://github.com/Jack-Long-2022/vscode-markdown-annotator/issues)
