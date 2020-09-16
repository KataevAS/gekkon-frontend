import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const Button = ({
  disabled,
  submit,
  fullLength,
  isWaiting,
  size,
  style,
  onClick,
  children
}) => {
  let styleClassDark = false;
  let styleClassOutlined = false;
  let styleClassGrey = false;
  let styleClassFilter = false;
  let styleClassNotNormal = false;
  let sizeClassSmall = false;
  let sizeClassMedium = false;

  if (style === 'gray') {
    styleClassGrey = true;
  } else if (style === 'dark') {
    styleClassDark = true;
  } else if (style === 'outlined') {
    styleClassOutlined = true;
  } else if (style === 'filter') {
    styleClassFilter = true;
  } else if (style !== 'normal') {
    styleClassNotNormal = true;
  }

  if (size === 'small') {
    sizeClassSmall = true;
  } else if (size === 'medium') {
    sizeClassMedium = true;
  }

  const fullLengthClass = !!fullLength;
  const submitClass = !!submit;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!!disabled}
      style={disabled ? { cursor: 'not-allowed' } : (isWaiting ? { cursor: 'wait' } : {})}
      className={
        css(
          styles.btn,
          styleClassDark && styles.btnDark,
          styleClassGrey && styles.btnGray,
          styleClassOutlined && styles.btnOutlined,
          styleClassFilter && styles.btnFilter,
          styleClassNotNormal && styles.btnTransparent,
          sizeClassSmall && styles.btnSmall,
          sizeClassMedium && styles.btnMedium,
          fullLengthClass && styles.btnFullLength,
          submitClass && styles.btnSubmit,
        )
      }
    >
      {children}
    </button>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#006CEB',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '0 62px',
    lineHeight: '70px',
    height: '70px',
    border: 'none',
    boxShadow: 'none',
    boxSizing: 'border-box',
    transition: 'background-color .4s ease-out',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#2F86ED',
    },
    '@media screen and (max-width: 1600px)': {
      fontSize: '14px',
      height: '58px',
      lineHeight: '58px',
      paddingLeft: '30px',
      paddingRight: '30px',
    },
  },
  btnSmall: {
    fontSize: '14px',
    color: '#ffffff',
    lineHeight: '38px',
    height: '38px',
    padding: '0 25px',
  },
  btnMedium: {
    fontSize: '16px',
    color: '#ffffff',
    lineHeight: '50px',
    height: '50px',
    padding: '0 25px',
  },
  btnFullLength: {
    width: '100%',
  },
  btnTransparent: {
    backgroundColor: 'transparent',
    color: '#1f1f1f',
    padding: '0 40px',
    transition: 'color .4s ease-out',
    ':hover': {
      backgroundColor: 'transparent',
      color: '#666666',
    },
  },
  btnOutlined: {
    backgroundColor: 'transparent',
    color: '#1f1f1f',
    border: '2px solid #dde2ef',
    padding: '0 40px',
    transition: 'color .4s ease-out',
    ':hover': {
      backgroundColor: 'transparent',
      color: '#666666',
    },
  },
  btnSubmit: {
    marginTop: '27px',
  },
  btnGray: {
    backgroundColor: '#E4E8ED',
    color: '#1f1f1f',
    padding: '0 40px',
    transition: 'backgroundColor .4s ease-out',
    ':hover': {
      backgroundColor: '#D7D7D7',
    },
  },
  btnDark: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '0 40px',
    transition: 'backgroundColor .4s ease-out',
    ':hover': { backgroundColor: '#1f1f1f' },
  },
  btnFilter: {
    backgroundColor: '#ffffff',
    border: '2px solid #DDE2EF',
    height: '57px',
    width: '57px',
    padding: 0,
    fontSize: '24px',
    lineHeight: '57px',
    color: '#DDE2EF',
    fontWeight: 'bold',
    ':hover': {
      backgroundColor: '#fafafa',
      borderColor: '#006CEB',
      color: '#006CEB',
    },
  },
});

Button.propTypes = {
  disabled: PropTypes.bool,
  submit: PropTypes.bool,
  fullLength: PropTypes.bool,
  isWaiting: PropTypes.bool,
  size: PropTypes.string,
  style: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  disabled: false,
  submit: false,
  fullLength: false,
  isWaiting: false,
};

export default Button;
