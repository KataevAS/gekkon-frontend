import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 808,
  },
  displayedPhoto: {
    position: 'relative',
    width: '100%',
    height: 650,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  previewPhotoContainer: {
    display: 'flex',
    width: '100%',
    height: 125,
    marginTop: 33,
  },
  previewPhoto: {
    width: '20%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    marginRight: 7,
    ':last-child': { marginRight: 0 },
    ':hover': { opacity: '0.9' },
  },
  previewphotoInactive: { opacity: '0.6' },
  likeButtonContainer: {
    position: 'absolute',
    right: 30,
    top: 32,
    display: 'none',
  },
});

export default styles;
