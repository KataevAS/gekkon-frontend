import React from 'react';
import * as R from 'ramda';
import { StyleSheet, css } from '../../../aphrodite';
import Calendar from '../../../components/common/Calendar/Calendar';
import RouteAscentsTableContext from '../contexts/RouteAscentsTableContext';


const RouteAscentsTableLayout = ({
  onRemoveClicked,
  onDateClicked,
  onDateSelected,
  dateChangingAscentId,
  ascents,
}) => (
  <RouteAscentsTableContext.Consumer>
    {
      ({ setLastRowRef }) => (
        <>
          <table className={css(style.tableHeader)}>
            <thead>
            <tr>
              <th style={{ width: '10%', textAlign: 'left' }}>№</th>
              <th style={{ width: '25%' }}>Статус</th>
              <th style={{ width: '45%', textAlign: 'left' }}>Дата</th>
              <th style={{ width: '10%' }} />
              <th style={{ width: '10%' }} />
            </tr>
            </thead>
          </table>
          <div className={css(style.detailsContainer)}>
            <table className={css(style.table)}>
              <tbody>
              {
                ascents && R.addIndex(R.map)(
                  (ascent, i) => (
                    <tr key={i} ref={i === ascents.length - 1 ? setLastRowRef : null}>
                      <td style={{ width: '10%', outline: 'none' }} tabIndex={0}>{i + 1}</td>
                      <td
                        tabIndex={0}
                        style={{ width: '25%', textAlign: 'center', outline: 'none' }}
                      >
                        <img
                          src={
                            ascent.success ? (
                              require('./assets/success_indicator.svg')
                            ) : (
                              require('./assets/fail_indicator.svg')
                            )
                          }
                        />
                      </td>
                      <td
                        tabIndex={0}
                        style={{
                          width: '45%',
                          cursor: 'pointer',
                          outline: 'none',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => {
                          onDateClicked && onDateClicked(ascent.id);
                        }}
                      >
                        {ascent.accomplished_at}

                        {
                          dateChangingAscentId === ascent.id && (
                            <div style={{ position: 'relative' }}>
                              <Calendar
                                left="-80px"
                                date={ascent.accomplished_at}
                                onSelect={
                                  (newDate) => {
                                    onDateSelected && onDateSelected(
                                      ascent.id,
                                      newDate ? newDate : null,
                                    );
                                  }
                                }
                              />
                            </div>
                          )
                        }

                      </td>
                      <td tabIndex={0} style={{ outline: 'none' }}>
                        {
                          ascent.count > 1 && `×${ascent.count}`
                        }
                      </td>
                      <td
                        tabIndex={0}
                        style={{ width: '20%', textAlign: 'right', outline: 'none' }}
                      >
                        <img
                          style={{ cursor: 'pointer' }}
                          onClick={
                            () => {
                              onRemoveClicked && onRemoveClicked(ascent.id);
                            }
                          }
                          src={require('./assets/remove.svg')}
                        />
                      </td>
                    </tr>
                  ),
                )(ascents)
              }
              </tbody>
            </table>
          </div>
        </>
      )
    }
  </RouteAscentsTableContext.Consumer>
);

const style = StyleSheet.create({
  detailsContainer: {
    width: '100%',
    maxHeight: '400px',
    overflowY: 'auto',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderSpacing: 0,
    tableLayout: 'fixed',

    '> tbody': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> td': {
          '> img': {
            verticalAlign: 'middle',
          },
        },
        '> td:first-child': {
          paddingLeft: '10px',
        },
        '> td:last-child': {
          paddingRight: '10px',
        },
      },

      '> tr:nth-child(even)': {
        backgroundColor: '#EDEDED',
      },
    },
  },
  tableHeader: {
    width: '100%',
    borderSpacing: 0,

    '> thead': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> th:first-child': {
          paddingLeft: '10px',
        },
        '> th:last-child': {
          paddingRight: '10px',
        },
      },
    },
  },
});

export default RouteAscentsTableLayout;
