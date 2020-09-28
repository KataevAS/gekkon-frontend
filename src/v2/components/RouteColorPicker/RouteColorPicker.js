import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getColorStyle } from '@/v1/Constants/Route';
import { css } from '../../aphrodite';
import styles from './styles';

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
      onSelect(null);
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
