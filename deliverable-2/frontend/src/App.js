import './App.css';

import React from 'react'
import { Route, Switch, BrowserRouter} from 'react-router-dom'

import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import HostDash from './components/HostDash/HostDash'
import VolunteerDash from './components/VolunteerDash/VolunteerDash'


const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            exact path ={["/"]}
            render={()=><Login/>}
          />
          <Route
            exact path ={["/signup"]}
            render={()=><SignUp/>}
          />
          <Route
            exact path ={["/hostdash"]}
            render={()=> <HostDash/> }
          />
          <Route
            exact path ={["/volunteerdash"]}
            render={()=> <VolunteerDash/> }
          />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
