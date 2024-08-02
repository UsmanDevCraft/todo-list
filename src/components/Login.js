import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const history = useNavigate();

    const [ creds, setCreds ] = useState({email: "", password: ""});
    const { email, password } = creds;

    const fetchUser = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("https://backend-todolist-tan.vercel.app/api/auth/loginuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password})
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const json = await response.json();
    
            if(json.authToken){
                localStorage.setItem("token", json.authToken)
                history("/home");
            } else {
                alert(json.error)
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('An error occurred: ' + error.message);
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
        <p className='mt-2' style={{cursor: "pointer"}} onClick={()=>{history("/signup")}}><code>Don't have an account, signup here.</code></p>
        <br/>
        <p>Email: <b>gmailtin@gmail.com</b></p>
        <p>Password: <b>12345</b> (For test run)</p>
    </div>
  )
}

export default Login
