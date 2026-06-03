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
flowchart TD
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

```mermaid
flowchart LR
    P["patterns[] root"]

    subgraph DOC["Document structure"]
        C["#comment"]
        PR["#property"]
        D["#directive"]
        B["--- document begin"]
        E["... document end"]
    end

    subgraph NODES["#node dispatch"]
        N["#node"]
        subgraph BLOCK["Block style"]
            BN["#block-node"]
            BP["#block-pair"]
            BS["#block-scalar"]
        end
        subgraph FLOW["Flow style"]
            FN["#flow-node"]
            FP["#flow-pair"]
            subgraph FSCALAR["#flow-scalar variants"]
                FS["#flow-scalar"]
                FSDQ["#flow-scalar-double-quoted"]
                FSSQ["#flow-scalar-single-quoted"]
                FSPI["#flow-scalar-plain-in"]
                FSPO["#flow-scalar-plain-out"]
            end
        end
    end

    subgraph AZP["Azure Pipelines expressions (fork-added)"]
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

Concrete YAML snippets and which grammar nodes match each part.

### 5.1 Template expression in a plain scalar

```yaml
value: ${{ parameters.image }}
```

```mermaid
flowchart LR
    subgraph SC["#flow-scalar-plain-out (the value)"]
        S1["$"]:::sigil
        S2["{{"]:::brace
        subgraph BODY["#expression-body"]
            ID1["parameters"]:::ident
            DOT["."]:::punc
            ID2["image"]:::ident
        end
        S3["}}"]:::brace
    end

    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef ident fill:#dcfce7,stroke:#15803d,color:#111;
    classDef punc fill:#e5e7eb,stroke:#374151,color:#111;
    style BODY fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
    style SC fill:#f5f5f4,stroke:#78716c,color:#111;
```

Mapping: `${{ ... }}` is matched by `#template-expression`; the inside dispatches to `#expression-body`, which here picks `#identifier` + `#punctuation`.

### 5.2 Runtime expression with a function call

```yaml
condition: $[ and(succeeded(), eq(variables.flag, 'yes')) ]
```

```mermaid
flowchart LR
    subgraph RE["#runtime-expression"]
        SIG["$"]:::sigil
        OB["["]:::brace
        subgraph EB["#expression-body"]
            subgraph F1["#builtin-function-call: and()"]
                subgraph F2["#builtin-function-call: succeeded()"]
                end
                subgraph F3["#builtin-function-call: eq()"]
                    V["variables.flag"]:::ident
                    STR["'yes'"]:::str
                end
            end
        end
        CB["]"]:::brace
    end

    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef ident fill:#dcfce7,stroke:#15803d,color:#111;
    classDef str  fill:#fce7f3,stroke:#be185d,color:#111;
    style RE fill:#f5f5f4,stroke:#78716c,color:#111;
    style EB fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
    style F1 fill:#eef2ff,stroke:#6366f1,color:#111;
    style F2 fill:#ecfdf5,stroke:#10b981,color:#111;
    style F3 fill:#ecfdf5,stroke:#10b981,color:#111;
```

Mapping: `$[ ... ]` → `#runtime-expression` → recursive `#expression-body` → nested `#builtin-function-call` → `#brackets` and `#string-literal`.

### 5.3 Macro inside a double-quoted scalar

```yaml
script: "echo Hello $(Build.BuildId) from $(Agent.Name)"
```

```mermaid
flowchart LR
    subgraph DQ["#flow-scalar-double-quoted"]
        T1["echo Hello "]:::text
        subgraph MC1["#macro"]
            M1S["$"]:::sigil
            M1O["("]:::brace
            M1B["Build.BuildId"]:::ident
            M1C[")"]:::brace
        end
        T2[" from "]:::text
        subgraph MC2["#macro"]
            M2S["$"]:::sigil
            M2O["("]:::brace
            M2B["Agent.Name"]:::ident
            M2C[")"]:::brace
        end
    end

    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef ident fill:#dcfce7,stroke:#15803d,color:#111;
    classDef text  fill:#f5f5f4,stroke:#a8a29e,color:#111;
    style DQ fill:#fff1f2,stroke:#ef4444,color:#111;
    style MC1 fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
    style MC2 fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
```

Mapping: double-quoted scalar enters `#expressions-yaml-double-quoted`; each `$( ... )` is matched by `#macro` regardless of quoting context.

### 5.4 Template expression used as a mapping key

```yaml
${{ if eq(parameters.os, 'linux') }}:
  image: ubuntu-latest
```

```mermaid
flowchart LR
    subgraph PAIR["#block-pair"]
        subgraph KEY["#template-expression-key"]
            K1["$"]:::sigil
            K2["{{"]:::brace
            subgraph KBODY["#expression-body"]
                DIR["if"]:::dir
                FN1["eq(...)"]:::fn
            end
            K3["}}"]:::brace
            COL[":"]:::punc
        end
        VAL["image: ubuntu-latest (mapped value)"]:::val
    end

    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef dir   fill:#fae8ff,stroke:#a21caf,color:#111;
    classDef fn    fill:#ecfdf5,stroke:#10b981,color:#111;
    classDef punc  fill:#e5e7eb,stroke:#374151,color:#111;
    classDef val   fill:#f5f5f4,stroke:#a8a29e,color:#111;
    style PAIR fill:#ffffff,stroke:#0ea5e9,color:#111;
    style KEY  fill:#fef9c3,stroke:#d97706,color:#111;
    style KBODY fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
```

Mapping: when a `${{ }}` form sits on the left of `:`, it is matched by `#template-expression-key` (not `#template-expression`) and the inside uses `#directive-keyword` + `#builtin-function-call`.

## 6) Tricky Challenges & How We Resolved Them

Each subsection summarizes a real problem from this fork's history, the symptom in the editor, why it happened, the fix, and a before/after parse view.

---

### 6.1 Macro embedded in a plain scalar collapsed the rest of the line

**Symptom:** `$(Build.BuildId)` inside an unquoted scalar like `name: build-$(Build.BuildId)-final` was swallowed by the plain-scalar regex, so the macro and trailing text rendered as one undifferentiated string.

**Why:** YAML's `flow-scalar-plain-*` pattern is greedy — once it starts matching, it owns the line until end-of-scalar. Macro highlighting never got a chance to fire.

**Fix:** End the plain scalar at expression sigils (`$`) and re-enter via `#expressions`. See commit `1c8b19c` ("End plain scalar before expression sigils so embedded macros render uniformly").

```mermaid
flowchart LR
    subgraph BEFORE["Before"]
        direction LR
        B1["name:"]:::key
        subgraph BSCALAR["#flow-scalar-plain-out (greedy)"]
            B2["build-$(Build.BuildId)-final"]:::flat
        end
    end

    subgraph AFTER["After"]
        direction LR
        A1["name:"]:::key
        subgraph ASCALAR["#flow-scalar-plain-out (stops at $)"]
            A2["build-"]:::text
        end
        subgraph MAC["#macro"]
            M1["$"]:::sigil
            M2["("]:::brace
            M3["Build.BuildId"]:::ident
            M4[")"]:::brace
        end
        A3["-final"]:::text
    end

    classDef key   fill:#e0f2fe,stroke:#0369a1,color:#111;
    classDef flat  fill:#fecaca,stroke:#b91c1c,color:#111;
    classDef text  fill:#f5f5f4,stroke:#a8a29e,color:#111;
    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef ident fill:#dcfce7,stroke:#15803d,color:#111;
    style BEFORE fill:#fef2f2,stroke:#ef4444,color:#111;
    style AFTER  fill:#ecfdf5,stroke:#10b981,color:#111;
    style BSCALAR fill:#fff1f2,stroke:#b91c1c,color:#111;
    style ASCALAR fill:#f8fafc,stroke:#475569,color:#111;
    style MAC fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
```

---

### 6.2 Template-expression as mapping key wasn't matched

**Symptom:** `${{ if eq(...) }}:` keys were not highlighted as expressions; they were treated as a quoted-looking plain string.

**Why:** `#template-expression` only matches inside scalar *values*. Mapping keys are parsed by `#block-pair` / `#flow-pair` before scalar dispatch, so the expression never reached `#expressions`.

**Fix:** Introduce dedicated `#template-expression-key` variants (plain, single-quoted, double-quoted) and include them at the start of `#block-pair` and `#flow-pair`. See `591b18a` ("Highlight bare expressions in condition: and template expressions used as mapping keys").

```mermaid
flowchart LR
    subgraph BEFORE2["Before"]
        direction LR
        BP1["#block-pair"] --> BK1["unknown key string"]:::flat
        BK1 --> BCOL1[":"]:::punc
        BCOL1 --> BV1["value"]:::text
    end

    subgraph AFTER2["After"]
        direction LR
        AP1["#block-pair"] --> AK1["#template-expression-key"]:::new
        AK1 --> ABODY1["#expression-body"]:::body
        AP1 --> ACOL1[":"]:::punc
        ACOL1 --> AV1["value"]:::text
    end

    classDef flat fill:#fecaca,stroke:#b91c1c,color:#111;
    classDef text fill:#f5f5f4,stroke:#a8a29e,color:#111;
    classDef punc fill:#e5e7eb,stroke:#374151,color:#111;
    classDef new  fill:#fff3b0,stroke:#d97706,stroke-width:2px,color:#111;
    classDef body fill:#fff7ed,stroke:#d97706,color:#111;
    style BEFORE2 fill:#fef2f2,stroke:#ef4444,color:#111;
    style AFTER2  fill:#ecfdf5,stroke:#10b981,color:#111;
```

---

### 6.3 String literals inside expressions inside quoted scalars

**Symptom:** `"${{ eq(parameters.os, 'linux') }}"` rendered `'linux'` as raw text, breaking the visual cue that it was a string argument.

**Why:** Inside a YAML double-quoted scalar, an embedded expression body re-tokenized with the *outer* string scope still active. The inner `'linux'` ran into single-quote parsing conflicts.

**Fix:** Mirror `#expression-body` into `-yaml-single-quoted` and `-yaml-double-quoted` variants with quote-aware `#string-literal-*` children. See `3da5b3c`.

```mermaid
flowchart TD
    subgraph OUTER["#flow-scalar-double-quoted"]
        direction LR
        OQ1["\""]:::brace
        subgraph TE["#template-expression-yaml-double-quoted"]
            TS["$"]:::sigil
            TB1["{{"]:::brace
            subgraph EB["#expression-body-yaml-double-quoted"]
                FN["eq(parameters.os, ...)"]:::fn
                subgraph SL["#string-literal-yaml-double-quoted"]
                    Q1["'"]:::brace
                    SV["linux"]:::str
                    Q2["'"]:::brace
                end
            end
            TB2["}}"]:::brace
        end
        OQ2["\""]:::brace
    end

    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef fn    fill:#ecfdf5,stroke:#10b981,color:#111;
    classDef str   fill:#fce7f3,stroke:#be185d,color:#111;
    style OUTER fill:#fff1f2,stroke:#ef4444,color:#111;
    style TE    fill:#fef9c3,stroke:#d97706,color:#111;
    style EB    fill:#fff7ed,stroke:#d97706,stroke-dasharray: 3 2,color:#111;
    style SL    fill:#fdf2f8,stroke:#be185d,color:#111;
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

```mermaid
flowchart LR
    subgraph BEFORE4["Before — three scope problems"]
        direction LR
        B1["$"]:::shared
        B2["{{"]:::shared
        B3["...body..."]:::body
        B4["}}"]:::shared
    end

    subgraph AFTER4["After — separated scopes"]
        direction LR
        A1["$<br/><sub>keyword.operator.expression.sigil</sub>"]:::sigil
        A2["{{<br/><sub>keyword.other.template-expression</sub>"]:::tmpl
        A3["...body..."]:::body
        A4["}}<br/><sub>keyword.other.template-expression</sub>"]:::tmpl
    end

    classDef shared fill:#fecaca,stroke:#b91c1c,color:#111;
    classDef sigil  fill:#fde68a,stroke:#b45309,color:#111;
    classDef tmpl   fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef body   fill:#fff7ed,stroke:#d97706,color:#111;
    style BEFORE4 fill:#fef2f2,stroke:#ef4444,color:#111;
    style AFTER4  fill:#ecfdf5,stroke:#10b981,color:#111;
```

---

### 6.5 Quoted template key dragged "string" theming inside

**Symptom:** `'${{ parameters.x }}'` keys took on the string theme color, so `{{ }}` looked like part of a string literal instead of an expression boundary.

**Why:** The outer `'...'` opened a `string.quoted.single.yaml` scope that nested over the inner expression captures.

**Fix:** In `#template-expression-key-yaml-*-quoted`, scope the outer `'`/`"` as plain `punctuation.definition.string.*` only — drop the broad `string.quoted.*` envelope. See `5d6291a` ("Drop string scope from quoted template-expression keys so {{ }} match unquoted theming") and `c29d2a7` (related stray-quote fix).

```mermaid
flowchart LR
    subgraph BEFORE5["Before"]
        direction LR
        subgraph BSTR["string.quoted.single.yaml (covers everything)"]
            BQ1["'"]:::brace
            BIN["${{ parameters.x }}"]:::flat
            BQ2["'"]:::brace
            BCOL[":"]:::punc
        end
    end

    subgraph AFTER5["After"]
        direction LR
        AQ1["'<br/><sub>punctuation.definition.string.begin.yaml</sub>"]:::brace
        subgraph AKEY["#template-expression-key-yaml-single-quoted"]
            AS["$"]:::sigil
            AOB["{{"]:::tmpl
            ABODY["#expression-body-yaml-single-quoted"]:::body
            ACB["}}"]:::tmpl
        end
        AQ2["'<br/><sub>punctuation.definition.string.end.yaml</sub>"]:::brace
        ACOL[":"]:::punc
    end

    classDef flat  fill:#fecaca,stroke:#b91c1c,color:#111;
    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef sigil fill:#fde68a,stroke:#b45309,color:#111;
    classDef tmpl  fill:#fef9c3,stroke:#d97706,color:#111;
    classDef body  fill:#fff7ed,stroke:#d97706,color:#111;
    classDef punc  fill:#e5e7eb,stroke:#374151,color:#111;
    style BEFORE5 fill:#fef2f2,stroke:#ef4444,color:#111;
    style AFTER5  fill:#ecfdf5,stroke:#10b981,color:#111;
    style BSTR    fill:#fff1f2,stroke:#b91c1c,color:#111;
    style AKEY    fill:#fef9c3,stroke:#d97706,color:#111;
```

---

### 6.6 Runtime expression `]` closed at the wrong scope

**Symptom:** The closing `]` of `$[ ... ]` did not get the same scope as the opening `[`, so themes couldn't pair them.

**Why:** The end-capture used a slightly different scope name than the begin-capture.

**Fix:** Single-line scope alignment in `e35e27c` ("Fix runtime-expression closing bracket scope"). Visually, both delimiters now share `punctuation.definition.runtime-expression.*.azure-pipelines` and pair correctly.

```mermaid
flowchart LR
    subgraph BEFORE6["Before"]
        BS["$["]:::brace
        BB["body"]:::body
        BE["]<br/><sub>wrong scope</sub>"]:::flat
    end
    subgraph AFTER6["After"]
        AS["$["]:::brace
        AB["body"]:::body
        AE["]<br/><sub>punctuation.definition.runtime-expression.end</sub>"]:::brace
    end

    classDef brace fill:#bae6fd,stroke:#0369a1,color:#111;
    classDef body  fill:#fff7ed,stroke:#d97706,color:#111;
    classDef flat  fill:#fecaca,stroke:#b91c1c,color:#111;
    style BEFORE6 fill:#fef2f2,stroke:#ef4444,color:#111;
    style AFTER6  fill:#ecfdf5,stroke:#10b981,color:#111;
```

---

### 6.7 Recursion: function calls and brackets re-enter `#expression-body`

Not a "bug" but a deliberate design challenge — Azure Pipelines expressions are nestable (`and(eq(x, succeeded()), startsWith(...))`). Every grouping construct must recurse back into the body grammar without infinite-loop matching empty input.

**Resolution:** `#brackets`, `#builtin-function-call`, `#job-status-function-call` each define a begin/end pair that contains `{ "include": "#expression-body" }`. The base case is a token-level child (`#identifier`, `#literal*`) that consumes at least one character, preventing infinite recursion.

```mermaid
flowchart TD
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
