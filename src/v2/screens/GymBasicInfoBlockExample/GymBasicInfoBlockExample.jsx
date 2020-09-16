import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GymBasicInfoBlock from './GymBasicInfoBlock/GymBasicInfoBlock';
import { loadSpot as loadSpotAction } from '../../redux/spots/actions';
import { loadSpecificUser as loadSpecificUserAction } from '../../redux/users/actions';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import { css, StyleSheet } from '@/v2/aphrodite';
import { DEFAULT_MODERATOR_ID } from '@/constants/common';

const GymBasicInfoBlockExample = ({ loadSpot, loadSpecificUser, match }) => {
  const gymId = match.params.gym_id;

  const loadData = () => {
    loadSpot(gymId);
    loadSpecificUser(DEFAULT_MODERATOR_ID);
  };

  useEffect(() => loadData(), []);

  return (
    <MainScreen>
      <div className={css(styles.blockFitterForMainScreen)}>
        <div className={css(styles.container)}>
          <GymBasicInfoBlock id={gymId} />
        </div>
      </div>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  blockFitterForMainScreen: {
    flex: 1,
    paddingTop: '105px',
    paddingBottom: '105px',
    '@media screen and (max-width: 1440px)': {
      paddingTop: '65px',
      paddingBottom: '65px',
    },
  },
  container: {
    width: '100%',
    outline: '0',
    maxWidth: '1600px',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

GymBasicInfoBlockExample.propTypes = {
  loadSpot: PropTypes.func,
  loadSpecificUser: PropTypes.func,
  match: PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
  loadSpot: id => dispatch(loadSpotAction(id)),
  loadSpecificUser: id => dispatch(loadSpecificUserAction(id)),
});

export default connect(null, mapDispatchToProps)(GymBasicInfoBlockExample);
