# YAML tmLanguage Visualization

This document visualizes `syntaxes/yaml.tmLanguage.json` with a focus on parse flow and Azure Pipelines expression extensions.

## 1) Top-level Grammar Flow

```mermaid
flowchart LR
    P["patterns[] root"] --> C["#comment"]
    P --> PR["#property"]
    P --> D["#directive"]
    P --> B["--- document begin"]
    P --> E["... document end"]
    P --> N["#node"]

    N --> BN["#block-node"]
    N --> FN["#flow-node"]

    BN --> BP["#block-pair"]
    BN --> BS["#block-scalar"]

    FN --> FP["#flow-pair"]
    FN --> FS["#flow-scalar"]

    FS --> FSDQ["#flow-scalar-double-quoted"]
    FS --> FSSQ["#flow-scalar-single-quoted"]
    FS --> FSPI["#flow-scalar-plain-in"]
    FS --> FSPO["#flow-scalar-plain-out"]

    BP --> EX["#expressions"]
    BP --> TEK["#template-expression-key variants"]
    BP --> IEP["#implicit-expression-pair"]

    FP --> EX
    FP --> TEK

    BS --> EX
    FSDQ --> EXDQ["#expressions-yaml-double-quoted"]
    FSSQ --> EXSQ["#expressions-yaml-single-quoted"]
    FSPI --> EX
    FSPO --> EX

    classDef new fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    classDef base fill:#f8fafc,stroke:#475569,color:#111;
    class P,C,PR,D,B,E,N,BN,FN,BP,BS,FP,FS,FSDQ,FSSQ,FSPI,FSPO base;
    class EX,EXSQ,EXDQ,TEK,IEP new;
```

> Yellow nodes are added by this fork (not present in the upstream VS Code YAML grammar).

## 2) Azure Pipelines Expression Subsystem

```mermaid
flowchart LR
    EX["#expressions"] --> TE["#template-expression"]
    EX --> RE["#runtime-expression"]
    EX --> M["#macro"]

    EXSQ["#expressions-yaml-single-quoted"] --> TESQ["#template-expression-yaml-single-quoted"]
    EXSQ --> RESQ["#runtime-expression-yaml-single-quoted"]
    EXSQ --> M

    EXDQ["#expressions-yaml-double-quoted"] --> TEDQ["#template-expression-yaml-double-quoted"]
    EXDQ --> REDQ["#runtime-expression-yaml-double-quoted"]
    EXDQ --> M

    TEK["#template-expression-key"] --> EB["#expression-body"]
    TEKSQ["#template-expression-key-yaml-single-quoted"] --> EBSQ["#expression-body-yaml-single-quoted"]
    TEKDQ["#template-expression-key-yaml-double-quoted"] --> EBDQ["#expression-body-yaml-double-quoted"]

    IEP["#implicit-expression-pair"] --> EX
    IEP --> EB

    TE --> EB
    RE --> EB
    TESQ --> EBSQ
    RESQ --> EBSQ
    TEDQ --> EBDQ
    REDQ --> EBDQ

    classDef new fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    class EX,EXSQ,EXDQ,TE,RE,M,TESQ,RESQ,TEDQ,REDQ,TEK,TEKSQ,TEKDQ,EB,EBSQ,EBDQ,IEP new;
```

> Every node in this diagram is fork-added (the entire Azure expression subsystem).

## 3) Expression Body Building Blocks

```mermaid
flowchart LR
    EB["#expression-body"] --> DK["#directive-keyword"]
    EB --> BFC["#builtin-function-call"]
    EB --> JSF["#job-status-function-call"]
    EB --> CO["#context-object"]
    EB --> LC["#language-constant"]
    EB --> SL["#string-literal"]
    EB --> VL["#version-literal"]
    EB --> NL["#number-literal"]
    EB --> BR["#brackets"]
    EB --> PUNC["#punctuation"]
    EB --> ID["#identifier"]

    BR --> EB
    BFC --> EB
    JSF --> EB

    classDef new fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    class EB,DK,BFC,JSF,CO,LC,SL,VL,NL,BR,PUNC,ID new;
```

> Every node in this diagram is fork-added.

## 4) Top-level Grammar, Grouped

Same content as diagram 1, but with subgraph "boxes" that encapsulate logical groups.
    direction LR

```mermaid
flowchart LR
    P["patterns[] root"]

    subgraph DOC["Document structure"]
    direction LR
        C["#comment"]
        PR["#property"]
        D["#directive"]
        B["--- document begin"]
        E["... document end"]
    end

    subgraph NODES["#node dispatch"]
    direction LR
        N["#node"]
        subgraph BLOCK["Block style"]
    direction LR
            BN["#block-node"]
            BP["#block-pair"]
            BS["#block-scalar"]
        end
        subgraph FLOW["Flow style"]
    direction LR
            FN["#flow-node"]
            FP["#flow-pair"]
            subgraph FSCALAR["#flow-scalar variants"]
    direction LR
                FS["#flow-scalar"]
                FSDQ["#flow-scalar-double-quoted"]
                FSSQ["#flow-scalar-single-quoted"]
                FSPI["#flow-scalar-plain-in"]
                FSPO["#flow-scalar-plain-out"]
            end
        end
    end

    subgraph AZP["Azure Pipelines expressions (fork-added)"]
    direction LR
        EX["#expressions"]
        EXSQ["#expressions-yaml-single-quoted"]
        EXDQ["#expressions-yaml-double-quoted"]
        TEK["#template-expression-key variants"]
        IEP["#implicit-expression-pair"]
    end

    P --> C
    P --> PR
    P --> D
    P --> B
    P --> E
    P --> N

    N --> BN
    N --> FN
    BN --> BP
    BN --> BS
    FN --> FP
    FN --> FS
    FS --> FSDQ
    FS --> FSSQ
    FS --> FSPI
    FS --> FSPO

    BP --> EX
    BP --> TEK
    BP --> IEP
    FP --> EX
    FP --> TEK
    BS --> EX
    FSDQ --> EXDQ
    FSSQ --> EXSQ
    FSPI --> EX
    FSPO --> EX

    classDef new fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    classDef base fill:#f8fafc,stroke:#475569,color:#111;
    class P,C,PR,D,B,E,N,BN,FN,BP,BS,FP,FS,FSDQ,FSSQ,FSPI,FSPO base;
    class EX,EXSQ,EXDQ,TEK,IEP new;
    style AZP fill:#fef9c3,stroke:#d97706,stroke-dasharray: 4 2,color:#111;
    style FSCALAR fill:#eef2ff,stroke:#6366f1,color:#111;
    style BLOCK fill:#ecfdf5,stroke:#10b981,color:#111;
    style FLOW fill:#fef2f2,stroke:#ef4444,color:#111;
    style DOC fill:#f5f5f4,stroke:#78716c,color:#111;
    style NODES fill:#ffffff,stroke:#0ea5e9,color:#111;
```

## 5) How Things Break Down — Visual Examples

Concrete YAML snippets shown the way VS Code actually parses them: each row is one token span with its full scope stack (matches the output of `Developer: Inspect Editor Tokens and Scopes`), followed by a push/pop stack timeline.

### 5.1 `value: ${{ parameters.image }}`

```yaml
value: ${{ parameters.image }}
```

**Annotated source (one row per token span):**

| Pos | Text | Scope stack (top-most last) |
|----:|------|-----------------------------|
| 0–4 | `value` | `source.yaml` → `entity.name.tag.yaml` |
| 5 | `:` | `source.yaml` → `punctuation.separator.key-value.mapping.yaml` |
| 7 | `$` | `source.yaml` → `meta.template.expression.azure-pipelines` → `keyword.operator.expression.sigil.azure-pipelines` |
| 8–9 | `{{` | … → `punctuation.definition.template-expression.begin.azure-pipelines` |
| 10 | ` ` | … → `meta.template.expression.body.azure-pipelines` |
| 11–20 | `parameters` | … → `variable.other.identifier.azure-pipelines` |
| 21 | `.` | … → `punctuation.accessor.azure-pipelines` |
| 22–26 | `image` | … → `variable.other.identifier.azure-pipelines` |
| 27 | ` ` | … → `meta.template.expression.body.azure-pipelines` |
| 28–29 | `}}` | … → `punctuation.definition.template-expression.end.azure-pipelines` |

**Stack timeline (push = →, pop = ←):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> source_yaml
    source_yaml --> mapping_key : "value"
    mapping_key --> source_yaml : ":"
    source_yaml --> template_expression : "$"
    template_expression --> begin_delim : "{{"
    begin_delim --> expression_body : enter body
    expression_body --> identifier : "parameters"
    identifier --> expression_body : pop
    expression_body --> accessor : "."
    accessor --> expression_body : pop
    expression_body --> identifier2 : "image"
    identifier2 --> expression_body : pop
    expression_body --> end_delim : "}}"
    end_delim --> source_yaml : pop template_expression
    source_yaml --> [*]
```

### 5.2 `condition: $[ and(succeeded(), eq(variables.flag, 'yes')) ]`

```yaml
condition: $[ and(succeeded(), eq(variables.flag, 'yes')) ]
```

**Annotated source:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0–8 | `condition` | `source.yaml` → `entity.name.tag.yaml` |
| 9 | `:` | … → `punctuation.separator.key-value.mapping.yaml` |
| 11 | `$` | … → `meta.runtime-expression.azure-pipelines` → `keyword.operator.expression.sigil` |
| 12 | `[` | … → `punctuation.definition.runtime-expression.begin` |
| 14–16 | `and` | … → `expression-body` → `meta.function-call.builtin.azure-pipelines` → `support.function` |
| 17 | `(` | … → `meta.brace.round` |
| 18–26 | `succeeded` | … → inner `meta.function-call.builtin` → `support.function` |
| 27 | `(` | … → inner `meta.brace.round` |
| 28 | `)` | … → close inner call, pop to outer `and()` body |
| 28 | `,` | … → `punctuation.separator.comma` |
| 30–31 | `eq` | … → another `meta.function-call.builtin` → `support.function` |
| 32 | `(` | … → `meta.brace.round` |
| 33–46 | `variables.flag` | … → identifier + accessor + identifier |
| 46 | `,` | … → `punctuation.separator.comma` |
| 48 | `'` | … → `string.quoted.single.azure-pipelines` → `punctuation.definition.string.begin` |
| 49–51 | `yes` | … → string content |
| 52 | `'` | … → `punctuation.definition.string.end` (pop string) |
| 53 | `)` | … → close `eq()` |
| 54 | `)` | … → close `and()` |
| 56 | `]` | … → `punctuation.definition.runtime-expression.end` (pop runtime-expression) |

**Stack depth over the line:**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> runtime_expr : "$["
    runtime_expr --> body : enter
    body --> and_call : "and"
    and_call --> brace_and : "("
    brace_and --> succeeded_call : "succeeded"
    succeeded_call --> brace_s : "("
    brace_s --> succeeded_call : ")"
    succeeded_call --> brace_and : pop
    brace_and --> eq_call : ", eq"
    eq_call --> brace_eq : "("
    brace_eq --> ident : "variables.flag"
    ident --> brace_eq : pop
    brace_eq --> string : "'"
    string --> brace_eq : "yes'"
    brace_eq --> eq_call : ")"
    eq_call --> brace_and : pop
    brace_and --> and_call : ")"
    and_call --> body : pop
    body --> runtime_expr : "]"
    runtime_expr --> yaml : pop
    yaml --> [*]
```

### 5.3 `script: "echo Hello $(Build.BuildId) from $(Agent.Name)"`

```yaml
script: "echo Hello $(Build.BuildId) from $(Agent.Name)"
```

**Annotated source:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0–5 | `script` | `source.yaml` → `entity.name.tag.yaml` |
| 6 | `:` | … → `punctuation.separator.key-value.mapping.yaml` |
| 8 | `"` | … → `string.quoted.double.yaml` → `punctuation.definition.string.begin.yaml` |
| 9–19 | `echo Hello ` | … → `string.quoted.double.yaml` |
| 20 | `$` | … → `variable.other.readwrite.azure-pipelines` → `punctuation.definition.variable.azure-pipelines` |
| 21 | `(` | … → `punctuation.definition.variable.azure-pipelines` |
| 22–33 | `Build.BuildId` | … → `variable.other.readwrite.azure-pipelines` |
| 34 | `)` | … → `punctuation.definition.variable.azure-pipelines` (pop macro) |
| 35–40 | ` from ` | … → `string.quoted.double.yaml` |
| 41–54 | `$(Agent.Name)` | … → second `variable.other.readwrite.azure-pipelines` push/pop |
| 55 | `"` | … → `punctuation.definition.string.end.yaml` (pop string) |

**Stack timeline:**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> dq_string : open "
    dq_string --> macro1 : "$("
    macro1 --> dq_string : ")"
    dq_string --> macro2 : "$("
    macro2 --> dq_string : ")"
    dq_string --> yaml : close "
    yaml --> [*]
```

Key insight: the `string.quoted.double.yaml` scope stays on the stack across both `$( ... )` macros — they push a *sibling* scope on top, render, and pop back into the string. That's why the macros highlight uniformly inside quoted *and* plain scalars.

### 5.4 `${{ if eq(parameters.os, 'linux') }}:` as a mapping key

```yaml
${{ if eq(parameters.os, 'linux') }}:
  image: ubuntu-latest
```

**Annotated source:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.template.expression.azure-pipelines` → `keyword.operator.expression.sigil` |
| 1–2 | `{{` | … → `punctuation.definition.template-expression.begin` |
| 4–5 | `if` | … → `expression-body` → `keyword.control.directive.azure-pipelines` |
| 7–8 | `eq` | … → `meta.function-call.builtin` → `support.function` |
| 9 | `(` | … → `meta.brace.round` |
| 10–22 | `parameters.os` | … → identifier + accessor |
| 22 | `,` | … → `punctuation.separator.comma` |
| 24 | `'` | … → `string.quoted.single.azure-pipelines` |
| 25–29 | `linux` | … → string content |
| 30 | `'` | … → pop string |
| 31 | `)` | … → pop `eq()` |
| 33–34 | `}}` | … → `punctuation.definition.template-expression.end` (pop template-expression) |
| 35 | `:` | `source.yaml` → `punctuation.separator.key-value.mapping.yaml` |

**Stack timeline:**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> tek : "$" (template-expression-key)
    tek --> begin_d : "{{"
    begin_d --> body : enter
    body --> if_kw : "if"
    if_kw --> body : pop
    body --> eq_call : "eq"
    eq_call --> brace : "("
    brace --> ident : "parameters.os"
    ident --> brace : pop
    brace --> string : "'linux'"
    string --> brace : pop
    brace --> eq_call : ")"
    eq_call --> body : pop
    body --> end_d : "}}"
    end_d --> yaml : pop template-expression-key
    yaml --> colon : ":"
    colon --> [*]
```

The whole `${{ ... }}` lives at the *key* position, so when it pops, the parser is back at `source.yaml` ready to consume the `:` — not inside any scalar scope. That's exactly the bug fixed in 6.2.

### How to verify these traces against real output

1. Open one of the YAML snippets in VS Code with this extension active.
2. `Ctrl+Shift+P` → **Developer: Inspect Editor Tokens and Scopes**.
3. Click any character in the editor; the popup shows the live scope stack.
4. Compare row-by-row with the tables above.

That tool is the ground truth — if a table here disagrees, the table is wrong (and probably worth a commit to fix).



## 6) Tricky Challenges & How We Resolved Them

Each subsection summarizes a real problem from this fork's history, the symptom in the editor, why it happened, the fix, and a before/after parse view.

---

### 6.1 Macro embedded in a plain scalar collapsed the rest of the line

**Symptom:** `$(Build.BuildId)` inside an unquoted scalar like `name: build-$(Build.BuildId)-final` was swallowed by the plain-scalar regex, so the macro and trailing text rendered as one undifferentiated string.

**Why:** YAML's `flow-scalar-plain-*` pattern is greedy — once it starts matching, it owns the line until end-of-scalar. Macro highlighting never got a chance to fire.

**Fix:** End the plain scalar at expression sigils (`$`) and re-enter via `#expressions`. See commit `1c8b19c` ("End plain scalar before expression sigils so embedded macros render uniformly").

Input: `name: build-$(Build.BuildId)-final`

**Before — one greedy scalar swallows everything:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0–3 | `name` | `source.yaml` → `entity.name.tag.yaml` |
| 4 | `:` | … → `punctuation.separator.key-value.mapping.yaml` |
| 6–34 | `build-$(Build.BuildId)-final` | … → `string.unquoted.plain.out.yaml` (single span) |

**After — scalar yields to `#macro` at `$`:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0–3 | `name` | `source.yaml` → `entity.name.tag.yaml` |
| 4 | `:` | … → `punctuation.separator.key-value.mapping.yaml` |
| 6–11 | `build-` | … → `string.unquoted.plain.out.yaml` (ends at `$`) |
| 12 | `$` | … → `variable.other.readwrite.azure-pipelines` → `punctuation.definition.variable` |
| 13 | `(` | … → `punctuation.definition.variable` |
| 14–26 | `Build.BuildId` | … → `variable.other.readwrite.azure-pipelines` |
| 27 | `)` | … → `punctuation.definition.variable` (pop macro) |
| 28–33 | `-final` | … → `string.unquoted.plain.out.yaml` (re-enters) |

**Stack timeline — Before (one flat span):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> key : "name"
    key --> yaml : ":"
    yaml --> plain_scalar : enter scalar
    plain_scalar --> plain_scalar : swallow $(...)-final
    plain_scalar --> yaml : pop at EOL
    yaml --> [*]
```

**Stack timeline — After (scalar yields, macro pushes, scalar re-enters):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> key : "name"
    key --> yaml : ":"
    yaml --> plain_scalar : "build-"
    plain_scalar --> yaml : pop at "$"
    yaml --> macro : "$("
    macro --> ident : "Build.BuildId"
    ident --> macro : pop
    macro --> yaml : ")"
    yaml --> plain_scalar2 : "-final"
    plain_scalar2 --> yaml : pop
    yaml --> [*]
```

---

### 6.2 Template-expression as mapping key wasn't matched

**Symptom:** `${{ if eq(...) }}:` keys were not highlighted as expressions; they were treated as a quoted-looking plain string.

**Why:** `#template-expression` only matches inside scalar *values*. Mapping keys are parsed by `#block-pair` / `#flow-pair` before scalar dispatch, so the expression never reached `#expressions`.

**Fix:** Introduce dedicated `#template-expression-key` variants (plain, single-quoted, double-quoted) and include them at the start of `#block-pair` and `#flow-pair`. See `591b18a` ("Highlight bare expressions in condition: and template expressions used as mapping keys").

Input: `${{ if eq(parameters.os, 'linux') }}: ubuntu-latest`

**Before — key is treated as a generic plain scalar:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0–34 | `${{ if eq(parameters.os, 'linux') }}` | `source.yaml` → `string.unquoted.plain.out.yaml` (one span, no expression scope) |
| 35 | `:` | … → `punctuation.separator.key-value.mapping.yaml` |
| 37–49 | `ubuntu-latest` | … → `string.unquoted.plain.out.yaml` |

**After — key matches `#template-expression-key` *before* scalar parsing:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.template.expression.azure-pipelines` → `keyword.operator.expression.sigil` |
| 1–2 | `{{` | … → `punctuation.definition.template-expression.begin` |
| 4–5 | `if` | … → `expression-body` → `keyword.control.directive.azure-pipelines` |
| 7–35 | `eq(parameters.os, 'linux')` | … → recursive function-call body (see 5b.4 for detail) |
| 36–37 | `}}` | … → `punctuation.definition.template-expression.end` (pop) |
| 38 | `:` | `source.yaml` → `punctuation.separator.key-value.mapping.yaml` |
| 40–52 | `ubuntu-latest` | … → `string.unquoted.plain.out.yaml` |

**Stack timeline — Before (key falls through to plain scalar):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> block_pair : start pair
    block_pair --> plain_scalar_key : no key rule matches, fallback
    plain_scalar_key --> block_pair : pop at ":"
    block_pair --> yaml : ":"
    yaml --> plain_scalar_val : "ubuntu-latest"
    plain_scalar_val --> yaml : pop
    yaml --> [*]
```

**Stack timeline — After (`#template-expression-key` wins before scalar dispatch):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> block_pair : start pair
    block_pair --> tmpl_expr_key : "$"
    tmpl_expr_key --> begin_delim : "{{"
    begin_delim --> expr_body : enter
    expr_body --> directive : "if"
    directive --> expr_body : pop
    expr_body --> eq_call : "eq(...)"
    eq_call --> expr_body : pop
    expr_body --> end_delim : "}}"
    end_delim --> block_pair : pop tmpl_expr_key
    block_pair --> yaml : ":"
    yaml --> plain_scalar_val : "ubuntu-latest"
    plain_scalar_val --> yaml : pop
    yaml --> [*]
```

---

### 6.3 String literals inside expressions inside quoted scalars

**Symptom:** `"${{ eq(parameters.os, 'linux') }}"` rendered `'linux'` as raw text, breaking the visual cue that it was a string argument.

**Why:** Inside a YAML double-quoted scalar, an embedded expression body re-tokenized with the *outer* string scope still active. The inner `'linux'` ran into single-quote parsing conflicts.

**Fix:** Mirror `#expression-body` into `-yaml-single-quoted` and `-yaml-double-quoted` variants with quote-aware `#string-literal-*` children. See `3da5b3c`.

Input: `"${{ eq(parameters.os, 'linux') }}"`

**Before — outer string scope leaks into the inner `'linux'`:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `"` | `source.yaml` → `string.quoted.double.yaml` → `punctuation.definition.string.begin` |
| 1 | `$` | … → `meta.template.expression` → `sigil` (but **still inside `string.quoted.double.yaml`**) |
| 2–3 | `{{` | … → `punctuation.definition.template-expression.begin` |
| 5–17 | `eq(parameters.os,` | … → expression-body using base `#string-literal` rules |
| 19 | `'` | **mismatch**: tries to *close* the outer string scope, leaves `linux'` un-scoped |
| 20–24 | `linux` | scope stack is now broken — falls back to bare `source.yaml` |

**After — `-yaml-double-quoted` variants own the inner string:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `"` | `source.yaml` → `string.quoted.double.yaml` → `punctuation.definition.string.begin` |
| 1 | `$` | … → `meta.template.expression.azure-pipelines` → `sigil` |
| 2–3 | `{{` | … → `punctuation.definition.template-expression.begin` |
| 5–6 | `eq` | … → `expression-body-yaml-double-quoted` → `support.function` |
| 7 | `(` | … → `meta.brace.round` |
| 8–20 | `parameters.os` | … → identifier + accessor |
| 22 | `'` | … → `string-literal-yaml-double-quoted` → `punctuation.definition.string.begin` |
| 23–27 | `linux` | … → string content (inner scope, doesn't pop the outer `"`) |
| 28 | `'` | … → pop inner string |
| 29 | `)` | … → close `eq()` |
| 31–32 | `}}` | … → `punctuation.definition.template-expression.end` |
| 33 | `"` | … → `punctuation.definition.string.end` (pop outer string) |

**Stack timeline — Before (inner `'` is mistaken for the outer `"` close):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> dq_string : opening &quot;
    dq_string --> tmpl_expr : "$"
    tmpl_expr --> begin_delim : "{{"
    begin_delim --> expr_body : enter (base #string-literal)
    expr_body --> eq_call : "eq(parameters.os,"
    eq_call --> broken : inner ' confused with outer string close
    broken --> yaml : stack desync, fallback to bare yaml
    yaml --> [*]
```

**Stack timeline — After (quote-aware variants keep the stack consistent):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> dq_string : opening &quot;
    dq_string --> tmpl_expr : "$"
    tmpl_expr --> begin_delim : "{{"
    begin_delim --> expr_body_dq : enter -yaml-double-quoted
    expr_body_dq --> eq_call : "eq"
    eq_call --> brace_eq : "("
    brace_eq --> ident : "parameters.os"
    ident --> brace_eq : pop
    brace_eq --> inner_string : inner "'" via string-literal-yaml-double-quoted
    inner_string --> brace_eq : closing "'"
    brace_eq --> eq_call : ")"
    eq_call --> expr_body_dq : pop
    expr_body_dq --> end_delim : "}}"
    end_delim --> dq_string : pop tmpl_expr
    dq_string --> yaml : closing &quot;
    yaml --> [*]
```

The trick: every variant (`-yaml-single-quoted` / `-yaml-double-quoted`) is a near-copy of the base, swapping only the quote rules so the language server stays in a consistent quote context.

---

### 6.4 Bracket "rainbow" stole color from expression delimiters

**Symptom:** With VS Code's bracket pair colorization on, the `{{`, `}}`, `(`, `)`, `[`, `]` inside expressions cycled through rainbow colors that visually competed with theme keyword colors.

**Why:** Default bracket scopes triggered bracket pair colorization; the `$` sigil shared the same scope so it inherited the same shifting color.

**Fix (multi-commit):**
- `385bbbf`: keep template expressions *inside* the plain scalar wrapper so brackets aren't seen as top-level pairs.
- `db21035`: split sigil scope from bracket scope so `$` colors independently from `{{ }}` / `( )` / `[ ]`.
- `5af7293` (current head): assign theme-friendly scopes (`keyword.other.template-expression`, `keyword.operator.expression.sigil`, `punctuation.definition.variable`) so each delimiter family is themed by token color, not bracket rainbow.

Input: `${{ x }}` (just the delimiters of interest)

**Before — sigil and delimiters share one bracket-ish scope:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.template.expression` → `punctuation.section.braces.begin` |
| 1–2 | `{{` | … → `punctuation.section.braces.begin` (same scope as `$` → bracket pair colorization fires across both) |
| 4 | `x` | … → `expression-body` → `identifier` |
| 6–7 | `}}` | … → `punctuation.section.braces.end` |

**After — three distinct, theme-friendly scopes:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.template.expression.azure-pipelines` → `keyword.operator.expression.sigil.azure-pipelines` |
| 1–2 | `{{` | … → `keyword.other.template-expression.azure-pipelines` + `punctuation.definition.template-expression.begin.azure-pipelines` |
| 4 | `x` | … → `meta.template.expression.body.azure-pipelines` → `variable.other.identifier` |
| 6–7 | `}}` | … → `keyword.other.template-expression.azure-pipelines` + `punctuation.definition.template-expression.end.azure-pipelines` |

**Stack timeline — Before (`$` and `{{` share one bracket scope):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> tmpl_expr : enter meta.template.expression
    tmpl_expr --> braces_section : "$" pushed into punctuation.section.braces.begin
    braces_section --> braces_section : "{{" same scope (bracket pair colorization paints both)
    braces_section --> expr_body : enter body
    expr_body --> ident : "x"
    ident --> expr_body : pop
    expr_body --> braces_section_end : "}}" into punctuation.section.braces.end
    braces_section_end --> yaml : pop tmpl_expr
    yaml --> [*]
```

**Stack timeline — After (three distinct scope families, no bracket-pair confusion):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> tmpl_expr : enter meta.template.expression.azure-pipelines
    tmpl_expr --> sigil : "$" → keyword.operator.expression.sigil
    sigil --> tmpl_expr : pop
    tmpl_expr --> begin_delim : "{{" → keyword.other.template-expression
    begin_delim --> expr_body : enter body
    expr_body --> ident : "x"
    ident --> expr_body : pop
    expr_body --> end_delim : "}}" → keyword.other.template-expression
    end_delim --> yaml : pop tmpl_expr
    yaml --> [*]
```

Why this matters: the `$` and `{{` no longer share a `punctuation.section.braces.*` scope, so VS Code's bracket-pair colorization doesn't see the expression delimiters as a *bracket* pair — and themes color them via the `keyword.*` tokens instead.

---

### 6.5 Quoted template key dragged "string" theming inside

**Symptom:** `'${{ parameters.x }}'` keys took on the string theme color, so `{{ }}` looked like part of a string literal instead of an expression boundary.

**Why:** The outer `'...'` opened a `string.quoted.single.yaml` scope that nested over the inner expression captures.

**Fix:** In `#template-expression-key-yaml-*-quoted`, scope the outer `'`/`"` as plain `punctuation.definition.string.*` only — drop the broad `string.quoted.*` envelope. See `5d6291a` ("Drop string scope from quoted template-expression keys so {{ }} match unquoted theming") and `c29d2a7` (related stray-quote fix).

Input: `'${{ parameters.x }}':`

**Before — `string.quoted.single.yaml` wraps everything, so the body inherits string color:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `'` | `source.yaml` → `string.quoted.single.yaml` → `punctuation.definition.string.begin` |
| 1 | `$` | … → `string.quoted.single.yaml` → `meta.template.expression` → `sigil` (still under `string.*`) |
| 2–3 | `{{` | … → `string.quoted.single.yaml` → `keyword.other.template-expression` (themed as string!) |
| 5–16 | `parameters.x` | … → `string.quoted.single.yaml` → expression body (themed as string!) |
| 18–19 | `}}` | … → `string.quoted.single.yaml` → `keyword.other.template-expression` |
| 20 | `'` | … → `punctuation.definition.string.end` (pop) |
| 21 | `:` | `source.yaml` → `punctuation.separator.key-value.mapping.yaml` |

**After — only the quotes themselves carry string scope:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `'` | `source.yaml` → `meta.template.expression.azure-pipelines` → `punctuation.definition.string.begin.yaml` |
| 1 | `$` | … → `keyword.operator.expression.sigil.azure-pipelines` (no `string.*` on stack) |
| 2–3 | `{{` | … → `keyword.other.template-expression.azure-pipelines` |
| 5–16 | `parameters.x` | … → `expression-body-yaml-single-quoted` → identifier + accessor |
| 18–19 | `}}` | … → `keyword.other.template-expression.azure-pipelines` |
| 20 | `'` | … → `punctuation.definition.string.end.yaml` (pop template-expression-key) |
| 21 | `:` | `source.yaml` → `punctuation.separator.key-value.mapping.yaml` |

**Stack timeline — Before (`string.quoted.single.yaml` envelopes the whole key):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> sq_string : opening "'"
    sq_string --> tmpl_expr : "$" (still under string.quoted.single)
    tmpl_expr --> begin_delim : "{{" (themed as string!)
    begin_delim --> expr_body : enter
    expr_body --> ident : "parameters.x" (themed as string!)
    ident --> expr_body : pop
    expr_body --> end_delim : "}}" (themed as string!)
    end_delim --> sq_string : pop tmpl_expr
    sq_string --> yaml : closing "'"
    yaml --> yaml : ":"
    yaml --> [*]
```

**Stack timeline — After (only the quote tokens carry string scope):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> tmpl_expr_key : enter meta.template.expression
    tmpl_expr_key --> open_quote : "'" as punctuation.definition.string.begin
    open_quote --> tmpl_expr_key : pop (no string.* envelope)
    tmpl_expr_key --> sigil : "$"
    sigil --> tmpl_expr_key : pop
    tmpl_expr_key --> begin_delim : "{{"
    begin_delim --> expr_body_sq : enter expression-body-yaml-single-quoted
    expr_body_sq --> ident : "parameters.x"
    ident --> expr_body_sq : pop
    expr_body_sq --> end_delim : "}}"
    end_delim --> tmpl_expr_key : pop body
    tmpl_expr_key --> close_quote : "'" as punctuation.definition.string.end
    close_quote --> yaml : pop tmpl_expr_key
    yaml --> yaml : ":"
    yaml --> [*]
```

Key difference: in the *After* stack, no row contains `string.quoted.single.yaml`. Themes that color `string.*` no longer paint the expression body.

---

### 6.6 Runtime expression `]` closed at the wrong scope

**Symptom:** The closing `]` of `$[ ... ]` did not get the same scope as the opening `[`, so themes couldn't pair them.

**Why:** The end-capture used a slightly different scope name than the begin-capture.

**Fix:** Single-line scope alignment in `e35e27c` ("Fix runtime-expression closing bracket scope"). Visually, both delimiters now share `punctuation.definition.runtime-expression.*.azure-pipelines` and pair correctly.

Input: `$[ x ]`

**Before — open and close bracket scopes don't match:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.runtime-expression` → `sigil` |
| 1 | `[` | … → `punctuation.definition.runtime-expression.begin.azure-pipelines` |
| 3 | `x` | … → `expression-body` → `identifier` |
| 5 | `]` | … → `punctuation.section.brackets.end` ← **different namespace, themes can't pair it** |

**After — symmetric begin/end scopes:**

| Pos | Text | Scope stack |
|----:|------|-------------|
| 0 | `$` | `source.yaml` → `meta.runtime-expression.azure-pipelines` → `sigil` |
| 1 | `[` | … → `punctuation.definition.runtime-expression.begin.azure-pipelines` |
| 3 | `x` | … → `expression-body` → `identifier` |
| 5 | `]` | … → `punctuation.definition.runtime-expression.end.azure-pipelines` ← **matches the `.begin.`** |

**Stack timeline — Before (open and close pop into different namespaces):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> runtime_expr : "$"
    runtime_expr --> begin_bracket : "[" → runtime-expression.begin
    begin_bracket --> expr_body : enter
    expr_body --> ident : "x"
    ident --> expr_body : pop
    expr_body --> end_bracket : "]" → punctuation.section.brackets.end (wrong)
    end_bracket --> yaml : pop (unpaired with begin scope)
    yaml --> [*]
```

**Stack timeline — After (symmetric begin/end scopes pair cleanly):**

```mermaid
stateDiagram-v2
    direction LR
    [*] --> yaml
    yaml --> runtime_expr : "$"
    runtime_expr --> begin_bracket : "[" → runtime-expression.begin
    begin_bracket --> expr_body : enter
    expr_body --> ident : "x"
    ident --> expr_body : pop
    expr_body --> end_bracket : "]" → runtime-expression.end (matches)
    end_bracket --> yaml : pop runtime_expr
    yaml --> [*]
```

---

### 6.7 Recursion: function calls and brackets re-enter `#expression-body`

Not a "bug" but a deliberate design challenge — Azure Pipelines expressions are nestable (`and(eq(x, succeeded()), startsWith(...))`). Every grouping construct must recurse back into the body grammar without infinite-loop matching empty input.

**Resolution:** `#brackets`, `#builtin-function-call`, `#job-status-function-call` each define a begin/end pair that contains `{ "include": "#expression-body" }`. The base case is a token-level child (`#identifier`, `#literal*`) that consumes at least one character, preventing infinite recursion.

```mermaid
flowchart LR
    EB["#expression-body"] --> FN["#builtin-function-call"]
    EB --> BR["#brackets"]
    EB --> JS["#job-status-function-call"]
    EB --> ID["#identifier"]
    EB --> LIT["#string-literal / #number-literal / #version-literal / #language-constant"]
    FN -.recurse.-> EB
    BR -.recurse.-> EB
    JS -.recurse.-> EB

    classDef anchor fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    classDef recurse fill:#dbeafe,stroke:#1d4ed8,color:#111;
    classDef base    fill:#dcfce7,stroke:#15803d,color:#111;
    class EB anchor;
    class FN,BR,JS recurse;
    class ID,LIT base;
```

The dashed arrows are the recursion edges; the solid arrows down to `#identifier` and the literal nodes are the terminal cases that always make progress.

## 7) Quick Notes

- Repository size (current file): 61 repository entries, 116 include edges.
- The Azure extension is layered into normal YAML scalar and pair parsing, then dispatches into expression variants.
- Single- and double-quoted expression bodies are mirrored variants of the same core expression language.

## 8) Other Visualization Options

- VS Code: open this Markdown preview to get Mermaid rendering directly.
- Graphviz export: generate DOT from the include graph for a full repository-level dependency map.
- Interactive explorer idea: add a tiny script that emits filtered subgraphs (for example, only nodes reachable from `#flow-node` or `#expressions`).
