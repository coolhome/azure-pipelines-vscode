/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License.
*--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

type ScaffoldPath = 'pipeline' | 'template' | 'child';

interface ScaffoldSnippet {
    path: ScaffoldPath;
    /** For `path: "child"`, the top-level key whose array we live in (e.g. "stages"). */
    context?: string;
    prefix: string;
    description: string;
    body: string[];
}

type SnippetFile = Record<string, ScaffoldSnippet>;

/**
 * Decide whether a document looks like a reusable template file rather than a
 * pipeline entry-point.
 *
 * Heuristics (any one is enough):
 *  - file lives under a folder named `templates` (case-insensitive)
 *  - filename starts with `template` or `_` (common community conventions)
 *  - file already declares a top-level `parameters:` block
 */
function looksLikeTemplateFile(document: vscode.TextDocument): boolean {
    const fsPath = document.uri.fsPath;
    const base = path.basename(fsPath).toLowerCase();
    const segments = fsPath.split(/[\\/]/).map(s => s.toLowerCase());

    if (segments.includes('templates')) {
        return true;
    }
    if (base.startsWith('template') || base.startsWith('_')) {
        return true;
    }

    // Top-level `parameters:` declared at column 0.
    const text = document.getText();
    if (/^parameters\s*:/m.test(text)) {
        return true;
    }

    return false;
}

/**
 * A document is considered "empty / at root" when it has no non-whitespace
 * content, or only contains comments and blank lines.
 */
function isEmptyOrCommentsOnly(document: vscode.TextDocument): boolean {
    const text = document.getText();
    if (text.trim().length === 0) {
        return true;
    }
    return text
        .split(/\r?\n/)
        .every(line => line.trim().length === 0 || line.trim().startsWith('#'));
}

/**
 * Walk up from the cursor and decide which top-level array key (if any) we
 * are currently inside. Returns the key name (e.g. "stages") or undefined.
 */
function findEnclosingTopLevelArray(
    document: vscode.TextDocument,
    position: vscode.Position,
): string | undefined {
    for (let line = position.line; line >= 0; line--) {
        const text = document.lineAt(line).text;
        if (text.length === 0 || /^\s/.test(text) || text.startsWith('#')) {
            continue;
        }
        const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*$/);
        if (match) {
            return match[1];
        }
        // Hit a column-0 non-key (e.g. a scalar value).
        return undefined;
    }
    return undefined;
}

/**
 * For a child snippet to fire cleanly, the cursor must be on a blank line
 * with indentation > 0 (i.e. inside some block, not at the document root).
 */
function isAtChildListInsertionPoint(
    document: vscode.TextDocument,
    position: vscode.Position,
): boolean {
    const lineText = document.lineAt(position.line).text;
    if (lineText.trim().length !== 0) {
        return false;
    }
    return position.character > 0;
}

function toCompletionItem(name: string, snippet: ScaffoldSnippet): vscode.CompletionItem {
    const item = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet);
    item.detail = name;
    item.documentation = new vscode.MarkdownString(
        `${snippet.description}\n\n\`\`\`yaml\n${snippet.body.join('\n')}\n\`\`\``
    );
    item.insertText = new vscode.SnippetString(snippet.body.join('\n'));
    item.sortText = `0_${snippet.path}_${snippet.prefix}`;
    item.filterText = snippet.prefix;
    return item;
}

export function registerScaffoldSnippetProvider(
    context: vscode.ExtensionContext,
    languageId: string,
): void {
    const snippetsPath = context.asAbsolutePath(path.join('snippets', 'scaffold-snippets.json'));
    let snippets: SnippetFile;
    try {
        snippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf8')) as SnippetFile;
    } catch (err) {
        // Fail silently — snippets are a nice-to-have, not core functionality.
        console.error('Failed to load Azure Pipelines scaffold snippets:', err);
        return;
    }

    const pipelineSnippets = Object.entries(snippets).filter(([, s]) => s.path === 'pipeline');
    const templateSnippets = Object.entries(snippets).filter(([, s]) => s.path === 'template');
    const childSnippets = Object.entries(snippets).filter(([, s]) => s.path === 'child');

    const provider: vscode.CompletionItemProvider = {
        provideCompletionItems(document, position) {
            const items: vscode.CompletionItem[] = [];

            // ---- Child snippets (inside a top-level array like `stages:`) ----
            if (isAtChildListInsertionPoint(document, position)) {
                const enclosing = findEnclosingTopLevelArray(document, position);
                if (enclosing) {
                    for (const [name, snippet] of childSnippets) {
                        if (snippet.context === enclosing) {
                            items.push(toCompletionItem(name, snippet));
                        }
                    }
                }
                return items;
            }

            // ---- Root scaffold snippets ----
            if (position.character !== 0) {
                return undefined;
            }

            const emptyDoc = isEmptyOrCommentsOnly(document);
            const templateFile = looksLikeTemplateFile(document);

            // Path A (pipeline): only when the document is effectively empty AND
            // the filename/location doesn't already say "this is a template".
            if (emptyDoc && !templateFile) {
                for (const [name, snippet] of pipelineSnippets) {
                    items.push(toCompletionItem(name, snippet));
                }
            }

            // Path B (template): when the file looks like a template, OR when the
            // document is empty (so users authoring a fresh template still see them).
            if (templateFile || emptyDoc) {
                for (const [name, snippet] of templateSnippets) {
                    items.push(toCompletionItem(name, snippet));
                }
            }

            return items;
        }
    };

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            [
                { language: languageId, scheme: 'file' },
                { language: languageId, scheme: 'untitled' },
            ],
            provider,
        ),
    );
}
