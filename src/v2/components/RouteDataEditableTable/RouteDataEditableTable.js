import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CategorySlider from '@/v1/components/CategorySlider/CategorySlider';
import { getCategoryColor } from '@/v1/Constants/Categories';
import ComboBox from '@/v1/components/ComboBox/ComboBox';
import { ROUTE_KINDS } from '@/v1/Constants/Route';
import ComboBoxPerson from '@/v1/components/ComboBoxPerson/ComboBoxPerson';
import RouteColorPicker from '@/v1/components/RouteColorPicker/RouteColorPicker';
import DatePicker from '@/v1/components/DatePicker/DatePicker';
import RouteContext from '@/v1/contexts/RouteContext';
import { css } from '@/v2/aphrodite';
import styles from './styles';

class RouteDataEditableTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSlider: false,
    };
  }

    onHoldsColorSelect = (holdsColor) => {
      const { onRouteParamChange } = this.props;
      onRouteParamChange(holdsColor, 'holds_color');
    };

    onMarksColorSelect = (marksColor) => {
      const { onRouteParamChange } = this.props;
      onRouteParamChange(marksColor, 'marks_color');
    };

    render() {
      const {
        onRouteParamChange, routeMarkColors, sectors, users,
      } = this.props;
      const { showSlider } = this.state;
      return (
        <RouteContext.Consumer>
          {
            ({ route }) => {
              const sector = sectors[route.sector_id];
              let kindId;
              if (route && route.kind) {
                kindId = R.find(R.propEq('title', route.kind), ROUTE_KINDS).id;
              }
              return (
                <div>
                  <div className={css(styles.routeDataTableRow)}>
                    <div
                      className={
                        css(
                          styles.routeDataTableItem,
                          styles.routeDataTableItemHeader,
                        )
                      }
                    >
                      Сложность:
                    </div>
                    <div className={css(styles.routeDataTableTableItemRight)}>
                      <div className={css(styles.routeDataTableCategoryTrackWrap)}>
                        <div
                          className={css(styles.routeDataTableCategoryTrackInfo)}
                          role="button"
                          tabIndex={0}
                          style={{ outline: 'none' }}
                          onClick={() => this.setState({ showSlider: !showSlider })}
                        >
                          <div className={css(styles.routeDataTableCategoryTrack)}>
                            {route.category}
                          </div>
                          <div
                            className={css(styles.routeDataTableCategoryTrackColor)}
                            style={{ backgroundColor: getCategoryColor(route.category) }}
                          />
                        </div>
                        {
                          showSlider
                            ? (
                              <CategorySlider
                                category={route.category}
                                hide={() => this.setState({ showSlider: false })}
                                changeCategory={
                                  category => onRouteParamChange(category, 'category')
                                }
                              />
                            )
                            : ''
                        }
                      </div>
                    </div>
                  </div>
                  <div className={css(styles.routeDataTableRow)}>
                    <div
                      className={
                        css(
                          styles.routeDataTableItem,
                          styles.routeDataTableItemHeader,
                        )
                      }
                    >
                      Цвет зацепов:
                    </div>
                    <div className={css(styles.routeDataTableItem)}>
                      <RouteColorPicker
                        editable
                        routeMarkColors={routeMarkColors}
                        route={route}
                        fieldName="holds_color"
                        onSelect={this.onHoldsColorSelect}
                      />
                    </div>
                  </div>
                  <div className={css(styles.routeDataTableRow)}>
                    <div
                      className={
                        css(
                          styles.routeDataTableItem,
                          styles.routeDataTableItemHeader,
                        )
                      }
                    >
                      Цвет маркировки:
                    </div>
                    <div className={css(styles.routeDataTableItem)}>
                      <RouteColorPicker
                        editable
                        routeMarkColors={routeMarkColors}
                        route={route}
                        fieldName="marks_color"
                        onSelect={this.onMarksColorSelect}
                      />
                    </div>
                  </div>
                  {
                    sector && <div className={css(styles.routeDataTableRow)}>
                      <div
                        className={
                          css(
                            styles.routeDataTableItem,
                            styles.routeDataTableItemHeader,
                          )
                        }
                      >
                        Тип:
                      </div>
                      <div className={css(styles.routeDataTableItem)}>
                        {
                          sector.kind === 'mixed'
                            ? (
                              <div>
                                <ComboBox
                                  onChange={
                                    id => onRouteParamChange(
                                      R.find(R.propEq('id', id), ROUTE_KINDS).title,
                                      'kind',
                                    )
                                  }
                                  size="small"
                                  style="transparent"
                                  currentId={route.kind ? kindId : 0}
                                  textFieldName="text"
                                  items={ROUTE_KINDS}
                                />
                              </div>
                            )
                            : (
                              <React.Fragment>
                                {R.find(R.propEq('title', route.kind), ROUTE_KINDS).text}
                              </React.Fragment>
                            )
                        }
                      </div>
                    </div>
                  }
                  <div className={css(styles.routeDataTableRow)}>
                    <div
                      className={
                        css(
                          styles.routeDataTableItem,
                          styles.routeDataTableItemHeader,
                        )
                      }
                    >
                      Дата накрутки:
                    </div>
                    <div className={css(styles.modalTableItem, styles.modalTableItemRight)}>
                      <div>
                        <DatePicker
                          date={route.installed_at}
                          size="small"
                          borderStyle="transparent"
                          onSelect={
                            date => onRouteParamChange(date ? date.format() : null, 'installed_at')
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className={css(styles.routeDataTableRow)}>
                    <div
                      className={
                        css(
                          styles.routeDataTableItem,
                          styles.routeDataTableItemHeader,
                        )
                      }
                    >
                      Дата cкрутки:
                    </div>
                    <div className={css(styles.modalTableItem, styles.modalTableItemRight)}>
                      <div>
                        <DatePicker
                          date={route.installed_until}
                          size="small"
                          borderStyle="transparent"
                          onSelect={
                            date => onRouteParamChange(date ? date.format() : null, 'installed_until')
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {
                    (!route.data.personal)
                      ? (
                        <div className={css(styles.routeDataTableRow)}>
                          <div
                            className={
                              css(
                                styles.routeDataTableItem,
                                styles.routeDataTableItemHeader,
                              )
                            }
                          >
                            Накрутчик:
                          </div>
                          <ComboBoxPerson
                            selectedUser={route.author}
                            users={users}
                            onSelect={author => onRouteParamChange(author, 'author')}
                          />
                        </div>
                      )
                      : ''
                  }
                </div>
              );
            }
          }
        </RouteContext.Consumer>
      );
    }
}

RouteDataEditableTable.propTypes = {
  sectors: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  onRouteParamChange: PropTypes.func.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(RouteDataEditableTable));
