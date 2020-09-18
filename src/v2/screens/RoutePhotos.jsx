import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import RoutePhotosCards from '@/v2/components/RoutePhotosCards/RoutePhotosCards';
import InfoPageHeader from '../components/InfoPageHeader/InfoPageHeader';

const RoutePhotos = ({ match, sectors, spots }) => (
  <MainScreen
    header={
      <InfoPageHeader
        title={
          `${sectors[match.params.sector_id].name} скалодрома ${spots[match.params.id].name}`
        }
      />
    }
  >
    <div className={css(style.container)}>
      <div className={css(style.content)}>
        <RoutePhotosCards />
      </div>
    </div>
  </MainScreen>
);

const style = StyleSheet.create({
  container: { width: '100%' },
  content: {
    flex: 1,
    maxWidth: '1600px',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

RoutePhotos.propTypes = {
  match: PropTypes.object,
  spots: PropTypes.object,
  sectors: PropTypes.object,
};

const mapStateToProps = state => ({
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps)(RoutePhotos));
