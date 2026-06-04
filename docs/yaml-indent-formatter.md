# YAML hanging-indent formatter

This document explains how the extension hang-indents the line that
follows `- key: value` so the cursor lands under the key (the canonical
YAML block-mapping-in-sequence style), and why we use an
`OnTypeFormattingEditProvider` rather than `language-configuration.json`
rules for it.

## What it does

When the user presses Enter at the end of a line that looks like

```yaml
    - name: deployStages
```

the new line is indented to the column of the first character after
`- ` on the previous line — i.e. directly under `name`:

```yaml
    - name: deployStages
      <cursor>
```

This holds regardless of where `-` sits (column 0, column 2, column 4,
…) and regardless of the user's `editor.tabSize`.

## Why not `onEnterRules` / `increaseIndentPattern`

Both of those produce an indent equal to one `editor.tabSize` worth of
spaces. That only aligns with the key column when `tabSize` is 2 — the
literal width of `- ` — because the dash and trailing space together
take up exactly two characters. At any other tab size the cursor
overshoots the key by `tabSize - 2` columns. The earlier `onEnterRules`
entry that did this was removed in favor of the provider.

## Implementation

- `src/yamlIndentLogic.ts` — pure helper `computeHangingIndent(prev,
  current)`. Uses the regex
  `^( *)-( +)[A-Za-z_][\w-]*:\s+\S.*$` on the previous line and
  computes the target column as `match[1].length + 1 + match[2].length`
  (leading whitespace + dash + dash-to-key whitespace). Returns the
  whitespace to write plus the current new-line's leading whitespace
  length to replace.
- `src/yamlIndentFormatter.ts` — thin
  `OnTypeFormattingEditProvider` that calls the helper on `\n` and
  returns a single `TextEdit` replacing the new line's leading
  whitespace.
- `src/extension.ts` — registers the provider for the
  `azure-pipelines` document selector with `\n` as the trigger.
- `package.json` — `[azure-pipelines]` `configurationDefaults` set
  `editor.formatOnType: true` so the provider actually fires out of
  the box.

## Intentional non-cases

The regex deliberately does **not** match:

- `- name:` (no value): the existing `increaseIndentPattern` already
  handles adding one indent level so a child mapping starts under
  `name`, and we don't want to fight it.
- `- - name: x` (nested sequence): the inner item's alignment math is
  different and we don't try to handle it; the line falls through to
  default behavior.
- Quoted keys (`- 'name': x`): also fall through; this is rare in
  Azure Pipelines source.

## Tests

`src/unittest/formatting/yamlIndentFormatter.test.ts` covers the pure
helper: left-aligned and indented list items, multi-space dash-to-key
separators, idempotency (no edit when indent is already correct), and
the non-cases above. The tests do not require VS Code APIs because the
helper is decoupled from the provider.
