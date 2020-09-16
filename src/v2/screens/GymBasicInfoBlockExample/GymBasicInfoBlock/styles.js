import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  kind: {
    fontSize: '16px',
    lineHeight: '23px',
    color: '#7F7F7F',
  },
  signUpContainer: { display: 'none' },
  bell: {
    height: '23px',
    width: '20px',
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#c4c4c4',
    },
  },
  signUp: {
    marginLeft: '12px',
    fontSize: '20px',
    lineHeight: '23px',
    color: '#293034',
  },
  leftBlock: { width: '55%' },
  rightBlock: {
    width: '45%',
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '74px',
  },
  topBlock: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  gymName: {
    marginTop: '8px',
    fontWeight: 500,
    fontSize: '42px',
    lineHeight: '58px',
    fontFamily: 'GilroyMedium',
  },
  btnContainer: {
    marginTop: '12px',
    width: '100%',
  },
  arrow: {
    height: '10px',
    width: '20px',
    marginLeft: '10px',
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#f1f1f1',
    },
  },
  bottomBlock: { marginTop: '32px' },
  gymInfoTopBlock: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  moderatorBlock: { display: 'flex' },
  moderatorInfo: {
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  moderatorName: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
    color: '#293034',
  },
  writeModeratorLink: {
    fontSize: '20px',
    lineHeight: '24px',
    color: '#006CEB',
    cursor: 'pointer',
    marginTop: '11px',
  },
  infoBlock: {
    display: 'flex',
    alignItems: 'center',
  },
  routesInfo: { marginLeft: '51px' },
  gymInfoBtnBlock: {
    marginTop: '32px',
    display: 'flex',
  },
  btnWrapper: { flex: 1 },
  gymInfoDescBlock: { marginTop: '40px' },
  gymInfoDescHeader: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '25px',
    display: 'flex',
    alignItems: 'center',
    color: '#293034',
    fontFamily: 'GilroyBold',
  },
  gymInfoDescContent: {
    fontWeight: 300,
    fontSize: '16px',
    lineHeight: '18px',
    color: '#000000',
    marginTop: '22px',
  },
});

export default styles;
