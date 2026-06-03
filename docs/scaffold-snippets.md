# Empty-file scaffold snippets

Tracking doc for the "open empty `azure-pipelines.yaml`, press Ctrl+Space, get a
top-level skeleton" feature.

## Goal

When a user opens a file recognized as the `azure-pipelines` language and the
document is empty (or the cursor is at the document root), pressing
<kbd>Ctrl</kbd>+<kbd>Space</kbd> should surface scaffold suggestions for the
common top-level shapes of an Azure Pipelines YAML file.

## Approach

Snippets are defined as data in
[snippets/scaffold-snippets.json](../snippets/scaffold-snippets.json) and
surfaced by a `CompletionItemProvider` registered in
[src/snippets/scaffoldSnippetProvider.ts](../src/snippets/scaffoldSnippetProvider.ts).

We deliberately do **not** use `contributes.snippets`, because that would show
every snippet in every Azure Pipelines file regardless of context. Going
through the completion-provider API lets us scope when each path appears.

### Context rules

| Condition                                              | Show Path A (`pipeline-*`) | Show Path B (`template-*`) |
| ------------------------------------------------------ | -------------------------- | -------------------------- |
| Empty or comments-only doc, file is **not** a template | ✅                          | ✅                          |
| Empty or comments-only doc, file **is** a template     | ❌                          | ✅                          |
| File already has top-level content, **is** a template  | ❌                          | ✅                          |
| File already has top-level content, **not** a template | ❌                          | ❌                          |
| Cursor is not at column 0                              | ❌                          | ❌                          |

A document is "empty / comments-only" when every line is blank or starts with
`#`. A file is treated as a template when any of these is true:

- path contains a `templates` folder (case-insensitive),
- filename starts with `template` or `_`,
- the document already declares a top-level `parameters:` block.

Snippets are given a `sortText` of `0_…` so they rank above generic schema
completions when they do apply.

## Snippets shipped

Two parallel paths, one snippet per layer.

### Path A — Pipeline (runnable entry-point)

Each Path A snippet emits a common header:

```yaml
name: $(Date:yyyyMMdd)$(Rev:.r)
trigger: none
pr: none
appendCommitMessageToRunName: true|false
```

…followed by the layer-specific body.

| Name                                              | Prefix                | Layer body                                              |
| ------------------------------------------------- | --------------------- | ------------------------------------------------------- |
| Pipeline Stage Template                           | `pipeline-stages`     | `stages:` / `  - stage: <cursor>`                       |
| Pipeline Job Template                             | `pipeline-jobs`       | `jobs:` / `  - job: <cursor>`                           |
| Pipeline Steps Template (implicit job)            | `pipeline-steps`      | `steps:` / `  - pwsh: <cursor>`                         |
| Pipeline Deployment Template                      | `pipeline-deployment` | `jobs:` / `  - deployment:` / `    environment:`        |
| Pipeline Extends Template (instance of template)  | `pipeline-extends`    | `extends:` / `  template:` / `  parameters:` / `    name: value` |

### Path B — Reusable template files (parameter-driven)
Each Path B snippet declares `parameters:` and emits a single block that
references those parameters. No pipeline-level header.

| Name              | Prefix               | Body                                                            |
| ----------------- | -------------------- | --------------------------------------------------------------- |
| Stage Template    | `template-stage`     | `parameters: - name: stageName, type: string` / `stages: - stage: ${{ parameters.stageName }}` |
| Job Template      | `template-job`       | `parameters: - name: jobName, type: string` / `jobs: - job: ${{ parameters.jobName }}` |
| Step Template     | `template-step`      | `parameters: - name: script, type: string, default: ''` / `steps: - pwsh: ${{ parameters.script }}` |
| Variable Template | `template-variables` | `variables: - name: <cursor>, value:`                           |

### Child snippets (in-block)

Fire only when the cursor is on a blank, indented line directly under a
top-level array key. Each snippet scaffolds the *next* item but stops at the
next layer down, so the user picks what to put inside.

| Name          | Triggered inside | Prefix  | Body                              |
| ------------- | ---------------- | ------- | --------------------------------- |
| Minimal stage | `stages:`        | `stage` | `- stage: <cursor>` / `  jobs:`   |
| Minimal job   | `jobs:`          | `job`   | `- job: <cursor>` / `  steps:`    |

## Manual test

1. `npm install`
2. Run the `Extension` debug configuration (or `npm run watch` + reload).
3. Create a new file named `azure-pipelines.yaml` in any folder.
4. Confirm the language mode at the bottom-right is `Azure Pipelines`.
5. With the file empty, press <kbd>Ctrl</kbd>+<kbd>Space</kbd>.
6. Expect to see all Path A (`pipeline-*`) and Path B (`template-*`) entries;
   selecting one inserts the body and places the cursor at the first tab stop.
   For Path A, the first tab stop is the `appendCommitMessageToRunName` choice
   (`true` / `false`).

## Status

- [x] Branch `feature/empty-file-scaffold-snippets` created.
- [x] Snippet data file added (`snippets/scaffold-snippets.json`).
- [x] Context-aware `CompletionItemProvider` registered from `extension.ts`.
- [x] Tracking doc (this file).
- [ ] Manual verification in Extension Host.
- [ ] Unit tests for `looksLikeTemplateFile` / `isEmptyOrCommentsOnly` and the
      provider's filtering matrix.

## Follow-ups / open questions

- The "is a template" heuristic is filename/path-based plus a `parameters:`
  check. We could also peek at the schema or a workspace setting if those
  prove too coarse.
- These snippets are intentionally minimal; nested shapes (a stage with jobs
  inside, a steps block with a task + inputs, etc.) can be added incrementally.
- Longer term, autocompletion for *non-local* template references (resolving
  `extends.template: file.yml@repo`) needs a pipeline-aware index in the
  language server — out of scope for this branch.
