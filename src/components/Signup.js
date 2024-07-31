import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const history = useNavigate();
    const pushHistory = () => {
        history("/login");
    };

    const [ creds, setCreds ] = useState({email: "", password: ""});
    const { email, password } = creds;

    const fetchUser = async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });
        const json = await response.json();
        if(json.error){
            alert(json.error)
        } else {
            alert("Account Signed In Successfully, Login to move further.");
            localStorage.setItem("token", json.authToken);
            history("/login");
        }
    };

    const onChange = (e) =>{
        setCreds({...creds, [e.target.name]:e.target.value})
    };

  return (
    <div className='container'>
        <h1 className='mt-5 text-center'>Welcome to Signup page.</h1>
        <form onSubmit={fetchUser}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name='password' onChange={onChange} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        <p className='mt-2' style={{cursor: "pointer"}} onClick={pushHistory}><code>Already have an account, login here.</code></p>
    </div>
  )
}

export default Signup
