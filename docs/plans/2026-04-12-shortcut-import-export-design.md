# Design: Shortcut Enhancement, Import/Export Improvements

**Date:** 2026-04-12
**Status:** Approved

## Overview

Three improvements to the Markdown Annotator extension:
1. Color-specific keyboard shortcuts for highlights
2. Import annotations feature
3. Export path automation (same directory, auto-clear)

## 1. Color System Changes

- **Remove:** pink
- **Add:** red (rgba(255, 0, 0, 0.3))
- **Final colors:** red, yellow, green, blue, orange

## 2. Keyboard Shortcuts

| Shortcut | Command ID | Behavior |
|----------|-----------|----------|
| ctrl+alt+h | `markdownAnnotator.quickHighlight` | Default yellow, no color picker |
| ctrl+alt+1 | `markdownAnnotator.highlightRed` | Red highlight |
| ctrl+alt+2 | `markdownAnnotator.highlightYellow` | Yellow highlight |
| ctrl+alt+3 | `markdownAnnotator.highlightGreen` | Green highlight |
| ctrl+alt+4 | `markdownAnnotator.highlightBlue` | Blue highlight |
| ctrl+alt+5 | `markdownAnnotator.highlightOrange` | Orange highlight |
| ctrl+alt+m | `markdownAnnotator.addComment` | Add text comment (existing) |
| ctrl+alt+e | `markdownAnnotator.exportAnnotations` | Export + clear (enhanced) |
| ctrl+alt+i | `markdownAnnotator.importAnnotations` | Import annotations (new) |

Original `addHighlight` command (with color picker) remains available via command palette.

## 3. Export Flow

1. Collect all annotations for the current markdown file
2. Save to `{filename}.annotations.json` in the same directory (no dialog)
3. Auto-clear: remove HTML comments from file, clear decorations, clear memory

## 4. Import Flow

1. Look for `{filename}.annotations.json` in the same directory as the markdown file
2. **Found:** Load directly, restore highlight decorations
3. **Not found:** Show file picker dialog for user to select JSON file
4. Restore comment annotations by re-inserting HTML comments into the file
5. Update in-memory annotation data

## 5. JSON Format (unchanged)

```json
{
  "/path/to/file.md": [
    {
      "type": "highlight",
      "color": "red",
      "range": {
        "start": { "line": 5, "character": 10 },
        "end": { "line": 5, "character": 25 }
      },
      "text": "highlighted text",
      "timestamp": 1712898000000
    },
    {
      "type": "comment",
      "range": { ... },
      "text": "selected text",
      "comment": "user comment content",
      "timestamp": 1712898000000
    }
  ]
}
```

## Files Modified

- `package.json` - new commands, keybindings, remove pink color config
- `extension.js` - new color-specific highlight commands, import command, export auto-path logic
