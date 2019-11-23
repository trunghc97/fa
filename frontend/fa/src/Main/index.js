import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import Attendance from "../Attendances";

class Main extends Component {
 render() {
   return (
     <Router>
       <Switch>
         <Route path="/">
           <Attendance />
        </Route>
       </Switch>
     </Router>
   );
 }
}

export default Main;
