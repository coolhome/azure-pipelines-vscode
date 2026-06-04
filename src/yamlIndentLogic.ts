/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License.
*--------------------------------------------------------------------------------------------*/

// Matches `<indent>- <key>: <value>` so we can hang-indent the continuation
// line under <key>. Restricting the key to a plain identifier avoids firing
// on nested sequences like `- - name: x`, which we don't try to handle.
const LIST_ITEM_KEY_VALUE = /^( *)-( +)[A-Za-z_][\w-]*:\s+\S.*$/;

export interface HangingIndentReplacement {
    readonly newIndent: string;
    readonly currentIndentLength: number;
}

export function computeHangingIndent(
    previousLineText: string,
    currentLineText: string,
): HangingIndentReplacement | undefined {
    const match = LIST_ITEM_KEY_VALUE.exec(previousLineText);
    if (!match) {
        return undefined;
    }

    const keyColumn = match[1].length + 1 /* dash */ + match[2].length;
    const currentIndentLength = currentLineText.match(/^[ \t]*/)![0].length;
    const newIndent = ' '.repeat(keyColumn);

    if (currentLineText.substring(0, currentIndentLength) === newIndent) {
        return undefined;
    }

    return { newIndent, currentIndentLength };
}
