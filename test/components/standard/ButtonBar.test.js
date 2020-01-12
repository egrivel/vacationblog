import React from 'react';
import renderer from 'react-test-renderer';
import sinon from 'sinon';

import ButtonBar from '../../../src/components/standard/ButtonBar';

/*
 * Test strategy
 * The component gets an array of one or more buttons. If there are
 * multiple buttons, they are separated by a space.
 */
describe('components/standard/ButtonBar', () => {
  test('renders single button', () => {
    const buttonList = [
      {
        label: 'Test Label',
        onClick: sinon.stub()
      }
    ];
    const render = renderer.create(
      <ButtonBar buttons={buttonList} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });

  test('renders multiple buttons', () => {
    const buttonList = [
      {
        label: 'Test Label 1',
        onClick: sinon.stub()
      },
      {
        label: 'Test Label 2',
        onClick: sinon.stub()
      }
    ];
    const render = renderer.create(
      <ButtonBar buttons={buttonList} />
    );
    expect(render.toJSON()).toMatchSnapshot();
  });
});
