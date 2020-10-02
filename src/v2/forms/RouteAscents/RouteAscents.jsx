import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import RouteAscentsLayout from './RouteAscentsLayout';
import {
  updateAscent as updateAscentAction,
  addAscent as addAscentAction,
  removeAscent as removeAscentAction,
} from '@/v2/redux/routes/actions';
import reloadRoutesAction from '@/v2/utils/reloadRoutes';
import RouteAscentsTableContext from './contexts/RouteAscentsTableContext';
import isHtmlElChild from '@/v2/utils/isHtmlElChild';
import getViewMode from '@/v1/utils/getViewMode';
import getFilters from '../../../v1/utils/getFilters';

const SAVE_REQUEST_DELAY = 3000;

class RouteAscents extends Component {
  constructor(props) {
    super(props);

    const ascent = this.getAscent();

    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const { sectors, selectedViewModes, selectedFilters, routes } = this.props;
    const route = routes[this.getRouteId()];
    const viewMode = getViewMode(
      sectors,
      selectedViewModes,
      spotId,
      sectorId,
    );
    let date;
    if (viewMode === 'scheme') {
      const filters = getFilters(selectedFilters, spotId, sectorId);
      date = filters.date && moment(filters.date).format('YYYY-MM-DD');
    } else if (route.installed_until && moment(route.installed_until) < moment()) {
      date = route.installed_until && moment(route.installed_until).format('YYYY-MM-DD');
    }

    this.state = {
      details: ascent,
      ascent,
      mergeLastRow: true,
      newRowDate: date,
    };
    this.timerId = null;
    this.lastTableRowRef = null;
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.save(true);
    }
  }

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  save = (removeIfEmpty) => {
    const { removeAscent, updateAscent, reloadRoutes } = this.props;
    const { ascent } = this.state;
    const { id } = this.getAscent();
    if (ascent.history === null && removeIfEmpty) {
      removeAscent(
        id,
        () => reloadRoutes(this.getSpotId(), this.getSectorId()),
      );
    } else {
      updateAscent(
        id,
        { ascent },
        () => reloadRoutes(this.getSpotId(), this.getSectorId()),
      );
    }
  };

  onAscentDateChanged = (index, date) => {
    const { ascent, mergeLastRow } = this.state;
    const history = R.clone(ascent.history);
    if (index !== history.length - 1 || (index === history.length - 1 && mergeLastRow)) {
      let i = index - 1;
      const fields = ['result', 'accomplished_at'];
      while (i >= 0 && R.equals(R.pick(fields, history[i]), R.pick(fields, history[index]))) {
        history[i].accomplished_at = date.format('YYYY-MM-DD');
        i -= 1;
      }
    }
    history[index].accomplished_at = date.format('YYYY-MM-DD');
    this.updateStateAscent(this.sortAscents(history));
  };

  removeAscent = (index) => {
    const { ascent } = this.state;
    const history = R.remove(index, 1, ascent.history);
    this.updateStateAscent(history);
  };

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  getAscent = () => {
    const { routes, user } = this.props;
    const route = routes[this.getRouteId()];
    return R.find(R.propEq('user_id', user.id), R.values(route.ascents));
  };

  ascentsForLayout = () => {
    const { ascent } = this.state;
    const mapIndexed = R.addIndex(R.map);
    return mapIndexed(
      (a, index) => (
        {
          id: index,
          success: a.result === 'success',
          accomplished_at: a.accomplished_at,
        }
      ),
      (ascent && ascent.history) || [],
    );
  };

  getResult = (history) => {
    if (history === null || history.length === 0) {
      return 'unsuccessful';
    }
    if (history[0].result === 'success') {
      return 'flash';
    }
    if (R.find(R.propEq('result', 'success'), history)) {
      return 'red_point';
    }
    return 'unsuccessful';
  };

  sortAscents = history => (
    R.sort(
      (a, b) => (moment(
        a.accomplished_at,
        'YYYY-MM-DD',
      ) - moment(
        b.accomplished_at,
        'YYYY-MM-DD',
      )),
      history,
    )
  );

  prepareAscentsHistory = (ascents) => {
    let date;
    if (this.state.newRowDate) {
      date = this.state.newRowDate;
    } else {
      date = moment().format('YYYY-MM-DD');
    }
    this.setState({ newRowDate: date });
    return R.flatten(R.map(
      a => (
        R.repeat(
          {
            result: a.result,
            accomplished_at: date,
          },
          a.count,
        )
      ),
      ascents,
    ));
  };

  updateStateAscent = (history) => {
    this.setState({
      ascent: {
        result: this.getResult(history),
        history: (history === null || history.length === 0) ? null : history,
      },
    });
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.save, SAVE_REQUEST_DELAY);
  };

  onAddAscents = (ascents, afterAscentsAdded) => {
    const { ascent } = this.state;
    const { reloadRoutes } = this.props;
    if (ascent) {
      const history = R.concat(ascent.history || [], this.prepareAscentsHistory(ascents));
      this.updateStateAscent(history);
      this.setState({ mergeLastRow: false });
    } else {
      const { user, addAscent, history: historyProp } = this.props;
      let params;
      let ascentsPrepared = ascents;
      if (ascents[0].result === 'red_point') {
        ascentsPrepared = R.prepend(
          {
            ...ascents[0],
            result: 'attempt',
            count: 1,
          },
          ascents,
        );
      }
      const lookup = {
        red_point: 'success',
        flash: 'success',
        unsuccessful: 'attempt',
      };
      const ascentsNew = R.map(
        a => (
          {
            result: lookup[a.result],
            count: a.count,
          }
        ),
        ascentsPrepared,
      );
      const history = this.prepareAscentsHistory(ascentsNew);
      params = {
        ascent: {
          history,
          result: this.getResult(history),
          user_id: user.id,
          route_id: this.getRouteId(),
        },
      };
      addAscent(
        params,
        () => reloadRoutes(this.getSpotId(), this.getSectorId()),
      );
      historyProp.goBack();
    }

    if (afterAscentsAdded) {
      afterAscentsAdded();
    }
  };

  onChangeFocus = (event) => {
    const { mergeLastRow } = this.state;
    if (!mergeLastRow) {
      this.setState(
        { mergeLastRow: !isHtmlElChild(event.target, this.lastTableRowRef) },
      );
    }
  };

  render() {
    const { details, ascent, mergeLastRow } = this.state;
    const ascentsHistory = this.ascentsForLayout();
    return (
      <Modal maxWidth="400px">
        <RouteAscentsTableContext.Provider
          value={{ setLastRowRef: (ref) => { this.lastTableRowRef = ref; } }}
        >
          <div onFocus={this.onChangeFocus}>
            <RouteAscentsLayout
              title="Добавление пролаза"
              initialWithFlash={!ascent}
              instantMode={ascent}
              blameCategory={false}
              ascents={ascentsHistory}
              details={{
                show: details,
              }}
              mergeLastRow={mergeLastRow}
              onAddAscents={this.onAddAscents}
              onRemoveAscent={this.removeAscent}
              onAscentDateChanged={this.onAscentDateChanged}
            />
          </div>
        </RouteAscentsTableContext.Provider>
      </Modal>
    );
  }
}

RouteAscents.propTypes = {
  user: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  addAscent: PropTypes.func.isRequired,
  updateAscent: PropTypes.func.isRequired,
  removeAscent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  reloadRoutes: PropTypes.func.isRequired,
  sectors: PropTypes.object,
  selectedViewModes: PropTypes.object,
  selectedFilters: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  formErrors: {},
  routes: state.routesStoreV2.routes,
  selectedViewModes: state.selectedViewModes,
  sectors: state.sectorsStore.sectors,
  selectedFilters: state.selectedFilters,
});

const mapDispatchToProps = dispatch => ({
  addAscent: (params, afterSuccess) => dispatch(addAscentAction(params, afterSuccess)),
  updateAscent: (url, params, afterSuccess) => {
    dispatch(updateAscentAction(url, params, afterSuccess));
  },
  removeAscent: (url, afterSuccess) => dispatch(removeAscentAction(url, afterSuccess)),
  reloadRoutes: (spotId, sectorId) => dispatch(reloadRoutesAction(spotId, sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouteAscents));
