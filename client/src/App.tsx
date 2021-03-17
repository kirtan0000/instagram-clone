import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import MyAccount from './Components/MyAccount'
import NotFound from './Components/NotFound'
import Account from './Components/Account'
import ShowFollowers from './Components/ShowFollowers'
import ShowFollowing from './Components/ShowFollowing'
import UploadPost from './Components/UploadPost'
import Post from './Components/Post'
import Redirect from './Util/Redirect'
import SearchUser from './Components/SearchUser'
import MyFeed from './Components/MyFeed'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={MyAccount} exact />
        <Route path='/feed' component={MyFeed} exact />
        <Route path='/login' component={Login} exact />
        <Route path='/sign-up' component={SignUp} exact />
        <Route path='/upload-post' component={UploadPost} exact />
        <Route path='/user/:name' component={Account} exact />
        <Route path='/posts/:id' component={Post} exact />
        <Route path='/followers/:name' component={ShowFollowers} exact />
        <Route path='/following/:name' component={ShowFollowing} exact />
        <Route path='/search/users/' component={SearchUser} exact />

        {/* Redirects */}
        <Route
          path='/u/:name'
          component={() => (
            <Redirect
              url={`../user/${window.location.pathname.split('/')[2]}`}
            />
          )}
          exact
        />
        <Route
          path='/p/:id'
          component={() => (
            <Redirect
              url={`../posts/${window.location.pathname.split('/')[2]}`}
            />
          )}
          exact
        />
        <Route
          path='/f/:id'
          component={() => (
            <Redirect
              url={`../followers/${window.location.pathname.split('/')[2]}`}
            />
          )}
          exact
        />
        <Route
          path='/fi/:id'
          component={() => (
            <Redirect
              url={`../following/${window.location.pathname.split('/')[2]}`}
            />
          )}
          exact
        />
        <Route
          path='/su'
          component={() => <Redirect url={`../search/users/`} />}
          exact
        />
        {/* 404 */}
        <Route component={NotFound} exact />
      </Switch>
    </BrowserRouter>
  )
}

export default App
