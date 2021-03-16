import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router'
import './Login.css'

function Login() {
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePwd = e => {
        setPwd(e.target.value)
    }

    const handleLogin = e => {
        const request = new Request(`/api/login?email=${email}&password=${pwd}`, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        })
        fetch(request)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(json => {
                if (json.response.userType === "HOST"){
                    history.push("/hostdash")
                }
                else if (json.response.userType === "VOLUNTEER"){
                    history.push("/volunteerdash")
                }
                
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSignUp = e => {
        history.push("/signup")
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