import './Login.css';
import 'bootstrap';
import Alert from 'react-bootstrap/Alert'
import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [show, setShow] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        
        fetch('http://localhost:8000/api/Authentication/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {
                name,
                email,
                password
            })
        })
        .then((data) => {
            console.log(data);
            if (data.ok) {
                setRedirect(true);
            }
            else {
                throw new Error(data);
            }
            //return data.json();
        })
        .catch((error) => {
            setShow(true);
        });

        //setRedirect(true);
        //const content = await response.json();
        //console.log(content);
    }

    if(redirect) {
        return <Redirect to="/login"/>;
    }

    return (
        <div className="Register">
        <main className="form-signin">
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please register</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" required
                        onChange={e => setEmail(e.target.value)}/>
                    <label htmlFor="floatingEmail">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="name" className="form-control" id="floatingName" placeholder="Name" required
                        onChange={e => setName(e.target.value)}/>
                    <label htmlFor="floatingName">Name</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                        onChange={e => setPassword(e.target.value)}/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
                <Alert variant="danger" show={show} style={{marginTop: "5%"}}>
                    <Alert.Heading>An error has occured!</Alert.Heading>
                    <p>
                        There was an error with your register form. Please try another email.
                    </p>
                </Alert>
            </form>
        </main>
        </div>
    );
}

export default Register;
