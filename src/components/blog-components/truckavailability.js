import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { FaWeightHanging, FaTruck, FaLocationDot, FaTruckFast } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel, GiTruck } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router for navigation
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Autocomplete from "react-google-autocomplete";
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import Select from 'react-dropdown-select';
import axiosInstance from '../../Services/axiosInstance';
import { RiMapPinTimeFill } from 'react-icons/ri';


const TruckAvailability = () => {
    let publicUrl = process.env.PUBLIC_URL + '/'

    const LoginDetails = useSelector((state) => state.login);
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userStateList, setUserStateList] = useState([])
    const [cardsPerPage] = useState(21); // Adjust the number of cards per page as needed
    const [filters, setFilters] = useState({
        search: '',
    });

    const [aadharNumber, setAadharNumber] = useState("")
    const [aadharStep, setAadharStep] = useState(1);
    const [otpNumber, setOtpNumber] = useState("")

    const [selectToLocationSingle, setSelectToLocationSingle] = useState("")
    const [selectToLocationMultiple, setSelectToLocationMultiple] = useState([])

    const truckBodyType = ["LCV", "Container", "Open body vehicle", "Tanker", "Trailer", "Tipper"];
    const numOfTyres = [4, 6, 10, 12, 14, 16, 18, 20, 22]

    const [editingData, setEditingData] = useState({
        vehicle_number: '',
        company_name: '',
        name_of_the_transport: '',
        contact_no: '',
        truck_name: '',
        truck_brand_name: '',
        tone: '',
        truck_body_type: '',
        no_of_tyres: '',
        description: ''
    });


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

    const [selectedContactNum, setSelectedContactNum] = useState(null)
    const [viewContactId, setviewContactId] = useState(null)

    const fetchData = async () => {
        try {
            await axios.get('https://truck.truckmessage.com/all_truck_details')
                .then(response => {
                    if (response.data.success && Array.isArray(response.data.data)) {
                        const reOrder = response.data.data.sort(function(a,b){
                            if(new Date(a.updt) > new Date(b.updt)){
                                return -1
                            }
                        })
 
                        setCards(reOrder)
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

    const getUserStateList = async () => {
        try {
            const userId = window.atob(Cookies.get("usrin"));
            const data = {
                user_id: userId
            }

            const res = await axiosInstance.post("/get_user_state_list", data)

            if (res.data.error_code === 0) {
                if (res.data.data) {
                    const convertToSelect = res.data.data[0].state_list.map((val, ind) => {
                        return { value: ind + 1, label: val }
                    })
                    setUserStateList(convertToSelect)
                }
                else {
                    setUserStateList([])
                }
            } else {
                setUserStateList([])
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
        getUserStateList()
    }, []);

    const handleCopy = (contactNo, cardId) => {
        // navigator.clipboard.writeText(contactNo)
        //     .then(() => {
        //         toast.success('Contact number copied!'); // Optional, show a success message
        //     })
        //     .catch(() => {
        //         toast.error('Failed to copy contact number.');
        //     });
        setSelectedContactNum(null)

        setviewContactId(cardId)
        setTimeout(() => {
            setSelectedContactNum(contactNo)
            setviewContactId(null)
        }, 800)
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


    const handleSubmit = async () => {
        const userId = window.atob(Cookies.get("usrin"));
        const data = {
            vehicle_number: editingData.vehicle_number,
            company_name: editingData.company_name,
            name_of_the_transport: editingData.name_of_the_transport,
            contact_no: editingData.contact_no,
            from: showingFromLocation,
            to: showingToLocation,
            truck_name: editingData.truck_brand_name,
            truck_brand_name: editingData.truck_brand_name,
            tone: editingData.tone,
            truck_body_type: editingData.truck_body_type,
            no_of_tyres: editingData.no_of_tyres,
            description: editingData.description,
            user_id: userId
        };

        console.log(data)

        try {
            if (data.vehicle_number && data.company_name && data.name_of_the_transport && data.contact_no && data.from && data.to && data.truck_brand_name && data.truck_brand_name && data.tone && data.truck_body_type && data.no_of_tyres) {
                if (!validateContactNumber(data.contact_no)) {
                    setContactError('Please enter a valid 10-digit contact number.');
                    return;
                }

                const res = await axios.post('https://truck.truckmessage.com/truck_entry', data, {})
                if (res.data.error_code === 0) {
                    document.getElementById('closeAddModel').click();
                    setEditingData({
                        vehicle_number: '',
                        company_name: '',
                        name_of_the_transport: '',
                        contact_no: '',
                        truck_name: '',
                        truck_brand_name: '',
                        tone: '',
                        truck_body_type: '',
                        no_of_tyres: '',
                        description: ''
                    })
                    setShowingFromLocation('')
                    setShowingToLocation('')
                    setSelectToLocationSingle("")

                    toast.success(res.data.message);
                    fetchData()
                } else {
                    toast.error(res.data.message);
                }
            } else {
                toast.error('Some fields are missing');
            }
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
        const spreadMultipleLocation = selectToLocationMultiple.map((v) => v.label)

        const filterObj = { ...filterModelData }
        filterObj.truck_name = filterModelData.truck_brand_name
        filterObj.from_location = showingFromLocation
        filterObj.to_location = spreadMultipleLocation

        try {
            const res = await axios.post("https://truck.truckmessage.com/user_truck_details_filter", filterObj)

            if (res.data.error_code === 0) {
                const reOrder = res.data.data.sort(function(a,b){
                    if(new Date(a.updt) > new Date(b.updt)){
                        return -1
                    }
                })

                setCards(reOrder)
                
                toast.success(res.data.message)
                document.getElementById("closeFilterBox").click()

                // SetfilterModelData({
                //     user_id: "",
                //     vehicle_number: "",
                //     company_name: "",
                //     contact_no: "",
                //     from_location: "",
                //     to_location: "",
                //     truck_brand_name: "",
                //     truck_body_type: "",
                //     no_of_tyres: "",
                //     tone: "",
                //     truck_name: ""
                // })
                // setShowingFromLocation("")
                // setShowingToLocation("")

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
                    <div className="row gy-4">
                        <div className="col-12 col-md-6">
                            <h6>Vehicle Number</h6>
                            <div className="input-item input-item-email">
                                <input
                                    type="tel"
                                    name="contact_no"
                                    className="mb-0"
                                    placeholder="Type your Vehicle Number"
                                    value={editingData.vehicle_number}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            vehicle_number: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Owner Name</h6>
                            <div className="input-item input-item-name">
                                <input
                                    type="text"
                                    className="mb-0"
                                    name="company_name"
                                    placeholder="Name of the Owner"
                                    value={editingData.company_name}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            company_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Contact Number</h6>
                            <div className="input-item input-item-email">
                                <input
                                    type="tel"
                                    name="contact_no"
                                    className="mb-0"
                                    placeholder="Type your contact number"
                                    value={editingData.contact_no}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            contact_no: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {contactError && (
                                    <p style={{ color: "red" }}>{contactError}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Name of the transport</h6>
                            <div className="input-item input-item-name ">
                                <input type="text" name="name_of_the_transport" className='m-0' placeholder="Enter name of the transport"
                                    value={editingData.name_of_the_transport}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            name_of_the_transport: e.target.value,
                                        })
                                    }
                                    required />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Ton</h6>
                            <div className="input-item input-item-name ">
                                <input type="number" name="tone" className='m-0' placeholder="Example: 2 tons"
                                    value={editingData.tone}
                                    onChange={(e) =>
                                        setEditingData({
                                            ...editingData,
                                            tone: e.target.value,
                                        })
                                    }
                                    required />
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Brand Name</h6>

                            <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                                {editingData.truck_brand_name === '' ? 'select Brand name' : `${editingData.truck_brand_name} `}
                            </button>
                            <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'ashok_leyland'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Ashok_leyland</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'tata'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Tata</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'mahindra'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Mahindra</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'eicher'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Eicher</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'daimler_india'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Daimler_india</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'bharat_benz'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Bharat_benz</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'maruthi_suzuki'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Maruthi_suzuki</a></li>
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'sml_isuzu'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Sml_isuzu</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'force'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Force</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'amw'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Amw</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'man'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Man</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'scania'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Scania</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'volvo'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Volvo</a></li >
                                <li onClick={() => setEditingData({
                                    ...editingData, truck_brand_name: 'others'
                                })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Others</a></li >
                            </ul >
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>From</h6>
                            <div className="input-item input-item-name">
                                <Autocomplete name="from_location"
                                    className="google-location location-input bg-transparent py-2 m-0"
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

                        </div>
                        <div className="col-12 col-md-6">
                            <h6>To</h6>
                            {/* <Select options={userStateList} className='selectBox-innerWidth' onChange={(e) => setSelectToLocationSingle(e)} /> */}
                            <div className="input-item input-item-name">
                                <Autocomplete name="to_location"
                                    className="google-location location-input bg-transparent py-2 mb-0"
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
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>Truck Body Type</h6>
                            <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                {editingData.truck_body_type === '' ? 'select body type' : `${editingData.truck_body_type}`}
                            </button>
                            <ul class="dropdown-menu col-11 dropdown-ul">
                                {
                                    truckBodyType.map((bodyType) => {
                                        return <li onClick={() => setEditingData({
                                            ...editingData, truck_body_type: bodyType,
                                        })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                                    })
                                }
                            </ul >
                        </div>

                        <div className="col-12 col-md-6">
                            <h6>No. of Tyres</h6>
                            <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                {editingData.no_of_tyres === '' ? 'select number of tyres' : `${editingData.no_of_tyres}`}
                            </button>
                            <ul class="dropdown-menu col-11 dropdown-ul">
                                {
                                    numOfTyres.map((numOfTyres) => {
                                        return <li onClick={() => setEditingData({
                                            ...editingData, no_of_tyres: numOfTyres,
                                        })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                                    })
                                }
                            </ul >
                        </div>

                        <div className="col-12 col-md-12">
                            <h6>Descriptions </h6>
                            <div className="input-item input-item-textarea ltn__custom-icon">
                                <textarea name="description" placeholder="Enter a text here" value={editingData.description} onChange={(e) => setEditingData({
                                    ...editingData, description: e.target.value
                                })} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer btn-wrapper text-center mt-3">
                        <button className="btn btn-primary text-uppercase" type="button" onClick={handleSubmit}>Submit</button>
                    </div>
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
            <div className="ltn__product-area ltn__product-gutter mb-50 ">
                <div className="container">
                    <div className='text-center'><h2 className='cardmodifyhead'>Truck Availability</h2></div>
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
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal">+ Add Truck availability </button>
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

                                <div className="col-6 col-lg-2 ">
                                    <button type="button" className="btn btn-primary filterbtn" data-bs-toggle="modal" data-bs-target="#truckfilter" >Filter</button>
                                </div>

                                <div className="col-6 col-lg-2 ">
                                    <button type="button" className="btn btn-secondary filterbtn" onClick={() => fetchData()}>Clear filter</button>
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
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Filter</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeFilterBox"></button>
                        </div>
                        <div className="modal-body ps-4 pe-4 p-">
                            <div className="ltn__appointment-inner ">
                                <div className="row gy-4">
                                    <div className="col-12 col-md-6">
                                        <h6>From</h6>
                                        <div className="input-item input-item-name">
                                            <Autocomplete name="from_location"
                                                className="google-location location-input bg-transparent py-2 mb-0"
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
                                        <Select multi options={userStateList} className='selectBox-innerWidth' onChange={(e) => setSelectToLocationMultiple(e)} />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>Brand Name</h6>

                                        <button type="button" class="btn btn-transparent dropdown-toggle col-12 py-3 dropdown-arrow shadow-none border rounded text-start p-3" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filterModelData.truck_brand_name === '' ? 'select truck' : `${filterModelData.truck_brand_name} `}
                                        </button>
                                        <ul class="dropdown-menu  cup shadow-0 col-11 dropdown-ul">
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'ashok_leyland'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Ashok_leyland</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'tata'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Tata</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'mahindra'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Mahindra</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'eicher'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Eicher</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'daimler_india'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Daimler_india</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'bharat_benz'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Bharat_benz</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'maruthi_suzuki'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Maruthi_suzuki</a></li>
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'sml_isuzu'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Sml_isuzu</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'force'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Force</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'amw'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Amw</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'man'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Man</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'scania'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Scania</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'volvo'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Volvo</a></li >
                                            <li onClick={() => SetfilterModelData({
                                                ...filterModelData, truck_brand_name: 'others'
                                            })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">Others</a></li >
                                        </ul >
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>Truck Body Type</h6>
                                        <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filterModelData.truck_body_type === '' ? 'select body type' : `${filterModelData.truck_body_type}`}
                                        </button>
                                        <ul class="dropdown-menu col-11 dropdown-ul">
                                            {
                                                truckBodyType.map((bodyType) => {
                                                    return <li onClick={() => SetfilterModelData({
                                                        ...filterModelData, truck_body_type: bodyType,
                                                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{bodyType}</a></li>
                                                })
                                            }
                                        </ul >
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>No. of Tyres</h6>
                                        <button type="button" class="btn btn-transparent shadow-none border dropdown-toggle col-12 py-3 dropdown-arrow text-start" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filterModelData.no_of_tyres === '' ? 'select number of tyres' : `${filterModelData.no_of_tyres}`}
                                        </button>
                                        <ul class="dropdown-menu col-11 dropdown-ul">
                                            {
                                                numOfTyres.map((numOfTyres) => {
                                                    return <li onClick={() => SetfilterModelData({
                                                        ...filterModelData, no_of_tyres: numOfTyres,
                                                    })} className="cup mt-0 py-2 dropdown-list-hover"><a class="dropdown-item text-decoration-none">{numOfTyres}</a></li>
                                                })
                                            }
                                        </ul >
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <h6>Ton</h6>
                                        <div className="input-item input-item-name ltn__custom-icon">
                                            <input type="text" name="tone" placeholder="Example: 2 tones" className='m-0' onChange={(e) => SetfilterModelData({ ...filterModelData, tone: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
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
                {currentCards.length > 0 ?
                    <div className="row row-cols-1 row-cols-md-3 g-4 mb-60">
                        {currentCards.map(card => (
                            <div className="col" key={card.id}>
                                <div className="card h-100 shadow truckcard">
                                    <div className='card-header border-0 mb-0 '>
                                        <p className='.fs-6 reviewtext '>
                                            {/* Generate the star ratings based on the response */}
                                            {[...Array(5)].map((_, index) => (
                                                <span key={index} className="float-right">
                                                    <i className={`text-warning fa fa-star ${index < card.rating ? '' : 'text-muted'}`}></i>
                                                </span>
                                            ))}
                                            <span>({card.user_review_count} 4)</span>
                                            <p className="float-end mb-0 text-b"> <strong>Posts </strong> : {card.user_post}</p>

                                        </p>

                                        <div className="cardmodify py-1 py-3">
                                            <h5 className='mb-1'>{card.profile_name}</h5>
                                            <div className="col-lg-12 cardicontext">
                                                <label><HiOutlineOfficeBuilding className='me-2' />{card.company_name}</label>
                                            </div>
                                        </div>
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
                                            <p className='datetext'><strong><RiMapPinTimeFill className='me-2' />Posted on :</strong> {card.updt.slice(5, 25)}</p>

                                            {/* <div className="col-lg-12 cardicon">
                                            <div><label>Distance: {"hii"}</label></div>
                                        </div> */}
                                        </div>
                                        <hr className="hr m-2" />
                                        <div className='row mt-3'>
                                            <div className="col-lg-6 cardicontext">
                                                <div><label><FaWeightHanging className='me-2' />{card.tone} ton</label></div>
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
                                                        {
                                                            viewContactId === card.id ?
                                                                <button
                                                                    className="btn btn-success w-100"
                                                                    type="button">
                                                                    <div className="spinner-border text-light" role="status">
                                                                        <span className="sr-only">Loading...</span>
                                                                    </div>
                                                                </button>
                                                                :

                                                                selectedContactNum && card.contact_no === selectedContactNum ?
                                                                    <button
                                                                        className="btn btn-success w-100"
                                                                        type="button">
                                                                        {selectedContactNum}
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        className="btn btn-success w-100"
                                                                        type="button"
                                                                        onClick={() => handleCopy(card.contact_no, card.id)}>
                                                                        {/* <FaRegCopy className='me-2' /> */}
                                                                        Contact
                                                                    </button>
                                                        }
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
                    :
                    <div className='row justify-content-center align-items-center emptyCardHeight'>
                        <div className='col text-center'>
                            <img src={publicUrl + "assets/img/Folder_empty.png"} width={100} height={100} />
                            <p>No Data Available</p>

                            {LoginDetails.isLoggedIn ?
                                <button type="button" className='btn btn-primary col-12 col-md-6 col-lg-4 col-xl-3' data-bs-toggle="modal" data-bs-target="#addtruckavailability" onClick={handleTruckAvailabilityModelOpen}>Click here to Add Load</button>
                                :
                                <button type="button " className='btn btn-primary col-12 col-md-6 col-lg-4 col-xl-3' data-bs-toggle="modal" data-bs-target="#loginModal">Click here to Add Truck</button>
                            }

                        </div>
                    </div>
                }
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
