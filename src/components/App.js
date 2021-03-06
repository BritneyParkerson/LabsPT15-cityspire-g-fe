import React from 'react';
import { Route, useHistory, Switch, useParams } from 'react-router-dom';

import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import 'antd/dist/antd.less';
import 'mapbox-gl/dist/mapbox-gl.css';

import { CitySearchResultsPage } from './pages/CitySearchResults';
import { NotFoundPage } from './pages/NotFound';
import { ExampleListPage } from './pages/ExampleList';
import { HomePage } from './pages/Home';
import { ProfileListPage } from './pages/ProfileList';
import { LoginPage } from './pages/Login';
import { ExampleDataViz } from './pages/ExampleDataViz';
import { config } from '../utils/oktaConfig';
import { LoadingComponent } from './common';
import { UserDashboardPage } from './pages/UserDashboard';

const App = () => {
  // The reason to declare App this way is so that we can use any helper functions we'd need for business logic, in our case auth.
  // React Router has a nifty useHistory hook we can use at this level to ensure we have security around our routes.
  const history = useHistory();

  const authHandler = () => {
    // We pass this to our <Security /> component that wraps our routes.
    // It'll automatically check if userToken is available and push back to login if not :)
    history.push('/login');
  };

  const { id } = useParams();

  return (
    <Security {...config} onAuthRequired={authHandler}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/implicit/callback" component={LoginCallback} />
        {/* any of the routes you need secured should be registered as SecureRoutes */}
        <SecureRoute
          path="/"
          exact
          component={() => <HomePage LoadingComponent={LoadingComponent} />}
        />
        <SecureRoute path="/example-list" component={ExampleListPage} />

        <SecureRoute path="/profile-list" component={ProfileListPage} />
        <SecureRoute path="/datavis" component={ExampleDataViz} />
        <SecureRoute path={`/profile/:id/dashboard`} exact>
          <UserDashboardPage id={id} />
        </SecureRoute>

        <SecureRoute component={CitySearchResultsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Security>
  );
};

export default App;
