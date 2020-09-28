import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import CategorySlider from '../CategorySlider/CategorySlider';
import { getCategoryColor } from '../../Constants/Categories';
import ComboBox from '../ComboBox/ComboBox';
import { ROUTE_KINDS } from '../../Constants/Route';
import ComboBoxPerson from '../ComboBoxPerson/ComboBoxPerson';
import RouteColorPicker from '@/v2/components/RouteColorPicker/RouteColorPicker';
import DatePicker from '../DatePicker/DatePicker';
import RouteContext from '../../contexts/RouteContext';
import './RouteDataEditableTable.css';

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
      const { onRouteParamChange, spots, match } = this.props;
      const spotId = match.params.id;
      const spot = spots[spotId];
      const { markColorToCategory } = spot.data;
      onRouteParamChange(marksColor, 'marks_color');
      if (markColorToCategory && markColorToCategory[marksColor.id]) {
        onRouteParamChange(markColorToCategory[marksColor.id], 'category');
      }
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
                <div className="route-data-table">
                  <div className="route-data-table-row">
                    <div className="route-data-table-item route-data-table-item_header">
                      Сложность:
                    </div>
                    <div className="route-data-table__table-item route-data-table__table-item-right">
                      <div className="route-data-table__category-track-wrap">
                        <div
                          className="route-data-table__category-track-info"
                          role="button"
                          tabIndex={0}
                          style={{outline: 'none'}}
                          onClick={() => this.setState({showSlider: !showSlider})}
                        >
                          <div className="route-data-table__category-track">
                            {route.category}
                          </div>
                          <div
                            className="route-data-table__category-track-color"
                            style={{ backgroundColor: getCategoryColor(route.category) }}
                          />
                        </div>
                        {
                          showSlider
                            ? (
                              <CategorySlider
                                category={route.category}
                                hide={() => this.setState({showSlider: false})}
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
                  <div className="route-data-table-row">
                    <div className="route-data-table-item route-data-table-item_header">
                      Цвет зацепов:
                    </div>
                    <div className="route-data-table-item">
                      <RouteColorPicker
                        editable
                        routeMarkColors={routeMarkColors}
                        route={route}
                        fieldName="holds_color"
                        onSelect={this.onHoldsColorSelect}
                      />
                    </div>
                  </div>
                  <div className="route-data-table-row">
                    <div className="route-data-table-item route-data-table-item_header">
                      Цвет маркировки:
                    </div>
                    <div className="route-data-table-item">
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
                    sector && <div className="route-data-table-row">
                      <div className="route-data-table-item route-data-table-item_header">
                        Тип:
                      </div>
                      <div className="route-data-table-item">
                        {
                          sector.kind === 'mixed'
                            ? (
                              <div className="modal__field-select">
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
                  <div className="route-data-table-row">
                    <div className="route-data-table-item route-data-table-item_header">
                      Дата накрутки:
                    </div>
                    <div className="modal__table-item modal__table-item-right">
                      <div className="modal__field-select">
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
                  <div className="route-data-table-row">
                    <div className="route-data-table-item route-data-table-item_header">
                      Дата cкрутки:
                    </div>
                    <div className="modal__table-item modal__table-item-right">
                      <div className="modal__field-select">
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
                        <div className="route-data-table-row">
                          <div className="route-data-table-item route-data-table-item_header">
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
  spots: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  onRouteParamChange: PropTypes.func.isRequired,
  routeMarkColors: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  spots: state.spotsStore.spots,
});

export default withRouter(connect(mapStateToProps)(RouteDataEditableTable));
