import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import enzyme from 'enzyme';

import Textbox from '../../../src/components/standard/Textbox';

/*
 * Test strategy
 * The component has one optional prop (value) and one callback
 * function (onChange). The requirements are:
 *  - the component renders with or without a value
 *  - the onChange is fired when changing the value
 */
describe('components/standard/Textbox', () => {
  const testFieldId = 'test-field-id';
  const testLabel = 'Test Label';
  const testValue = 'This is the test value';
  const newTestValue = 'This is the changed test value';
  let onChangeStub;
  let testEvent;

  beforeEach(() => {
    onChangeStub = sinon.stub();
    testEvent = {
      preventDefault() {},
      target: {}
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#render', () => {
    test('renders without a value', () => {
      const render = renderer.create(
        <Textbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });

    test('renders with a value', () => {
      const render = renderer.create(
        <Textbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
          value={newTestValue}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });
  });

  describe('handles onChange', () => {
    it('passes the new value back', () => {
      const component = enzyme.shallow(
        <Textbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
          value={testValue}
        />
      );
      testEvent.target.value = newTestValue;
      component.find('input').simulate('change', testEvent);
      expect(onChangeStub.callCount).toBe(1);
      expect(onChangeStub.args[0][0]).toBe(newTestValue);
      expect(onChangeStub.args[0][1]).toBe(testFieldId);
    });
  });
});
