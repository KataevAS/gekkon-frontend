import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const BackButton = ({
  onClick,
}) => (
  <button
    className={css(styles.back)}
    type="button"
    onClick={onClick}
  />
);

const styles = StyleSheet.create({
  back: {
    width: '24px',
    height: '20px',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M22.6509%2011.8837L22.6884%2011.8755H6.62869L11.6773%2016.9352C11.9245%2017.1822%2012.0601%2017.5168%2012.0601%2017.8681C12.0601%2018.2193%2011.9245%2018.5516%2011.6773%2018.7992L10.8917%2019.5851C10.6447%2019.8322%2010.3155%2019.9688%209.96449%2019.9688C9.61327%2019.9688%209.28391%2019.8331%209.03688%2019.5861L0.382639%2010.9327C0.134639%2010.6847%20-0.000970382%2010.3543%205.22758e-06%2010.0029C-0.000970382%209.64953%200.134639%209.31899%200.382639%209.07138L9.03688%200.417142C9.28391%200.170313%209.61308%200.0345079%209.96449%200.0345079C10.3155%200.0345079%2010.6447%200.170508%2010.8917%200.417142L11.6773%201.20309C11.9245%201.44973%2012.0601%201.77909%2012.0601%202.13031C12.0601%202.48134%2011.9245%202.79334%2011.6773%203.04017L6.57171%208.12816H22.6689C23.3922%208.12816%2024%208.75158%2024%209.47451V10.5861C24%2011.309%2023.3742%2011.8837%2022.6509%2011.8837Z%22%20fill%3D%22%234F4F4F%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '24px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    transition: 'opacity .4s ease-out',
    outline: 'none',
    ':hover': {
      opacity: '.6',
    },
    ':focus': {
      opacity: '.6',
    },
    ':active': {
      opacity: '.6',
    },
  },
});

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default BackButton;
