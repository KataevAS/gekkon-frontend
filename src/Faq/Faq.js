import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import Cookies from 'js-cookie';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import Footer from '../Footer/Footer';
import BaseComponent from '../BaseComponent';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import StickyBar from '../StickyBar/StickyBar';
import { TITLE, TITLES, FAQ_DATA } from '../Constants/Faq';
import { avail } from '../Utils';
import { signIn } from '../../v1/stores/users/utils';
import { logOutUser } from '../../v1/stores/users/actions';
import getState from '../../v1/utils/getState';

class Faq extends BaseComponent {
  componentDidMount() {
    const {
      history,
      signIn: signInProp,
      logOutUser: logOutUserProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    if (Cookies.get('user_session_token') !== undefined) {
      signInProp();
    } else {
      logOutUserProp();
    }
  }

  changeNameFilter = () => {
  };

  content = () => {
    const { user } = this.props;
    const {
      signUpIsWaiting,
      signUpFormVisible,
      logInIsWaiting,
      logInFormVisible,
      profileFormVisible,
      signUpFormErrors,
      logInFormErrors,
      profileFormErrors,
      profileIsWaiting,
    } = this.state;
    return (
      <>
        {
          signUpFormVisible && (
            <SignUpForm
              onFormSubmit={this.submitSignUpForm}
              closeForm={this.closeSignUpForm}
              enterWithVk={this.enterWithVk}
              isWaiting={signUpIsWaiting}
              formErrors={signUpFormErrors}
              resetErrors={this.signUpResetErrors}
            />
          )
        }
        {
          logInFormVisible && (
            <LogInForm
              onFormSubmit={this.submitLogInForm}
              closeForm={this.closeLogInForm}
              enterWithVk={this.enterWithVk}
              isWaiting={logInIsWaiting}
              resetPassword={this.resetPassword}
              formErrors={logInFormErrors}
              resetErrors={this.logInResetErrors}
            />
          )
        }
        {
          (avail(user) && profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              showToastr={this.showToastr}
              enterWithVk={this.enterWithVk}
              isWaiting={profileIsWaiting}
              closeForm={this.closeProfileForm}
              formErrors={profileFormErrors}
              resetErrors={this.profileResetErrors}
            />
          )
        }
        <ToastContainer
          ref={(ref) => {
            this.container = ref;
          }}
          onClick={() => this.container.clear()}
          className="toast-top-right"
        />
        <InfoPageHeader
          changeNameFilter={this.changeNameFilter}
          user={user}
          openProfile={this.openProfileForm}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
          title={TITLE}
          image={require('./images/faq.jpg')}
        />
        <InfoPageContent titles={TITLES} data={FAQ_DATA} />
      </>
    );
  };

  render() {
    const { user, loading } = this.props;
    const {
      signUpFormVisible,
      logInFormVisible,
      profileFormVisible,
    } = this.state;
    const showModal = signUpFormVisible || logInFormVisible || profileFormVisible;
    return (
      <div className={showModal ? null : 'page__scroll'}>
        <StickyBar loading={loading}>
          {this.content()}
        </StickyBar>
        <Footer
          user={user}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  signIn: (afterSignIn) => dispatch(signIn(afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Faq));
