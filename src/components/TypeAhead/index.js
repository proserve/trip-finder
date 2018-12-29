import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './type-ahead.scss';

export default class TypeAhead extends React.Component {
  constructor(props) {
    super(props);
    const { suggestions } = this.props;
    this.state = {
      tempVal: '',
      suggestions,
      showSuggestions: false,
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps({ suggestions }) {
    this.setState({ suggestions });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onValueChange(e) {
    const { value } = e.target;
    const { suggestions } = this.props;
    const newSuggestions = suggestions.filter(
      suggestion => suggestion.toLocaleLowerCase()
        .indexOf(value.toLowerCase()) !== -1,
    );
    this.setState({ suggestions: newSuggestions, tempVal: value, showSuggestions: true });
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showSuggestions: false });
    }
  }


  render() {
    const { placeholder, onValueChange, style } = this.props;
    const { tempVal, suggestions, showSuggestions } = this.state;
    return (
      <div
        className="type-ahead-container"
        style={style}
        ref={(ref) => { this.wrapperRef = ref; }}
      >
        <input
          onFocus={() => this.setState({ showSuggestions: true })}
          type="text"
          value={tempVal}
          placeholder={placeholder}
          onChange={this.onValueChange}
        />
        {showSuggestions > 0 && (
          <div className="suggestion-container">
            {(suggestions && suggestions.length === 0) ? (
              <div className="suggestion">No results</div>
            ) : (
              <Fragment>
                {suggestions.map(suggestion => (
                  <div
                    onClick={() => {
                      onValueChange(suggestion);
                      this.setState({ tempVal: suggestion, showSuggestions: false });
                    }}
                    role="presentation"
                    key={suggestion}
                    className="suggestion"
                  >
                    {suggestion}
                  </div>
                ))}
              </Fragment>
            )
            }
          </div>
        )}
      </div>

    );
  }
}

TypeAhead.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  style: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  placeholder: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TypeAhead.defaultProps = {
  placeholder: 'Type to see suggestions',
  style: {},
};
