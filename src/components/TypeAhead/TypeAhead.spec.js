import React from 'react';
import { shallow } from 'enzyme';
import TypeAhead from './index';
import data from '../../assets/response';
import TFGraph from '../../common/TFGraph';

const cities = Object.keys(new TFGraph(data.deals).graph);

describe('TypeAhead', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<TypeAhead suggestions={cities} onValueChange={() => {}} />);
    expect(component).toMatchSnapshot();
  });
});
