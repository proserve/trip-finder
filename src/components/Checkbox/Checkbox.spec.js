import React from 'react';
import { shallow } from 'enzyme';
import Checkbox from './index';

describe('Checkbox', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Checkbox name="test" onChange={() => { console.log('test'); }} />);
    expect(component).toMatchSnapshot();
  });
});
