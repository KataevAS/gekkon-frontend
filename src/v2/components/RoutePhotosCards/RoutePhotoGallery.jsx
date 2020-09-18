import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { StyleSheet, css } from '../../aphrodite';
import Modal from '../../layouts/Modal';
import { removeRoutePhoto as removeRoutePhotoAction } from '../../redux/route_photos/actions';

class RoutePhotoGallery extends Component {
  constructor(props) {
    super(props);

    const index = R.findIndex(R.propEq('id', this.props.photoId))(this.props.photos);
    this.state = {
      currentDisplayedPhotoIndex: index === -1 ? 0 : index,
      bgImageLoaded: true,
    };
  }

  nextPhoto = () => {
    const newIndex = (
      this.state.currentDisplayedPhotoIndex + 1 === this.props.photos.length
        ? 0
        : this.state.currentDisplayedPhotoIndex + 1
    );
    this.setState({ currentDisplayedPhotoIndex: newIndex });
  }

  remove = () => {
    if (window.confirm('Удалить фото?')) {
      this.props.removeRoutePhoto(
        this.props.photos[this.state.currentDisplayedPhotoIndex].id,
        this.props.afterRemovePhoto,
      );
    }
  }

  render() {
    const { photos } = this.props;
    const { currentDisplayedPhotoIndex, bgImageLoaded } = this.state;
    return (
      <Modal maxWidth="1200px">
        <div className={css(styles.container)}>
          <div
            className={css(styles.imgContainer)}
            onClick={this.nextPhoto}
            style={
              (photos[currentDisplayedPhotoIndex] && bgImageLoaded)
                ? { backgroundImage: `url(${photos[currentDisplayedPhotoIndex].photo.url})` }
                : {}
            }
          />
          <div className={css(styles.trash)} onClick={this.remove}>
            <svg aria-hidden="true" width="100%" height="100%">
              <use xlinkHref={`${require('./assets/trash-can.svg')}#trash-can`} />
            </svg>
          </div>
        </div>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  imgContainer: {
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundColor: '#1f1f1f',
    height: 'calc(100vh - 200px)',
  },
  trash: {
    cursor: 'pointer',
    position: 'absolute',
    top: 10,
    right: 10,
    height: 24,
    width: 23,
    '> svg': { fill: '#6F6F6F' },
    ':hover': { '> svg': { fill: '#F3F3F3' } },
  },
});

RoutePhotoGallery.propTypes = {
  photos: PropTypes.array,
  photoId: PropTypes.number,
  history: PropTypes.object,
  removeRoutePhoto: PropTypes.func,
  afterRemovePhoto: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  removeRoutePhoto: (id, afterSuccess) => dispatch(removeRoutePhotoAction(id, afterSuccess)),
});

export default withRouter(connect(null, mapDispatchToProps)(RoutePhotoGallery));
