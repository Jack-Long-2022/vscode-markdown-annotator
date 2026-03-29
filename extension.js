const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let annotations = new Map(); // Store annotations by file path

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Markdown Annotator is now active!');

    // Register decoration types for highlights
    const decorationTypes = {
        yellow: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 255, 0, 0.3)',
            isWholeLine: false
        }),
        green: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(0, 255, 0, 0.3)',
            isWholeLine: false
        }),
        blue: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(0, 150, 255, 0.3)',
            isWholeLine: false
        }),
        pink: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 105, 180, 0.3)',
            isWholeLine: false
        }),
        orange: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 165, 0, 0.3)',
            isWholeLine: false
        })
    };

    // Register commands
    const addHighlightCmd = vscode.commands.registerCommand(
        'markdownAnnotator.addHighlight',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'markdown') {
                vscode.window.showWarningMessage('Please open a Markdown file first');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('Please select some text to highlight');
                return;
            }

            const color = await vscode.window.showQuickPick(
                ['yellow', 'green', 'blue', 'pink', 'orange'],
                { placeHolder: 'Select highlight color' }
            );

            if (!color) return;

            const range = new vscode.Range(selection.start, selection.end);
            const decorationType = decorationTypes[color];
            editor.setDecorations(decorationType, [range]);

            // Store annotation
            const filePath = editor.document.uri.fsPath;
            const annotation = {
                type: 'highlight',
                color: color,
                range: {
                    start: { line: selection.start.line, character: selection.start.character },
                    end: { line: selection.end.line, character: selection.end.character }
                },
                text: editor.document.getText(range),
                timestamp: Date.now()
            };

            if (!annotations.has(filePath)) {
                annotations.set(filePath, []);
            }
            annotations.get(filePath).push(annotation);

            vscode.window.showInformationMessage(`Highlighted in ${color}!`);
        }
    );

    const addCommentCmd = vscode.commands.registerCommand(
        'markdownAnnotator.addComment',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'markdown') {
                vscode.window.showWarningMessage('Please open a Markdown file first');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('Please select some text to comment on');
                return;
            }

            const comment = await vscode.window.showInputBox({
                prompt: 'Enter your comment',
                placeHolder: 'Your comment here...'
            });

            if (!comment) return;

            // Insert comment as HTML comment after the selection
            const selectedText = editor.document.getText(selection);
            const endLine = selection.end.line;
            const endPosition = new vscode.Position(endLine, editor.document.lineAt(endLine).text.length);

            const commentText = `\n<!-- 💬 Annotation: ${comment} -->`;

            editor.edit(editBuilder => {
                editBuilder.insert(endPosition, commentText);
            });

            // Store annotation
            const filePath = editor.document.uri.fsPath;
            const annotation = {
                type: 'comment',
                range: {
                    start: { line: selection.start.line, character: selection.start.character },
                    end: { line: selection.end.line, character: selection.end.character }
                },
                text: selectedText,
                comment: comment,
                timestamp: Date.now()
            };

            if (!annotations.has(filePath)) {
                annotations.set(filePath, []);
            }
            annotations.get(filePath).push(annotation);

            vscode.window.showInformationMessage('Comment added!');
        }
    );

    const clearAllCmd = vscode.commands.registerCommand(
        'markdownAnnotator.clearAll',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const filePath = editor.document.uri.fsPath;
            if (!annotations.has(filePath)) {
                vscode.window.showInformationMessage('No annotations to clear');
                return;
            }

            const confirm = await vscode.window.showWarningMessage(
                'Clear all annotations for this file?',
                'Yes', 'No'
            );

            if (confirm === 'Yes') {
                // Clear all decoration types
                Object.values(decorationTypes).forEach(type => {
                    editor.setDecorations(type, []);
                });

                annotations.delete(filePath);
                vscode.window.showInformationMessage('All annotations cleared!');
            }
        }
    );

    const exportCmd = vscode.commands.registerCommand(
        'markdownAnnotator.exportAnnotations',
        async () => {
            if (annotations.size === 0) {
                vscode.window.showWarningMessage('No annotations to export');
                return;
            }

            const exportData = {};
            annotations.forEach((value, key) => {
                exportData[key] = value;
            });

            const jsonStr = JSON.stringify(exportData, null, 2);

            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file('annotations.json'),
                filters: { 'JSON': ['json'] }
            });

            if (uri) {
                fs.writeFileSync(uri.fsPath, jsonStr, 'utf8');
                vscode.window.showInformationMessage(`Annotations exported to ${uri.fsPath}`);
            }
        }
    );

    context.subscriptions.push(addHighlightCmd, addCommentCmd, clearAllCmd, exportCmd);

    // Restore annotations when opening a file
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'markdown') {
            const filePath = editor.document.uri.fsPath;
            if (annotations.has(filePath)) {
                const fileAnnotations = annotations.get(filePath);
                fileAnnotations.forEach(annotation => {
                    if (annotation.type === 'highlight') {
                        const range = new vscode.Range(
                            annotation.range.start.line,
                            annotation.range.start.character,
                            annotation.range.end.line,
                            annotation.range.end.character
                        );
                        editor.setDecorations(decorationTypes[annotation.color], [range]);
                    }
                });
            }
        }
    });
}

function deactivate() {
    console.log('Markdown Annotator deactivated');
}

module.exports = {
    activate,
    deactivate
}
