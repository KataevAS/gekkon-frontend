import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  markColorPickerName: {
    display: 'inline-block',
    verticalAlign: 'middle',
    paddingLeft: '20px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  markColorPickerWrap: {
    display: 'inline-flex',
    position: 'relative',
    outline: 'none',
  },
  markColorPickerInfo: {
    cursor: 'pointer',
  },
  markColorPickerColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
  },
  markColorPickerItem: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  markColorPickerItemText: {
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    paddingLeft: '20px',
  },
  markColorPickerButton: {
    color: '#C2C3C8',
    fontSize: '14px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color .3s ease-out, color .3s ease-out',
    position: 'relative',
    outline: 'none',
    ':after': {
      position: 'absolute',
      content: '\'\'',
      left: 0,
      right: 0,
      top: 0,
      height: '1px',
      backgroundColor: '#F1F2F6',
    },
    ':hover': {
      backgroundColor: '#F3F3F3',
      color: '#6F6F6F',
    },
  },
});

export default styles;
