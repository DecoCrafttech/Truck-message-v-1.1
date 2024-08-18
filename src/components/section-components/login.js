import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const SignInForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);

    const signIn = () => {
        if (phoneNumber === '' || password === '') {
            toast.error('Please fill in all fields.');
        } else if (!termsChecked) {
            toast.error('Please agree to the terms and conditions.');
        } else {
            // Replace this with your actual sign-in logic
            toast.success('Sign-in successful!');
        }
    };

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 my-5">
                        <div className="card mx-auto p-5" style={{ maxWidth: '520px' }}>
                            <div className="card-body">
                                <h4 className="card-title mb-4">Sign In</h4>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" className="form-control" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                    <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                </div>
                                <button type="button" className="btn btn-primary btn-block" onClick={signIn}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInForm;
