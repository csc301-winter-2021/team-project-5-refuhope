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
        setAccount(field => ({ ...field, [e.target.id]: e.target.value }))
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
                if (json.response) {
                    history.push("/")
                }
            })
            .catch(error => {
                console.log(error);
                alert("Error occured when signing up, please review and try again.")
            });
    }

    return (
        <div className="signup-container">
            <div className="signup-title">
                <p>Create Account</p>
            </div>
            <div className="signup-element">
                <label>Email</label>
                <input
                    type="text"
                    id="email"
                    value={account.email}
                    onChange={handleInput}
                />
            </div>
            <div className="signup-element">
                <label>Password</label>
                <input
                    type="password"
                    id="pwd"
                    value={account.pwd}
                    onChange={handleInput}
                />
            </div>
            <div className="signup-element">
                <label>Name</label>
                <input
                    type="text"
                    id="name"
                    value={account.name}
                    onChange={handleInput}
                />
            </div>
            <div className="signup-element">
                <label>Phone</label>
                <input
                    type="text"
                    id="phone"
                    value={account.phone}
                    onChange={handleInput}
                />
            </div>
            <div className="signup-element">
                <label>Username</label>
                <input
                    type="text"
                    id="usern"
                    value={account.usern}
                    onChange={handleInput}
                />
            </div>
            <button
                className="signup-create-acc-button"
                onClick={handleSignUp}
            >
                Create Account
            </button>

        </div>
    )
}

export default SignUp