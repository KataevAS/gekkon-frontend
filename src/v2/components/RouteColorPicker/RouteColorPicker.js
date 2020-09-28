import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
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

    render() {
      const { route, fieldName, editable, routeMarkColors } = this.props;
      const { droppedDown } = this.state;
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
                  className={css(styles.comboBoxDropdown, styles.comboBoxDropdownActive)}
                >
                  <div
                    className={css(styles.comboBoxDropdownWrapper)}
                  >
                    {R.map(routeMarkColor => (
                      <li
                        key={routeMarkColor.id}
                        onClick={() => this.selectItem(routeMarkColor)}
                        className={
                          css(
                            styles.comboBoxDropdownItem,
                            styles.comboBoxDropdownItemPadding10,
                          )
                        }
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
