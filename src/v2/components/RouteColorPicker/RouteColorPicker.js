import React, { Component } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { getColorStyle } from '@/v1/Constants/Route';
import { css } from '../../aphrodite';
import styles from './styles';
import { CATEGORIES } from '../../../v1/Constants/Categories';

const mapIndexed = R.addIndex(R.map);

export default class RouteColorPicker extends Component {
  constructor(props) {
    super(props);

    const { route, fieldName, routeMarkColors } = this.props;
    this.state = {
      droppedDown: false,
      selectedItem: R.findIndex(R.propEq('id', route[fieldName].id))(routeMarkColors),
    };
    this.mouseOver = false;
    this.listRef = {};
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

    scrollToCurrentSelectedItem = () => {
      const { selectedItem } = this.state;
      if (selectedItem === undefined) { return; }

      this.listRef[selectedItem].scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    onKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();

        this.setState(
          state => ({
            selectedItem: (
              state.selectedItem !== undefined
                ? R.max(0, state.selectedItem - 1)
                : 0
            ),
          }),
          this.scrollToCurrentSelectedItem,
        );
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const listLength = R.keys(this.props.routeMarkColors).length;

        this.setState(
          state => ({
            selectedItem: (
              state.selectedItem !== undefined
                ? R.min(listLength - 1, state.selectedItem + 1)
                : 0
            ),
          }),
          this.scrollToCurrentSelectedItem,
        );
      }
      if (event.key === 'Enter') {
        this.selectItem(this.props.routeMarkColors[this.state.selectedItem]);
      }
    };

    render() {
      const { route, fieldName, editable, routeMarkColors } = this.props;
      const { droppedDown, selectedItem } = this.state;
      return (
        <div
          className={css(styles.markColorPickerWrap)}
          role="button"
          onClick={() => {
            if (editable) {
              this.setState(
                { droppedDown: !droppedDown },
                () => {
                  if (this.state.droppedDown) {
                    this.scrollToCurrentSelectedItem();
                  }
                },
              );
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
          onKeyDown={this.onKeyDown}
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
                    {mapIndexed((routeMarkColor, index) => (
                      <li
                        key={routeMarkColor.id}
                        ref={(ref) => { this.listRef[index] = ref; }}
                        onClick={() => this.selectItem(routeMarkColor)}
                        className={
                          css(
                            styles.comboBoxDropdownItem,
                            styles.comboBoxDropdownItemPadding10,
                            index === selectedItem && styles.comboBoxDropdownItemSelected,
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
