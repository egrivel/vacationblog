import React from 'react';
import renderer from 'react-test-renderer';

import Formrow from '../../../src/components/standard/Formrow';

/*
 * Test strategy
 * The component has three optional attributes.
 * Confirm that the component renders correctly both with and without
 * the attributes.
 */
describe('components/standard/Formrow', () => {
  const testLabel = 'Test Label';
  const testLabelFor = 'test-label-for';
  const testContent = <span>This is some <em>test</em> content.</span>;

  describe('#render', () => {
    test('renders with label and value', () => {
      const render = renderer.create(
        <Formrow
          label={testLabel}
          labelFor={testLabelFor}
        >
          {testContent}
        </Formrow>
      );
      expect(render.toJSON()).toMatchSnapshot();
    });

    test('renders with label but no value', () => {
      const render = renderer.create(
        <Formrow />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });
  });
});
