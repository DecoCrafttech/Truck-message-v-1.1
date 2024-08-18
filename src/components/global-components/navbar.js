import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Services/axiosInstance';
import { updateIsLoggedIn, updateUserDetails } from '../../Storage/Slices/LoginSlice';
import Cookie from 'js-cookie';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import Autocomplete from "react-google-autocomplete";

const Navbar = () => {
    const Login = useSelector((state) => state.login);
    const dispatch = useDispatch();
    const pageRender = useNavigate();

    const publicUrl = process.env.PUBLIC_URL + '/';

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);

    const [otpInput, setOtpInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [dob, setDob] = useState('');
    const [category, setCategory] = useState('')

    const [operatingStates, setOperatingStates] = useState([])
    const [operatingStateString, setoperatingStateString] = useState('')
    const [operatingStateStringdupli, setoperatingStateStringdupli] = useState('')
    const [checked, setChecked] = useState(false);

    const [forgotPassMobNum, setForgotPassMobNum] = useState('');
    const [forgotPasswordStep, setForgotPasswordStep] = useState(Number);
    const [forgotPassUSerId,setforgotPassUSerId] = useState('')

    const [updatePass, setUpdatePass] = useState({
        password: '',
        confirm_password: ''
    })

    const [otp, setOtp] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [window.location.pathname])

    useEffect(() => {
        const isUserExist = Cookie.get("usrin")
        if (isUserExist) {
            dispatch(updateIsLoggedIn(true));
        } else {
            dispatch(updateIsLoggedIn(false));
        }
    }, [])

    const signIn = async () => {
        if (phoneNumber === '' || password === '') {
            toast.error('Please fill in all fields.');
        } else if (!termsChecked) {
            toast.error('Please agree to the terms and conditions.');
        } else {
            try {
                const loginData = {
                    username: phoneNumber,
                    password: password
                }
                const res = await axiosInstance.post('/login', loginData)
                if (res.data.error_code === 0) {
                    const userId = window.btoa(res.data.data[0].id);
                    var date = new Date();
                    date.setDate(date.getDate() + 1);

                    //updating username in cookies
                    Cookie.set("usrin", userId, {
                        expires: date, // 1 day
                        secure: true,
                        sameSite: 'strict',
                        path: '/'
                    })

                    dispatch(updateIsLoggedIn(true));
                    document.getElementById("closeSignInModel").click();
                } else {
                    toast.error("Login failed")
                }
            } catch (err) {
                toast.error(err.code)
            }
        }
    };

    const register = async () => {
        try {
            if (firstName === '' || dob === '' || phoneNumber === '' || password === '' || confirmPassword === '' || operatingStates.length === 0) {
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
                category: category, // Assuming the state variable holds the category
                state: operatingStates,
                phone_number: phoneNumber,
                password: password,
                operating_city: operatingStates
            };

            console.log(registrationData)

            const res = await axios.post('https://truck.truckmessage.com/registration', registrationData)
            if (res.data.error_code === 0) {
                if (res.data.success) {
                    toast.success(res.data.message)
                    sendOTP(phoneNumber); // Send OTP after successful registration
                    setStep(2); // Move to step 2 after registration
                } else {
                    document.getElementById("registrationModalClose").click()
                    toast.error(res.data.message)
                }
            }
        } catch (err) {
            toast.error(err.code)
        }
    };

    const sendOTP = async (phone) => {
        try {
            await axiosInstance.post('/send_signup_otp', { phone_number: phone })
        } catch (err) {
            toast.error(err.code)
        }
    };

    const validateOTP = async () => {
        try {
            if (otpInput === '') {
                toast.error('Please enter OTP.');
                return;
            }

            const otpData = {
                phone_number: phoneNumber,
                otp: otpInput
            };

            const res = await axiosInstance.post('/validate_otp', otpData);
            if (res.data.error_code === 0) {

                document.getElementById("registrationModalClose").click();
            }

        } catch (err) {
            console.log(err)
        }
    };

    const handlePhoneNumberInput = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        setPhoneNumber(e.target.value);
    };

    const handleLogOut = () => {
        Cookie.remove("usrin");
        dispatch(updateIsLoggedIn(false));
    }

    useEffect(() => {
        if (operatingStateStringdupli !== '') {
            operatingStates[operatingStates.length] = operatingStateStringdupli
            setOperatingStates(operatingStates)
            setoperatingStateString("")
            setoperatingStateStringdupli("")
        }
    }, [operatingStateStringdupli])

    const handleFromLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setoperatingStateStringdupli(`${cityComponent.long_name}, ${stateComponent.long_name}`)
                setoperatingStateString(`${cityComponent.long_name}, ${stateComponent.long_name}`)
            }
        }
    };

    const handleDeleteOperatingState = (deletingIndex) => {
        const deleteState = operatingStates.filter((v, i) => {
            return i !== deletingIndex
        })
        setOperatingStates(deleteState)
    }

    const handleCheckbox = (e) => {
        setChecked(e.target.checked)
        if (e.target.checked) {
            setOperatingStates(["All state and cities"])
        } else {
            setOperatingStates([])
        }
    }

    const handleVerifyMobileNumbre = async () => {
        if (forgotPassMobNum !== '' ) {
            try {
                const data = {
                    phone_number:forgotPassMobNum
                }
                const res = await axios.post('https://truck.truckmessage.com/send_forgot_pwd_otp', data)

                if(res.data.error_code === 0){
                    setForgotPasswordStep(2)
                    setforgotPassUSerId(res.data.data.user_id)
                    toast.success(res.data.message)
                }else{
                    toast.error(res.data.message)
                }
            }
            catch (err) {
                console.log(err)
            }
        } else {
            toast.error("Invalid mobile number")
        }
    }

    const handleVerifyOtp = async () => {
        if (otp !== '' && otp.length === 6) {
            try {
                const data = {
                    phone_number:forgotPassMobNum,
                    otp:otp,
                    user_id:JSON.stringify(forgotPassUSerId)
                }
                const res = await axios.post('https://truck.truckmessage.com/validate_forgot_otp', data)

                if(res.data.error_code === 0){
                    console.log(res.data)
                    setForgotPasswordStep(3)
                    toast.success(res.data.message)
                }else{
                    toast.error(res.data.message)
                }
            }
            catch (err) {
                console.log(err)
            }
        } else {
            toast.error("Invalid otp")
        }
    }

    const handleVerifyPasswords = async () => {
        if (updatePass.password !== '' || updatePass.confirm_password !== '') {
            if (updatePass.password === updatePass.confirm_password) {
                try {
                    const data = {
                        user_id:JSON.stringify(forgotPassUSerId),
                        pwd_type:"forgot_pwd",
                        new_pwd:updatePass.password
                    }
                    const res = await axios.post('https://truck.truckmessage.com/update_user_password', data)

                    if(res.data.error_code === 0){
                        document.getElementById('closeForgotPasswordModel').click()
                        toast.success(res.data.message)
                    }else{
                        toast.error(res.data.message)
                    }
                }
                catch (err) {
                    console.log(err)
                }
            } else {
                toast.error("password/confirm password does not match")
            }
        } else {
            toast.error("password/confirm password is empty")
        }
    }

    const dynamicForgotPassword = () => {
        switch (forgotPasswordStep) {
            case 1:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Forgot password</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="number" max={10} className="form-control py-3" placeholder="Phone number" value={forgotPassMobNum} onChange={(e) => setForgotPassMobNum(e.target.value)} />
                                            </div>
                                            <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyMobileNumbre}>Verify</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            case 2:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Verify OTP</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>OTP</label>
                                                <input type="number" max={6} className="form-control py-3" placeholder="Enter otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                            </div>
                                            <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyOtp}>Verify otp</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            case 3:
                return <div className="modal-content">
                    <div className="modal-header border-0 ">
                        <h1 className="modal-title fs-5 " id="staticBackdropLabel">Change Password</h1>
                        <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeForgotPasswordModel"></button>
                    </div>
                    <div className="modal-body">
                        <section>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body py-5">
                                            <div className="form-group">
                                                <label>password</label>
                                                <input type="text" className="form-control" placeholder="Password" value={updatePass.password} onChange={(e) => setUpdatePass({ ...updatePass, password: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm password</label>
                                                <input type="password" className="form-control" placeholder="Confirm Password" value={updatePass.confirm_password} onChange={(e) => setUpdatePass({ ...updatePass, confirm_password: e.target.value })} />
                                            </div>
                                            <button type="button" className="btn btn-primary btn-block" onClick={handleVerifyPasswords}>Update password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

            default:
                break;
        }
    }



    return (
        <>
            <div>
                <header className="ltn__header-5 ltn__header-transparent--- gradient-color-4---">
                    <div className="ltn__header-top-area section-bg-6 top-area-color-white---">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="ltn__top-bar-menu text-start  mailtext">
                                        <ul>
                                            <li>
                                                <a className=' mailtext' href="mailto:info@webmail.com?Subject=Flower%20greetings%20to%20you">
                                                    <i className="icon-mail" /> info@truckmessage.com
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="top-bar-right justify-content-end">
                                        <div className="ltn__top-bar-menu text-end">
                                            <ul>
                                                <li>
                                                    <div className="ltn__drop-menu ltn__currency-menu ltn__language-menu">
                                                        <ul>
                                                            <li>
                                                                <a href="#" className="dropdown-toggle">
                                                                    <span className="active-currency">English</span>
                                                                </a>
                                                                <ul>
                                                                    <li><Link to="#">Tamil</Link></li>
                                                                    <li><Link to="#">English</Link></li>
                                                                    <li><Link to="#">Hindi</Link></li>

                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white">
                        <div className="container">
                            <div className="row">

                                <div className="col">
                                    <div className="site-logo-wrap mb-0">
                                        <div className="site-logo go-top">
                                            <Link to="/"><img src={publicUrl + "assets/img/truckmessage.png"} alt="truck message Logo - All in one truck solutions" /></Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col header-menu-column d-none d-xl-block">
                                    <div className="header-menu">
                                        <nav>
                                            <div className="ltn__main-menu go-top">
                                                <ul>
                                                    <li><Link to="/">Home</Link></li>
                                                    <li><Link to="/service">Services</Link></li>
                                                    <li><Link to="/about">About</Link></li>
                                                    {/* <li><Link to="/blog">Blog</Link></li> */}
                                                    <li><Link to="/contact">Contact</Link></li>
                                                </ul>
                                            </div>
                                        </nav>
                                    </div>
                                </div>


                                <div className="col">
                                    <div className='ltn__header-options ltn__header-options-2 mb-sm-20 justify-content-end align-items-center mb-0'>
                                        {
                                            Login.isLoggedIn ?
                                                <>
                                                    <div className="dropdown dropdown m-0 h-100">
                                                        <div className="dropdown col-12 text-center" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <img className='user-icon-width btn ltn__utilize-toggle p-0 shadow' src='https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' alt="profile logo" />
                                                        </div>
                                                        <ul className="dropdown-menu dropdown-menu-lg-end">
                                                            <li className='m-0' onClick={() => pageRender("my_profile")}><button className="dropdown-item" type="button">My account</button></li>
                                                            <li className='m-0' onClick={() => pageRender("wishlist/load")}><button className="dropdown-item" type="button">My post</button></li>
                                                            <li className='m-0'><button className="dropdown-item" type="button">Enquiry</button></li>
                                                            <li className='m-0' onClick={handleLogOut}><button className="dropdown-item" type="button">Log out</button></li>
                                                        </ul>
                                                    </div>
                                                </>
                                                :
                                                <div className="ltn__drop-menu user-menu">
                                                    <ul>
                                                        <li>
                                                            <Link data-bs-toggle="modal" data-bs-target="#loginModal" title="Login">
                                                                <i className="far fa-sign-in-alt" />
                                                                <span className="tooltip">Login</span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link data-bs-toggle="modal" data-bs-target="#registerModal" title="Sign Up" onClick={() => setStep(1)}>
                                                                <i className="fas fa-user-plus" />
                                                                <span className="tooltip">Sign Up</span>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                        }

                                        <div className="dropdown mobile-menu-toggle dropdown d-xl-none">
                                            <button type="button" className="btn ltn__utilize-toggle p-0 shadow" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa-solid fa-bars p-0" />
                                            </button>
                                            <ul className="dropdown-menu end-0 dropdown-menu-lg-end">
                                                <li className='mt-0'><Link to="/" className="dropdown-item">Home</Link></li>
                                                <li className='mt-0'><Link to="/service" className="dropdown-item">Services</Link></li>
                                                <li className='mt-0'><Link to="/" className="dropdown-item">About</Link></li>
                                                <li className='mt-0'><Link to="/" className="dropdown-item">Blog</Link></li>
                                                {/* <li className='mt-0'><Link to="/blog" className="dropdown-item">Blog</Link></li> */}
                                                <li className='mt-0'><Link to="/contact" className="dropdown-item">Contact</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <div id="ltn__utilize-mobile-menu" className="ltn__utilize ltn__utilize-mobile-menu">
                    <div className="ltn__utilize-menu-inner ltn__scrollbar">
                        <div className="ltn__utilize-menu-head">
                            <div className="site-logo">
                                <Link to="/"><img src={publicUrl + "assets/img/logo.png"} alt="Logo" /></Link>
                            </div>
                            <button className="ltn__utilize-close">×</button>
                        </div>
                        <div className="ltn__utilize-menu">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/service">Services</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/blog">Blog</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
                            <ul>
                                {Login.isLoggedIn && (
                                    <li>
                                        <Link to="/my-account" title="My Account">
                                            <span className="utilize-btn-icon">
                                                <i className="far fa-user" />
                                            </span>
                                            My Account
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            {/* login modal  */}
            <div className="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 ">
                            <h1 className="modal-title fs-5 " id="staticBackdropLabel">Login</h1>
                            <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="closeSignInModel"></button>
                        </div>
                        <div className="modal-body">
                            <section>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card mx-auto p-3 pb-0 pt-2 border-0" style={{ maxWidth: '520px' }}>
                                            <div className="card-body">
                                                <div className="form-group">
                                                    <label>Phone Number</label>
                                                    <input type="text" className="form-control" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Password</label>
                                                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                                                    <div className='text-end w-100'>
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#forgotpasswordModel" onClick={() => {
                                                            setForgotPasswordStep(1)
                                                            document.getElementById("closeSignInModel").click()
                                                        }}>Forgot password ?</a>
                                                    </div>
                                                </div>
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                                    <label className="form-check-label ps-2" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                                </div>
                                                <button type="button" className="btn btn-primary btn-block" onClick={signIn}>Sign In</button>
                                                <div className='mt-4'>
                                                    <p>
                                                        Dont have an account ?
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#registerModal" onClick={() => { document.getElementById("closeSignInModel").click() }}> Register</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>


            {/* forgot password modal  */}
            <div className="modal fade" id="forgotpasswordModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    {dynamicForgotPassword()}
                </div>
            </div>

            {/* register modal  */}
            <div className="modal fade" id="registerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h1 className="modal-title fs-5  " id="staticBackdropLabel">Registration</h1>
                            <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" id="registrationModalClose"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-lg-12 p-2 border-0">
                                    <div className="card mx-auto  border-0" style={{ maxWidth: '520px' }}>
                                        <div className="card-body">
                                            {/* <h4 className="card-title mb-4">Registration</h4> */}
                                            <div id="step1" style={{ display: step === 1 ? 'block' : 'none' }}>
                                                <div className="form-group ">
                                                    <label className='mb-1'>Name</label>
                                                    <input type="text" className="form-control" placeholder="Enter Your Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>

                                                <div className="form-group ">
                                                    <label>Date of Birth</label>
                                                    <input type="date" className="form-control py-3" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                                                </div>
                                                <div className="input-item mb-3">
                                                    <label>Phone Number</label>
                                                    <div className="input-group ">
                                                        <div className="input-group-prepend d-flex">
                                                            <span className="input-group-text py-3">+91</span>
                                                        </div>
                                                        <input type="tel" className="form-control py-3 mb-0" placeholder="Phone number" value={phoneNumber} onInput={handlePhoneNumberInput} maxLength="10" />
                                                    </div>
                                                </div>
                                                <div className="input-item">
                                                    <label>Category</label>
                                                    <select className="form-select" onChange={(e) => setCategory(e.target.value)}>
                                                        <option value="">Category</option>
                                                        <option value="Lorry Owner">Lorry Owner</option>
                                                        <option value="Logistics">Logistics</option>
                                                        <option value="Lorry Contractors">Lorry Contractors</option>
                                                        <option value="Load Booking Agent">Load Booking Agent</option>
                                                        <option value="Driver">Driver</option>
                                                        <option value="Lorry Buy & Sell Dealer/Owner">Lorry Buy & Sell Dealer/Owner</option>
                                                    </select>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Operating State and City</label>
                                                    <Autocomplete name="from_location"
                                                        className="google-location location-input bg-transparent mb-1"
                                                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                                        onPlaceSelected={(place) => {
                                                            if (place) {
                                                                handleFromLocation(place.address_components);
                                                            }
                                                        }}
                                                        required
                                                        options={{
                                                            componentRestrictions: { country: "in" },
                                                        }}
                                                        value={operatingStateString}
                                                        onChange={(e) => setoperatingStateString(e.target.value)}
                                                        disabled={checked}
                                                    />
                                                    <div className='row g-2 mb-3 h-100'>
                                                        {!checked ?
                                                            operatingStates.map((v, i) => {
                                                                return <div className='col-6 h-100'>
                                                                    <div className='p-2 border rounded-2 col-12 d-flex flex-wrap'>
                                                                        <div className="col-10 p-0">
                                                                            <p className='m-0 text-break'>{v}</p>
                                                                        </div>
                                                                        <div className="col-2">
                                                                            <MdDelete className='cursor-pointer text-danger' onClick={() => handleDeleteOperatingState(i)} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            })
                                                            :
                                                            null}
                                                    </div>
                                                </div>
                                                <div className="form-check mb-3">
                                                    <input className="form-check-input" type="checkbox" value="" id="allStatesandCities" onChange={handleCheckbox} />
                                                    <label className="form-check-label ps-2" for="allStatesandCities">
                                                        All states and cities
                                                    </label>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Password</label>
                                                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Confirm Password</label>
                                                    <input type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} />
                                                    <label className="form-check-label" htmlFor="termsCheck">I agree to the terms and conditions</label>
                                                </div>
                                                <button type="button" className="btn btn-primary btn-block" onClick={register} aria-label="Register">Register</button>

                                                <div className='mt-4'>
                                                    <p>
                                                        Already have an account ?
                                                        <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal" onClick={() => { document.getElementById("registrationModalClose").click() }}> Sign in</a>
                                                    </p>
                                                </div>
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
                    </div>
                </div>
            </div>
        </>
    );
    // }
}

export default Navbar;
