@echo off
cd /d "%~dp0"
echo Building vscode-markdown-annotator...
vsce package
if %errorlevel% equ 0 (
    echo.
    echo Build succeeded!
    for %%f in (vscode-markdown-annotator-*.vsix) do echo Output: %%f
) else (
    echo.
    echo Build failed!
)
pause
