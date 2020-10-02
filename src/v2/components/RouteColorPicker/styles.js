import { StyleSheet } from '../../aphrodite';

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
  markColorPickerInfo: { cursor: 'pointer' },
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
  comboBoxDropdown: {
    content: '\'\'',
    position: 'absolute',
    margin: 0,
    padding: 0,
    left: 0,
    top: 'calc(100% + 20px)',
    backgroundColor: '#ffffff',
    minWidth: '100%',
    boxSizing: 'border-box',
    boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.12)',
    border: '2px solid #DDE2EF',
    zIndex: 10,
  },
  comboBoxDropdownActive: { display: 'block' },
  comboBoxDropdownWrapper: {
    maxHeight: '270px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  comboBoxDropdownItem: {
    listStyle: 'none',
    lineHeight: '1.3em',
    color: '#1f1f1f',
    fontFamily: 'GilroyRegular',
    fontSize: '18px',
    padding: '16px 20px',
    maxWidth: '100%',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: '#f5f5f5',
      cursor: 'pointer',
    },
  },
  comboBoxDropdownItemSelected: { backgroundColor: '#f5f5f5' },
  comboBoxDropdownItemPadding10: { padding: '10px' },
});

export default styles;
