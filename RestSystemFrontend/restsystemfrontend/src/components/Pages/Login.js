import './Login.css';
import 'bootstrap';
import Alert from 'react-bootstrap/Alert';
import React, {useState} from 'react';
import {Redirect, Link} from 'react-router-dom';
import { useHistory } from 'react-router';

const Login = (props) => {

  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/api/Authentication/login', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify( {
            email,
            password
        })
    })
    .then((data) => {
      console.log(data);
      if (!data.ok) {
        throw Error(data.statusText);
      }
      return data.json();
    })
    .then((data) => {
      console.log(data);
      setRedirect(true);
      localStorage.setItem('user', JSON.stringify(data));
      props.setUser(data);
      console.log("success");
      history.push("/");
    })
    .catch((error) => {
      console.log(error);
      console.log("error");
      setShow(true);
    });
  }

  if(redirect) {
    return <Redirect to="/Home"/>;
  }

  return (
    <div className="Login">
      <main className="form-signin">
        <form onSubmit={submit}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
              onChange={e => setEmail(e.target.value)}/>
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
              onChange={e => setPassword(e.target.value)}/>
            <label htmlFor="floatingPassword">Password</label>
          </div>
          
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me"/> Remember me
            </label>
          </div>

          <Alert variant="danger" show={show} style={{marginTop: "5%"}}>
              <Alert.Heading>An error has occured!</Alert.Heading>
              <p>
                  There was an error with your login form. Your email or password might be incorrect.
              </p>
          </Alert>

          <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
          <p>Don't have an Account? <Link to="/Register"> Register here!</Link></p>
          <p className="mt-5 mb-3 text-muted">&copy; 2017???2021</p>
        </form>
      </main>
    </div>
  );
}

export default Login;
