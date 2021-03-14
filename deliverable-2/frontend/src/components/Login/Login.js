import React from 'react'
import { useState } from 'react'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePwd = e => {
        setPwd(e.target.value)
    }

    const handleLogin = e => {
        // GET
    }

    const handleSignUp = e => {
        // Reroute
    }

    return (
        <div className="loginContainer">
            <div className="loginTitle">
                <p>Welcome to RefuTalent</p>
            </div>
            <div className="loginElement">
                <label>Email:</label>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmail}
                    />
                </div>
            </div>

            <div className="loginElement">
                <label> Password: </label>
                <div>
                    <input
                        type="password"
                        value={pwd}
                        onChange={handlePwd}
                    />
                </div>
            </div>

            <button 
                className="loginButton"
                onClick={handleLogin}
            >
                Login
            </button>

            
            <div>
                <span>New User?</span>
                <button 
                    className="loginButton"
                    onClick={handleSignUp}>
                        Sign Up
                </button>
            </div>
            
        </div>
    )
}

export default Login