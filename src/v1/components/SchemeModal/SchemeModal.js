import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import Axios from 'axios';
import * as R from 'ramda';
import Scheme from '../Scheme/Scheme';
import BackButton from '../BackButton/BackButton';
import './SchemeModal.css';
import { DEFAULT_FILTERS } from '../../Constants/filters';
import { BACKEND_DATE_FORMAT } from '../../Constants/Date';
import { ApiUrl } from '../../Environ';
import toastHttpError from '@/v2/utils/toastHttpError';

class SchemeModal extends Component {
  constructor(props) {
    super(props);

    const { currentRoute } = this.props;
    this.state = {
      routes: [],
      currentRoute: R.clone(currentRoute),
    };
    this.isMoving = false;
  }

  componentDidMount() {
    this.loadRoutes();
  }

  loadRoutes = () => {
    const {
      currentRoute,
    } = this.props;
    const currentSectorId = currentRoute.sector_id;
    const currentCategoryFrom = DEFAULT_FILTERS.categoryFrom;
    const currentCategoryTo = DEFAULT_FILTERS.categoryTo;
    const currentDate = DEFAULT_FILTERS.date;
    const params = {
      filters: {
        category: [[currentCategoryFrom], [currentCategoryTo]],
        personal: DEFAULT_FILTERS.personal,
        outdated: true,
      },
    };

    params.filters.installed_at = [[null], [moment(currentDate).format(BACKEND_DATE_FORMAT)]];
    params.filters.installed_until = [
      [moment(currentDate).add(1, 'days').format(BACKEND_DATE_FORMAT)],
      [null],
    ];
    Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, { params })
      .then((response) => {
        this.setState(
          { routes: R.reject(R.propEq('id', currentRoute.id), response.data.payload) },
        );
      }).catch((error) => {
        toastHttpError(error);
      });
  };

  onMouseDown = (event) => {
    if (event.nativeEvent.which === 1) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const { currentRoute } = this.state;
      const newCurrentRoute = R.clone(currentRoute);
      newCurrentRoute.data.position = {
        left: (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100,
        top: (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100,
      };
      this.isMoving = true;
      this.setState({ currentRoute: newCurrentRoute });
    }
  };

  onMouseMove = (event) => {
    if (this.isMoving) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const xOld = (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
      const yOld = (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
      const { currentRoute } = this.state;
      currentRoute.data.position.dx = xOld - currentRoute.data.position.left;
      currentRoute.data.position.dy = yOld - currentRoute.data.position.top;
      this.setState({ currentRoute });
    }
  };

  onStartMoving = (pageX, pageY) => {
    const { editable } = this.props;
    if (!editable) {
      return;
    }
    this.isMoving = true;
    const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
    const xOld = (pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
    const yOld = (pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
    const { currentRoute } = this.state;
    currentRoute.data.position.dx = xOld - currentRoute.data.position.left;
    currentRoute.data.position.dy = yOld - currentRoute.data.position.top;
    this.setState({ currentRoute });
  };

  onMouseUp = (event) => {
    if (this.isMoving) {
      const schemeContainerRect = this.schemeContainerRef.getBoundingClientRect();
      const { currentRoute } = this.state;
      const xOld = (event.pageX - schemeContainerRect.x) / schemeContainerRect.width * 100;
      const yOld = (event.pageY - schemeContainerRect.y) / schemeContainerRect.height * 100;
      const dx = xOld - currentRoute.data.position.left;
      const dy = yOld - currentRoute.data.position.top;
      currentRoute.data.position = {
        left: currentRoute.data.position.left + dx,
        top: currentRoute.data.position.top + dy,
      };
      this.setState({ currentRoute });
      this.isMoving = false;
    }
  };

  close = () => {
    const { close, currentRoute: currentRouteProp } = this.props;
    this.setState({ currentRoute: currentRouteProp });
    close();
  };

  render() {
    const {
      save,
      editable,
    } = this.props;
    const { currentRoute, routes } = this.state;
    return (
      <>
        <div className="modal__back">
          <BackButton onClick={() => save(currentRoute.data.position)} />
        </div>
        <div
          role="button"
          tabIndex={0}
          style={{ margin: '50px 70px', outline: 'none' }}
          className="modal__hall-scheme"
          ref={(ref) => {
            this.schemeContainerRef = ref;
          }}
          onMouseDown={editable ? this.onMouseDown : null}
          onMouseUp={editable ? this.onMouseUp : null}
          onMouseMove={editable ? this.onMouseMove : null}
        >
          <Scheme
            currentRoutes={[currentRoute.id]}
            routes={[currentRoute, ...routes]}
            showCards={false}
            onStartMoving={this.onStartMoving}
          />
        </div>
      </>
    );
  }
}

SchemeModal.propTypes = {
  editable: PropTypes.bool,
  currentRoute: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export default withRouter(SchemeModal);
