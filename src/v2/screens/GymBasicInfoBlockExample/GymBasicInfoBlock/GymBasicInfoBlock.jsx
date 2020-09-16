import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Api from '@/v2/utils/Api';
import { css } from '../../../aphrodite';
import { userBaseName } from '../../../utils/users';
import { getSpotKind } from '../../../utils/spots';
import { currentUser } from '../../../redux/user_session/utils';
import withModals from '../../../modules/modalable';
import showToastr from '../../../utils/showToastr';
import InfoBlockCounter from './InfoBlockCounter/InfoBlockCounter';
import PhotoGallery from '../../../components/common/PhotoGallery/PhotoGallery';
import Button from '../../../components/Button/Button';
import AvatarRound from '../../../components/AvatarRound/AvatarRound';
import ContactModeratorForm from './ContactModeratorForm/ContactModeratorForm';
import UserInfoForm from './UserInfoForm/UserInfoForm';
import { DEFAULT_MODERATOR_ID } from '@/constants/common';

import styles from './styles';

class GymBasicInfoBlock extends Component {
  sendWantToContributeRequest = (userData, afterSuccess) => {
    Sentry.withScope(
      (scope) => {
        scope.setExtra('user', userData);

        Sentry.captureMessage(
          'Want to contribute request',
          (error) => {
            showToastr('Спасибо за готовность помочь, мы с вами свяжемся!', { type: 'success' });

            if (error) {
              showToastr('Произошла ошибка, мы не смогли отправить ваш запрос', { type: 'error' });
            }

            afterSuccess && afterSuccess();
          },
        );
      },
    );
  };

  contactModerator = (user, msg, afterSuccess) => {
    Api.get(
      `/v1/gyms/${this.props.id}/actions/contact_moderator`,
      {
        params: { user, msg },
        success() {
          showToastr('Ваше сообщение принято к отправлению', { type: 'success' });
          afterSuccess && afterSuccess();
        },
        failed() {
          showToastr('Не удалось отправить сообщение', { type: 'error' });
        },
      },
    );
  };

  sendPhotos = () => {
    const { user } = this.props;

    if (!user) {
      this.props.history.push('#want_to_add_routes');
      return;
    }

    this.sendWantToContributeRequest(user);
  };

  wantToAddRoutes = () => {
    const { user } = this.props;

    if (!user) {
      this.props.history.push('#send_photos');
      return;
    }

    this.sendWantToContributeRequest(user);
  };

  writeToModerator = () => {
    this.props.history.push('#contact_moderator');
  };

  modals() {
    return {
      want_to_add_routes: {
        hashRoute: true,
        body: (
          <UserInfoForm
            submit={
              (userData) => {
                this.sendWantToContributeRequest(
                  userData,
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
      send_photos: {
        hashRoute: true,
        body: (
          <UserInfoForm
            submit={
              (userData) => {
                this.sendWantToContributeRequest(
                  userData,
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
      contact_moderator: {
        hashRoute: true,
        body: (
          <ContactModeratorForm
            cancel={this.props.history.goBack}
            submit={
              ({ msg }) => {
                this.contactModerator(
                  this.props.user,
                  msg,
                  () => this.props.history.goBack(),
                );
              }
            }
          />
        ),
      },
    };
  }

  render() {
    const { history, spot, moderator, id } = this.props;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.leftBlock)}>
          <PhotoGallery
            photos={
              spot && (
                R.concat(
                  [spot?.photo],
                  R.map(s => s.photo, spot?.sectors),
                )
              )
            }
          />
        </div>
        <div className={css(styles.rightBlock)}>
          <div className={css(styles.topBlock)}>
            <div className={css(styles.kind)}>{getSpotKind(spot)}</div>
            <div className={css(styles.signUpContainer)}>
              <div className={css(styles.bell)}>
                <svg aria-hidden="true">
                  <use xlinkHref={`${require('./assets/bell.svg')}#bell`} />
                </svg>
              </div>
              <span className={css(styles.signUp)}>Подписаться</span>
            </div>
          </div>
          <div className={css(styles.gymName)}>
            {spot?.name}
          </div>
          <div className={css(styles.btnContainer)}>
            <Button
              onClick={() => { history.push(`/spots/${id}/sectors/${spot?.sectors[0]?.id}`); }}
              style="dark"
              fullLength
            >
              Трассы
              <div className={css(styles.arrow)}>
                <svg aria-hidden="true">
                  <use xlinkHref={`${require('./assets/arrow.svg')}#arrow`} />
                </svg>
              </div>
            </Button>
          </div>
          <div className={css(styles.bottomBlock)}>
            <div className={css(styles.gymInfoTopBlock)}>
              <div className={css(styles.moderatorBlock)}>
                <AvatarRound user={moderator} size="big" />
                <div className={css(styles.moderatorInfo)}>
                  <span className={css(styles.moderatorName)}>
                    {moderator && userBaseName(moderator)}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={this.writeToModerator}
                    className={css(styles.writeModeratorLink)}
                  >
                    Написать модератору
                  </span>
                </div>
              </div>
              {
                spot?.infoData && (
                  <div className={css(styles.infoBlock)}>
                    <div>
                      <InfoBlockCounter
                        count={spot.infoData[0].count}
                        label={spot.infoData[0].label}
                      />
                    </div>
                    <div className={css(styles.routesInfo)}>
                      <InfoBlockCounter
                        count={spot.infoData[1].count}
                        label={spot.infoData[1].label}
                      />
                    </div>
                  </div>
                )
              }
            </div>
            <div className={css(styles.gymInfoBtnBlock)}>
              <div className={css(styles.btnWrapper)}>
                <Button onClick={this.sendPhotos} style="outlined" fullLength>
                  Прислать фотографии
                </Button>
              </div>
              <div className={css(styles.btnWrapper)}>
                <Button onClick={this.wantToAddRoutes} style="transparent" fullLength>
                  Хочу вносить трассы
                </Button>
              </div>
            </div>
            <div className={css(styles.gymInfoDescBlock)}>
              <div className={css(styles.gymInfoDescHeader)}>Описание</div>
              <div className={css(styles.gymInfoDescContent)}>{spot?.description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GymBasicInfoBlock.propTypes = {
  id: PropTypes.number,
  spot: PropTypes.object,
  user: PropTypes.object,
  moderator: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const spot = state.spotsStoreV2[props.id];

  return {
    spot,
    moderator: state.usersStoreV2.store[spot?.moderator_id ?? DEFAULT_MODERATOR_ID],
    user: currentUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(withModals(GymBasicInfoBlock)));
