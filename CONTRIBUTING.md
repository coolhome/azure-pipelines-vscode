# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Local development

### Prerequisites

- Node.js >= 12.20 (see `engines.node` in `package.json`)
- VS Code >= 1.64
- `npm install` once to fetch dependencies

### Option 1 — Run in an Extension Development Host (recommended for iterating)

The Extension Development Host is a throwaway VS Code window that loads
your working copy of the extension. Nothing is installed into your
normal VS Code.

1. Open the repo in VS Code (or open
   `azure-pipelines-vscode.code-workspace` for the multi-root setup
   that bundles the domain docs).
2. Press **F5**, or pick **Run Extension** / **Run Extension (grammar
   test)** from the Run and Debug panel. This builds via webpack and
   launches the host window.
3. In the host window, open a pipeline YAML file (see
   `examples/expressionSyntaxes.yml` for a sample exercising the
   expression syntaxes). If the file isn't auto-detected as
   `Azure Pipelines`, switch the language via the status bar.

To iterate on the **grammar** (`syntaxes/yaml.tmLanguage.json`) you do
**not** need to rebuild. Edit the file, then in the host window run
**Developer: Reload Window** from the Command Palette.

To iterate on the **TypeScript** sources, run `npm run watch` in a
terminal before launching the host — webpack will rebuild `dist/` on
save and the host's debugger will pick up the changes after a reload.

### Option 2 — Build and install a `.vsix`

For a persistent install in your normal VS Code (survives restarts):

```bash
npm install
npm run compile
npx --yes @vscode/vsce package --no-dependencies   # produces azure-pipelines-<version>.vsix
```

If you have the marketplace **Azure Pipelines** extension installed,
uninstall it first or VS Code will load both grammars at the same
language ID:

```bash
code --uninstall-extension ms-azure-devops.azure-pipelines
code --install-extension azure-pipelines-*.vsix --force
```

To revert: `code --uninstall-extension ms-azure-devops.azure-pipelines`
and reinstall from the marketplace.

### Inspecting grammar scopes

When working on `syntaxes/yaml.tmLanguage.json`, use **Developer:
Inspect Editor Tokens and Scopes** (Command Palette) to see the exact
scope stack at the cursor — the fastest way to confirm a pattern
matches and to find the scope name to target from a theme.

### Tests

```bash
npm run unittest   # mocha unit tests
npm test           # full extension test suite (boots VS Code)
```

The **Extension Tests** launch configuration in `.vscode/launch.json`
runs the full suite under the VS Code debugger.
