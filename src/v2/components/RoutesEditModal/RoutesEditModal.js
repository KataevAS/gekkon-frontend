import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Button from '@/v1/components/Button/Button';
import RouteDataEditableTable from '@/v1/components/RouteDataEditableTable/RouteDataEditableTable';
import RouteEditor from '../RouteEditor/RouteEditor';
import CloseButton from '../CloseButton/CloseButton';
import ButtonHandler from '@/v1/components/ButtonHandler/ButtonHandler';
import { DEFAULT_CATEGORY } from '@/v1/Constants/Categories';
import RoutePhotoCropper from '@/v1/components/RoutePhotoCropper/RoutePhotoCropper';
import {
  isNeeded as exifRotateIgnoredIsNeeded,
  fixRoutePhotoUpdateParams,
} from '@/v1/Workarounds/EXIFRotateIgnored';
import SchemeModal from '../SchemeModal/SchemeModal';
import ShowSchemeButton from '../ShowSchemeButton/ShowSchemeButton';
import RouteContext from '@/v1/contexts/RouteContext';
import NewRoute from '@/v1/Constants/NewRoute';
import { avail } from '@/v1/utils';
import { StyleSheet, css } from '../../aphrodite';
import { loadRouteMarkColors } from '@/v1/stores/route_mark_colors/utils';
import { loadUsers } from '@/v1/stores/users/utils';
import { loadSector } from '@/v1/stores/sectors/utils';
import {
  addRoute as addRouteAction,
  loadRoute as loadRouteAction,
  updateRoute as updateRouteAction,
} from '@/v2/redux/routes/actions';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { NUM_OF_DAYS } from '@/v1/Constants/Route';
import { ApiUrl } from '@/v1/Environ';
import reloadSector from '@/v1/utils/reloadSector';
import reloadRoutes from '@/v2/utils/reloadRoutes';

class RoutesEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPointers: [],
      currentPointersOld: [],
      route: undefined,
      fieldsOld: {},
      showCropper: false,
      photo: {
        content: null,
        file: null,
        crop: null,
        rotate: null,
      },
      routeImageLoading: true,
      schemeModalVisible: false,
      isWaiting: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    const {
      sectors,
      match,
      loadUsers: loadUsersProp,
      routeMarkColors,
      loadRoute,
      loadSector: loadSectorProp,
      loadRouteMarkColors: loadRouteMarkColorsProp,
    } = this.props;
    const sectorId = match.params.sector_id ? parseInt(match.params.sector_id, 10) : null;
    const routeId = this.getRouteId();
    if (routeId === null && !sectors[sectorId]) {
      const params = {};
      params.numOfDays = NUM_OF_DAYS;
      loadSectorProp(
        `${ApiUrl}/v1/sectors/${sectorId}`,
        params,
        (response) => {
          this.afterSectorIsLoaded(response.data.payload);
        },
      );
    }
    if (routeId === null && sectors[sectorId]) {
      this.afterSectorIsLoaded(sectors[sectorId]);
    }
    if (routeId) {
      loadRoute(
        this.getRouteId(),
        (payload) => {
          const route = payload;
          const routeCopy = R.clone(route);
          if (route.photo) {
            routeCopy.photo = routeCopy.photo.url;
          }
          if (route.category === null) {
            routeCopy.category = DEFAULT_CATEGORY;
          }
          this.setState({ fieldsOld: routeCopy, route: R.clone(routeCopy) });
          this.loadPointers(route);
        },
      );
    }
    loadUsersProp();
    if (routeMarkColors.length === 0) {
      loadRouteMarkColorsProp();
    }
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  afterSectorIsLoaded = (sector) => {
    const { user } = this.props;
    this.newRoute = R.clone(NewRoute);
    this.newRoute.sector_id = sector.id;
    if (sector.kind !== 'mixed') {
      this.newRoute.kind = sector.kind;
    }
    this.newRoute.category = DEFAULT_CATEGORY;
    if (user.role === 'user') this.newRoute.data.personal = true;
    this.setState({ route: R.clone(this.newRoute) });
  };

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

  updateRoute = (params) => {
    const {
      history,
      match,
      sectors,
      updateRoute,
    } = this.props;
    const routeId = this.getRouteId();
    this.setState({ isWaiting: true });
    updateRoute(
      routeId,
      params,
      (payload) => {
        history.push(R.replace('/edit', '', `${match.url}`));
        reloadSector(payload.sector_id);
        reloadRoutes(
          sectors[payload.sector_id].spot_id, payload.sector_id,
        );
      },
      () => this.setState({ isWaiting: false }),
    );
  };

  createRoute = (params) => {
    const {
      history,
      match,
      sectors,
      addRoute,
    } = this.props;
    this.setState({ isWaiting: true });
    addRoute(
      params,
      (payload) => {
        history.push(
          R.replace('new', payload.id, `${match.url}`),
        );
        reloadSector(payload.sector_id);
        reloadRoutes(
          sectors[payload.sector_id].spot_id, payload.sector_id,
        );
      },
      () => this.setState({ isWaiting: false }),
    );
  };

  changed = (newValue, oldValue) => JSON.stringify(newValue) !== JSON.stringify(oldValue);

  save = () => {
    const {
      routes, sectors, user,
    } = this.props;
    const {
      currentPointers, currentPointersOld, route, photo,
    } = this.state;
    const sector = sectors[route.sector_id];
    const routeId = this.getRouteId();
    const routeProp = routeId ? routes[routeId] : this.newRoute;
    const paramList = [
      'number',
      'name',
      'author_id',
      'category',
      'kind',
      'installed_at',
      'installed_until',
      'description',
    ];
    const formData = new FormData();
    const pointersChanged = this.changed(currentPointers, currentPointersOld);
    const holdsColorsChanged = this.changed(routeProp.holds_color, route.holds_color);
    const marksColorsChanged = this.changed(routeProp.marks_color, route.marks_color);
    if (pointersChanged || holdsColorsChanged || marksColorsChanged) {
      const x = R.map(pointer => pointer.x, currentPointers);
      const y = R.map(pointer => pointer.y, currentPointers);
      const angle = R.map(pointer => pointer.angle, currentPointers);
      if (route.holds_color) {
        formData.append('route[mark][colors][holds]', route.holds_color.id);
      }
      if (route.marks_color) {
        formData.append('route[mark][colors][marks]', route.marks_color.id);
      }
      for (const i in x) {
        formData.append('route[mark][pointers][x][]', x[i]);
        formData.append('route[mark][pointers][y][]', y[i]);
        formData.append('route[mark][pointers][angle][]', angle[i]);
      }
    }
    for (const i in paramList) {
      if (routeProp[paramList[i]] !== route[paramList[i]]) {
        formData.append(`route[${paramList[i]}]`, route[paramList[i]]);
      }
    }
    if (route.id === null) {
      formData.append('route[sector_id]', route.sector_id);
      if (sector.kind !== 'mixed') {
        formData.append('route[kind]', route.kind);
      }
      formData.append('route[category]', route.category);
    }
    if (route.photo !== (routeProp.photo ? routeProp.photo.url : null)) {
      formData.append('route[photo]', route.photoFile);
    }
    if (photo.crop !== null) {
      formData.append('data[photo][cropping][x]', Math.round(photo.crop.x));
      formData.append('data[photo][cropping][y]', Math.round(photo.crop.y));
      formData.append('data[photo][cropping][width]', Math.round(photo.crop.width));
      formData.append('data[photo][cropping][height]', Math.round(photo.crop.height));
    }
    if (photo.rotate !== null) {
      formData.append('data[photo][rotation]', photo.rotate);
    }
    if (routeProp.data.personal || user.id === route.author_id) {
      formData.append('data[personal]', true);
    }
    if (JSON.stringify(routeProp.data.position) !== JSON.stringify(route.data.position)) {
      formData.append('data[position][left]', route.data.position.left);
      formData.append('data[position][top]', route.data.position.top);
    }
    if (routeProp.id !== null) {
      this.updateRoute(formData);
    } else {
      this.createRoute(formData);
    }
  };

  loadPointers = (currentRoute) => {
    let route;
    if (currentRoute) {
      route = currentRoute;
    } else {
      const { routes } = this.props;
      const routeId = this.getRouteId();
      route = routeId ? routes[routeId] : this.newRoute;
    }
    let pointers = (route.mark && route.mark.pointers) ? route.mark.pointers : {
      x: [],
      y: [],
      angle: [],
    };
    const mapIndexed = R.addIndex(R.map);
    pointers = mapIndexed((x, index) => ({
      x: parseFloat(x),
      y: parseFloat(pointers.y[index]),
      dx: 0,
      dy: 0,
      angle: parseInt(pointers.angle[index], 10),
    }), pointers.x);
    this.setState({ currentPointers: pointers, currentPointersOld: pointers });
  };

  updatePointers = (pointers) => {
    this.setState({ currentPointers: pointers });
  };

  onRouteParamChange = (value, paramName) => {
    if (paramName === 'author') {
      this.setState(state => ({ route: { ...state.route, author_id: value.id } }));
    }
    if (paramName === 'photo' && value === null) {
      this.setState(state => ({ route: { ...state.route, photoFile: null } }));
    }
    this.setState(state => ({ route: { ...state.route, [paramName]: value } }));
  };

  onFileRead = () => {
    const { photo } = this.state;
    const photoCopy = R.clone(photo);
    photoCopy.content = this.fileReader.result;
    this.mouseOver = false;
    this.setState({ showCropper: true, photo: photoCopy });
  };

  onFileChosen = (file) => {
    const { photo } = this.state;
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.onFileRead;
    this.fileReader.readAsDataURL(file);
    const photoCopy = R.clone(photo);
    photoCopy.file = file;
    this.setState({ photo: photoCopy });
  };

  saveCropped = (src, crop, rotate, image, exifAngle) => {
    const { route, photo } = this.state;
    route.photo = src;
    route.photoFile = photo.file;
    const isFullWidth = Math.abs(image.width - crop.width) < 1;
    const isFullHeight = Math.abs(image.height - crop.height) < 1;
    if (crop.width === 0 || crop.height === 0 || (isFullWidth && isFullHeight)) {
      let photoCopy = R.clone(photo);
      photoCopy.crop = null;
      photoCopy.rotate = (rotate === 0 ? null : rotate);
      if (exifRotateIgnoredIsNeeded(exifAngle)) {
        photoCopy = fixRoutePhotoUpdateParams(exifAngle, photoCopy);
      }
      this.setState({ route, showCropper: false, photo: photoCopy });
    } else {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      let photoCopy = R.clone(photo);
      photoCopy.crop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      };
      photoCopy.rotate = (rotate === 0 ? null : rotate);
      if (exifRotateIgnoredIsNeeded(exifAngle)) {
        photoCopy = fixRoutePhotoUpdateParams(exifAngle, photoCopy);
      }
      this.setState({ route, showCropper: false, photo: photoCopy });
    }
  };

  saveRoutePositionAndClose = (position) => {
    const { route } = this.state;
    const data = R.clone(route.data);
    data.position = R.clone(position);
    this.onRouteParamChange(data, 'data');
    this.setState({ schemeModalVisible: false });
  };

  resetRoutePositionAndClose = () => {
    this.setState({ schemeModalVisible: false });
  };

  content = () => {
    const {
      onClose,
      cancel,
      user,
      routeMarkColors,
      users,
    } = this.props;
    const {
      route,
      fieldsOld,
      currentPointers,
      currentPointersOld,
      routeImageLoading,
      schemeModalVisible,
      isWaiting,
    } = this.state;
    const routeChanged = JSON.stringify(route) !== JSON.stringify(fieldsOld);
    const markChanged = JSON.stringify(currentPointers) !== JSON.stringify(currentPointersOld);
    const saveDisabled = (!routeChanged && !markChanged);
    const iconImage = require('../../../../img/btn-handler/btn-handler-sprite.svg');
    return (
      <div className={css(styles.modalOverlayWrapper)}>
        <div className={css(styles.modal, styles.modalOverlayModal)}>
          <div className="modal-block__close">
            <CloseButton
              onClick={
                schemeModalVisible
                  ? this.resetRoutePositionAndClose
                  : () => onClose()
              }
            />
          </div>
          {
            schemeModalVisible
              ? (
                <SchemeModal
                  currentRoute={route}
                  editable
                  save={this.saveRoutePositionAndClose}
                  close={this.resetRoutePositionAndClose}
                />
              )
              : (
                <>
                  {
                    avail(route) && <>
                      <div
                        className={css(styles.modalTrackBlock)}
                        onMouseOver={() => {
                          this.mouseOver = true;
                        }}
                        onMouseLeave={() => {
                          this.mouseOver = false;
                        }}
                      >
                        <div className={css(styles.modalTrack)}>
                          <ShowSchemeButton
                            onClick={() => this.setState({schemeModalVisible: true})}
                          />
                          {
                            ((route && !route.photo) || !routeImageLoading) && (
                              <div className={css(styles.modalTrackDescr)}>
                                <div className={css(styles.modalTrackDescrPicture)} />
                                <div className={css(styles.modalTrackDescrText)}>
                                  Загрузите фото трассы
                                </div>
                              </div>
                            )
                          }
                          {
                            route && route.photo
                              ? (
                                <RouteEditor
                                  routePhoto={
                                    typeof (route.photo) === 'string'
                                      ? route.photo
                                      : route.photo.url
                                  }
                                  pointers={currentPointers}
                                  editable
                                  updatePointers={this.updatePointers}
                                  routeImageLoading={routeImageLoading}
                                  onImageLoad={() => this.setState({ routeImageLoading: false })}
                                />
                              )
                              : ''
                          }
                          <div className={css(styles.btnHandlerTrackToggles)}>
                            <input
                              type="file"
                              hidden
                              ref={(ref) => {
                                this.fileInput = ref;
                              }}
                              onChange={event => this.onFileChosen(event.target.files[0])}
                            />
                            {
                              route && route.photo
                                ? (
                                  <React.Fragment>
                                    <ButtonHandler
                                      onClick={() => this.fileInput.click()}
                                      title="Обновить фото"
                                      xlinkHref={`${iconImage}#icon-btn-reload`}
                                    />
                                    <ButtonHandler
                                      onClick={
                                        () => this.onRouteParamChange(null, 'photo')
                                      }
                                      title="Удалить фото"
                                      xlinkHref={`${iconImage}#icon-btn-close`}
                                    />
                                  </React.Fragment>
                                )
                                : (
                                  <ButtonHandler
                                    onClick={() => this.fileInput.click()}
                                    title="Загрузить фото"
                                    xlinkHref={`${iconImage}#icon-btn-download`}
                                  />
                                )
                            }
                          </div>
                        </div>
                        <div
                          className={css(styles.modalTrackFooter,styles.modalTrackFooterEditMode)}
                        >
                          <div className={css(styles.modalTrackFooterEditModeItem)}>
                            <Button
                              size="small"
                              style="gray"
                              title="Отмена"
                              onClick={cancel}
                            />
                          </div>
                          <div className={css(styles.modalTrackFooterEditModeItem)}>
                            <Button
                              size="small"
                              style="normal"
                              title="Сохранить"
                              isWaiting={isWaiting}
                              disabled={saveDisabled}
                              onClick={this.save}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={css(styles.modalTrackInfo)}
                        onMouseOver={() => {
                          this.mouseOver = true;
                        }}
                        onMouseLeave={() => {
                          this.mouseOver = false;
                        }}
                      >
                        <div className={css(styles.modalTrackHeader)}>
                          <h1 className={css(styles.modalTitle)}>
                            {'№ '}
                            <input
                              type="text"
                              onChange={
                                event => this.onRouteParamChange(
                                  event.target.value,
                                  'number',
                                )
                              }
                              className={css(
                                styles.modalTitleInput,
                                styles.modalNumberInput,
                                styles.modalTitleInputDark,
                              )}
                              maxLength="6"
                              value={route.number ? route.number : ''}
                            />
                            <span className={css(styles.modalTitlePlace)}>(“</span>
                            <input
                              type="text"
                              onChange={
                                event => this.onRouteParamChange(
                                  event.target.value,
                                  'name',
                                )
                              }
                              className={css(styles.modalTitleInput)}
                              value={route.name ? route.name : ''}
                            />
                            <span className={css(styles.modalTitlePlace)}>”)</span>
                          </h1>
                          <RouteDataEditableTable
                            onRouteParamChange={this.onRouteParamChange}
                            user={user}
                            routeMarkColors={routeMarkColors}
                            users={users}
                          />
                        </div>
                        <div className={css(styles.modalItem, styles.modalDescrItem)}>
                          <div>
                            <button
                              type="button"
                              className={css(
                                styles.collapsableBlockHeader,
                                styles.collapsableBlockHeaderEdit,
                              )}
                            >
                              Описание
                            </button>
                            <textarea
                              className={css(styles.modalDescrEdit)}
                              onChange={
                                event => this.onRouteParamChange(
                                  event.target.value,
                                  'description',
                                )
                              }
                              value={route.description ? route.description : ''}
                            />
                          </div>
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
    const { onClose } = this.props;
    const {
      showCropper,
      photo,
      route,
    } = this.state;
    return (
      <RouteContext.Provider value={{ route }}>
        <div
          className={css(styles.modalOverlay)}
          onClick={showCropper ? null : () => {
            if (!this.mouseOver) {
              onClose();
            }
          }}
        >
          {
            showCropper
              ? (
                <RoutePhotoCropper
                  src={photo.content}
                  close={() => this.setState({ showCropper: false })}
                  save={this.saveCropped}
                />
              )
              : (
                <>
                  {this.content()}
                </>
              )
          }
        </div>
      </RouteContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    display: 'block',
    position: 'fixed',
    top: '0',
    left: '0',
    overflow: 'auto',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    zIndex: '100',
  },
  modalOverlayWrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingLeft: '70px',
    paddingRight: '70px',
    width: '100%',
    maxWidth: '1464px',
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100%',
    minWidth: '1100px',
  },
  modalOverlayModal: {
    '@media screen and (min-width: 1920px)': {
      alignSelf: 'center',
    },
  },
  modal: {
    maxWidth: '1320px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    position: 'relative',
    minHeight: '800px',
    minWidth: '960px',
    maxHeight: '1050px',
    height: '95vh',
    '@media screen and (max-width: 1600px)': {
      minHeight: '700px',
    },
    '@media screen and (max-width: 1440px)': {
      minHeight: '600px',
    },
  },
  modalTrackBlock: {
    maxWidth: '530px',
    flexBasis: '45%',
    width: '100%',
    height: '100%',
    backgroundColor: '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
  },
  modalTrackInfo: {
    paddingTop: '45px',
    width: '55%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    backgroundColor: '#ffffff',
    '@media screen and (max-width: 1440px)': {
      minWidth: '410px',
      paddingTop: '24px',
    },
  },
  modalTrackHeader: {
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingBottom: '15px',
    width: '100%',
    boxSizing: 'border-box',
    '@media screen and (max-width: 1440px)': {
      paddingBottom: '6px',
      paddingLeft: '32px',
      paddingRight: '32px',
    },
  },
  modalTrackFooter: {
    padding: '33px 30px',
    alignSelf: 'flex-end',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '@media screen and (max-width: 1440px)': {
      padding: '16px 24px',
    },
  },
  modalTrackFooterEditMode: {
    justifyContent: 'flex-end',
  },
  modalTrackFooterEditModeItem: {
    ':not(:first-child)': {
      marginLeft: '10px',
    },
    ':not(:last-child)': {
      marginRight: '10px',
    },
  },
  modalTrack: {
    width: '100%',
    height: 'calc(100% - 104px)',
    backgroundColor: '#F3F3F3',
    overflow: 'hidden',
    display: 'block',
    alignItems: 'center',
    position: 'relative',
    '@media screen and (max-width: 1440px)': { height: 'calc(100% - 70px)' },
  },
  modalTrackDescr: {
    position: 'absolute',
    content: '\'\'',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: '1',
  },
  modalTrackDescrPicture: {
    width: '118px',
    height: '118px',
    borderRadius: '50%',
    border: '4px solid #797979',
    position: 'relative',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      width: '4px',
      height: '50px',
      left: '50%',
      top: '50%',
      backgroundColor: '#797979',
      transform: 'translate(-50%, -50%)',
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      width: '4px',
      height: '50px',
      left: '50%',
      top: '50%',
      backgroundColor: '#797979',
      transform: 'translate(-50%, -50%) rotate(90deg)',
    },
  },
  modalTrackDescrText: {
    fontFamily: ['GilroyBold', 'sans-serif'],
    fontSize: '30px',
    color: '#797979',
    marginTop: '30px',
  },
  modalItem: {
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingTop: '15px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    '@media screen and (max-width: 1440px)': {
      paddingLeft: '32px',
      paddingRight: '32px',
      paddingTop: '6px',
      paddingBottom: '6px',
    },
  },
  modalDescrItem: {
    flexShrink: '0',
    flexGrow: '0',
    paddingBottom: '15px',
    '@media screen and (max-width: 1440px)': {
      paddingBottom: '6px',
    },
  },
  modalTitle: {
    color: '#1f1f1f',
    fontSize: '30px',
    fontFamily: ['GilroyBold', 'sans-serif'],
    marginTop: '0',
    marginBottom: '30px',
    paddingRight: '100px',
    '@media screen and (max-width: 1440px)': {
      display: 'block',
      paddingRight: '0',
      fontSize: '24px',
      marginBottom: '12px',
    },
  },
  modalTitlePlace: {
    color: '#797979',
    '@media screen and (max-width: 1440px)': {
      marginTop: '12px',
    },
  },
  modalTitleInput: {
    border: 'none',
    fontSize: '30px',
    color: '#797979',
    fontFamily: ['GilroyBold', 'sans-serif'],
    outline: 'none',
    maxWidth: '200px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    '@media screen and (max-width: 1440px)': {
      fontSize: '24px',
    },
    ':hover': {
      borderBottom: '2px solid #E3E3E3',
    },
  },
  modalNumberInput: {
    maxWidth: '100px',
  },
  modalTitleInputDark: {
    color: '#1f1f1f',
  },
  modalDescrEdit: {
    width: '100%',
    height: '150px',
    marginTop: '15px',
    border: '1px solid #DDE2EF',
    outline: 'none',
    transition: 'boxShadow .4s ease-out',
    resize: 'none',
    padding: '20px 20px',
    boxSizing: 'border-box',
    color: '#828282',
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    overflowX: 'hidden',
    '@media screen and (max-width: 1440px)': {
      marginTop: '8px',
      fontSize: '14px',
      padding: '14px',
    },
    ':focus': {
      boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)',
    },
  },
  collapsableBlockHeader: {
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    outline: 'none',
    padding: '0',
    width: '100%',
    textAlign: 'left',
    position: 'relative',
    paddingRight: '15px',
    cursor: 'pointer',
    fontSize: '22px',
    color: '#1f1f1f',
    fontFamily: 'GilroyBold',
    lineHeight: '1.3em',
    '@media screen and (max-width: 1440px)': {
      fontSize: '18px',
      ':after': {
        top: '7px',
      },
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      display: 'block',
      width: '10px',
      height: '7px',
      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20d%3D%22M5%207.1875L-6.01031e-08%202.1875L1.3125%200.8125L5%204.5L8.6875%200.8125L10%202.1875L5%207.1875Z%22%20fill%3D%22%231F1F1F%22/%3E%0A%3C/svg%3E%0A")',
      backgroundRepeat: 'no-repeat',
      right: '0px',
      top: '12px',
    },
  },
  collapsableBlockHeaderEdit: {
    cursor: 'default',
    ':after': {
      display: 'none',
    },
  },
  btnHandlerTrackToggles: {
    position: 'absolute',
    content: '\'\'',
    right: '25px',
    top: '25px',
    display: 'flex',
    zIndex: '3',
  },
});


RoutesEditModal.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  sectors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  routeMarkColors: PropTypes.array,
};

const mapStateToProps = state => ({
  sectors: state.sectorsStore.sectors,
  routes: state.routesStoreV2.routes,
  user: state.usersStore.users[state.usersStore.currentUserId],
  users: getArrayByIds(state.usersStore.sortedUserIds, state.usersStore.users),
  routeMarkColors: state.routeMarkColorsStore.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  loadRouteMarkColors: () => dispatch(loadRouteMarkColors()),
  loadUsers: () => dispatch(loadUsers()),
  loadSector: (url, params, afterLoad) => dispatch(loadSector(url, params, afterLoad)),
  loadRoute: (id, afterLoad) => dispatch(loadRouteAction(id, afterLoad)),
  updateRoute: (id, params, afterSuccess, afterAll) => dispatch(
    updateRouteAction(id, params, afterSuccess, afterAll),
  ),
  addRoute: (params, afterSuccess, afterAll) => dispatch(
    addRouteAction(params, afterSuccess, afterAll),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoutesEditModal));
