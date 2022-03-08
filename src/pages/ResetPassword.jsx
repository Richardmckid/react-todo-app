import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebaseConfig"; 
import Loading from "../components/Loading";

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const resetPassword = async (e) =>{
        setLoading(true);
        e.preventDefault();
        setError(null);
        setMessage(null);

        if(email.length < 5){
            setLoading(false);
            return setError('Please enter an email address');
        }

        setEmail('');
        try {
            const res = await sendPasswordResetEmail(auth, email);
            if(res === undefined) {
                setMessage('Please check your email for reset link.')
                setLoading(false);
            }
            return
        } catch (error) {
            setMessage('Please check your email for reset link.')
            setLoading(false);
        }
    }
    return (
        <div className="container">
            {loading &&
                <Loading/>
            }
            <div className="login-container">
                <form >
                    <div className="login-form-header">
                        <h1>Reset Password</h1>
                        {error && <p className="error">{error}</p>}
                        {message && <p className="success">{message}</p>}
                    </div>
                    <div className="login-form-body">
                        <div className="login-form-body-input">
                            <ion-icon name="mail-outline" class="login-icon"></ion-icon>
                            <input className="input-field" type="email" id="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button className="login-button" type="submit" onClick={(e) => resetPassword(e)}>Reset</button>
                        <div className="login-footer">
                            <p>Already have an account? <Link className="sign-link" to="/login">Login</Link></p>
                            
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;