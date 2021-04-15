import './App.css';

import { React, useState } from 'react'
import { Route, Switch, BrowserRouter} from 'react-router-dom'

import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import HostDash from './components/HostDash/HostDash'
import VolunteerDash from './components/VolunteerDash/VolunteerDash'
import Match from './components/Match/Match'

const App = () => {
  const [user, setUser] = useState({})

  const getSession = async () => {
    const request = new Request("/api/loggedIn", {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    })
    fetch(request)
      .then(res => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
      if (json.loggedIn == null) {
        setUser({userType : undefined})
      } 
      else {
        setUser(json.loggedIn)
      }
    })
    .catch(error => {
        console.log(error);
    });
  }
  
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            exact path ={["/"]}
            // render={() => getSession() && user.userType === undefined ? <Login/> : <Login/>}
            render={()=><Login/>}
          />
          <Route
            exact path ={["/signup"]}
            render={()=><SignUp/>}
          />
          <Route
            exact path ={["/dash"]}
            render={() => getSession() && user.userType === "HOST" ? <HostDash user={user}/> : user.userType === "VOLUNTEER" ? <VolunteerDash/> : <Login/>}
          />
          <Route
            exact path={["/match"]}
            render={()=> <Match/> }
          />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
