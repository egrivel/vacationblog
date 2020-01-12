import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import enzyme from 'enzyme';

import Checkbox from '../../../src/components/standard/Checkbox';

/*
 * Test strategy
 * The component has one optional prop (selected) and one callback
 * function (onChange). The requirements are:
 *  - the component renders differently when selected or when not selected
 *  - the onChange is fired when clicking on either the underlying
 *    input or on the rendered label
 */
describe('components/standard/Checkbox', () => {
  const testFieldId = 'test-field-id';
  const testLabel = 'Test Label';
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
    test('renders unchecked', () => {
      const render = renderer.create(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });

    test('renders checked', () => {
      const render = renderer.create(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
          selected
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });
  });

  describe('handles onChange', () => {
    it('unselected, click input', () => {
      const component = enzyme.shallow(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
        />
      );
      // when the checkbox is unchecked, the event sets it to checked
      testEvent.target.checked = true;
      component.find('input').simulate('change', testEvent);
      expect(onChangeStub.callCount).toBe(1);
      // Expect that the new selection value is true
      expect(onChangeStub.args[0][0]).toBe(true);
    });

    it('unselected, click label', () => {
      const component = enzyme.shallow(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
        />
      );
      component.find('label').simulate('click', testEvent);
      expect(onChangeStub.callCount).toBe(1);
      // Expect that the new selection value is true
      expect(onChangeStub.args[0][0]).toBe(true);
    });

    it('selected, click input', () => {
      const component = enzyme.shallow(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
          selected
        />
      );
      // when the checkbox is checked, the event sets it to unchecked
      testEvent.target.checked = false;
      component.find('input').simulate('change', testEvent);
      expect(onChangeStub.callCount).toBe(1);
      // Expect that the new selection value is false
      expect(onChangeStub.args[0][0]).toBe(false);
    });

    it('selected, click label', () => {
      const component = enzyme.shallow(
        <Checkbox
          fieldId={testFieldId}
          label={testLabel}
          onChange={onChangeStub}
          selected
        />
      );
      component.find('label').simulate('click', testEvent);
      expect(onChangeStub.callCount).toBe(1);
      // Expect that the new selection value is false
      expect(onChangeStub.args[0][0]).toBe(false);
    });
  });
});
