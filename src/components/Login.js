import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const history = useNavigate();
    const pushHistory = () => {
        history("/signup");
    };

    const [ creds, setCreds ] = useState({email: "", password: ""});
    const { email, password } = creds;

    const fetchUser = async (e) => {
        e.preventDefault()
        const response = await fetch("https://backend-todolist-tau.vercel.app/api/auth/loginuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });
        const json = await response.json();
        if(json.authToken){
            history("/home");
            localStorage.setItem("token", json.authToken)
        } else {
            alert(json.error)
        }
    };

    const onChange = (e) =>{
        setCreds({...creds, [e.target.name]:e.target.value})
    };

  return (
    <div className='container'>
        <h1 className='mt-5 text-center'>Welcome to Login page.</h1>
        <form onSubmit={fetchUser}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name='password' onChange={onChange} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <p className='mt-2' style={{cursor: "pointer"}} onClick={pushHistory}><code>Don't have an account, signup here.</code></p>
    </div>
  )
}

export default Login
