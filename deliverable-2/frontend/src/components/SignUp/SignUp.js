import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router'
import './SignUp.css'

function SignUp() {
    const history = useHistory()
    const [account, setAccount] = useState({
        email: "",
        pwd: "",
        name: "",
        usern: "",
        phone: "",
    })

    const handleInput = e => {
        setAccount(field => ({...field, [e.target.id]: e.target.value}))
    }

    const handleSignUp = e => {
        const newUser = {
            name: account.name,
            phone: account.phone,
            email: account.email,
            username: account.usern,
            password: account.pwd
        }
        const request = new Request("/api/userAdd", {
            method: "post",
            body: JSON.stringify(newUser),
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
                if (json.response){
                    history.push("/")
                } 
            })
            .catch(error => {
                console.log(error);
                alert("Error occured when signing up, please review and try again.")
            });
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
                <span>Username: </span>
                <input
                    type="text"
                    id="usern"
                    value={account.usern}
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