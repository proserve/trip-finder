import React from 'react';
import 'isomorphic-fetch';
import { shallow } from 'enzyme';
import Home from './index';

describe('App', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Home />);
    expect(component).toMatchSnapshot();
  });
});
