import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import DatePicker from '../DatePicker/DatePicker';
import ComboBox from '../ComboBox/ComboBox';
import { PERIOD_FILTERS, RESULT_FILTERS } from '../../Constants/filters';
import { CATEGORIES, CATEGORIES_ITEMS } from '../../Constants/Categories';
import { dateToTextFormatter } from '../../Constants/Date';
import './FilterBlock.css';
import getFilters, { getMergedFilters } from '../../utils/getFilters';
import { setSelectedPage, setSelectedViewMode } from '../../actions';
import { setAllSelectedFilters } from '@/v2/redux/selectedFilters/actions';
import { avail } from '../../utils';
import Button from '@/v2/components/Button/Button';
import getCategoryId from '../../utils/getCategoryId';

class FilterBlock extends Component {
  constructor(props) {
    super(props);

    this.state = { filtersList: {} };

    this.timer = null;
    this.timeout = 1500;
  }

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  setFiltersList = (key, value) => {
    const sectorId = this.getSectorId();
    const { filtersList } = this.state;
    this.setState({
      filtersList: {
        ...filtersList,
        [sectorId]: { ...filtersList[sectorId], [key]: value },
      },
    });
  };

  changeCategoryFilter = (categoryFrom, categoryTo) => {
    clearTimeout(this.timer);
    const {
      setAllSelectedFilters: setAllSelectedFiltersProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const { filtersList } = this.state;
    this.setState({
      filtersList: {
        ...filtersList,
        [sectorId]: {
          ...filtersList[sectorId],
          categoryFrom,
          categoryTo,
        },
      },
    });
    this.timer = setTimeout(
      () => {
        if (categoryFrom !== null) {
          setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
          setSelectedPageProp(spotId, sectorId, 1);
        }
        if (categoryTo !== null) {
          setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
          setSelectedPageProp(spotId, sectorId, 1);
        }
      },
      this.timeout,
    );
  };

  changePeriodFilter = (period) => {
    clearTimeout(this.timer);
    const {
      setAllSelectedFilters: setAllSelectedFiltersProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.setFiltersList('period', period);
    this.timer = setTimeout(
      () => {
        setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
        setSelectedPageProp(spotId, sectorId, 1);
      },
      this.timeout,
    );
  };

  changeDateFilter = (date) => {
    clearTimeout(this.timer);
    const { setAllSelectedFilters: setAllSelectedFiltersProp } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.setFiltersList('date', date ? date.format() : undefined);
    this.timer = setTimeout(
      () => {
        setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
      },
      this.timeout,
    );
  };

  changeFilter = (name, value) => {
    clearTimeout(this.timer);
    const {
      setAllSelectedFilters: setAllSelectedFiltersProp,
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.setFiltersList(name, value);
    this.timer = setTimeout(
      () => {
        setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
        setSelectedPageProp(spotId, sectorId, 1);
      },
      this.timeout,
    );
  };

  onViewModeChange = (viewMode) => {
    const {
      setAllSelectedFilters: setAllSelectedFiltersProp,
      setSelectedViewMode: setSelectedViewModeProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedViewModeProp(spotId, sectorId, viewMode);
    if (viewMode === 'scheme') {
      setAllSelectedFiltersProp(spotId, sectorId, this.state.filtersList);
    }
  };

  onFilterChange = (id) => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const filters = getFilters(this.props.selectedFilters, spotId, sectorId);
    this.changeFilter(id, !filters[id]);
  };

  onCategoryChange = (id) => {
    switch (id) {
    case 0:
      this.changeCategoryFilter(CATEGORIES[0], CATEGORIES[CATEGORIES.length - 1]);
      break;
    case 1:
      this.changeCategoryFilter(CATEGORIES[0], '6a+');
      break;
    case 2:
      this.changeCategoryFilter('6a', '6b+');
      break;
    case 3:
      this.changeCategoryFilter('6b', '7a+');
      break;
    case 4:
      this.changeCategoryFilter('7a', CATEGORIES[CATEGORIES.length - 1]);
      break;
    default:
      break;
    }
  };

  render() {
    const {
      viewModeData,
      user,
      viewMode,
      history,
      match,
      selectedFilters,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const {
      categoryFrom,
      categoryTo,
      period,
      date,
      filters,
    } = getMergedFilters(selectedFilters, this.state.filtersList, spotId, sectorId);
    const defaultFilters = R.filter(
      e => !R.contains(e.id, R.concat(R.keys(RESULT_FILTERS), ['liked'])),
      filters,
    );
    const currentFilters = (
      viewMode === 'scheme'
        ? R.filter(f => f.id !== 'outdated', avail(user) ? filters : defaultFilters)
        : avail(user) ? filters : defaultFilters
    );
    return (
      <div className="content__filter">
        <div className="content__filter-item content__filter-item_category">
          <div>
            <span className="filter-block__title">Категория</span>
            <ComboBox
              tabIndex={1}
              onChange={this.onCategoryChange}
              currentId={getCategoryId(categoryFrom, categoryTo)}
              textFieldName="title"
              items={CATEGORIES_ITEMS}
            />
          </div>
        </div>
        <div className="content__filter-item content__filter-item_period">
          <div>
            {
              viewMode === 'scheme'
                ? (
                  <>
                    <span className="filter-block__title">Дата</span>
                    <DatePicker
                      date={date}
                      onSelect={this.changeDateFilter}
                      formatter={dateToTextFormatter}
                      placeholder="сегодня"
                    />
                  </>
                )
                : (
                  <>
                    <span className="filter-block__title">Период</span>
                    <ComboBox
                      tabIndex={2}
                      onChange={this.changePeriodFilter}
                      currentId={period}
                      textFieldName="text"
                      items={PERIOD_FILTERS}
                    />
                  </>
                )
            }
          </div>
        </div>
        <div className="content__filter-item content__filter-item_result">
          <div>
            <span className="filter-block__title">Фильтры</span>
            <ComboBox
              tabIndex={3}
              onChange={this.onFilterChange}
              multipleSelect
              currentValue={
                R.join(
                  ', ',
                  R.map(
                    e => R.slice(0, -2, e.text),
                    R.filter(e => e.selected, currentFilters),
                  ),
                )
              }
              textFieldName="text"
              items={currentFilters}
            />
          </div>
        </div>
        {
          avail(user) && sectorId !== 0 && <div className="content__filter-item">
            <div>
              <span className="filter-block__title">&nbsp;</span>
              <Button
                tabIndex={4}
                style="filter"
                onClick={() => { history.push(`${match.url}/routes/new`); }}
              >
                +
              </Button>
            </div>
          </div>
        }
        <ViewModeSwitcher
          viewModeData={viewModeData}
          onViewModeChange={this.onViewModeChange}
          viewMode={viewMode}
        />
      </div>
    );
  }
}

FilterBlock.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedFilters: state.selectedFilters,
  user: state.usersStore.users[state.usersStore.currentUserId],
});

const mapDispatchToProps = dispatch => ({
  setSelectedViewMode: (spotId, sectorId, viewMode) => dispatch(
    setSelectedViewMode(spotId, sectorId, viewMode),
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
  setAllSelectedFilters: (spotId, sectorId, filters) => dispatch(
    setAllSelectedFilters(spotId, sectorId, filters),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterBlock));
