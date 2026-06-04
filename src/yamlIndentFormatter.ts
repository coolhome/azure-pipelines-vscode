/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License.
*--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

import { computeHangingIndent } from './yamlIndentLogic';

export const yamlListItemHangingIndentProvider: vscode.OnTypeFormattingEditProvider = {
    provideOnTypeFormattingEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        ch: string,
    ): vscode.TextEdit[] {
        if (ch !== '\n' || position.line === 0) {
            return [];
        }

        const previousLineText = document.lineAt(position.line - 1).text;
        const currentLineText = document.lineAt(position.line).text;
        const replacement = computeHangingIndent(previousLineText, currentLineText);
        if (!replacement) {
            return [];
        }

        return [
            vscode.TextEdit.replace(
                new vscode.Range(position.line, 0, position.line, replacement.currentIndentLength),
                replacement.newIndent,
            ),
        ];
    },
};
