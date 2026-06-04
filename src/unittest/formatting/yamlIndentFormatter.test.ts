import * as assert from 'assert';
import { computeHangingIndent } from '../../yamlIndentLogic';

suite('yamlIndentFormatter', () => {
    suite('computeHangingIndent', () => {
        test('aligns continuation under the key after `- `', () => {
            const result = computeHangingIndent('    - name: deployStages', '');
            assert.deepStrictEqual(result, { newIndent: '      ', currentIndentLength: 0 });
        });

        test('uses the literal column of the key, independent of tab size', () => {
            // Indent of dash is 7 spaces, so key column is 9 → newIndent has 9 spaces.
            const result = computeHangingIndent('       - script: echo hi', '');
            assert.ok(result);
            assert.strictEqual(result.newIndent.length, 9);
        });

        test('handles multiple spaces between `-` and the key', () => {
            const result = computeHangingIndent('-   name: value', '');
            assert.ok(result);
            assert.strictEqual(result.newIndent.length, 4);
        });

        test('returns undefined when the new line already has the right indent', () => {
            const result = computeHangingIndent('    - name: deployStages', '      ');
            assert.strictEqual(result, undefined);
        });

        test('returns undefined for a list item without a value', () => {
            assert.strictEqual(computeHangingIndent('- name:', ''), undefined);
            assert.strictEqual(computeHangingIndent('  - name: ', ''), undefined);
        });

        test('returns undefined for a nested sequence line', () => {
            assert.strictEqual(computeHangingIndent('  - - name: nested', ''), undefined);
        });

        test('returns undefined for a non-list line', () => {
            assert.strictEqual(computeHangingIndent('parameters:', ''), undefined);
            assert.strictEqual(computeHangingIndent('  key: value', ''), undefined);
        });
    });
});
