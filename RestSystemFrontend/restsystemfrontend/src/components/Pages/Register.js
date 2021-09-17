import './Login.css';
import 'bootstrap';
import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        
        await fetch('http://localhost:8000/api/Authentication/register', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {
                name,
                email,
                password
            })
        });

        setRedirect(true);
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
            </form>
        </main>
        </div>
    );
}

export default Register;
