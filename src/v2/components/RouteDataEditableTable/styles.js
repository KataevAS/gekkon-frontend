import { StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  routeDataTableRow: {
    display: 'flex',
    padding: '5px 0 5px',
    '@media screen and (max-width: 1440px)': { padding: '3px 0 3px' },
  },
  routeDataTableItem: {
    maxWidth: '215px',
    width: '100%',
    fontSize: '16px',
    '@media screen and (max-width: 1440px)': { fontSize: '14px' },
  },
  routeDataTableItemHeader: {
    color: '#828282',
    '@media screen and (max-width: 1440px)': { minWidth: '150px' },
  },
  routeDataTableTableItemRight: {
    maxWidth: '240px',
    width: '100%',
  },
  routeDataTableFieldSelect: {
    marginLeft: '-10px',
    marginTop: '-3px',
  },
  routeDataTableCategoryTrack: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  routeDataTableCategoryTrackWrap: {
    display: 'inline-flex',
    position: 'relative',
  },
  routeDataTableCategoryTrackInfo: { cursor: 'pointer' },
  routeDataTableCategoryTrackColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    marginLeft: '15px',
  },
  modalTableItem: {
    maxWidth: '215px',
    width: '100%',
    fontSize: '16px',
    position: 'relative',
  },
  modalTableItemRight: {
    maxWidth: '240px',
    width: '100%',
  },
});

export default styles;
