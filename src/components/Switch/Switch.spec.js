import React from 'react';
import { shallow } from 'enzyme';
import Switch from './index';
import { weightProps } from '../../common/TFGraph';

const choices = [
  { label: 'Cheapest', value: weightProps.MONEY },
  { label: 'Fastest', value: weightProps.TIME },
];

describe('Switch', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Switch choices={choices} />);
    expect(component).toMatchSnapshot();
  });
});
