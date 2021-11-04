import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import {Link, Redirect} from "react-router-dom";
import React, {useState} from 'react';
import { NavDropdown } from 'react-bootstrap';

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
                <NavDropdown title={<img src="http://localhost:8000/images/hamburger_40x40.svg" />} id="collapsible-nav-dropdown">
                    <NavDropdown.Item>
                        <Link className="navbar-brand" to="/">
                            <img src="http://localhost:8000/images/icons8-contacts_40px.svg"/>
                            <a>{props.user.name}</a>
                        </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                        <Link className="navbar-brand" to="/Games">
                            <img src="http://localhost:8000/images/controller.svg"/>
                            <a>Games</a> 
                        </Link>
                    </NavDropdown.Item>
                    {props.user.roles > 1 ? 
                    <NavDropdown.Item>
                        <Link className="navbar-brand" to="/AddGame"> 
                            <img src="http://localhost:8000/images/icons8-edit_40px.svg"/>
                            <a>Add Game</a> 
                        </Link>
                    </NavDropdown.Item>
                    : ""}
                </NavDropdown>
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