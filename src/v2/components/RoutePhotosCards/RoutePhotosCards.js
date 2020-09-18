import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import Pagination from '@/v1/components/Pagination/Pagination';
import { StyleSheet, css } from '../../aphrodite';
import { ApiUrl } from '@/v1/Environ';
import RoutePhotosCardsLayout from './RoutePhotosCardsLayout';
import { loadRoutePhotos as loadRoutePhotosAction } from '../../redux/route_photos/actions';
import toastHttpError from '@/v2/utils/toastHttpError';

const PHOTOS_PER_PAGE = 30;
const NUM_OF_DISPLAYED_PAGES = 5;

class RoutePhotosCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };
  }

  componentDidMount() {
    this.props.loadRoutePhotos(this.getSectorId());
  }

  getSectorId = () => parseInt(R.propOr(0, 'sector_id', this.props.match.params), 10);

  onDropFiles = (acceptedFiles) => {
    const data = new FormData();
    data.append('route_photo[photo]', acceptedFiles[0]);
    data.append('route_photo[sector_id]', this.getSectorId());

    Axios({
      url: `${ApiUrl}/v1/route_photos`,
      method: 'post',
      data,
      config: { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true },
    })
      .then(() => {
        this.props.loadRoutePhotos(this.getSectorId());

        if (acceptedFiles.length > 1) {
          this.onDropFiles(R.slice(1, Infinity, acceptedFiles));
        }
      }).catch((error) => {
        toastHttpError(error);
      });
  };

  style = StyleSheet.create({
    container: {
      paddingTop: '105px',
      paddingBottom: '105px',

      '@media screen and (max-width: 1440px)': {
        paddingTop: '65px',
        paddingBottom: '65px',
      },
    },
  });

  obtainRoutePhotos = () => {
    const { page } = this.state;

    const photos = R.sort((a, b) => b.id - a.id)(Object.values(this.props.routePhotos));
    return photos.slice((page - 1) * PHOTOS_PER_PAGE, page * PHOTOS_PER_PAGE);
  };

  pagesList = () => {
    const { routePhotos } = this.props;
    const { page } = this.state;
    const numOfPages = (
      routePhotos
        ? Math.ceil(Object.values(routePhotos).length / PHOTOS_PER_PAGE)
        : 0
    );
    if (NUM_OF_DISPLAYED_PAGES >= numOfPages) {
      return R.range(1, numOfPages + 1);
    }
    const firstPage = page - Math.floor(NUM_OF_DISPLAYED_PAGES / 2);
    const lastPage = firstPage + NUM_OF_DISPLAYED_PAGES;
    if (firstPage >= 1 && lastPage <= numOfPages) {
      return R.range(firstPage, lastPage);
    }
    if (firstPage >= 1) {
      return R.range(numOfPages - NUM_OF_DISPLAYED_PAGES + 1, numOfPages + 1);
    }
    return R.range(1, NUM_OF_DISPLAYED_PAGES + 1);
  };

  render() {
    const { routePhotos } = this.props;
    const numOfPages = (
      routePhotos
        ? Math.ceil(Object.values(routePhotos).length / PHOTOS_PER_PAGE)
        : 0
    );
    return (
      <Dropzone onDrop={this.onDropFiles}>
        {({ getRootProps, getInputProps }) => (
          <div
            className={css(this.style.container)}
            {...getRootProps()}
            onClick={(event) => event.stopPropagation()}
          >
            <input {...getInputProps(this.getSectorId())} />
            <RoutePhotosCardsLayout photos={this.obtainRoutePhotos()} />
            <Pagination
              onPageChange={page => this.setState({ page })}
              page={this.state.page}
              pagesList={this.pagesList()}
              firstPage={1}
              lastPage={numOfPages}
            />
          </div>
        )}
      </Dropzone>
    );
  }
}

RoutePhotosCards.propTypes = {
};

const mapStateToProps = state => ({
  routePhotos: state.routePhotosV2,
});

const mapDispatchToProps = dispatch => ({
  loadRoutePhotos: (sectorId) => dispatch(loadRoutePhotosAction(sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutePhotosCards));
