import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@/v2/aphrodite';
import styles from './styles';

const InfoBlockCounter = ({ count, label }) => (
  <>
    <span className={css(styles.count)}>{count}</span>
    <span className={css(styles.label)}>{label.toLowerCase()}</span>
  </>
);

InfoBlockCounter.propTypes = {
  count: PropTypes.number,
  label: PropTypes.string,
};

export default InfoBlockCounter;
