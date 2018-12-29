import React from 'react';
import PropTypes from 'prop-types';

import './checkbox.scss';

export default class Checkbox extends React.Component {
  render() {
    const { isChecked, onChange, name } = this.props;
    return (
      <label htmlFor={`${name}_checkbox`} className="container-checkbox">
        {name}
        <input
          type="checkbox"
          id={`${name}_checkbox`}
          checked={isChecked}
          onChange={onChange}
        />
        <span className="checkmark" />
      </label>
    );
  }
}

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
  isChecked: false,
};
