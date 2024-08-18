import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegistrationForm = () => {
    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [dob, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [operatingCity, setOperatingCity] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [state, setState] = useState('');

    const register = () => {
        if (firstName === '' || dob === '' || phoneNumber === '' || password === '' || confirmPassword === '' || operatingCity === '') {
            toast.error('Please fill in all fields.');
            return;
        } else if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        } else if (!termsChecked) {
            toast.error('You must agree to the terms and conditions.');
            return;
        }

        const registrationData = {
            first_name: firstName,
            date_of_birth: dob,
            category: state, // Assuming the state variable holds the category
            state: state,
            phone_number: phoneNumber,
            password: password,
            operating_city: operatingCity
        };

        axios.post('https://truck.truckmessage.com/registration', registrationData)
            .then(response => {
                if (response.data.success) {
                    sendOTP(phoneNumber); // Send OTP after successful registration
                    setStep(2); // Move to step 2 after registration
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                toast.error('Registration failed. Please try again.');
            });
    };

    const sendOTP = (phone) => {
        axios.post('https://truck.truckmessage.com/send_signup_otp', { phone_number: phone })
            .then(response => {
                toast.success('OTP sent successfully.');
            })
            .catch(error => {
                toast.error('Failed to send OTP. Please try again.');
            });
    };

    const validateOTP = () => {
        if (otpInput === '') {
            toast.error('Please enter OTP.');
            return;
        }

        const otpData = {
            phone_number: phoneNumber,
            otp: otpInput
        };

        axios.post('https://truck.truckmessage.com/validate_otp', otpData)
            .then(response => {
                if (response.data.success) {
                    toast.success('OTP verified successfully.');
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch(error => {
                toast.error('OTP verification failed. Please try again.');
            });
    };

    const handlePhoneNumberInput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setPhoneNumber(e.target.value);
    };

    return (
        <section> 
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 py-3">
                        <div className="card mx-auto p-5" style={{ maxWidth: '520px' }}>
                            <div className="card-body">
                                <h4 className="card-title mb-4">Registration</h4>
                                <div id="step1" style={{ display: step === 1 ? 'block' : 'none' }}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" className="form-control" placeholder="Enter Your Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input type="date" className="form-control" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                                    </div>
                                    <div className="input-item">
                                        <label>Phone Number</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend d-flex">
                                                <span className="input-group-text">+91</span>
                                            </div>
                                            <input type="tel" className="form-control mb-0" placeholder="Phone number" value={phoneNumber} onInput={handlePhoneNumberInput} maxLength="10" />
                                        </div>
                                    </div>
                                    <div className="input-item">
                                        <label>Category</label>
                                        <select className="form-control nice-select" value={state} onChange={(e) => setState(e.target.value)}>
                                            <option value="">Category</option>
                                            <option value="LORRY OWNER">Lorry Owner</option>
                                            <option value="LOGISTICS">Logistics</option>
                                            <option value="LORRY CONTRACTERS">Lorry Contractors</option>
                                            <option value="LOAD BOOKING AGENT">Load Booking Agent</option>
                                            <option value="DRIVER">Driver</option>
                                            <option value="LORRY BUY & SELL DEALER/OWNER">Lorry Buy & Sell Dealer/Owner</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Operating State</label>
                                        <input type="text" className="form-control" placeholder="Enter Operating City" value={operatingCity} onChange={(e) => setOperatingCity(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Operating City</label>
                                        <input type="text" className="form-control" placeholder="Enter Operating City" value={operatingCity} onChange={(e) => setOperatingCity(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                        <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                    </div>
                                    <button type="button" className="btn btn-primary btn-block" onClick={register} aria-label="Register">Register</button>
                                </div>

                                {/* Step 2: Enter OTP */}
                                <div id="step2" style={{ display: step === 2 ? 'block' : 'none' }}>
                                    <div className="form-group">
                                        <label>Enter OTP</label>
                                        <input type="text" className="form-control" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
                                    </div>
                                    <button type="button" className="btn btn-primary btn-block" onClick={validateOTP} aria-label="Send OTP">Verify OTP</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationForm;



// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';

// const RegistrationForm = () => {
//     const [step, setStep] = useState(1);
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otpInput, setOtpInput] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [selectedCities, setSelectedCities] = useState([]);
//     const [termsChecked, setTermsChecked] = useState(false);

//     const nextStep = () => {
//         if (step === 1) {
//             if (firstName === '' || lastName === '' || phoneNumber === '' || password === '' || confirmPassword === '') {
//                 toast.error('Please fill in all fields.');
//             } else if (password !== confirmPassword) {
//                 toast.error('Passwords do not match.');
//             } else if (!validatePhoneNumber(phoneNumber)) {
//                 toast.error('Invalid phone number format.');
//             } else {
//                 // Replace this with your actual code to send OTP via SMS or any other method
//                 toast.success(`OTP sent successfully to ${phoneNumber}`);
//                 setStep(2);
//             }
//         }
//     };

//     const sendOTP = () => {
//         if (otpInput === '') {
//             toast.error('Please enter OTP.');
//         } else {
//             // Replace this with your actual code to verify OTP
//             toast.success('OTP verified successfully.');
//             setStep(3);
//         }
//     };

//     const handleCityChange = (event) => {
//         const { value } = event.target;
//         if (selectedCities.includes(value)) {
//             setSelectedCities(selectedCities.filter(city => city !== value));
//         } else {
//             setSelectedCities([...selectedCities, value]);
//         }
//     };

//     const register = () => {
//         if (!termsChecked) {
//             toast.error('Please agree to the terms and conditions.');
//         } else {
//             const registrationData = {
//                 first_name: firstName,
//                 phone_number: phoneNumber,
//                 password: password
//             };

//             axios.post('https://truck.truckmessage.com/registration', registrationData)
//                 .then(response => {
//                     toast.success('Registration successful!');
//                 })
//                 .catch(error => {
//                     toast.error('Registration failed. Please try again.');
//                 });
//         }
//     };

//     const validatePhoneNumber = (phoneNumber) => {
//         // India phone number regex validation
//         const regex = /^\d{10}$/;
//         return regex.test(phoneNumber);
//     };

//     return (
//         <section>
//             <div className="container">
//                 <div className="row">
//                     <div className="col-lg-12 py-3">
//                         <div className="card mx-auto p-5" style={{ maxWidth: '520px' }}>
//                             <div className="card-body">
//                                 <h4 className="card-title mb-4">Registration</h4>
//                                 <div id="step1" style={{ display: step === 1 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>Name</label>
//                                         <input type="text" className="form-control" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Date of Birth</label>
//                                         <input type="text" className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Phone Number</label>
//                                         <input type="text" className="form-control" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>State</label>
//                                         <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Operating Cities</label>
//                                         <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Password</label>
//                                         <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Confirm Password</label>
//                                         <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={nextStep} aria-label="Next">Next</button>
//                                 </div>

//                                 {/* Step 2: Enter OTP */}
//                                 <div id="step2" style={{ display: step === 2 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>Enter OTP</label>
//                                         <input type="text" className="form-control" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={sendOTP} aria-label="Send OTP">Verify OTP</button>
//                                 </div>

//                                 {/* Step 3: Select City */}
//                                 <div id="step3" style={{ display: step === 3 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>Select Cities</label>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="New York" checked={selectedCities.includes("New York")} onChange={handleCityChange} />
//                                                 New York
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="Los Angeles" checked={selectedCities.includes("Los Angeles")} onChange={handleCityChange} />
//                                                 Los Angeles
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="Chicago" checked={selectedCities.includes("Chicago")} onChange={handleCityChange} />
//                                                 Chicago
//                                             </label>
//                                         </div>
//                                         {/* Add more cities as needed */}
//                                     </div>
//                                     <div className="form-group form-check">
//                                         <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
//                                         <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={register} aria-label="Register">Register</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default RegistrationForm;


// import React, { useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';

// const RegistrationForm = () => {
//     const [step, setStep] = useState(1);
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otpInput, setOtpInput] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [selectedCities, setSelectedCities] = useState([]);
//     const [country, setCountry] = useState('India');
//     const [termsChecked, setTermsChecked] = useState(false);

//     const nextStep = () => {
//         if (step === 1) {
//             if (firstName === '' || lastName === '' || phoneNumber === '' || password === '' || confirmPassword === '') {
//                 toast.error('Please fill in all fields.');
//             } else if (password !== confirmPassword) {
//                 toast.error('Passwords do not match.');
//             } else if (!validatePhoneNumber(phoneNumber)) {
//                 toast.error('Invalid phone number format.');
//             } else {
//                 // Replace this with your actual code to send OTP via SMS or any other method
//                 toast.success(`OTP sent successfully to ${phoneNumber}`);
//                 setStep(2);
//             }
//         }
//     };

//     const sendOTP = () => {
//         if (otpInput === '') {
//             toast.error('Please enter OTP.');
//         } else {
//             // Replace this with your actual code to verify OTP
//             toast.success('OTP verified successfully.');
//             setStep(3);
//         }
//     };

//     const handleCityChange = (event) => {
//         const { value } = event.target;
//         if (selectedCities.includes(value)) {
//             setSelectedCities(selectedCities.filter(city => city !== value));
//         } else {
//             setSelectedCities([...selectedCities, value]);
//         }
//     };

//     const register = () => {
//         if (!termsChecked) {
//             toast.error('Please agree to the terms and conditions.');
//         } else {
//             // Replace this with your actual registration logic
//             toast.success('Registration successful!');
//         }
//     };

//     const validatePhoneNumber = (phoneNumber) => {
//         // India phone number regex validation
//         const regex = /^\d{10}$/;
//         return regex.test(phoneNumber);
//     };

//     return (
//         <section>
//             <div className="container">
//                 <div className="row">
//                     <div className="col-lg-12">
//                         <div className="card mx-auto" style={{ maxWidth: '520px' }}>
//                             <div className="card-body">
//                                 <h4 className="card-title mb-4">Registration</h4>
//                                 <div id="step1" style={{ display: step === 1 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>First name</label>
//                                         <input type="text" className="form-control" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Last name</label>
//                                         <input type="text" className="form-control" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Phone Number</label>
//                                         <input type="text" className="form-control" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Password</label>
//                                         <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Confirm Password</label>
//                                         <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={nextStep} aria-label="Next">Next</button>
//                                 </div>

//                                 {/* Step 2: Enter OTP */}
//                                 <div id="step2" style={{ display: step === 2 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>Enter OTP</label>
//                                         <input type="text" className="form-control" placeholder="Enter OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={sendOTP} aria-label="Send OTP">Verify OTP</button>
//                                 </div>

//                                 {/* Step 3: Select City */}
//                                 <div id="step3" style={{ display: step === 3 ? 'block' : 'none' }}>
//                                     <div className="form-group">
//                                         <label>Select Cities</label>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="New York" checked={selectedCities.includes("New York")} onChange={handleCityChange} />
//                                                 New York
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="Los Angeles" checked={selectedCities.includes("Los Angeles")} onChange={handleCityChange} />
//                                                 Los Angeles
//                                             </label>
//                                         </div>
//                                         <div>
//                                             <label>
//                                                 <input type="checkbox" value="Chicago" checked={selectedCities.includes("Chicago")} onChange={handleCityChange} />
//                                                 Chicago
//                                             </label>
//                                         </div>
//                                         {/* Add more cities as needed */}
//                                     </div>
//                                     <div className="form-group form-check">
//                                         <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
//                                         <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
//                                     </div>
//                                     <button type="button" className="btn btn-primary btn-block" onClick={register} aria-label="Register">Register</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default RegistrationForm;
