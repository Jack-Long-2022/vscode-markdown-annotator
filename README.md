# Markdown Annotator

VS Code Markdown 标注插件 —— 添加高亮、注释，导出为 AI 可读的 JSON 格式。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| ⚡ 快速高亮 | 一键高亮，使用默认颜色 |
| 🎨 选择颜色高亮 | 5种颜色，代表不同重要性 |
| 💬 添加注释 | 为选中文字添加批注 |
| 📋 查看所有标注 | 列出当前文件所有标注 |
| 🗑️ 清除高亮 | 清除当前文件高亮（保留注释） |
| 📤 导出并归档 | **导出标注 + 清理文件** |

---

## 🚀 核心功能：导出并归档

这是最重要的功能，用于：

1. **导出标注** → JSON 文件
2. **清理 Markdown** → 移除所有 `<!-- 💬 -->` 注释
3. **清除高亮** → 移除视觉装饰

### 导出的 JSON 格式

```json
{
  "_ai_instructions": {
    "purpose": "此文件包含用户对 Markdown 文档的标注信息",
    "how_to_read": {
      "highlights": "高亮标记：用户认为重要的内容",
      "color_meaning": {
        "yellow": "一般重点",
        "green": "重要/正确",
        "blue": "信息/参考",
        "pink": "警告/注意",
        "orange": "待办/问题"
      },
      "comments": "用户注释：对特定内容的理解或疑问",
      "usage": "AI 可以根据这些标注总结重点、回答问题、优化文档"
    },
    "original_file": "example.md",
    "exported_at": "2026-03-29 10:00"
  },
  "document": {
    "path": "/path/to/example.md",
    "name": "example.md",
    "annotation_count": {
      "total": 5,
      "highlights": 3,
      "comments": 2
    }
  },
  "annotations": [
    {
      "type": "highlight",
      "text": "重要的内容",
      "location": { "line": 10, "start_char": 0, "end_char": 6 },
      "color": "yellow",
      "importance": "normal"
    },
    {
      "type": "comment",
      "text": "有疑问的段落",
      "location": { "line": 20, "start_char": 0, "end_char": 7 },
      "comment": "这里需要进一步解释",
      "comment_time": "2026-03-29 09:30"
    }
  ]
}
```

### AI 如何使用这个 JSON

```javascript
// AI 可以：
// 1. 读取 _ai_instructions 了解文件用途
// 2. 根据 color_meaning 理解高亮的语义
// 3. 根据 annotations 提取重点内容
// 4. 根据 comments 理解用户的疑问
// 5. 基于这些信息优化原始 Markdown
```

---

## 📦 安装

1. 去 [Releases](https://github.com/Jack-Long-2022/vscode-markdown-annotator/releases) 下载 `.vsix` 文件
2. VS Code 按 `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. 选择下载的文件，重启 VS Code

---

## 🖱️ 使用方法

### 右键菜单（推荐）

在 Markdown 文件中：

| 命令 | 需要 | 说明 |
|------|------|------|
| ⚡ 快速高亮 | 选中文字 | 用默认颜色高亮 |
| 🎨 选择颜色高亮 | 选中文字 | 选择颜色后高亮 |
| 💬 添加注释 | 选中文字 | 在文件中插入 HTML 注释 |
| 📋 查看所有标注 | - | 列出所有标注，点击跳转 |
| 🗑️ 清除高亮 | - | 清除视觉装饰（注释保留） |
| 📤 导出并归档 | - | 导出 JSON + 清理文件 |

---

## 🎨 高亮颜色含义

| 颜色 | 含义 | 使用场景 |
|------|------|----------|
| 🟡 黄色 | 一般重点 | 需要注意的内容 |
| 🟢 绿色 | 重要/正确 | 关键信息、正确答案 |
| 🔵 蓝色 | 信息/参考 | 参考链接、补充信息 |
| 🩷 粉色 | 警告/注意 | 可能有问题、需要检查 |
| 🟠 橙色 | 待办/问题 | TODO、疑问、待解决 |

---

## 📖 工作流程

```
┌────────────────────────────────────────────────────┐
│              Markdown 标注工作流                   │
├────────────────────────────────────────────────────┤
│                                                    │
│  1️⃣ 阅读文档，标注重点                             │
│      - 选中文字 → 右键 → 高亮                      │
│      - 选中文字 → 右键 → 添加注释                  │
│      ↓                                             │
│  2️⃣ 继续阅读，持续标注                             │
│      - 可以随时右键 → 查看所有标注                  │
│      ↓                                             │
│  3️⃣ 标注完成，导出归档                             │
│      - 右键 → 导出并归档                           │
│      - 生成 JSON 文件（AI 可读）                   │
│      - Markdown 文件被清理干净                     │
│      ↓                                             │
│  4️⃣ 将 JSON 发给 AI 处理                           │
│      - AI 根据 _ai_instructions 理解标注          │
│      - AI 可以总结、优化、回答问题                  │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 💡 使用场景

### 场景 1：学习笔记

1. 阅读 Markdown 教程/文档
2. 用高亮标记重点内容（黄色=一般，绿色=重要）
3. 对不理解的地方添加注释
4. 导出 JSON，发给 AI 解释不懂的地方

### 场景 2：代码审查

1. 打开代码文档的 Markdown
2. 用粉色高亮标记潜在问题
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
