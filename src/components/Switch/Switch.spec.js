import React from 'react';
import { shallow } from 'enzyme';
import Switch from './index';
import TFGraph from '../../common/TFGraph';

const choices = [
  { label: 'Cheapest', value: TFGraph.weightProps.MONEY },
  { label: 'Fastest', value: TFGraph.weightProps.TIME },
];

describe('Switch', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Switch choices={choices} />);
    expect(component).toMatchSnapshot();
  });
});
