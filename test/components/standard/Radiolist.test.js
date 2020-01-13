import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import enzyme from 'enzyme';

import Radiolist from '../../../src/components/standard/Radiolist';

/*
 * Test strategy
 * The component has one optional prop (value) and one callback
 * function (onChange). The requirements are:
 *  - the component renders with or without a value
 *  - the onChange is fired when changing the selected item, either by
 *    clicking on the button or on the label
 */
describe('components/standard/Radiolist', () => {
  const testFieldId = 'test-field-id';
  const testLabel = 'Test Label';
  const testItemLabel1 = 'Test Item Label 1';
  const testItemValue1 = 'test-item-value-1';
  const testItemLabel2 = 'Test Item Label 2';
  const testItemValue2 = 'test-item-value-2';
  const testItemLabel3 = 'Test Item Label 3';
  const testItemValue3 = 'test-item-value-3';
  let onChangeStub;
  let testEvent;
  let testList;

  beforeEach(() => {
    onChangeStub = sinon.stub();
    testEvent = {
      preventDefault() {},
      target: {}
    };
    testList = [
      {
        label: testItemLabel1,
        value: testItemValue1
      }, {
        label: testItemLabel2,
        value: testItemValue2
      }, {
        label: testItemLabel3,
        value: testItemValue3
      }
    ];
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#render', () => {
    test('renders without a value', () => {
      const render = renderer.create(
        <Radiolist
          fieldId={testFieldId}
          label={testLabel}
          list={testList}
          onChange={onChangeStub}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });

    test('renders checked', () => {
      const render = renderer.create(
        <Radiolist
          fieldId={testFieldId}
          label={testLabel}
          list={testList}
          onChange={onChangeStub}
          value={testItemValue2}
        />
      );
      expect(render.toJSON()).toMatchSnapshot();
    });
  });

  describe('handles onChange', () => {
    it('clicking on the input passes the selected value back', () => {
      const component = enzyme.shallow(
        <Radiolist
          fieldId={testFieldId}
          label={testLabel}
          list={testList}
          onChange={onChangeStub}
        />
      );
      testEvent.target.value = testItemValue1;
      const inputList = component.find('input');
      for (let i = 0; i < inputList.length; i++) {
        if (inputList.at(i).props().value === testItemValue1) {
          inputList.at(i).simulate('click', testEvent);
        }
      }
      expect(onChangeStub.callCount).toBe(1);
      expect(onChangeStub.args[0][0]).toBe(testItemValue1);
      expect(onChangeStub.args[0][1]).toBe(testFieldId);
    });

    it('clicking on the label passes the selected value back', () => {
      const component = enzyme.shallow(
        <Radiolist
          fieldId={testFieldId}
          label={testLabel}
          list={testList}
          onChange={onChangeStub}
        />
      );
      testEvent.target.value = testItemValue1;
      // Find the input, then click on the corresponding label
      const inputList = component.find('input');
      const labelList = component.find('label');
      for (let i = 0; i < inputList.length; i++) {
        if (inputList.at(i).props().value === testItemValue1) {
          labelList.at(i).simulate('click', testEvent);
        }
      }
      expect(onChangeStub.callCount).toBe(1);
      expect(onChangeStub.args[0][0]).toBe(testItemValue1);
      expect(onChangeStub.args[0][1]).toBe(testFieldId);
    });
  });
});
