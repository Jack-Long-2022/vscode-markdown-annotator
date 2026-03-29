const vscode = require('vscode');
const path = require('path');
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
        orange: vscode.window.createTextEditorDecorationType({
            backgroundColor: 'rgba(255, 165, 0, 0.35)',
            borderRadius: '3px',
            isWholeLine: false
        })
    };

    // ==================== 添加高亮 ====================
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
            
            const showColorPicker = config.get('alwaysShowColorPicker', true);
            
            let color = defaultColor;
            if (showColorPicker) {
                const picked = await vscode.window.showQuickPick(
                    [
                        { label: '🟡 黄色 (Yellow)', value: 'yellow' },
                        { label: '🟢 绿色 (Green)', value: 'green' },
                        { label: '🔵 蓝色 (Blue)', value: 'blue' },
                        { label: '🩷 粉色 (Pink)', value: 'pink' },
                        { label: '🟠 橙色 (Orange)', value: 'orange' }
                    ],
                    { placeHolder: `选择高亮颜色（默认: ${defaultColor}）` }
                );
                if (!picked) return;
                color = picked.value;
            }

            const range = new vscode.Range(selection.start, selection.end);
            const decorationType = decorationTypes[color];
            
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
            editor.setDecorations(decorationType, existingRanges);

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

            // 插入注释（带时间戳）
            const commentText = `\n<!-- 💬 [${getTimestamp()}] ${comment} -->`;

            await editor.edit(editBuilder => {
                editBuilder.insert(endPosition, commentText);
            });

            // 存储标注
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

            vscode.window.showInformationMessage('✅ 注释已添加到文件末尾');
        }
    );

    // ==================== 清除当前文件所有标注 ====================
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

            const confirm = await vscode.window.showWarningMessage(
                '确定要清除当前文件的所有标注吗？（高亮会被清除，注释会保留在文件中）',
                { modal: true },
                '清除高亮'
            );

            if (confirm === '清除高亮') {
                // 清除所有高亮装饰
                Object.values(decorationTypes).forEach(type => {
                    editor.setDecorations(type, []);
                });

                annotations.delete(filePath);
                vscode.window.showInformationMessage('✅ 已清除所有高亮（注释保留在文件中）');
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
                exportData.files[key] = {
                    annotationCount: value.length,
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

    // ==================== 快速高亮（使用默认颜色，不弹窗）====================
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
            const decorationType = decorationTypes[color];
            
            const filePath = editor.document.uri.fsPath;
            const fileAnnotations = annotations.get(filePath) || [];
            const existingRanges = fileAnnotations
                .filter(a => a.type === 'highlight' && a.color === color)
                .map(a => new vscode.Range(
                    a.range.start.line, a.range.start.character,
                    a.range.end.line, a.range.end.character
                ));
            
            existingRanges.push(range);
            editor.setDecorations(decorationType, existingRanges);

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

            // 不弹出提示，避免干扰
            console.log(`Quick highlight added in ${color}`);
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
                placeHolder: `当前文件有 ${fileAnnotations.length} 个标注`
            });

            if (selected) {
                // 跳转到对应位置
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

    // 显示欢迎信息
    vscode.window.showInformationMessage('📝 Markdown Annotator 已激活！选中文字后按快捷键添加标注。');
}

function deactivate() {
    console.log('Markdown Annotator deactivated');
}

module.exports = {
    activate,
    deactivate
}
