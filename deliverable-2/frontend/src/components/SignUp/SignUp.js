import React from 'react'
import { useState } from 'react'
import './SignUp.css'

function SignUp() {
    const [account, setAccount] = useState({
        email: "",
        pwd: "",
        name: "",
        phone: "",
        city: "",
        prov: "",
    })

    const handleInput = e => {
        setAccount(field => ({...field, [e.target.id]: e.target.value}))
    }

    const handleSignUp = e => {
        // POST Host
    }

    return (
        <div className="signupContainer">
            <div className="signupTitle">
                <p>Create Account</p>
            </div>
            <div className="l">
            <div className="signupElement">
                <span>Email: </span>
                <input
                    type="text"
                    id="email"
                    value={account.email}
                    onChange={handleInput}
                />
            </div>
            <div className="signupElement">
                <span>Password:  </span>
                <input
                    type="text"
                    id="pwd"
                    value={account.pwd}
                    onChange={handleInput}
                />
            </div>
            <div className="signupElement">
                <span>Name: </span>
                <input
                    type="text"
                    id="name"
                    value={account.name}
                    onChange={handleInput}
                />
            </div>
            <div className="signupElement">
                <span>Phone: </span>
                <input
                    type="text"
                    id="phone"
                    value={account.phone}
                    onChange={handleInput}
                />
            </div>
            <div className="signupElement">
                <span>City: </span>
                <input
                    type="text"
                    id="city"
                    value={account.city}
                    onChange={handleInput}
                />
            </div>
            <div className="signupElement">
                <span>Province: </span>
                <input
                    type="text"
                    id="prov"
                    value={account.prov}
                    onChange={handleInput}
                />
            </div>
            </div>
            <button 
                className="signupButton"
                onClick={handleSignUp}
            >
                Sign Up
            </button>
            
        </div>
    )
}

export default SignUp