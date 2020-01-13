import React from 'react';
import renderer from 'react-test-renderer';

import Display from '../../../src/components/standard/Display';

/*
 * Test strategy
 * The component has one optional attribute (the value) and no logic.
 * Confirm that the component renders correctly both with and without
 * the attribute.
 */
describe('components/standard/Display', () => {
  const testFieldId = 'test-field-id';
  const testLabel = 'Test Label';
  const testValue = 'Test Value';

  describe('#render', () => {
    test('renders with label and value', () => {
      const render = renderer.create(
        <Display
          fieldId={testFieldId}
          label={testLabel}
          value={testValue}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });

    test('renders with label but no value', () => {
      const render = renderer.create(
        <Display
          fieldId={testFieldId}
          label={testLabel}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });
  });
});
