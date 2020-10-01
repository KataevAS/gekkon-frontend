import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import { currentUser } from '../../redux/user_session/utils';
import List from '@/v1/components/List/List';
import Avatar from '@/v1/components/Avatar/Avatar';
import { GetUserName, USER_ITEMS_DATA, GUEST_ITEMS_DATA } from '@/v1/Constants/User';

import { StyleSheet, css } from '../../aphrodite';
import { closeUserSession as closeUserSessionAction } from '../../utils/auth';


class UserIcon extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      droppedDown: false,
    };
  }

  onItemSelect = (id) => {
    const { user } = this.props;

    this.setState({ droppedDown: false });

    if (id === 1) {
      if (user) {
        this.props.history.push('#profile');
      } else {
        this.props.history.push('#signup');
      }
    }

    if (id === 2) {
      if (user) {
        this.props.closeUserSession();
      } else {
        this.props.history.push('#signin');
      }
    }
  };

  onAvatarClick = () => {
    const { droppedDown } = this.state;
    this.setState({ droppedDown: !droppedDown });
  };

  render() {
    const { user } = this.props;
    const { droppedDown } = this.state;
    const title = user ? GetUserName(user, true) : '';
    return (
      <div
        className={css(style.userIcon)}
        onBlur={() => this.setState({ droppedDown: false })}
        tabIndex={0}
      >
        <Avatar
          onClick={this.onAvatarClick}
          user={user}
        />
        {
          droppedDown
            ? (
              <div className={css(style.userIconUserMenu, style.userIconUserMenuActive)}>
                <List
                  items={
                    !user
                      ? GUEST_ITEMS_DATA
                      : R.prepend({ title }, USER_ITEMS_DATA)
                  }
                  onClick={this.onItemSelect}
                  textFieldName="title"
                />
              </div>
            )
            : ''
        }
      </div>
    );
  }
}

const style = StyleSheet.create({
  userIcon: {
    outline: 'none',
    position: 'relative',
  },
  userIconUserMenu: {
    position: 'absolute',
    content: '\'\'',
    right: '5px',
    top: 'calc(100% + 25px)',
    backgroundColor: '#ffffff',
    padding: '12px 0',
    minWidth: '225px',
    boxSizing: 'border-box',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.08)',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      top: '-14px',
      right: '23px',
      height: '14px',
      width: '23px',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2223%22%20height%3D%2214%22%20viewBox%3D%220%200%2023%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cmask%20id%3D%22mask0%22%20mask-type%3D%22alpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2223%22%20height%3D%2214%22%3E%0A%3Crect%20width%3D%2223%22%20height%3D%2214%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/mask%3E%0A%3Cg%20mask%3D%22url%28%23mask0%29%22%3E%0A%3Cpath%20d%3D%22M11.5%200L23.1913%2014.25H-0.191343L11.5%200Z%22%20fill%3D%22white%22/%3E%0A%3C/g%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
    },
  },
  userIconUserMenuActive: {
    display: 'block',
  },
});

UserIcon.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

const mapDispatchToProps = dispatch => (
  { closeUserSession: () => dispatch(closeUserSessionAction()) }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserIcon));
