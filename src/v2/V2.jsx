import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import BootingScreen from './screens/BootingScreen';
import Users from './screens/Users';
import UserShow from './screens/UserShow';
import SpotsShow from './screens/SpotsShow';
import SpotsIndex from './screens/SpotsIndex';
import WallPhotos from './screens/WallPhotos';
import { currentUser as currentUserObtainer } from './redux/user_session/utils';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
import CtrlPressedCatcher from './components/common/CtrlPressedCatcher/CtrlPressedCatcher';
import LoginVKError from '@/v2/components/LoginVK/LoginVKError';
import LoginVKSuccess from '@/v2/components/LoginVK/LoginVKSuccess';
import GymBasicInfoBlockExample from
  '@/v2/screens/GymBasicInfoBlockExample/GymBasicInfoBlockExample';


const V2 = ({ currentUser }) => (
  <CtrlPressedCatcher>
    {
      currentUser !== undefined ? (
        <Switch>
          <Route path="/users/:user_id" component={UserShow} />
          <Route path="/users" component={Users} />
          <Route exact path={['/', '/spots']} component={SpotsIndex} />
          <Route path="/spots/:id/sectors/:sector_id/photos" component={WallPhotos} />
          <Route path="/spots/:id/sectors/:sector_id" component={SpotsShow} />
          <Route path="/spots/:id" component={SpotsShow} />
          <Route path="/gyms/:gym_id" component={GymBasicInfoBlockExample} />
          <Route exact path="/about" component={About} />
          <Route exact path="/faq" component={Faq} />
          <Route path="/error" component={LoginVKError} />
          <Route path="/integrations/vk/actions/success" component={LoginVKSuccess} />
        </Switch>
      ) : (
        <BootingScreen />
      )
    }
  </CtrlPressedCatcher>
);

const mapStateToProps = state => ({
  currentUser: currentUserObtainer(state),
});

export default connect(mapStateToProps)(V2);
