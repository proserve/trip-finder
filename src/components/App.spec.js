import React from 'react';
import "isomorphic-fetch"
import { shallow } from 'enzyme';
import App from './App';

describe('App', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<App />);
    expect(component).toMatchSnapshot();
  });
});
