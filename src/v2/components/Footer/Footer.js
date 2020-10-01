import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { currentUser } from '../../redux/user_session/utils';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import {
  TELEGRAM_LINK,
  INSTA_LINK,
  VK_LINK,
} from '@/v1/Constants/SocialLinks';
import { notReady, notExist } from '@/v1/utils';

import './Footer.css';
import { closeUserSession as closeUserSessionAction } from '@/v2/utils/auth';


class Footer extends React.PureComponent {
  render() {
    const { user, history } = this.props;

    const socialLinksSprite = require(
      '@/../img/social-links-sprite/social-links-sprite.svg',
    );

    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__block-group">
            <div className="footer__item">
              <h3 className="footer__header">
                Аккаунт
              </h3>
              <ul className="footer__list">
                {
                  !notReady(user) && (
                    <>
                      {
                        notExist(user)
                          ? (
                            <>
                              <li className="footer__list-item">
                                <a
                                  onClick={() => history.push('#signin')}
                                  role="link"
                                  tabIndex={0}
                                  className="footer__list-link"
                                >
                                  Вход
                                </a>
                              </li>
                              <li className="footer__list-item">
                                <a
                                  onClick={() => history.push('#signup')}
                                  role="link"
                                  tabIndex={0}
                                  className="footer__list-link"
                                >
                                  Регистрация
                                </a>
                              </li>
                            </>
                          )
                          : (
                            <li className="footer__list-item">
                              <a
                                onClick={this.props.closeUserSession}
                                role="link"
                                tabIndex={0}
                                className="footer__list-link"
                              >
                                Выход
                              </a>
                            </li>
                          )
                      }
                    </>
                  )
                }
              </ul>
            </div>
            <div className="footer__item">
              <h3 className="footer__header">
                Разделы
              </h3>
              <ul className="footer__list">
                <li className="footer__list-item">
                  <Link to="/" className="footer__list-link">Скалодромы</Link>
                </li>
                <li className="footer__list-item">
                  <Link to="/crags" className="footer__list-link footer__list-link-disabled">
                    Скалы
                  </Link>
                </li>
                <li className="footer__list-item">
                  <Link to="/users" className="footer__list-link">Рейтинги</Link>
                </li>
              </ul>
            </div>
            <div className="footer__item">
              <h3 className="footer__header">Информация</h3>
              <ul className="footer__list">
                <li className="footer__list-item">
                  <Link to="/about" className="footer__list-link">О нас</Link>
                </li>
              </ul>
            </div>
            <div className="footer__item">
              <h3 className="footer__header">Помощь</h3>
              <ul className="footer__list">
                <li className="footer__list-item">
                  <Link to="/faq" className="footer__list-link">FAQ</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__social">
            <h3 className="footer__header">Соцсети</h3>
            <ul className="social-links">
              <li>
                <SocialLinkButton
                  href={TELEGRAM_LINK}
                  xlinkHref={`${socialLinksSprite}#icon-telegram`}
                />
              </li>
              <li>
                <SocialLinkButton
                  href={VK_LINK}
                  xlinkHref={`${socialLinksSprite}#icon-vk`}
                />
              </li>
              <li>
                <SocialLinkButton
                  href={INSTA_LINK}
                  xlinkHref={`${socialLinksSprite}#icon-inst`}
                />
              </li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  user: PropTypes.object,
  closeUserSession: PropTypes.func,
};

const mapStateToProps = state => ({
  user: currentUser(state),
});

const mapDispatchToProps = dispatch => (
  { closeUserSession: () => dispatch(closeUserSessionAction()) }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Footer));
