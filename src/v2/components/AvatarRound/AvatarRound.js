import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const AvatarRound = ({ user, size }) => (
  <a
    className={
      css(
        styles.avatarRound,
        user ? styles.avatarRoundLogin : '',
        size === 'big' && styles.avatarRoundBig,
      )
    }
  >
    {user && user.avatar && <img src={user.avatar.url} alt={user.name ? user.name : user.login} />}
  </a>
);

const styles = StyleSheet.create({
  avatarRound: {
    display: 'flex',
    justifyContent: 'center',
    flexShrink: '0',
    alignItems: 'center',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M22.9803%208.71906C22.9803%2013.1525%2019.3843%2016.7486%2014.9508%2016.7486C10.5172%2016.7486%206.9212%2013.1279%206.9212%208.71906C6.9212%204.31019%2010.5173%200.714111%2014.9508%200.714111C19.3842%200.714111%2022.9803%204.28559%2022.9803%208.71906ZM20.8621%208.71906C20.8621%205.4678%2018.202%202.80772%2014.9508%202.80772C11.6995%202.80772%209.03941%205.46775%209.03941%208.71901C9.03941%2011.9703%2011.6995%2014.6304%2014.9508%2014.6304C18.202%2014.6304%2020.8621%2011.9703%2020.8621%208.71906ZM28.9409%2029.2856H1.0591C0.467973%2029.2856%200%2028.8177%200%2028.2265C0%2022.66%204.53203%2018.1526%2010.0739%2018.1526H19.9261C25.4926%2018.1526%2030%2022.6846%2030%2028.2265C30%2028.8177%2029.532%2029.2856%2028.9409%2029.2856ZM19.9261%2020.2708H10.0739C6.0345%2020.2708%202.70933%2023.3004%202.19211%2027.1674H27.8079C27.2906%2023.2758%2023.9655%2020.2708%2019.9261%2020.2708Z%22%20fill%3D%22%23BDBDBD%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '22px 21px',
    backgroundPosition: 'center',
    '@media screen and (max-width: 1440px)': {
      width: '36px',
      height: '36px',
    },
    '> img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  avatarRoundLogin: {
    backgroundColor: '#7AC767',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M22.9803%208.71882C22.9803%2013.1523%2019.3843%2016.7484%2014.9508%2016.7484C10.5172%2016.7484%206.9212%2013.1277%206.9212%208.71882C6.9212%204.30995%2010.5173%200.713867%2014.9508%200.713867C19.3842%200.713867%2022.9803%204.28535%2022.9803%208.71882ZM20.8621%208.71882C20.8621%205.46755%2018.202%202.80747%2014.9508%202.80747C11.6995%202.80747%209.03941%205.4675%209.03941%208.71877C9.03941%2011.97%2011.6995%2014.6301%2014.9508%2014.6301C18.202%2014.6301%2020.8621%2011.9701%2020.8621%208.71882ZM28.9409%2029.2854H1.0591C0.467973%2029.2854%200%2028.8174%200%2028.2263C0%2022.6597%204.53203%2018.1523%2010.0739%2018.1523H19.9261C25.4926%2018.1523%2030%2022.6844%2030%2028.2263C30%2028.8174%2029.532%2029.2854%2028.9409%2029.2854ZM19.9261%2020.2706H10.0739C6.0345%2020.2706%202.70933%2023.3002%202.19211%2027.1671H27.8079C27.2906%2023.2755%2023.9655%2020.2706%2019.9261%2020.2706Z%22%20fill%3D%22%23F7F7F7%22/%3E%0A%3C/svg%3E%0A")',
  },
  avatarRoundBig: {
    width: '80px',
    height: '80px',
    '@media screen and (max-width: 1440px)': {
      width: '80px',
      height: '80px',
    },
  },
});

AvatarRound.propTypes = {
  user: PropTypes.object,
  size: PropTypes.string,
};

export default AvatarRound;
