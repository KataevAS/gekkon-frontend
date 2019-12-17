import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LikeButton from '../LikeButton/LikeButton';
import Button from '../Button/Button';
import CommentBlock from '../CommentBlock/CommentBlock';
import RouteStatus from '../RouteStatus/RouteStatus';
import CollapsableBlock from '../CollapsableBlock/CollapsableBlock';
import CommentForm from '../CommentForm/CommentForm';
import Counter from '../Counter/Counter';
import RouteDataTable from '../RouteDataTable/RouteDataTable';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import { DEFAULT_COMMENTS_DISPLAYED } from '../Constants/Comments';
import StickyBar from '../StickyBar/StickyBar';
import SchemeModal from '../SchemeModal/SchemeModal';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import NoticeButton from '../NoticeButton/NoticeButton';
import NoticeForm from '../NoticeForm/NoticeForm';
import Tooltip from '../Tooltip/Tooltip';
import { avail, notAvail } from '../Utils';
import TooltipPerson from '../TooltipPerson/TooltipPerson';
import { HIDE_DELAY } from '../Constants/TooltipPerson';
import numToStr from '../Constants/NumToStr';
import RouteContext from '../contexts/RouteContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import { loadRoute } from '../../v1/stores/routes/utils';
import CtrlPressedContext from '../contexts/CtrlPressedContext';
import './RoutesShowModal.css';
import { ApiUrl } from '../Environ';
import getState from '../../v1/utils/getState';

class RoutesShowModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteComment: null,
      commentContent: '',
      numOfDisplayedComments: DEFAULT_COMMENTS_DISPLAYED,
      descriptionCollapsed: false,
      routeImageLoading: true,
      schemeModalVisible: false,
      showNoticeForm: false,
      showTooltip: false,
      showLikesTooltip: false,
      showRedpointsTooltip: false,
      showFlashesTooltip: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    const { loadRoute: loadRouteProp } = this.props;
    loadRouteProp(`${ApiUrl}/v1/routes/${this.getRouteId()}`);
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  getRouteId = () => {
    const { match } = this.props;
    return (
      match.params.route_id
        ? parseInt(match.params.route_id, 10)
        : null
    );
  };

  onKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape') {
      onClose();
    }
  };

  startAnswer = (quoteComment) => {
    this.setState({ quoteComment });
    this.textareaRef.focus();
  };

  removeQuoteComment = () => {
    this.setState({ quoteComment: null });
  };

  onCommentContentChange = (content) => {
    this.setState({ commentContent: content });
  };

  onDescriptionCollapseChange = (isCollapsed) => {
    this.setState({ descriptionCollapsed: isCollapsed });
  };

  showPreviousComments = (comments) => {
    this.setState(
      {
        descriptionCollapsed: true,
        numOfDisplayedComments: comments.length,
      },
    );
  };

  saveComment = (routeCommentId) => {
    const {
      routes,
      user,
      saveComment,
    } = this.props;
    const { commentContent } = this.state;
    const route = routes[this.getRouteId()];
    const params = {
      route_comment: {
        route_id: route.id,
        author_id: user.id,
        content: commentContent,
      },
    };
    if (routeCommentId !== null) {
      params.route_comment.route_comment_id = routeCommentId;
    }
    const self = this;
    saveComment(this.getRouteId(), params, () => {
      self.removeQuoteComment();
      self.onCommentContentChange('');
    });
  };

  pointers = () => {
    const { routes } = this.props;
    const route = routes[this.getRouteId()];
    const pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
      x: [],
      y: [],
      angle: [],
    };
    const mapIndexed = R.addIndex(R.map);
    return mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
  };

  setTextareaRef = (ref) => {
    this.textareaRef = ref;
  };

  canEditRoute = (user, route) => {
    if (user.role === 'admin' || user.role === 'creator') return true;
    if (user.role === 'user' && route.author_id === user.id) return true;
    return false;
  };

  hideLikesTooltip = () => {
    this.likesTimerId = setTimeout(() => this.setState({ showLikesTooltip: false }), HIDE_DELAY);
  };

  hideRedpointsTooltip = () => {
    this.redpointsTimerId = setTimeout(
      () => this.setState({ showRedpointsTooltip: false }),
      HIDE_DELAY,
    );
  };

  hideFlashesTooltip = () => {
    this.flashesTimerId = setTimeout(
      () => this.setState({ showFlashesTooltip: false }),
      HIDE_DELAY,
    );
  };

  showNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: true });
  };

  cancelNoticeForm = (event) => {
    event.stopPropagation();
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  submitNoticeForm = (msg) => {
    const { submitNoticeForm } = this.props;
    submitNoticeForm(this.getRouteId(), msg);
    this.setState({ showTooltip: false, showNoticeForm: false });
  };

  getRouteNumber = (route) => {
    if (route.number) {
      return `№ ${route.number}`;
    }
    if (route.id) {
      return `# ${route.id}`;
    }
    return '';
  };

  content = () => {
    const {
      onClose,
      routes,
      onLikeChange,
      user,
      removeRoute,
      openEdit,
      changeAscentResult,
      removeComment,
      goToProfile,
    } = this.props;
    const {
      descriptionCollapsed,
      numOfDisplayedComments,
      quoteComment,
      commentContent,
      routeImageLoading,
      schemeModalVisible,
      showLikesTooltip,
      showRedpointsTooltip,
      showFlashesTooltip,
      showNoticeForm,
      showTooltip,
    } = this.state;
    const route = routes[this.getRouteId()];
    const showLoadPhotoMsg = (
      ((route && !route.photo) || !routeImageLoading) && user && this.canEditRoute(user, route)
    );
    const routeId = this.getRouteId();
    const likes = avail(route) && avail(route.likes) && getArrayFromObject(route.likes);
    const numOfLikes = (avail(likes) && likes.length);
    const like = (
      notAvail(user) || notAvail(likes)
        ? undefined
        : R.find(R.propEq('user_id', user.id))(likes)
    );
    const ascents = avail(route) && avail(route.ascents) && getArrayFromObject(route.ascents);
    const redpoints = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'red_point'),
      ascents,
    );
    const numOfRedpoints = (avail(redpoints) && redpoints.length) || 0;
    const flashes = avail(route) && avail(ascents) && R.filter(
      R.propEq('result', 'flash'),
      ascents,
    );
    const numOfFlash = (avail(flashes) && flashes.length) || 0;
    return (
      <div className="modal-overlay__wrapper">
        <div className="modal modal-overlay__modal">
          <div className="modal-block__close">
            <CloseButton
              onClick={
                schemeModalVisible
                  ? () => this.setState({ schemeModalVisible: false })
                  : () => onClose()
              }
            />
          </div>
          {
            (user && avail(user)) && <div
              className="modal-block__notice"
              onMouseEnter={() => this.setState({ showTooltip: true })}
              onMouseLeave={() => this.setState({ showTooltip: false })}
              onClick={event => event.stopPropagation()}
            >
              <NoticeButton onClick={this.showNoticeForm} />
              <div className="modal-block__notice-tooltip">
                {showTooltip && <Tooltip text="Сообщить об ошибке" />}
              </div>
              {
                showNoticeForm && <NoticeForm
                  submit={this.submitNoticeForm}
                  cancel={this.cancelNoticeForm}
                />
              }
            </div>
          }
          {
            schemeModalVisible
              ? (
                <SchemeModal
                  currentRoute={route}
                  save={() => this.setState({ schemeModalVisible: false })}
                  close={() => this.setState({ schemeModalVisible: false })}
                />
              )
              : (
                <>
                  {
                    avail(route) && <>
                      <div
                        className="modal__track-block"
                        role="button"
                        tabIndex={0}
                        style={{ outline: 'none' }}
                        onMouseOver={() => {
                          this.mouseOver = true;
                        }}
                        onMouseLeave={() => {
                          this.mouseOver = false;
                        }}
                      >
                        <div className="modal__track">
                          <ShowSchemeButton
                            disabled={!route.data || route.data.position === undefined}
                            onClick={() => this.setState({ schemeModalVisible: true })}
                          />
                          {
                            showLoadPhotoMsg && (
                              <div className="modal__track-descr">
                                <div className="modal__track-descr-picture" />
                                <div className="modal__track-descr-text">Загрузите фото трассы</div>
                              </div>
                            )
                          }
                          {
                            route && route.photo
                              ? (
                                <RouteEditor
                                  routePhoto={route.photo.url}
                                  pointers={this.pointers()}
                                  editable={false}
                                  routeImageLoading={routeImageLoading}
                                  onImageLoad={() => this.setState({ routeImageLoading: false })}
                                />
                              )
                              : ''
                          }
                        </div>
                        <div
                          className="modal__track-footer"
                        >
                          <div className="modal__track-information">
                            <div
                              className="modal__track-count"
                              onMouseEnter={() => this.setState({
                                showLikesTooltip: true,
                                showRedpointsTooltip: false,
                                showFlashesTooltip: false,
                              })}
                              onMouseLeave={this.hideLikesTooltip}
                            >
                              {
                                showLikesTooltip && <TooltipPerson
                                  cancelHide={() => clearTimeout(this.likesTimerId)}
                                  hide={this.hideLikesTooltip}
                                  position="left"
                                  title={numToStr(
                                    numOfLikes,
                                    [
                                      `Понравилось ${numOfLikes} человеку`,
                                      `Понравилось ${numOfLikes} людям`,
                                      `Понравилось ${numOfLikes} людям`,
                                    ],
                                  )}
                                  users={R.map(l => l.user, likes || [])}
                                />
                              }
                              <LikeButton
                                numOfLikes={numOfLikes}
                                isLiked={like !== undefined}
                                onChange={
                                  !user
                                    ? null
                                    : afterChange => onLikeChange(
                                      routeId, afterChange,
                                    )
                                }
                              />
                            </div>
                            <div
                              className="modal__track-count"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => this.setState({
                                showLikesTooltip: false,
                                showRedpointsTooltip: true,
                                showFlashesTooltip: false,
                              })}
                              onMouseLeave={this.hideRedpointsTooltip}
                            >
                              {
                                showRedpointsTooltip && <TooltipPerson
                                  cancelHide={() => clearTimeout(this.redpointsTimerId)}
                                  hide={this.hideRedpointsTooltip}
                                  title={numToStr(
                                    numOfRedpoints,
                                    [
                                      `Пролез ${numOfRedpoints} человек`,
                                      `Пролезли ${numOfRedpoints} человека`,
                                      `Пролезли ${numOfRedpoints} человек`,
                                    ],
                                  )}
                                  users={R.map(redpoint => redpoint.user, redpoints || [])}
                                />
                              }
                              <Counter number={numOfRedpoints} text="redpoints" />
                            </div>
                            <div
                              className="modal__track-count"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => this.setState({
                                showLikesTooltip: false,
                                showRedpointsTooltip: false,
                                showFlashesTooltip: true,
                              })}
                              onMouseLeave={this.hideFlashesTooltip}
                            >
                              {
                                showFlashesTooltip && <TooltipPerson
                                  cancelHide={() => clearTimeout(this.flashesTimerId)}
                                  hide={this.hideFlashesTooltip}
                                  title={numToStr(
                                    numOfFlash,
                                    [
                                      `Флешанул ${numOfFlash} человек`,
                                      `Флешанули ${numOfFlash} человека`,
                                      `Флешанули ${numOfFlash} человек`,
                                    ],
                                  )}
                                  users={R.map(flash => flash.user, flashes || [])}
                                />
                              }
                              <Counter number={numOfFlash} text="flash" />
                            </div>
                          </div>
                          <CtrlPressedContext.Consumer>
                            {
                              ({ ctrlPressed }) => (
                                <>
                                  {
                                    (user && this.canEditRoute(user, route)) && (
                                      ctrlPressed
                                        ? (
                                          <Button
                                            size="small"
                                            style="normal"
                                            title="Удалить"
                                            onClick={() => removeRoute(routeId)}
                                          />
                                        )
                                        : (
                                          <Button
                                            size="small"
                                            style="normal"
                                            title="Редактировать"
                                            onClick={() => openEdit(routeId)}
                                          />
                                        )
                                    )
                                  }
                                </>
                              )
                            }
                          </CtrlPressedContext.Consumer>
                        </div>
                      </div>
                      <div
                        className="modal__track-info"
                        onMouseOver={() => {
                          this.mouseOver = true;
                        }}
                        onMouseLeave={() => {
                          this.mouseOver = false;
                        }}
                      >
                        <div className="modal__track-status">
                          {
                            user && (
                              <RouteStatus
                                changeAscentResult={() => changeAscentResult(routeId)}
                              />
                            )
                          }
                        </div>
                        <div className="modal__track-header">
                          <h1 className="modal__title">
                            {this.getRouteNumber(route)}
                            <span className="modal__title-place-wrapper">
                              <span className="modal__title-place">
                                {route.name ? `(“${route.name}”)` : ''}
                              </span>
                            </span>
                          </h1>
                          <RouteDataTable route={route} user={user} />
                        </div>
                        <div className="modal__item modal__descr-item">
                          <CollapsableBlock
                            title="Описание"
                            isCollapsed={descriptionCollapsed}
                            onCollapseChange={this.onDescriptionCollapseChange}
                            text={route.description ? route.description : ''}
                          />
                        </div>
                        <div className="modal__item">
                          <CommentBlock
                            startAnswer={this.startAnswer}
                            user={user}
                            removeComment={comment => removeComment(routeId, comment)}
                            allShown={
                              (route.comments || []).length === R.min(
                                numOfDisplayedComments,
                                (route.comments || []).length,
                              )
                            }
                            showPrevious={() => this.showPreviousComments(route.comments || [])}
                            onCollapseChange={this.onDescriptionCollapseChange}
                            comments={
                              R.slice(
                                (route.comments || []).length - R.min(
                                  numOfDisplayedComments,
                                  (route.comments || []).length,
                                ),
                                (route.comments || []).length,
                                route.comments || [],
                              )
                            }
                            objectListTitle="route_comments"
                          />
                        </div>
                        <div className="modal__enter-comment">
                          <CommentForm
                            quoteComment={quoteComment}
                            setTextareaRef={this.setTextareaRef}
                            goToProfile={goToProfile}
                            user={user}
                            content={commentContent}
                            saveComment={this.saveComment}
                            onContentChange={this.onCommentContentChange}
                            removeQuoteComment={this.removeQuoteComment}
                          />
                        </div>
                      </div>
                    </>
                  }
                </>
              )
          }
        </div>
      </div>
    );
  };

  render() {
    const {
      onClose, loading, routes,
    } = this.props;
    const route = routes[this.getRouteId()];
    return (
      <RouteContext.Provider value={{ route }}>
        <div
          className="modal-overlay"
          onClick={() => {
            if (!this.mouseOver) {
              onClose();
            }
          }}
        >
          <StickyBar
            loading={loading}
            hideLoaded
          >
            {this.content()}
          </StickyBar>
        </div>
      </RouteContext.Provider>
    );
  }
}

RoutesShowModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  openEdit: PropTypes.func.isRequired,
  removeRoute: PropTypes.func.isRequired,
  goToProfile: PropTypes.func.isRequired,
  removeComment: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  onLikeChange: PropTypes.func.isRequired,
  changeAscentResult: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitNoticeForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  loadRoute: (url, afterLoad) => dispatch(loadRoute(url, afterLoad)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesShowModal));
