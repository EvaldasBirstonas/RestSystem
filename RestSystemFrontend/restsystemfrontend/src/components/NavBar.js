import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Redirect} from "react-router-dom";
import React, {useState} from 'react';

const NavBar = (props) => {

    const [redirect, setRedirect] = useState(false);

    const logout = (e) => {     
        fetch('http://localhost:8000/api/Authentication/logout', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        })
        .then((data) => {
            console.log(data);
            if (!data.ok) {
              throw Error(data.statusText);
            }
            return data;
          })
          .then((data) => {
            props.setUser('');
            localStorage.removeItem('user');
            setRedirect(true);
            console.log("success");
          })
          .catch((error) => {
            console.log(error);
            console.log("error");
          });
        //const content = await response.json();
        //console.log(content);
    }
    /*
    if(redirect) {
        return <Redirect to="/Login"/>;
    }
    */
    if(props.user !== '' && props.user !== undefined) {
        console.log(props.user)
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Link className="navbar-brand" to="/">
                    <img style={{margin: '5px'}} src="http://localhost:8000/images/icons8-contacts_40px.svg"/>
                    <a>{props.user.name}</a>
                </Link>
                <Link className="navbar-brand" to="/Games">
                    <img style={{margin: '5px'}} src="http://localhost:8000/images/controller.svg"/>
                    <a>Games</a> 
                </Link>
                {props.user.roles > 1 ? 
                <Link className="navbar-brand" to="/AddGame"> 
                    <img style={{margin: '5px'}} src="http://localhost:8000/images/icons8-edit_40px.svg"/>
                    <a>Add Game</a> 
                </Link> 
                : ""}
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        <Link className="nav-link" to="/Logout" onClick={logout}> 
                            Logout
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                {redirect ? <Redirect to="/Login"/> : ""}
            </Navbar>
        )
    }
    else {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Link className="navbar-brand" to="/Login">Logo</Link>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/Login">
                            Home
                        </Link>
                        <Link className="nav-link" to="/Login">
                            Login
                        </Link>
                        <Link className="nav-link" to="/Register">
                            Register
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                {redirect ? <Redirect to="/Login"/> : ""}
            </Navbar>
        )
    }
}

export default NavBar