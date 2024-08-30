import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Autocomplete from "react-google-autocomplete";
import { IoCall } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const PortfolioV1 = () => {
    const LoginDetails = useSelector((state) => state.login);
    const navigate =useNavigate();
    

    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(21); // Adjust the number of cards per page as needed
    const [filters, setFilters] = useState({
        search: '',
    });

    const [filterModelData, SetfilterModelData] = useState({
        company_name: "",
        user_id: "",
        from_location: "",
        to_location: "",
        truck_body_type: "",
        no_of_tyres: "",
        material: "",
        tone: ""
    })

    const [contactError, setContactError] = useState(''); // State to manage contact number validation error

    const [aadharNumber, setAadharNumber] = useState("")
    const [aadharStep, setAadharStep] = useState(1);
    const [otpNumber, setOtpNumber] = useState("")

    const formRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                await axios.get('https://truck.truckmessage.com/all_load_details')
                    .then(response => {
                        if (response.data.success && Array.isArray(response.data.data)) {
                            setCards(response.data.data);
                        } else {
                            console.error('Unexpected response format:', response.data);
                        }
                    })
                    .catch(error => {
                        console.error('There was an error fetching the data!', error);
                    });
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()

        window.scrollTo(0, 0)
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            search: e.target.value,
        });
    };

    const handleCopy = (contactNo) => {
        navigator.clipboard.writeText(contactNo)
            .then(() => {
                toast.success('Contact number copied to clipboard!'); // Optional, show a success message
            })
            .catch(() => {
                toast.error('Failed to copy contact number.');
            });
    };

    const filterCards = (cards) => {
        return cards.filter(card => {
            const search = filters.search.toLowerCase();
            return (
                card.company_name.toLowerCase().includes(search) ||
                card.from_location.toLowerCase().includes(search) ||
                card.to_location.toLowerCase().includes(search) ||
                card.tone.toString().includes(search) ||
                card.material.toLowerCase().includes(search) ||
                card.no_of_tyres.toString().includes(search) ||
                card.truck_body_type.toLowerCase().includes(search)
            );
        });
    };

    const validateContactNumber = (contact) => {
        const contactNumberPattern = /^\d{10}$/; // Simple pattern for 10-digit numbers
        return contactNumberPattern.test(contact);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const contactNumber = formData.get('contact_no');

        if (!validateContactNumber(contactNumber)) {
            setContactError('Please enter a valid 10-digit contact number.');
            return;
        }

        const userId = window.atob(Cookies.get("usrin"));
        const data = {
            company_name: formData.get('company_name'),
            contact_no: contactNumber,
            from: formData.get('from_location'),
            to: formData.get('to_location'),
            material: formData.get('material'),
            tone: formData.get('tone'),
            truck_body_type: formData.get('truck_body_type'),
            no_of_tyres: formData.get('tyre_count'),
            description: formData.get('description'),
            user_id: userId
        };

        axios.post('https://truck.truckmessage.com/load_details', data, {
            headers: {
                'Content-Type': 'application/json'
            }

        })
            .then(response => {
                toast.success('Form submitted successfully!');
                formRef.current.reset();
                setContactError('');
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            })
            .catch(error => {
                toast.error('Failed to submit the form.');
                console.error('There was an error!', error);
            });
    };

    const filteredCards = filterCards(cards);

    // Calculate the index of the last card on the current page
    const indexOfLastCard = currentPage * cardsPerPage;
    // Calculate the index of the first card on the current page
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    // Get the cards to be displayed on the current page
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const [showingFromLocation, setShowingFromLocation] = useState("");
    const [showingToLocation, setShowingToLocation] = useState("");
    const [editCompanyFromLocation, setEditCompanyFromLocation] = useState({
        city: "",
        state: "",
    });
    const [editCompanyToLocation, setEditCompanyToLocation] = useState({
        city: "",
        state: "",
    });

    const handleFromLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setEditCompanyFromLocation({
                    city: cityComponent.long_name,
                    state: stateComponent.long_name,
                });
                setShowingFromLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    };

    const handleToLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setEditCompanyToLocation({
                    city: cityComponent.long_name,
                    state: stateComponent.long_name,
                });
                setShowingToLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    };

    const handleApplyFilter = async () => {
        const filterObj = { ...filterModelData }
        filterObj.from_location = showingFromLocation
        filterObj.to_location = showingToLocation

        try {
            const res = await axios.post("https://truck.truckmessage.com/user_load_details_filter", filterObj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.data.error_code === 0) {
                setCards(res.data.data)
                toast.success(res.data.message)
                document.getElementById("closeFilterBox").click()
            } else {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleloadAvailabilityModelOpen = async () => {
        if (Cookies.get("otpId")) {
            setAadharStep(3)
        } else {
            setAadharStep(1)
            try {
                const encodedUserId = Cookies.get("usrin");
                if (encodedUserId) {
                    const userId = window.atob(encodedUserId);

                    const res = await axios.post('https://truck.truckmessage.com/check_aadhar_verification', {
                        user_id: userId,
                    })

                    if (res.data.error_code === 0) {
                        if (res.data.data.is_aadhar_verified) {
                            setTimeout(() => {
                                setAadharStep(4)
                            }, 1500)
                        } else {
                            setTimeout(() => {
                                setAadharStep(2)
                            }, 1500)
                        }
                    } else {
                        setAadharStep(1)
                    }
                }
                else {
                    toast.error("User ID not found in cookies");
                }
            } catch (err) {
                console.log(err)
            }
        }
    }

    const handleUpdateAadhar = e => {
        const aadharnum = e.target.value.replace(/[^0-9]/g, '')
        if (aadharnum.length <= 12) {
            setAadharNumber(aadharnum)
        }
    }

    const handleVerifyAadhar = async () => {
        if (aadharNumber !== '' && aadharNumber.length === 12) {
            try {
                const res = await axios.post("https://truck.truckmessage.com/aadhaar_generate_otp", { id_number: aadharNumber })
                if (res.data.error_code === 0) {
                    Cookies.set("otpId", res.data.data[0].client_id, {
                        secure: true,
                        sameSite: 'strict',
                        path: '/'
                    })
                    setAadharStep(3)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            toast.error("invalid aadhar number")
        }
    }

    const handleUpdateOtp = e => {
        const otpnum = e.target.value.replace(/[^0-9]/g, '')
        if (otpnum.length <= 6) {
            setOtpNumber(otpnum)
        }
    }

    const handleVerifyOtp = async () => {
        if (otpNumber !== '' && otpNumber.length === 6) {
            try {
                const encodedUserId = Cookies.get("usrin");
                const userId = window.atob(encodedUserId);

                const data = {
                    client_id: Cookies.get('otpId'),
                    user_id: userId,
                    otp: otpNumber
                }
                const res = await axios.post("https://truck.truckmessage.com/aadhaar_submit_otp", data)
                if (res.data.error_code === 0) {
                    Cookies.remove("otpId")
                    setAadharStep(4)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            toast.error("invalid otp number")
        }
    }

    const handleAddarVerifiactionStatus = () => {
        switch (aadharStep) {
            case 1:
                return <div className="py-5 row align-items-center justify-content-center text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className='text-success mt-3'>Verifying Aadhar</p>
                </div>

            case 2:
                return <div>
                    <div className="py-5 row align-items-center justify-content-center">
                        <div className="col-12 col-md-9">
                            <h4 className='mb-3'>Verify Aadhar</h4>
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" value={aadharNumber} placeholder="Enter your aadhar number" onChange={handleUpdateAadhar} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <button type="button" className="btn btn-secondary col-12 col-md-5" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary col-12 col-md-5" onClick={handleVerifyAadhar}>verify aadhar</button>
                    </div>
                </div>

            case 3:
                return <div>
                    <div className="py-5 row align-items-center justify-content-center">
                        <div className="col-12 col-md-6">
                            <h4 className='mb-3'>Verify Otp</h4>
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" value={otpNumber} placeholder="Enter Otp" onChange={handleUpdateOtp} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-between">
                        <button type="button" className="btn btn-secondary col-12 col-md-5" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary col-12 col-md-5" onClick={handleVerifyOtp}>verify Otp</button>
                    </div>
                </div>

            case 4:
                return <div className="ltn__appointment-inner">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Company Name</h6>

                                <div className="input-item input-item-name ltn__custom-icon">
                                    <input type="text" name="company_name" placeholder="Name of the Owner" required />
                                </div>

                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Contact Number</h6>
                                <div className="input-item input-item-email ltn__custom-icon">
                                    <input type="tel" name="contact_no" placeholder="Type your contact number" required />
                                    {contactError && <p style={{ color: 'red' }}>{contactError}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>From</h6>
                                <div className="input-item input-item-name">
                                    <Autocomplete name="from_location"
                                        className="google-location location-input bg-transparent py-2"
                                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                        onPlaceSelected={(place) => {
                                            if (place) {
                                                handleFromLocation(place.address_components);
                                            }
                                        }}
                                        required
                                        value={showingFromLocation}
                                        onChange={(e) => setShowingFromLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>To</h6>
                                <div className="input-item input-item-name">
                                    <Autocomplete name="to_location"
                                        className="google-location location-input bg-transparent py-2"
                                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                        onPlaceSelected={(place) => {
                                            if (place) {
                                                handleToLocation(place.address_components);
                                            }
                                        }}
                                        required
                                        value={showingToLocation}
                                        onChange={(e) => setShowingToLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Material</h6>
                                <div className="input-item input-item-name ltn__custom-icon">
                                    <input type="text" name="material" placeholder="What type of material" required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Ton</h6>
                                <div className="input-item input-item-name ltn__custom-icon">
                                    <input type="text" name="tone" placeholder="Example: 2 tones" required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Truck Body Type</h6>
                                <div className="input-item">
                                    <select className="nice-select" name="truck_body_type" required>
                                        <option value="open_body">Open Body</option>
                                        <option value="container">Container</option>
                                        <option value="trailer">Trailer</option>
                                        <option value="tanker">Tanker</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>No. of Tyres</h6>
                                <div className="input-item">
                                    <select className="nice-select" name="tyre_count" required>
                                        <option value="6">6</option>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                        <option value="14">14</option>
                                        <option value="16">16</option>
                                        <option value="18">18</option>
                                        <option value="20">20</option>
                                        <option value="22">22</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h6>Descriptions (Optional)</h6>
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                    <textarea name="description" placeholder="Enter a text here" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer btn-wrapper text-center mt-4">
                            <button className="btn theme-btn-1 text-uppercase" type="submit">Submit</button>
                        </div>
                    </form>
                </div>

            default:
                break;
        }
    }

    const handleGetDistance = (from,to) =>{

    }

    const handleMessageClick = (card) => {
        navigate(`/chat?person_id=${card.user_id}`);
    };

    return (
        <div>
            <div className="ltn__product-area ltn__product-gutter mb-50 mt-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-2">
                            <div className='row'>
                                <div className=" col-lg-8 mb-2">
                                    <div className="showing-product-number text-right">
                                        <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} results</span>
                                    </div>
                                </div>
                                <div className='col-lg-4 mb-2' >
                                    <div >
                                        {/* <Link to="/add-listing"> + Add Load availability</Link> */}
                                        {LoginDetails.isLoggedIn ? (
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#addloadavailability" onClick={handleloadAvailabilityModelOpen}>+ Add Load availability</button>

                                        ) :
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal">+ Add Load availability</button>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr></hr>
                        <div className='col-12'>
                            <div className='row'>
                                <div className="col-lg-8">
                                    {/* Search Widget */}
                                    <div className="ltn__search-widget mb-0">
                                        <form action="">
                                            <input type="text" name="search" placeholder="Search by ..." onChange={handleFilterChange} />
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-4 ">
                                    {/* Filter */}
                                    <button type="button" className="filterbtn" data-bs-toggle="modal" data-bs-target="#loadfilter" >Filter</button>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="addloadavailability" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? 'modal-lg' : 'modal-md'}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Load</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="clodeBuySellModel"></button>
                        </div>
                        <div className="modal-body">
                            {handleAddarVerifiactionStatus()}
                        </div>
                    </div>
                </div>
            </div>

            {/* filter modal */}
            <div className="modal fade" id="loadfilter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeFilterBox"></button>
                        </div>
                        <div className="modal-body ps-4 pe-4 p-">
                            <div className="ltn__appointment-inner ">
                                <form ref={formRef} onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <h6>From</h6>
                                            <div className="input-item input-item-name">
                                                <Autocomplete name="from_location"
                                                    className="google-location location-input bg-transparent py-2"
                                                    apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                                    onPlaceSelected={(place) => {
                                                        if (place) {
                                                            handleFromLocation(place.address_components);
                                                        }
                                                    }}
                                                    value={showingFromLocation}
                                                    onChange={(e) => setShowingFromLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <h6>To</h6>
                                            <div className="input-item input-item-name">
                                                <Autocomplete name="to_location"
                                                    className="google-location location-input bg-transparent py-2"
                                                    apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                                    onPlaceSelected={(place) => {
                                                        if (place) {
                                                            handleToLocation(place.address_components);
                                                        }
                                                    }}
                                                    value={showingToLocation}
                                                    onChange={(e) => setShowingToLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <h6>Truck Body Type</h6>
                                            <div className="input-item">
                                                <select className="nice-select" name="truck_body_type" required>
                                                    <option value="open_body">LCV</option>
                                                    <option value="container">Bus</option>
                                                    <option value="trailer">Open body vehicle</option>
                                                    <option value="tanker">Tanker</option>
                                                    <option value="tanker">Trailer</option>
                                                    <option value="tanker">Tipper</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <h6>No. of Tyres</h6>
                                            <div className="input-item">
                                                <select className="nice-select" name="tyre_count" onChange={(e) => SetfilterModelData({ ...filterModelData, no_of_tyres: e.target.value })}>
                                                    <option value="6">6</option>
                                                    <option value="10">10</option>
                                                    <option value="12">12</option>
                                                    <option value="14">14</option>
                                                    <option value="16">16</option>
                                                    <option value="18">18</option>
                                                    <option value="20">20</option>
                                                    <option value="22">22</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-0" >
                                        <div className="col-12 col-md-6">
                                            <h6>Material</h6>
                                            <div className="input-item input-item-name ltn__custom-icon">
                                                <input type="text" name="material" placeholder="What type of material" onChange={(e) => SetfilterModelData({ ...filterModelData, material: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <h6>Ton</h6>
                                            <div className="input-item input-item-name ltn__custom-icon">
                                                <input type="text" name="tone" placeholder="Example: 2 tones" onChange={(e) => SetfilterModelData({ ...filterModelData, tone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleApplyFilter}>Apply Filter</button>
                        </div>
                    </div>
                </div>
            </div>



            {/* card  */}
            <div className='container'>
                <div className="row row-cols-1 row-cols-md-3 g-4 mb-60 ">
                    {currentCards.map(card => (
                        <div className="col" key={card.id}>
                            <div className="card h-100 shadow truckcard">
                                <div className='card-header mt-2 border-0 mb-0 '>
                                    <h5 className="card-title cardmodify">{card.profile_name}</h5>
                                    <p className='.fs-6 mb-0 reviewtext '>
                                        {/* Generate the star ratings based on the response */}
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className="float-right">
                                                <i className={`text-warning fa fa-star ${index < card.rating ? '' : 'text-muted'}`}></i>
                                            </span>
                                        ))}
                                        <span>({card.review_count})</span>
                                        <p className="float-end mb-0 text-b"> <strong>Posts </strong> : {card.user_post}</p>

                                    </p>

                                </div>

                                <div className="card-body p-3 mt-2 mb-2">
                                    <div className='row'>
                                        <div className="col-lg-12 cardicon">
                                            <div>
                                                <label><FaLocationDot className="me-2 text-danger" />{card.from_location}</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-12 cardicon">
                                            <div><label><FaLocationDot className='me-2 text-success' />{card.to_location}</label></div>
                                        </div>

                                        {handleGetDistance(card.from_location,card.to_location)}
                                    </div>
                                    <hr className="hr m-2" />
                                    <div className='row mt-3'>
                                        <div className="col-lg-6 cardicon">
                                            <div>
                                                <label><FaWeightHanging className='me-2' />{card.tone} ton</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 cardicon">
                                            <div><label><SiMaterialformkdocs className='me-2' />{card.material}</label></div>
                                        </div>
                                        <div className="col-lg-6 cardicon">
                                            <label><GiCarWheel className='me-2' />{card.no_of_tyres} wheels</label>
                                        </div>
                                        <div className="col-lg-6 cardicon">
                                            <label><FaTruck className='me-2' />{card.truck_body_type}</label>
                                        </div>
                                        <div className="col-lg-12 cardicon">
                                            <label><HiOutlineOfficeBuilding className='me-2' />{card.company_name}</label>
                                        </div>
                                    </div>
                                    <div className='m-2'>
                                        <h5 className="card-title mt-3">Description</h5>
                                        <p className="card-text paragraph">{card.description}</p>
                                    </div>
                                </div>
                                <div className="card-footer mb-3">
                                    <div>
                                        {LoginDetails.isLoggedIn ? (
                                            <div className="d-flex flex-wrap mt-3">
                                                {/* <div className='col-6'>
                                                    <a href={`tel:${card.contact_no}`} className="btn btn-success  w-100" type="button"> <IoCall className='me-3' />Call</a>
                                                </div> */}
                                                <div className='col-6'>
                                                    {/* <button className="btn btn-success w-100" type="button"> <IoCall  className='me-3' />{card.contact_no}</button> */}
                                                    <button
                                                        className="btn btn-success w-100"
                                                        type="button"
                                                        onClick={() => handleCopy(card.contact_no)}
                                                    >
                                                        <IoCall className='me-3' />{card.contact_no}
                                                    </button>
                                                </div>
                                                <div className='col-6'>
                                                    <button className="btn cardbutton w-100" type="button" onClick={() => handleMessageClick(card)}>Message</button>
                                                </div>
                                            </div>
                                        ) :
                                            <div className="d-grid gap-2">
                                                <button className="btn cardbutton" type="button" data-bs-toggle="modal" data-bs-target="#loginModal">View Details</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    <ul className='pagination-list'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className='pagination-item'>
                                <button
                                    onClick={() => paginate(index + 1)}
                                    className={currentPage === index + 1 ? 'pagination-link active' : 'pagination-link'}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PortfolioV1;





