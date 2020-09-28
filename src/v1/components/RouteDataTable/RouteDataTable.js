import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as R from 'ramda';
import { getCategoryColor } from '../../Constants/Categories';
import { GetUserName } from '../../Constants/User';
import { ROUTE_KINDS } from '../../Constants/Route';
import RouteColorPicker from '@/v2/components/RouteColorPicker/RouteColorPicker';
import './RouteDataTable.css';

const RouteDataTable = ({
  user, route,
}) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? GetUserName(route.author) : null;
  if (!isCurrentUserRoute && name === null && route.author_id !== null) {
    if (user && user.role === 'admin') {
      name = GetUserName(route.author, true);
    }
    if (user && user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  }
  const kind = R.find(R.propEq('title', route.kind), ROUTE_KINDS);
  return (
    <div className="route-data-table">
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Категория:
        </div>
        <div className="route-data-table-item">
          <div className="route-data-table__category-track">{route.category}</div>
          <div
            className="route-data-table__category-track-color"
            style={{ backgroundColor: getCategoryColor(route.category) }}
          />
        </div>
      </div>
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Зацепы:
        </div>
        <div className="route-data-table-item">
          <RouteColorPicker editable={false} route={route} fieldName="holds_color" />
        </div>
      </div>
      {
        route.marks_color && (
          <div className="route-data-table-row">
            <div className="route-data-table-item route-data-table-item_header">
              Маркировка:
            </div>
            <div className="route-data-table-item">
              <RouteColorPicker editable={false} route={route} fieldName="marks_color" />
            </div>
          </div>
        )
      }
      <div className="route-data-table-row">
        <div className="route-data-table-item route-data-table-item_header">
          Тип:
        </div>
        <div className="route-data-table-item">
          {kind && kind.text}
        </div>
      </div>
      {
        route.installed_at && (<>
          <div className="route-data-table-row">
            <div className="route-data-table-item route-data-table-item_header">
              Накручена:
            </div>
            <div className="route-data-table-item">
              {moment(route.installed_at).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        route.installed_until && (<>
          <div className="route-data-table-row">
            <div className="route-data-table-item route-data-table-item_header">
              Cкручена:
            </div>
            <div className="route-data-table-item">
              {moment(route.installed_until).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        name && (<>
          <div className="route-data-table-row">
            <div className="route-data-table-item route-data-table-item_header">
              Накрутчик:
            </div>
            <div className="route-data-table-item">
              <a className="route-data-table__link">{isCurrentUserRoute ? 'Вы' : name}</a>
            </div>
          </div>
        </>)
      }
    </div>
  );
};

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
