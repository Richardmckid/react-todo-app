import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loading from "../components/Loading";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const signIn = async (e) => {
        setLoading(true)
        e.preventDefault();
        setError(null);

        if(email === '' || password === ''){

            setError("Please enter email and password");
            setLoading(false)
            return 
        } 

        try{
            const user = await signInWithEmailAndPassword(auth, email, password);
            if(user){
                navigate('/');
            }

        } catch(error){
            
            switch(error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                    setError("Incorrect email/password");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email");
                    break;
                case "auth/operation-not-allowed":
                    setError("An error occured, please try again later");
                    break;
                default:
                    setError(error.message);
            }
        }
        setLoading(false)
    }

    return (
        <div className="container">
            {loading &&
                <Loading/>
            }
            <div className="login-container">
                <form >
                    <div className="login-form-header">
                        <h1>Login</h1>
                        {error && <p className="error">{error}</p>}
                    </div>
                    <div className="login-form-body">
                        <div className="login-form-body-input">
                            <ion-icon name="mail-outline" class="login-icon"></ion-icon>
                            <input className="input-field" type="text" id="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="login-form-body-input">
                            <ion-icon name="lock-closed-outline" class="login-icon"></ion-icon>
                            <input className="input-field" type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        
                        <button className="login-button" type="submit" onClick={(e) => signIn(e)}>Login</button>
                        <div className="login-footer">
                            <p>Don't have an account? <Link className="sign-link" to="/register">Signup</Link></p>
                            <p>Forgot password? <Link className="sign-link" to="/reset-password">Reset</Link></p>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;