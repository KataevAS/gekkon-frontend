import React, { Component } from 'react';
import * as R from 'ramda';
import moment from 'moment';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Calendar.css';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    const { date } = this.props;
    this.state = {
      displayedDate: date ? moment(date) : moment(),
      selectedDate: moment(date),
    };
  }

  getCurrentMonth = () => {
    const { displayedDate } = this.state;
    const d = displayedDate.format('MMMM');
    return d.charAt(0).toUpperCase() + d.slice(1);
  };

  getCurrentYear = () => {
    const { displayedDate } = this.state;
    return displayedDate.format('YYYY');
  };

  showPrevMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.subtract(1, 'month') });
  };

  showNextMonth = (event) => {
    event.stopPropagation();
    const { displayedDate } = this.state;
    this.setState({ displayedDate: displayedDate.add(1, 'month') });
  };

  getDay = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    return d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('D');
  };

  notSelectedMonth = (week, day) => {
    const { displayedDate } = this.state;
    const d = R.clone(displayedDate);
    const month = d.startOf('month').startOf('week').add(week * 7 + day, 'days').format('M');
    const displayedMonth = displayedDate.format('M');
    return month !== displayedMonth;
  };

  numOfWeeks = () => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    const start = d.startOf('month').weeks();
    d = R.clone(displayedDate);
    const end = d.endOf('month').weeks();
    if (end > start) {
      return end - start + 1;
    }
    if (end === 1) {
      d = R.clone(displayedDate);
      return d.endOf('month').subtract(7, 'days').weeks() - start + 2;
    }
    return end + 1;
  };

  isSelectedDate = (week, day) => {
    const { displayedDate, selectedDate } = this.state;
    if (selectedDate === null) {
      return false;
    }
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== R.clone(selectedDate).format('D')) {
      return false;
    }
    if (d.format('MM') !== R.clone(selectedDate).format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== R.clone(selectedDate).format('YYYY')) {
      return false;
    }
    return true;
  };

  isCurrentDate = (week, day) => {
    const { displayedDate } = this.state;
    let d = R.clone(displayedDate);
    d = d.startOf('month').startOf('week').add(week * 7 + day, 'days');
    if (d.format('D') !== moment().format('D')) {
      return false;
    }
    if (d.format('MM') !== moment().format('MM')) {
      return false;
    }
    if (d.format('YYYY') !== moment().format('YYYY')) {
      return false;
    }
    return true;
  };

  selectDate = (e, week, day) => {
    e.stopPropagation();
    const { displayedDate } = this.state;
    const { onSelect, hide } = this.props;
    const d = R.clone(displayedDate);
    onSelect(d.startOf('month').startOf('week').add(week * 7 + day, 'days'));
    hide();
  };

  removeDate = (e) => {
    e.stopPropagation();
    const { onSelect, hide } = this.props;
    onSelect(null);
    hide();
  };

  getDayClasses = (week, day) => (
    classNames(
      {
        'calendar__content-day': true,
        'calendar__content-day_unactive': this.notSelectedMonth(week, day),
        'calendar__content-day_current': this.isCurrentDate(week, day),
        'calendar__content-day_active': this.isSelectedDate(week, day),
      },
    )
  );

  render() {
    return (
      <div
        className="modal__table-item-calendar"
        style={this.props.left && { left: this.props.left }}
      >
        <div className="calendar calendar_left_v2">
          <div className="calendar__header" />
          <div className="calendar__content">
            <div className="calendar__content-header">
              <div className="calendar__content-header-month">
                <button
                  type="button"
                  onClick={this.showPrevMonth}
                  style={{ outline: 'none' }}
                  className="calendar__content-header-button calendar__content-header-button_prev"
                />
                {`${this.getCurrentMonth()} ${this.getCurrentYear()}`}
                <button
                  type="button"
                  onClick={this.showNextMonth}
                  style={{ outline: 'none' }}
                  className="calendar__content-header-button calendar__content-header-button_next"
                />
              </div>
              <div className="calendar__content-week-header">
                <div className="calendar__content-week-header-day">Пн</div>
                <div className="calendar__content-week-header-day">Вт</div>
                <div className="calendar__content-week-header-day">Ср</div>
                <div className="calendar__content-week-header-day">Чт</div>
                <div className="calendar__content-week-header-day">Пт</div>
                <div className="calendar__content-week-header-day">Сб</div>
                <div className="calendar__content-week-header-day">Вс</div>
              </div>
            </div>
            <div className="calendar__content-month">
              {
                R.map(
                  week => (
                    <div key={week} className="calendar__content-week">
                      {
                        R.map(
                          day => (
                            <button
                              key={day}
                              type="button"
                              style={{ outline: 'none' }}
                              onClick={e => this.selectDate(e, week, day)}
                              className={this.getDayClasses(week, day)}
                            >
                              {this.getDay(week, day)}
                            </button>
                          ),
                          R.range(0, 7),
                        )
                      }
                    </div>
                  ),
                  R.range(0, this.numOfWeeks()),
                )
              }
            </div>
          </div>
          <button
            type="button"
            onClick={this.removeDate}
            style={{ outline: 'none' }}
            className="calendar__button"
          >
            Сбросить дату
          </button>
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  date: PropTypes.string,
  hide: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  left: PropTypes.string,
};

DatePicker.defaultProps = {
  date: null,
  hide: () => {},
};
