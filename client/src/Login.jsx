import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Track if user is registering or logging in
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (email.length === 0 || password.length === 0) {
            setError('Email and password are mandatory fields');
            return;
        }

        if (!isRegister) {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const json = await response.json();

            if (!json.success) {
                setError(json.message)
            } else {
                localStorage.setItem('token', json.data.token);
                navigate('/')
            }
        } else {
            if (password !== passwordConfirm) {
                setError('Passwords do not match');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const json = await response.json();

            if (!json.success) {
                setError(json.message)
            } else {
                localStorage.setItem('token', json.data.token);
                navigate('/')
            }
        }
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "14px solid #555",
                    padding: 30,
                    borderRadius: 30,
                }}
            >
                <h1 style={{ marginBottom: 30, color: "#555", fontWeight: "bold" }}>
                    {isRegister ? "REGISTER" : "LOGIN"}
                </h1>

                <label htmlFor="email">Email</label>
                <input
                    style={{ width: 200, height: 30 }}
                    type="email"
                    required
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br />
                <br />
                <label htmlFor="password">Password</label>
                <input
                    style={{ width: 200, height: 30 }}
                    type="password"
                    required
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isRegister && (
                    <>
                        <br />
                        <br />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            style={{ width: 200, height: 30 }}
                            type="password"
                            required
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </>
                )}

                <br />
                <br />
                <button>{isRegister ? "Register" : "Login"}</button>

                <br />
                {error.length > 0 && <span>{error}</span>}

                <br />
                <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)} // Toggle between login and register
                    style={{ marginTop: 10 }}
                >
                    Switch to {isRegister ? "Login" : "Register"}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;
