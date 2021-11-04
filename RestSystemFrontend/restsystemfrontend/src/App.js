import Home from './components/Pages/Home'
import Register from './components/Pages/Register'
import Login from './components/Pages/Login'
import Games from './components/Pages/Games'
import AddGame from './components/Pages/AddGame'
import AddLevel from './components/Pages/AddLevel'
import EditGame from './components/Pages/EditGame'
import EditLevel from './components/Pages/EditLevel'
import EditAchievement from './components/Pages/EditAchievement'
import ViewGames from './components/Pages/ViewGames'
import ViewLevel from './components/Pages/ViewLevel'
import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import {Redirect} from 'react-router-dom';
import AddAchievement from './components/Pages/AddAchievement'
import ViewAchievement from './components/Pages/ViewAchievement'

function App() {

  const [user, setUser] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    (
    async () => {
      let loggedUser = localStorage.getItem('user');
      if(loggedUser) {
        const foundUser = JSON.parse(loggedUser);
        console.log("User is logged in");
        setUser(foundUser);
      }
      else {
        console.log("Issuing refresh")
        await fetch('http://localhost:8000/api/Authentication/refresh', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        })
        .then((data) => {
          if (!data.ok) {
            throw Error(data.statusText);
          }
          return data.json();
        })
        .then((data) => {
          setUser(data);
          console.log("success")
        })
        .catch((error) => {
          console.log(error);
          console.log("error");
          setRedirect(true);
        });
      }
      /*
      await fetch('http://localhost:8000/api/Authentication/Validate', {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      })
      
      .then((data) => {
        console.log(data);
        if (!data.ok) {
          throw Error(data.statusText);
        }
        return data.json();
      })
      .then((data) => {
        setUser(data);
        //console.log("AAAA" + data.json());
        //setRedirect(true);
        console.log("success")
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
      */
      /*
      const content = await response.json();
      if (content)
      setUser(content);
      console.log("content" + content);
      */
      } 
    )()
  }, []);

  /*
  if(redirect) {
    return <Redirect to="/Login"/>;
  }
  */

  
  return (
    <div className="App">
      <Router>
        <NavBar user={user} setUser={setUser} />
        {redirect ? (<Redirect to="/Login"/>) : ""}
        <Switch>
          <Route exact path="/" component= {() => <Home user={user}/>} />
          <Route path="/Home" component={() => <Home user={user}/>}/>
          <Route path="/Login" component={() => <Login setUser={setUser}/>} />
          <Route path="/Register" component={Register}/>
          <Route exact path="/Games" component={() => <Games refresh={refresh}/>}/>
          <Route path="/AddGame" component={() => user.roles > 1 ? <AddGame setRefresh={setRefresh} /> : <Redirect to="/" />}/>
          <Route path="/Games/:id/AddLevel" component={() => user.roles > 1 ? <AddLevel setRefresh={setRefresh} /> : <Redirect to="/" />}/>
          <Route path="/Games/:id/EditGame" component={() => user.roles > 1 ? <EditGame setRefresh={setRefresh} /> : <Redirect to="/" />}/>
          <Route path="/Games/:id/Levels/:id1/AddAchievement" component={() => user.roles > 1 ? <AddAchievement setRefresh={setRefresh} /> : <Redirect to="/" />}/>
          <Route exact path="/Games/:id" component={() => <ViewGames user={user} setRefresh={setRefresh}/>}/>
          <Route exact path="/Games/:id/Levels/:id1" component={() => <ViewLevel user={user} setRefresh={setRefresh}/>}/>
          <Route exact path="/Games/:id/Levels/:id1/EditLevel" component={() => user.roles > 1 ? <EditLevel user={user} setRefresh={setRefresh}/> : <Redirect to="/" />}/>
          <Route exact path="/Games/:id/Levels/:id1/Achievements/:id2" component={() => <ViewAchievement user={user} setRefresh={setRefresh}/>}/>
          <Route exact path="/Games/:id/Levels/:id1/Achievements/:id2/EditAchievement" component={() => user.roles > 1 ? <EditAchievement user={user} setRefresh={setRefresh}/> : <Redirect to="/" />}/>
          <Route>
            {/* If no other path is found, the route redirects to home component */}
            <Redirect to="/" />
          </Route>
        </Switch>
        <Footer />
      </Router>
  </div>
  );
}

export default App;
