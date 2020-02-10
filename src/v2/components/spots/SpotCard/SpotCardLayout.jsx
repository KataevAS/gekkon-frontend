import React from 'react';
import * as R from 'ramda';
import { css, StyleSheet } from '../../../aphrodite';


const SpotCardLayout = ({ spot, onClick, style: inputStyle, className }) => (
  <div
    className={[css(inputStyle, style.container), ...(className ? [className] : [])].join(' ')}
    onClick={onClick}
  >
    <div
      className={css(style.photo)}
      style={{
        backgroundImage: spot.photo && `url(${spot.photo.url})`,
      }}
    >
      &nbsp;
    </div>
    <div className={css(style.description)}>
      <div className={css(style.spotType)}>
        {
          R.map(
            kind => ({
              sport: 'веревка',
              boulder: 'боулдер',
            }[kind]),
          )(spot.kinds).join(', ')
        }
      </div>
      <div className={css(style.spotName)}>{spot.name}</div>
      <div className={css(style.spotInfo)}>
        <table>
          <tbody>
            {
              spot.data.hours && (
                R.addIndex(R.map)(
                  (e, i) => (
                    <tr>
                      <td>{i === 0 ? <img src={require('./assets/calendar.svg')} /> : ''}</td>
                      <td style={{ color: '#B4BABC' }}>{e.days}</td>
                      <td>{e.hours}</td>
                    </tr>
                  ),
                )(spot.data.hours)
              )
            }
            {
              spot.data.wayInfo && (
                R.addIndex(R.map)(
                  (way, i) => (
                    <tr>
                      <td>{ i === 0 ? <img src={require('./assets/landmark.svg')} /> : '' }</td>
                      <td>{way.pointFrom}</td>
                      <td style={{ color: '#B4BABC' }}>
                        <img src={require(`./assets/${way.pointFromType}.svg`)} />
                        &nbsp;
                        {way.distance}
                      </td>
                    </tr>
                  ),
                )(spot.data.wayInfo)
              )
            }
            {
              spot.data.price && (
                R.addIndex(R.map)(
                  (priceLine, i) => (
                    <tr>
                      <td><img src={i === 0 ? require('./assets/coin.svg') : ''} /></td>
                      <td style={{ color: '#B4BABC' }}>{priceLine.days}</td>
                      <td>{priceLine.cost}</td>
                    </tr>
                  ),
                )(spot.data.price)
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    color: '#1A1A1A',
    height: '500px',

    ':hover': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)',
    },
  },
  photo: {
    flex: 1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#F3F3F3',
  },
  description: {
    display: 'flex',
    flexFlow: 'column',
    fontSize: '14px',
    fontFamily: 'GilroyMedium, sans-serif',
    flex: '0 0 245px',
    margin: '25px',
    overflow: 'hidden',
  },
  spotType: {
    fontFamily: 'GilroyRegular, sans-serif',
    fontSize: '11px',
    marginBottom: '5px',
  },
  spotName: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '18px',
    marginBottom: '10px',

    ':hover': {
      color: '#000000',
      textShadow: '0px 0px 3px rgba(0, 0, 0, 0.12)',
    },
  },
  spotInfo: {
    flex: '0 0 175px',
    overflowY: 'scroll',
    scroll: 'none',
    '> table':
    {
      borderSpacing: 0,

      '> tbody': {
        '> tr': {
          lineHeight: '35px',
          '> td': {
            whiteSpace: 'nowrap',
            padding: 0,

            '> img': {
              verticalAlign: 'sub',
              height: '20px',
            },
          },
          '> td:first-child': {
            paddingRight: '15px',
          },
          '> td:nth-child(2n)': {
            paddingRight: '20px',
          },
        },
      },
    },
  },
});


export default SpotCardLayout;