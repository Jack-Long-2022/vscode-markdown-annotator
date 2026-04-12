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
        orange: vscode.window.createTextEditorDecorationType({
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

            const timestamp = getTimestamp();
            const commentText = `\n<!-- 💬 [${timestamp}] ${comment} -->`;

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
                commentTime: timestamp,
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
                Object.values(decorationTypes).forEach(type => {
                    editor.setDecorations(type, []);
                });

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

    // ==================== 导出并清理（归档）====================
    const exportAndCleanCmd = vscode.commands.registerCommand(
        'markdownAnnotator.exportAnnotations',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('没有打开的文件');
                return;
            }

            const filePath = editor.document.uri.fsPath;
            if (!annotations.has(filePath) || annotations.get(filePath).length === 0) {
                vscode.window.showWarningMessage('当前文件没有标注可导出');
                return;
            }

            const fileAnnotations = annotations.get(filePath);
            const highlights = fileAnnotations.filter(a => a.type === 'highlight');
            const comments = fileAnnotations.filter(a => a.type === 'comment');

            if (highlights.length === 0 && comments.length === 0) {
                vscode.window.showWarningMessage('当前文件没有标注可导出');
                return;
            }

            const confirm = await vscode.window.showWarningMessage(
                `导出并归档标注？\n\n🎨 高亮: ${highlights.length} 个\n💬 注释: ${comments.length} 个\n\n导出后：\n- 标注将保存到 JSON 文件\n- Markdown 文件中的注释将被清理\n- 高亮装饰将被清除`,
                { modal: true },
                '导出并归档'
            );

            if (confirm !== '导出并归档') return;

            // 构建导出数据
            const mdFileName = filePath.split(/[/\\]/).pop();
            const exportData = {
                _ai_instructions: {
                    purpose: "此文件包含用户对 Markdown 文档的标注信息，用于 AI 理解和处理",
                    how_to_read: {
                        highlights: "高亮标记：用户认为重要的内容，color 字段表示重要性级别",
                        color_meaning: {
                            yellow: "一般重点",
                            green: "重要/正确",
                            blue: "信息/参考",
                            pink: "警告/注意",
                            orange: "待办/问题"
                        },
                        comments: "用户注释：对特定内容的理解、疑问或补充说明",
                        usage: "根据这些标注，AI 可以：1) 总结重点内容 2) 回答相关问题 3) 优化文档结构 4) 提取关键信息"
                    },
                    original_file: mdFileName,
                    exported_at: getTimestamp()
                },
                document: {
                    path: filePath,
                    name: mdFileName,
                    annotation_count: {
                        total: fileAnnotations.length,
                        highlights: highlights.length,
                        comments: comments.length
                    }
                },
                annotations: fileAnnotations.map(a => ({
                    type: a.type,
                    text: a.text,
                    location: {
                        line: a.range.start.line + 1,
                        start_char: a.range.start.character,
                        end_char: a.range.end.character
                    },
                    ...(a.type === 'highlight' ? { 
                        color: a.color,
                        importance: { yellow: 'normal', green: 'important', blue: 'info', pink: 'warning', orange: 'todo' }[a.color]
                    } : {}),
                    ...(a.type === 'comment' ? { 
                        comment: a.comment,
                        comment_time: a.commentTime
                    } : {}),
                    timestamp: a.timestamp
                }))
            };

            // 保存 JSON 文件
            const jsonFileName = mdFileName.replace(/\.md$/i, '-annotations.json');
            const mdSummaryFileName = mdFileName.replace(/\.md$/i, '-annotations.md');
            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(jsonFileName),
                filters: { 'JSON': ['json'] }
            });

            if (!uri) return;

            try {
                fs.writeFileSync(uri.fsPath, JSON.stringify(exportData, null, 2), 'utf8');
                
                // 生成 Markdown 摘要文件
                const mdSummaryPath = uri.fsPath.replace(/\.json$/i, '.md');
                const mdSummary = generateMdSummary(exportData, mdFileName);
                fs.writeFileSync(mdSummaryPath, mdSummary, 'utf8');
            } catch (err) {
                vscode.window.showErrorMessage(`导出失败: ${err.message}`);
                return;
            }

            // 清理 Markdown 文件中的注释（HTML 注释）
            if (comments.length > 0) {
                const document = editor.document;
                const fullText = document.getText();
                
                // 匹配 <!-- 💬 [时间] 内容 --> 格式的注释
                const commentPattern = /\n?<!-- 💬 \[[\d\-: ]+\] .+? -->/g;
                const cleanedText = fullText.replace(commentPattern, '');

                // 替换整个文件内容
                const edit = new vscode.WorkspaceEdit();
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(fullText.length)
                );
                edit.replace(document.uri, fullRange, cleanedText);
                await vscode.workspace.applyEdit(edit);
            }

            // 清除高亮装饰
            Object.values(decorationTypes).forEach(type => {
                editor.setDecorations(type, []);
            });

            // 清空内存中的标注
            annotations.delete(filePath);

            // 保存文件
            await document.save();

            vscode.window.showInformationMessage(
                `✅ 已导出 ${fileAnnotations.length} 个标注\n📄 JSON + 📝 Markdown摘要\n✅ Markdown 文件已清理`
            );
        }
    );

    // ==================== 生成 Markdown 摘要 ====================
    function generateMdSummary(data, docName) {
        const lines = [];
        const colorLabels = {
            yellow: '一般重点',
            green: '重要/正确',
            blue: '信息/参考',
            pink: '警告/注意',
            orange: '待办/问题'
        };

        lines.push('# 决策摘要\n');
        lines.push(`> 来源文档：\`${docName}\`\n`);
        lines.push(`> 导出时间：${data._ai_instructions.exported_at}\n`);

        const annotations = data.annotations || [];
        const comments = annotations.filter(a => a.type === 'comment');
        const highlights = annotations.filter(a => a.type === 'highlight');

        lines.push(`\n---\n`);
        lines.push(`## 统计\n`);
        lines.push(`- 📄 文件：${data.document.name}\n`);
        lines.push(`- 🎨 高亮：${highlights.length} 个\n`);
        lines.push(`- 💬 注释：${comments.length} 个\n`);
        lines.push(`- 📊 总计：${annotations.length} 个标注\n`);

        if (annotations.length > 0) {
            lines.push(`\n---\n`);
            lines.push(`## 标注详情\n`);

            // 按行号排序
            const sortedAnnotations = [...annotations].sort(
                (a, b) => (a.location?.line || 0) - (b.location?.line || 0)
            );

            sortedAnnotations.forEach((ann, index) => {
                const lineNum = ann.location?.line || '?';
                const original = (ann.text || '').trim();
                const shortOriginal = original.length > 50 
                    ? original.substring(0, 50) + '...' 
                    : original;

                if (ann.type === 'comment') {
                    const comment = (ann.comment || '').trim();
                    lines.push(`\n### ${index + 1}. 💬 注释 @ 第${lineNum}行\n`);
                    lines.push(`**标注内容：**\n`);
                    lines.push(`> ${shortOriginal}\n`);
                    lines.push(`\n**决策/回复：**\n`);
                    lines.push(`${comment}\n`);
                    if (ann.comment_time) {
                        lines.push(`\n*${ann.comment_time}*\n`);
                    }
                } else if (ann.type === 'highlight') {
                    const colorLabel = colorLabels[ann.color] || ann.color;
                    const importance = ann.importance || 'normal';
                    lines.push(`\n### ${index + 1}. 🎨 高亮 [${colorLabel}] @ 第${lineNum}行\n`);
                    lines.push(`> ${shortOriginal}\n`);
                    if (ann.comment) {
                        lines.push(`\n**备注：** ${ann.comment}\n`);
                    }
                }
                lines.push(`\n---\n`);
            });
        }

        lines.push(`\n> 💡 此摘要由 Markdown Annotator 自动生成\n`);
        return lines.join('');
    }

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
        exportAndCleanCmd,
        quickHighlightCmd,
        listAnnotationsCmd
    );

    // ==================== 切换文件时恢复高亮 ====================
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.languageId === 'markdown') {
            const filePath = editor.document.uri.fsPath;
            if (annotations.has(filePath)) {
                const fileAnnotations = annotations.get(filePath);
                
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
