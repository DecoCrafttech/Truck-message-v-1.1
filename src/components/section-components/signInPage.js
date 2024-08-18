// SignInPage.js
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './SignInPage.css';

const SignInPage = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOTPRequested, setIsOTPRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      toast.success(`Welcome to Truck, ${userName}!`);
    }
  }, [isSignedIn, userName]);

  const handleChange = (value) => {
    setPhoneNumber(value);
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    // Here, you can implement the logic to send OTP to the provided phone number
    // For this example, let's assume the OTP is sent successfully
    setIsOTPRequested(true);
    toast.success('OTP sent successfully!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your logic to verify OTP here
    // For simplicity, let's assume verification is successful if OTP is entered
    if (otp.trim() !== '') {
      setIsLoading(true); // Set loading state to true while OTP verification is in progress
      // Simulate OTP verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('OTP verified successfully!');
      setIsSignedIn(true); // Set signed in state to true upon successful OTP verification
      setIsLoading(false); // Set loading state to false after OTP verification is complete
    } else {
      toast.error('Verification failed. Please enter OTP.');
    }
  };

  // If user is signed in, render home page content
  if (isSignedIn) {
    return (
      <div>
        <h2>Welcome to Home Page</h2>
        {/* Add your home page content here */}
      </div>
    );
  }

  // If user is not signed in, render sign-in form
  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={isOTPRequested ? handleSubmit : handleSendOTP}>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <PhoneInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={handleChange}
            defaultCountry="US" // Set default country code to United States
            required
          />
        </div>
        {!isOTPRequested && (
          <button type="submit">Send OTP</button>
        )}
        {isOTPRequested && (
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignInPage;
