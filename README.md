# Markdown Annotator

A VS Code extension for adding annotations, highlights, and comments to Markdown documents.

## Features

- 🎨 **Highlight Text**: Add colored highlights to important text
- 💬 **Add Comments**: Attach comments to selected text (inserted as HTML comments)
- 🧹 **Clear All**: Remove all annotations from the current file
- 📤 **Export Annotations**: Export all annotations to JSON file

## Usage

### Add Highlight
1. Select text in a Markdown file
2. Run command `Markdown Annotator: Add Highlight` (or press `Ctrl+Alt+H`)
3. Choose a color from the picker

### Add Comment
1. Select text in a Markdown file
2. Run command `Markdown Annotator: Add Comment` (or press `Ctrl+Alt+C`)
3. Enter your comment in the input box

### Clear All Annotations
- Run command `Markdown Annotator: Clear All Annotations`

### Export Annotations
- Run command `Markdown Annotator: Export Annotations`
- Choose where to save the JSON file

## Keyboard Shortcuts

| Command | Windows/Linux | macOS |
|---------|---------------|-------|
| Add Highlight | `Ctrl+Alt+H` | `Cmd+Alt+H` |
| Add Comment | `Ctrl+Alt+C` | `Cmd+Alt+C` |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `markdownAnnotator.highlightColor` | `yellow` | Default highlight color |
| `markdownAnnotator.showInPreview` | `true` | Show annotations in Markdown preview |

## Installation

### From VSIX (Local)
1. Download the `.vsix` file
2. Open VS Code
3. Press `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
4. Select the file

### From Source
```bash
git clone https://github.com/Jack-Long-2022/vscode-markdown-annotator.git
cd vscode-markdown-annotator
# Open in VS Code and press F5 to debug
```

## License

MIT
