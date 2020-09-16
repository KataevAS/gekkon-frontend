import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  form: { outline: 'none' },
  modalBlockPaddingWrapper: { padding: '35px' },
  noticeMessageButtonBlock: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '-6px',
    marginRight: '-6px',
    marginTop: '10px',
  },
  noticeMessageButtonCol: {
    marginLeft: '6px',
    marginRight: '6px',
  },
  noticeMessageTitle: {
    marginTop: 0,
    marginBottom: '12px',
    lineHeight: '1em',
    fontSize: '16px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    color: '#1f1f1f',
  },
  formTextarea: {
    width: '100%',
    height: '150px',
    border: '1px solid #DDE2EF',
    outline: 'none',
    transition: 'box-shadow .4s ease-out',
    resize: 'none',
    padding: '12px 12px',
    boxSizing: 'border-box',
    color: '#828282',
    fontSize: '16px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    overflowX: 'hidden',
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  },
});

export default styles;
