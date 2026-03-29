const vscode = require('vscode');
const fs = require('fs');

let annotations = new Map(); // Store annotations by file path

/**
 * Get current timestamp formatted
 */
function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Markdown Annotator is now active!');

    // Register decoration types for highlights
    const decorationTypes = {
        yellow: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 255, 0, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        }),
        green: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(0, 255, 0, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        }),
        blue: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(0, 150, 255, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        }),
        pink: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 105, 180, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        }),
        orange: vscode.window.createTextEditorType({
            backgroundColor: 'rgba(255, 165, 0, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        })
    };

    // ==================== 添加高亮（选择颜色）====================
    const addHighlightCmd = vscode.commands.registerCommand(
        'markdownAnnotator.addHighlight',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'markdown') {
                vscode.window.showWarningMessage('请在 Markdown 文件中使用此功能');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('请先选择要高亮的文字');
                return;
            }

            const config = vscode.workspace.getConfiguration('markdownAnnotator');
            const defaultColor = config.get('highlightColor') || 'yellow';
            
            const picked = await vscode.window.showQuickPick(
                [
                    { label: '🟡 黄色', value: 'yellow' },
                    { label: '🟢 绿色', value: 'green' },
                    { label: '🔵 蓝色', value: 'blue' },
                    { label: '🩷 粉色', value: 'pink' },
                    { label: '🟠 橙色', value: 'orange' }
                ],
                { placeHolder: `选择高亮颜色` }
            );
            if (!picked) return;
            
            const color = picked.value;
            const range = new vscode.Range(selection.start, selection.end);
            
            // 获取当前文件已有的高亮，追加新的
            const filePath = editor.document.uri.fsPath;
            const fileAnnotations = annotations.get(filePath) || [];
            const existingRanges = fileAnnotations
                .filter(a => a.type === 'highlight' && a.color === color)
                .map(a => new vscode.Range(
                    a.range.start.line, a.range.start.character,
                    a.range.end.line, a.range.end.character
                ));
            
            existingRanges.push(range);
            editor.setDecorations(decorationTypes[color], existingRanges);

            // 存储标注
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

            vscode.window.showInformationMessage(`✅ 已添加 ${color} 高亮`);
        }
    );

    // ==================== 快速高亮 ====================
    const quickHighlightCmd = vscode.commands.registerCommand(
        'markdownAnnotator.quickHighlight',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'markdown') {
                vscode.window.showWarningMessage('请在 Markdown 文件中使用此功能');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('请先选择要高亮的文字');
                return;
            }

            const config = vscode.workspace.getConfiguration('markdownAnnotator');
            const color = config.get('highlightColor') || 'yellow';

            const range = new vscode.Range(selection.start, selection.end);
            
            const filePath = editor.document.uri.fsPath;
            const fileAnnotations = annotations.get(filePath) || [];
            const existingRanges = fileAnnotations
                .filter(a => a.type === 'highlight' && a.color === color)
                .map(a => new vscode.Range(
                    a.range.start.line, a.range.start.character,
                    a.range.end.line, a.range.end.character
                ));
            
            existingRanges.push(range);
            editor.setDecorations(decorationTypes[color], existingRanges);

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

            console.log(`Quick highlight added in ${color}`);
        }
    );

    // ==================== 添加注释 ====================
    const addCommentCmd = vscode.commands.registerCommand(
        'markdownAnnotator.addComment',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'markdown') {
                vscode.window.showWarningMessage('请在 Markdown 文件中使用此功能');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('请先选择要注释的文字');
                return;
            }

            const comment = await vscode.window.showInputBox({
                prompt: '输入注释内容',
                placeHolder: '在这里写你的注释...',
                validateInput: (value) => {
                    if (!value || value.trim() === '') {
                        return '注释内容不能为空';
                    }
                    return null;
                }
            });

            if (!comment) return;

            const selectedText = editor.document.getText(selection);
            const endLine = selection.end.line;
            const lineLength = editor.document.lineAt(endLine).text.length;
            const endPosition = new vscode.Position(endLine, lineLength);

            const commentText = `\n<!-- 💬 [${getTimestamp()}] ${comment} -->`;

            await editor.edit(editBuilder => {
                editBuilder.insert(endPosition, commentText);
            });

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

            vscode.window.showInformationMessage('✅ 注释已添加');
        }
    );

    // ==================== 清除高亮 ====================
    const clearAllCmd = vscode.commands.registerCommand(
        'markdownAnnotator.clearAll',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('没有打开的文件');
                return;
            }

            const filePath = editor.document.uri.fsPath;
            if (!annotations.has(filePath)) {
                vscode.window.showInformationMessage('当前文件没有标注');
                return;
            }

            const fileAnnotations = annotations.get(filePath);
            const highlightCount = fileAnnotations.filter(a => a.type === 'highlight').length;
            const commentCount = fileAnnotations.filter(a => a.type === 'comment').length;

            if (highlightCount === 0) {
                vscode.window.showInformationMessage('当前文件没有高亮可清除');
                return;
            }

            const confirm = await vscode.window.showWarningMessage(
                `清除当前文件的所有高亮？\n\n🎨 高亮: ${highlightCount} 个（将被清除）\n💬 注释: ${commentCount} 个（保留在文件和记录中）`,
                { modal: true },
                '清除高亮'
            );

            if (confirm === '清除高亮') {
                // 清除所有高亮装饰
                Object.values(decorationTypes).forEach(type => {
                    editor.setDecorations(type, []);
                });

                // 只删除高亮记录，保留注释记录
                const remainingAnnotations = fileAnnotations.filter(a => a.type !== 'highlight');
                
                if (remainingAnnotations.length > 0) {
                    annotations.set(filePath, remainingAnnotations);
                    vscode.window.showInformationMessage(`✅ 已清除 ${highlightCount} 个高亮（${commentCount} 个注释保留）`);
                } else {
                    annotations.delete(filePath);
                    vscode.window.showInformationMessage(`✅ 已清除所有高亮`);
                }
            }
        }
    );

    // ==================== 导出标注 ====================
    const exportCmd = vscode.commands.registerCommand(
        'markdownAnnotator.exportAnnotations',
        async () => {
            if (annotations.size === 0) {
                vscode.window.showWarningMessage('没有可导出的标注');
                return;
            }

            const exportData = {
                exportedAt: getTimestamp(),
                totalFiles: annotations.size,
                files: {}
            };

            annotations.forEach((value, key) => {
                const highlights = value.filter(a => a.type === 'highlight');
                const comments = value.filter(a => a.type === 'comment');
                exportData.files[key] = {
                    total: value.length,
                    highlights: highlights.length,
                    comments: comments.length,
                    annotations: value
                };
            });

            const jsonStr = JSON.stringify(exportData, null, 2);

            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(`markdown-annotations-${Date.now()}.json`),
                filters: { 'JSON': ['json'] }
            });

            if (uri) {
                try {
                    fs.writeFileSync(uri.fsPath, jsonStr, 'utf8');
                    vscode.window.showInformationMessage(`✅ 标注已导出到: ${uri.fsPath}`);
                } catch (err) {
                    vscode.window.showErrorMessage(`导出失败: ${err.message}`);
                }
            }
        }
    );

    // ==================== 查看所有标注 ====================
    const listAnnotationsCmd = vscode.commands.registerCommand(
        'markdownAnnotator.listAnnotations',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('没有打开的文件');
                return;
            }

            const filePath = editor.document.uri.fsPath;
            if (!annotations.has(filePath) || annotations.get(filePath).length === 0) {
                vscode.window.showInformationMessage('当前文件没有标注');
                return;
            }

            const fileAnnotations = annotations.get(filePath);
            const items = fileAnnotations.map((a, index) => {
                const icon = a.type === 'highlight' ? '🎨' : '💬';
                const preview = a.text.length > 30 ? a.text.substring(0, 30) + '...' : a.text;
                const detail = a.type === 'highlight' 
                    ? `颜色: ${a.color}` 
                    : `注释: ${a.comment}`;
                return {
                    label: `${icon} 第${a.range.start.line + 1}行: ${preview}`,
                    description: detail,
                    index: index
                };
            });

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: `当前文件有 ${fileAnnotations.length} 个标注（${fileAnnotations.filter(a => a.type === 'highlight').length} 个高亮，${fileAnnotations.filter(a => a.type === 'comment').length} 个注释）`
            });

            if (selected) {
                const ann = fileAnnotations[selected.index];
                const position = new vscode.Position(ann.range.start.line, ann.range.start.character);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
            }
        }
    );

    context.subscriptions.push(
        addHighlightCmd, 
        addCommentCmd, 
        clearAllCmd, 
        exportCmd,
        quickHighlightCmd,
        listAnnotationsCmd
    );

    // ==================== 切换文件时恢复高亮 ====================
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'markdown') {
            const filePath = editor.document.uri.fsPath;
            if (annotations.has(filePath)) {
                const fileAnnotations = annotations.get(filePath);
                
                // 按颜色分组恢复高亮
                const colorGroups = {};
                fileAnnotations.forEach(annotation => {
                    if (annotation.type === 'highlight') {
                        if (!colorGroups[annotation.color]) {
                            colorGroups[annotation.color] = [];
                        }
                        colorGroups[annotation.color].push(new vscode.Range(
                            annotation.range.start.line,
                            annotation.range.start.character,
                            annotation.range.end.line,
                            annotation.range.end.character
                        ));
                    }
                });

                // 应用每种颜色的高亮
                Object.entries(colorGroups).forEach(([color, ranges]) => {
                    if (decorationTypes[color]) {
                        editor.setDecorations(decorationTypes[color], ranges);
                    }
                });
            }
        }
    });

    console.log('Markdown Annotator activated!');
}

function deactivate() {
    console.log('Markdown Annotator deactivated');
}

module.exports = {
    activate,
    deactivate
}
