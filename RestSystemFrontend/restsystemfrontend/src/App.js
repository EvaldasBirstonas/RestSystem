import Home from './components/Pages/Home'
import Register from './components/Pages/Register'
import Login from './components/Pages/Login'
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar';

function App() {

  useEffect(() => {
    (
    async () => {
      const response = await fetch('http://localhost:8000/api/Authentication/Validate', {
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })
      .then((data) => {
        console.log(data);
        if (!data.ok) {
          throw Error(data.statusText);
        }
        return data;
      })
      .then((data) => {
        console.log(data);
        //setRedirect(true);
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });;

      //const content = await response.json();

      //console.log(content);
      } 
    )()
  });

  return (
    <div className="App">
      <Router>
        <NavBar />

        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/Home" component={Home}/>
          <Route path="/Login" component={Login}/>
          <Route path="/Register" component={Register}/>
        </Switch>
      </Router>
  </div>
  );
}

export default App;
