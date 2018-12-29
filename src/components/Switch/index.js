import React from 'react';
import PropTypes from 'prop-types';
import './switch.scss';

export default class Switch extends React.Component {
  render() {
    const { choices, value: val, onValueChange } = this.props;
    return (
      <div className="switch-container">
        {choices.map(({ value, label }) => (
          <div
            onClick={() => onValueChange(value)}
            role="presentation"
            className={`choice ${value === val ? 'active' : ''}`}
            key={value}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }
}

Switch.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
  value: PropTypes.string.isRequired,
};
