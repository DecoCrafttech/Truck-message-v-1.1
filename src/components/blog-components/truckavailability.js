import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FaWeightHanging, FaTruck, FaLocationDot, FaTruckFast } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel, GiTruck } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Autocomplete from "react-google-autocomplete";
import { IoCall } from 'react-icons/io5';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { FaRegCopy } from 'react-icons/fa';


const TruckAvailability = () => {
    const LoginDetails = useSelector((state) => state.login);
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(21); // Adjust the number of cards per page as needed
    const [filters, setFilters] = useState({
        search: '',
    });

    const [aadharNumber, setAadharNumber] = useState("")
    const [aadharStep, setAadharStep] = useState(1);
    const [otpNumber, setOtpNumber] = useState("")
    const [truckBrandName, setTruckBrandName] = useState('')

    const [filterModelData, SetfilterModelData] = useState({
        user_id: "",
        vehicle_number: "",
        company_name: "",
        contact_no: "",
        from_location: "",
        to_location: "",
        truck_brand_name: "",
        truck_body_type: "",
        no_of_tyres: "",
        tone: "",
        truck_name: ""
    })

    const [contactError, setContactError] = useState(''); // State to manage contact number validation error


    const formRef = useRef(null);
    const modalRef = useRef(null);


    const fetchData = async () => {
        try {
            await axios.get('https://truck.truckmessage.com/all_truck_details')
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
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    const handleCopy = (contactNo) => {
        navigator.clipboard.writeText(contactNo)
            .then(() => {
                toast.success('Contact number copied!'); // Optional, show a success message
            })
            .catch(() => {
                toast.error('Failed to copy contact number.');
            });
    };

    const handleFilterChange = (e) => {
        setFilters({
            search: e.target.value,
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
                // card.material.toLowerCase().includes(search) ||
                card.no_of_tyres.toString().includes(search) ||
                card.truck_body_type.toLowerCase().includes(search)
            );
        });
    };

    const validateContactNumber = (contact) => {
        const contactNumberPattern = /^\d{10}$/; // Simple pattern for 10-digit numbers
        return contactNumberPattern.test(contact);
    };


    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData(event.target);
            const contactNumber = formData.get('contact_no');

            if (!validateContactNumber(contactNumber)) {
                setContactError('Please enter a valid 10-digit contact number.');
                return;
            }
            const userId = window.atob(Cookies.get("usrin"));
            const data = {
                vehicle_number: formData.get('vehicle_number'),
                company_name: formData.get('company_name'),
                name_of_the_transport: formData.get('name_of_the_transport'),
                contact_no: formData.get('contact_no'),
                from: formData.get('from_location'),
                to: formData.get('to_location'),
                truck_name: truckBrandName,
                truck_brand_name: truckBrandName,
                tone: formData.get('tone'),
                truck_body_type: formData.get('truck_body_type'),
                no_of_tyres: formData.get('tyre_count'),
                description: formData.get('description'),
                user_id: userId
            };

            await axios.post('https://truck.truckmessage.com/truck_entry', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    document.getElementById('closeAddModel').click();

                    toast.success('Form submitted successfully!');
                    formRef.current.reset();
                    setContactError('');
                    fetchData()
                })
                .catch(error => {
                    toast.error('Failed to submit the form.');
                    console.error('There was an error!', error);
                });
        }
        catch (err) {
            console.log(err)
        }
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
            const res = await axios.post("https://truck.truckmessage.com/user_truck_details_filter", filterObj, {
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




    const handleTruckAvailabilityModelOpen = async () => {
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
                    <div className="col">
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className="text-success mt-3">Verifying Aadhar</p>
                    </div>
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
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary col-12 col-md-5" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary col-12 col-md-5" onClick={handleVerifyOtp}>verify Otp</button>
                    </div>
                </div>

            case 4:
                return <div className="ltn__appointment-inner">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Vehicle Number</h6>
                                <div className="input-item input-item-name ">
                                    <input type="text" name="vehicle_number" placeholder="Enter a Vehicle Number" required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Owner Name</h6>
                                <div className="input-item input-item-name ">
                                    <input type="text" name="company_name" placeholder="Name of the Owner" required />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Contact Number</h6>
                                <div className="input-item input-item-name ">
                                <input
                                        type="text"
                                        name="contact_no"
                                        placeholder="Enter your contact number"
                                        maxLength="10"
                                        pattern="\d{10}"
                                        required
                                        title="Please enter a 10-digit contact number"
                                    />                               
                                    {contactError && <p style={{ color: 'red' }}>{contactError}</p>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <h6>Name of the transport</h6>
                                <div className="input-item input-item-name ">
                                    <input type="text" name="name_of_the_transport" placeholder="Enter name of the transport" required />
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <h6>Ton</h6>
                                <div className="input-item input-item-name ">
                                    <input type="number" name="tone" placeholder="Example: 2 tons" required />
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <h6>Truck Name</h6>

                                <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                                    {truckBrandName === '' ? 'select truck' : `${truckBrandName} `}
                                </button>
                                <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                                    <li onClick={() => setTruckBrandName('ashok_leyland')}><a class="dropdown-item">Ashok_leyland</a></li>
                                    <li onClick={() => setTruckBrandName('tata')}><a class="dropdown-item">Tata</a></li>
                                    <li onClick={() => setTruckBrandName('mahindra')}><a class="dropdown-item">Mahindra</a></li>
                                    <li onClick={() => setTruckBrandName('eicher')}><a class="dropdown-item">Eicher</a></li>
                                    <li onClick={() => setTruckBrandName('daimler_india')}><a class="dropdown-item">Daimler_india</a></li>
                                    <li onClick={() => setTruckBrandName('bharat_benz')}><a class="dropdown-item">Bharat_benz</a></li>
                                    <li onClick={() => setTruckBrandName('maruthi_suzuki')}><a class="dropdown-item">Maruthi_suzuki</a></li>
                                    <li onClick={() => setTruckBrandName('sml_isuzu')}><a class="dropdown-item">Sml_isuzu</a></li >
                                    <li onClick={() => setTruckBrandName('force')}><a class="dropdown-item">Force</a></li >
                                    <li onClick={() => setTruckBrandName('amw')}><a class="dropdown-item">Amw</a></li >
                                    <li onClick={() => setTruckBrandName('man')}><a class="dropdown-item">Man</a></li >
                                    <li onClick={() => setTruckBrandName('scania')}><a class="dropdown-item">Scania</a></li >
                                    <li onClick={() => setTruckBrandName('volvo')}><a class="dropdown-item">Volvo</a></li >
                                    <li onClick={() => setTruckBrandName('others')}><a class="dropdown-item">Others</a></li >
                                </ul >
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>From</h6>
                                <div className="input-item input-item-name">
                                    <Autocomplete name="from_location"
                                        className="google-location location-input bg-transparent py-2"
                                        apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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
                                {/*                                             
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" name="from_location" placeholder="Location" required />
                            </div> */}
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>To</h6>
                                <div className="input-item input-item-name">
                                    <Autocomplete name="to_location"
                                        className="google-location location-input bg-transparent py-2"
                                        apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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
                                {/*                                             
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" name="to_location" placeholder="Location" required />
                            </div> */}
                            </div>
                        </div>
                        <div className="row">
                            {/* <div>
                            <h6>Material</h6>
                            <div className="input-item input-item-name ltn__custom-icon">
                                <input type="text" name="material_type" placeholder="What type of material" required />
                            </div>
                        </div> */}


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
                                        <option value="4">4</option>
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
                            <div>
                                <h6>Descriptions (Optional)</h6>
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                    <textarea name="description" placeholder="Enter a text here" required />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer btn-wrapper text-center mt-3">
                            <button className="btn theme-btn-1 text-uppercase" type="submit">Submit</button>
                        </div>
                    </form>
                </div>

            default:
                break;
        }
    }

    const handleMessageClick = (card) => {
        navigate(`/chat?person_id=${card.user_id}`);
    };


    return (
        <div>
            <Toaster />
            <div className="ltn__product-area ltn__product-gutter mb-50 ">
                <div className="container">
                <div className='text-center ' ><h2 className='cardmodifyhead'>Truck Availability</h2></div>   
                    <div className="row">
                        <div className="col-lg-12 mb-2">
                            <div className='row'>
                                <div className=" col-lg-8 mb-2">
                                    <div className="showing-product-number text-right">
                                        <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} results</span>
                                    </div>
                                </div>
                                <div className='col-lg-4 mb-2' >
                                    <div>
                                        {LoginDetails.isLoggedIn ? (
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#addtruckavailability" onClick={handleTruckAvailabilityModelOpen}>+ Add Truck availability</button>

                                        ) :
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal">+ Add Truck availability check</button>
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
                                    <button type="button" className="filterbtn" data-bs-toggle="modal" data-bs-target="#truckfilter" >Filter</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* modal */}
            <div className="modal fade" id="addtruckavailability" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${aadharStep === 4 ? 'modal-lg' : 'modal-md'}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Truck</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeAddModel"></button>
                        </div>
                        <div className="modal-body">
                            {handleAddarVerifiactionStatus()}
                        </div>
                    </div>
                </div>
            </div>


            {/* filter modal */}
            <div className="modal fade" id="truckfilter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Truck</h1>
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
                                                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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
                                                    apiKey={process.env.REACT_APP_GOOGLE_PLACES_KEY}
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

            {/* card */}
            <div className='container'>
                <div className="row row-cols-1 row-cols-md-3 g-4 mb-60 ">
                    {currentCards.reverse().map(card => (
                        <div className="col" key={card.id}>
                            <div className="card h-100 shadow truckcard">   
                                <div className='card-header mt-2 border-0 mb-2'>
                                    <h5 className="card-title cardmodify">{card.profile_name}</h5>
                                    <p className='.fs-6 mb-0 reviewtext '>
                                        {/* Generate the star ratings based on the response */}
                                        {[...Array(5)].map((_, index) => (
                                            <span key={index} className="float-right">
                                                <i className={`text-warning fa fa-star ${index < card.rating ? '' : 'text-muted'}`}></i>
                                            </span>
                                        ))}
                                        <span>({card.review_count} 4)</span>
                                        <p className="float-end mb-0 text-b"> <strong>Posts </strong> {card.user_post}</p>

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
                                        {/* <div className="col-lg-12 cardicon">
                                            <div><label>Distance: {"hii"}</label></div>
                                        </div> */}
                                    </div>
                                    <hr className="hr m-2" />
                                    <div className='row mt-3'>
                                        <div className="col-lg-6 cardicontext">
                                            <div>
                                                <label><FaWeightHanging className='me-2' />{card.tone} ton</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <div><label><SiMaterialformkdocs className='me-2' />{card.truck_body_type}</label></div>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <label><GiCarWheel className='me-2' />{card.no_of_tyres} wheels</label>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <label><FaTruck className='me-2' />{card.truck_name}</label>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <label><FaTruckFast className='me-2' />{card.vehicle_number}</label>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <label><HiOutlineOfficeBuilding className='me-2' />{card.company_name}</label>
                                        </div>
                                        <div className="col-lg-6 cardicontext">
                                            <label><GiTruck className='me-2' />{card.name_of_the_transport}</label>
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
                                                        <FaRegCopy className='me-2' />
                                                        Contact                                                     </button>
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

export default TruckAvailability;
