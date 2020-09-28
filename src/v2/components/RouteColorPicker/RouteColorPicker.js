import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getColorStyle } from '@/v1/Constants/Route';
import { StyleSheet, css } from '../../aphrodite';

export default class RouteColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
    };
    this.mouseOver = false;
  }

    selectItem = (routeMarkColor) => {
      const { onSelect } = this.props;
      this.setState({ droppedDown: false });
      onSelect(routeMarkColor);
    };

    onBlur = () => {
      if (!this.mouseOver) {
        this.setState({ droppedDown: false });
      }
    };

    removeColor = () => {
      const { onSelect } = this.props;
      onSelect('');
    };

    render() {
      const {
        route, fieldName, editable, routeMarkColors,
      } = this.props;
      const { droppedDown } = this.state;
      const droppedDownClasses = classNames({
        'combo-box__dropdown': true,
        'modal__combo-box-drowdown': true,
        'combo-box__dropdown_active': true,
      });
      const itemClasses = classNames({
        'combo-box__dropdown-item': true,
        'combo-box__dropdown-item_padding-10': true,
      });
      return (
        <div
          className={css(styles.markColorPickerWrap)}
          role="button"
          onClick={() => {
            if (editable) {
              this.setState({ droppedDown: !droppedDown });
            }
          }}
          onBlur={this.onBlur}
          tabIndex={1}
          onMouseLeave={() => {
            this.mouseOver = false;
          }}
          onMouseOver={() => {
            this.mouseOver = true;
          }}
        >
          <div className={css(styles.markColorPickerInfo)}>
            <div
              className={css(styles.markColorPickerColor)}
              style={getColorStyle(route[fieldName])}
            />
          </div>
          <div className={css(styles.markColorPickerName)}>
            {
              route[fieldName]
                ? route[fieldName].name
                : 'не задан'
            }
          </div>
          {
            droppedDown
              ? (
                <div
                  className={droppedDownClasses}
                >
                  <div
                    className="combo-box__dropdown-wrapper"
                  >
                    {R.map(routeMarkColor => (
                      <li
                        key={routeMarkColor.id}
                        onClick={() => this.selectItem(routeMarkColor)}
                        className={itemClasses}
                      >
                        <div className={css(styles.markColorPickerItem)}>
                          <div
                            className={css(styles.markColorPickerColor)}
                            style={getColorStyle(routeMarkColor)}
                          />
                          <div className={css(styles.markColorPickerItemText)}>
                            {routeMarkColor.name}
                          </div>
                        </div>
                      </li>
                    ), routeMarkColors)}
                  </div>

                  <button
                    type="button"
                    onClick={this.removeColor}
                    // style={{ outline: 'none' }}
                    className={css(styles.markColorPickerButton)}
                  >
                    Сбросить цвет
                  </button>
                </div>
              )
              : ''
          }
        </div>
      );
    }
}

const styles = StyleSheet.create({
  markColorPickerName: {
    display: 'inline-block',
    verticalAlign: 'middle',
    paddingLeft: '20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  markColorPickerWrap: {
    display: 'inline-flex',
    position: 'relative',
    outline: 'none',
  },
  markColorPickerInfo: {
    cursor: 'pointer',
  },
  markColorPickerColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  markColorPickerItem: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  markColorPickerItemText: {
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    paddingLeft: '20px',
  },
  markColorPickerButton: {
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color .3s ease-out, color .3s ease-out',
    position: 'relative',
    outline: 'none',
    ':after': {
      position: 'absolute',
      content: '\'\'',
      left: 0,
      right: 0,
      top: 0,
      height: '1px',
      backgroundColor: '#F1F2F6',
    },
    ':hover': {
      backgroundColor: '#F3F3F3',
      color: '#6F6F6F',
    },
  },
});

RouteColorPicker.propTypes = {
  onSelect: PropTypes.func,
  routeMarkColors: PropTypes.array,
  route: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  fieldName: PropTypes.string.isRequired,
};

RouteColorPicker.defaultProps = {
  onSelect: null,
  routeMarkColors: null,
};
