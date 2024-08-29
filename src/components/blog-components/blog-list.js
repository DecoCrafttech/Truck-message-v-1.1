import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { RiPinDistanceFill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import Autocomplete from "react-google-autocomplete";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";



const BlogList = () => {
    const LoginDetails = useSelector((state) => state.login);

    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage] = useState(21);
    const [filters, setFilters] = useState({
        search: '',
    });

    const [filterModelData, SetfilterModelData] = useState({
        user_id: "",
        brand: '',
        contact_no: '',
        description: '',
        kms_driven: '',
        model: '',
        owner_name: '',
        vehicle_number: "",
        location: ''
    })

    const [showingBuyAndSellLocation, setShowingBuyAndSellLocation] = useState("");

    const [contactError, setContactError] = useState(''); // State to manage contact number validation error
    const [selectedfile, SetSelectedFile] = useState([]);
    const [multipleImages, setMultipleImages] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [createVehicleLoading, setCreateVehicleLoading] = useState(false);
    const [verifyOtpLoading, setverifyOtpLoading] = useState(false);
    const [verifyAadharLoading,setVerifyAadharLoading]=useState(false)

    const [aadharNumber, setAadharNumber] = useState("")
    const [aadharStep, setAadharStep] = useState(1);
    const [otpNumber, setOtpNumber] = useState("")

    const [showingFromLocation, setShowingFromLocation] = useState("");
    const [showingToLocation, setShowingToLocation] = useState("");
    const [isDataFiltered, setIsDataFiltered] = useState(false)

    const handleLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setShowingToLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    };

    const handleApplyFilter = async () => {
        setFilterLoading(true)
        const filterObj = { ...filterModelData }
        filterObj.location = showingFromLocation
        setIsDataFiltered(true)

        try {
            const res = await axios.post("https://truck.truckmessage.com/user_buy_sell_filter", filterObj, {
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
            setFilterLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    const filterCards = (cards) => {
        return cards.filter(card => {
            const search = filters.search.toLowerCase();
            return (
                card.location.toLowerCase().includes(search) ||
                card.model.toString().includes(search) ||
                card.owner_name.toLowerCase().includes(search) ||
                card.vehicle_number.toLowerCase().includes(search) ||
                card.kms_driven.toString().includes(search)
            );
        });
    };

    const filteredCards = filterCards(cards);

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [editingData, setEditingData] = useState({
        company_name: "",
        contact_no: "",
        description: "",
        material: "",
        no_of_tyres: "",
        tone: "",
        truck_body_type: "",
    })

    useEffect(() => {
        initialRender()
    }, []);

    const initialRender = async () => {
        setFilterLoading(true)
        try {
            await axios.get('https://truck.truckmessage.com/all_buy_sell_details')
                .then(response => {
                    if (response.data.success && Array.isArray(response.data.data)) {
                        setCards(response.data.data);
                    } else {
                        console.error('Unexpected response format:', response.data);
                    }
                    setIsDataFiltered(false)
                    setFilterLoading(false)
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleFilterChange = (e) => {
        setFilters({
            search: e.target.value,
        });
    };

    const handleBuyAndSellLocation = (selectedLocation) => {
        if (selectedLocation) {
            const cityComponent = selectedLocation.find(component => component.types.includes('locality'));
            const stateComponent = selectedLocation.find(component => component.types.includes('administrative_area_level_1'));

            if (cityComponent && stateComponent) {
                setShowingBuyAndSellLocation(`${cityComponent.long_name}, ${stateComponent.long_name}`);
            }
        }
    }

    const handleSaveBusAndSellId = (buyAndSellDetails) => {
        Cookies.set("buyAndSellViewDetailsId", window.btoa(buyAndSellDetails.buy_sell_id), {
            secure: true,
            sameSite: 'strict',
            path: '/'
        })
    }

    //Image upload and delete functions
    const filesizes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    const InputChange = (e) => {
        if (e.target.files.length > 0) {
            setMultipleImages(e.target.files)
        }

        // --For Multiple File Input
        let images = [];
        for (let i = 0; i < e.target.files.length; i++) {
            images.push((e.target.files[i]));
            let reader = new FileReader();
            let file = e.target.files[i];
            reader.onloadend = () => {
                SetSelectedFile((preValue) => {
                    return [
                        ...preValue,
                        {
                            id: shortid.generate(),
                            filename: e.target.files[i].name,
                            filetype: e.target.files[i].type,
                            fileimage: reader.result,
                            datetime: e.target.files[i].lastModifiedDate.toLocaleString('en-IN'),
                            filesize: filesizes(e.target.files[i].size)
                        }
                    ]
                });
            }
            if (e.target.files[i]) {
                reader.readAsDataURL(file);
            }
        }
    }
    const DeleteSelectFile = (id) => {
        const result = selectedfile.filter((data) => data.id !== id);
        SetSelectedFile(result);

        const overallFile = result.map((data) => data.filename)

        var newImages = []
        for (let i = 0; i < multipleImages.length; i++) {
            if (overallFile.includes(multipleImages[i].name)) {
                newImages[newImages.length] = multipleImages[i]
            }
        }
        setMultipleImages(newImages)
    }
    //

    const handleBuyAndSellUpdate = async () => {
        setCreateVehicleLoading(true)
        const userId = window.atob(Cookies.get("usrin"));

        const edit = { ...editingData }
        edit.images = multipleImages

        const formData = new FormData();

        formData.append("user_id", userId);
        formData.append("brand", edit.brand)
        formData.append("contact_no", edit.contact_no)
        formData.append("description", edit.description)
        formData.append("kms_driven", edit.kms_driven)
        formData.append("location", showingBuyAndSellLocation)
        formData.append("model", edit.model)
        formData.append("owner_name", edit.owner_name)
        formData.append("vehicle_number", edit.vehicle_number)

        if (multipleImages.length > 0) {
            if (edit.images.length > 0) {
                for (let i = 0; i < edit.images.length; i++) {
                    formData.append(`truck_image${i + 1}`, edit.images[i]);
                }
            }

            try {
                const res = await axios.post("https://truck.truckmessage.com/truck_buy_sell", formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                if (res.data.error_code === 0) {
                    document.getElementById("clodeBuySellModel").click()
                    toast.success(res.data.message)
                    initialRender()
                } else {
                    toast.error(res.data.message)
                }
                setCreateVehicleLoading(false)
            }
            catch (err) {
                console.log(err)
            }
        } else {
            toast.error("Image required")
        }
    }

    const handleBuyAndSellModelOpen = async () => {
        setverifyOtpLoading(false)
        setCreateVehicleLoading(false)
        setVerifyAadharLoading(false)

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
                    toast.error("User ID not found");
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
            setVerifyAadharLoading(true)
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
                setVerifyAadharLoading(false)
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
        setverifyOtpLoading(true)
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
                    toast.success(res.data.message)
                } else {
                    console.log(res)
                    toast.error(res.data.message)
                }
                setverifyOtpLoading(false)
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

                    <div className="modal-footer">
                        <div className="col-12 col-md-6 m-0">
                            <button type="button" className="btn btn-secondary w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div className="col-12 col-md-6 m-0">
                            {
                                verifyAadharLoading ?
                                    <button type="button" className="btn btn-primary w-100">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">verifying...</span>
                                        </div>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary w-100" onClick={handleVerifyAadhar}>verify aadhar</button>
                            }
                        </div>
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
                        <div className="col-12 col-md-6 m-0">
                            <button type="button" className="btn btn-secondary w-100" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div className="col-12 col-md-6 m-0">
                            {
                                verifyOtpLoading ?
                                    <button type="button" className="btn btn-primary w-100">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">verifying...</span>
                                        </div>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary w-100" onClick={handleVerifyOtp}>verify Otp</button>
                            }
                        </div>
                    </div>
                </div>

            case 4:
                return <div className="ltn__appointment-inner">
                    <div>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <h6>Model Year</h6>
                                <div className="tel-item ">
                                    <input type="number" name="company_name" className="w-100 py-4" placeholder="Name of the Brand" value={editingData.brand} onChange={(e) => setEditingData({ ...editingData, brand: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Brand</h6>
                                <div className="input-item">
                                    <select className="nice-select" name="truck_body_type" required>
                                        <option value="open_body">Ashok Leyland</option>
                                        <option value="container">Tata </option>
                                        <option value="trailer">Mahindra </option>
                                        <option value="tanker">Eicher </option>
                                        <option value="tanker">Daimler India  </option>
                                        <option value="tanker">Bharat Benz </option>
                                        <option value="tanker">Maruthi Suzuki  </option>
                                        <option value="tanker">SML Lsuzu </option>
                                        <option value="tanker">Force  </option>
                                        <option value="tanker">AMW   </option>
                                        <option value="tanker">Man   </option>
                                        <option value="tanker">Scania    </option>
                                        <option value="tanker">Volvo     </option>
                                        <option value="tanker">Others   </option>
                                    </select>
                                </div>
                            </div>
                            {/* <div className="col-12 col-md-6">
                                <h6>Brand </h6>
                                <div className="input-item input-item-name ltn__custom-icon">
                                    <input type="text" name="company_name" placeholder="Name of the Model" value={editingData.model} onChange={(e) => setEditingData({ ...editingData, model: e.target.value })} required />
                                </div>
                            </div> */}
                            <div className="col-12 col-md-6">
                                <h6>Owner Name</h6>
                                <div className="input-item input-item-name ltn__custom-icon">
                                    <input type="text" name="owner_name" placeholder="Name of the Owner" value={editingData.owner_name} onChange={(e) => setEditingData({ ...editingData, owner_name: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Vehicle Number</h6>
                                <div className="input-item input-item-email ltn__custom-icon">
                                    <input type="tel" name="contact_no" placeholder="Type your Vehicle Number" value={editingData.vehicle_number} onChange={(e) => setEditingData({ ...editingData, vehicle_number: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Kilometers driven</h6>
                                <div className="tel-item">
                                    <input type="number" name="kms driven" className="w-100 py-4" placeholder="Type Kms driven" value={editingData.kms_driven} onChange={(e) => setEditingData({ ...editingData, kms_driven: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Price</h6>
                                <div className="tel-item">
                                    <input type="number" name="kms driven" className="w-100 py-4" placeholder="Enter your Price here..." value={editingData.kms_driven} onChange={(e) => setEditingData({ ...editingData, kms_driven: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Contact Number</h6>
                                <div className="input-item input-item-email ltn__custom-icon">
                                    <input type="tel" name="contact_no" placeholder="Type your contact number" value={editingData.contact_no} onChange={(e) => setEditingData({ ...editingData, contact_no: e.target.value })} required />
                                    {contactError && <p style={{ color: 'red' }}>{contactError}</p>}
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <h6>Location</h6>
                                <div className="input-item input-item-name">
                                    <Autocomplete name="from_location"
                                        className="google-location location-input bg-transparent py-2"
                                        apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                        onPlaceSelected={(place) => {
                                            if (place) {
                                                handleBuyAndSellLocation(place.address_components);
                                            }
                                        }}
                                        required
                                        value={showingBuyAndSellLocation}
                                        onChange={(e) => setShowingBuyAndSellLocation(e.target.value)}
                                    />
                                </div>
                            </div>
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
                                    <select className="nice-select" name="tyre_count" value={editingData.no_of_tyres} onChange={(e) => setEditingData({ ...editingData, no_of_tyres: e.target.value })} required>
                                        <option value="6">6</option>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                        <option value="14">14</option>
                                        <option value="12">16</option>
                                        <option value="18">18</option>
                                        <option value="20">20</option>
                                        <option value="22">22</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label for="formFileMultiple" className="form-label">Multiple files input example</label>
                            <input type="file" id="fileupload" className="file-upload-input form-control" onChange={InputChange} multiple required />
                        </div>
                        <div className='my-3'>
                            {selectedfile.map((data, index) => {
                                const { id, filename, filetype, fileimage, datetime, filesize } = data;
                                return (
                                    <div className="file-atc-box" key={id}>
                                        {
                                            filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ?
                                                <div className="file-image"> <img src={fileimage} alt="" /></div> :
                                                <div className="file-image"><i className="far fa-file-alt"></i></div>
                                        }
                                        <div className="file-detail row">
                                            <h6>{filename}</h6>
                                            <div className='col-9'>
                                                <p><span>Size : {filesize}</span>,<span className="ps-1 ml-2">Modified Time : {datetime}</span></p>
                                            </div>
                                            <div className="file-actions col-3">
                                                <button type="button" className="file-action-btn" onClick={() => DeleteSelectFile(id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h6>Descriptions (Optional)</h6>
                            <div className="input-item input-item-textarea ltn__custom-icon">
                                <textarea name="description" placeholder="Enter a text here" value={editingData.description} onChange={(e) => setEditingData({ ...editingData, description: e.target.value })} required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="col-12 col-md-6 m-0">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                        <div className="col-12 col-md-6 m-0">
                            {
                                createVehicleLoading ?
                                    <button type="button" className="btn btn-primary w-100">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Saving...</span>
                                        </div>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary w-100" onClick={handleBuyAndSellUpdate}>Create</button>
                            }
                        </div>
                    </div>
                </div>

            default:
                break;
        }
    }

    return (
        <div>
            <div className="ltn__product-area ltn__product-gutter mb-50 mt-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 mb-2">
                            <div className="ltn__shop-options">
                                <ul>
                                    <li>
                                        <div className="showing-product-number text-right">
                                            <span>Showing {indexOfFirstCard + 1}-{Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} results</span>
                                        </div>
                                    </li>
                                    <div className="header-top-btn">
                                        {LoginDetails.isLoggedIn ? (
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#addloadavailability" onClick={handleBuyAndSellModelOpen}> + Add vehicle post</button>

                                        ) :
                                            <button type="button " className='cardbutton truck-brand-button ' data-bs-toggle="modal" data-bs-target="#loginModal"> + Add vehicle post</button>
                                        }
                                    </div>
                                </ul>
                            </div>
                        </div>

                        <hr></hr>

                        <div className="col-lg-12">
                            <div className='row'>
                                <div className="col-12 col-lg-12">
                                    {/* Search Widget */}
                                    <div className="ltn__search-widget mb-0">
                                        <form action="">
                                            <input type="text" name="search" placeholder="Search by ..." onChange={handleFilterChange} />
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-4 row d-lg-none">
                                    <div className='col-8'>
                                        {/* Filter */}
                                        <button type="button" className="filterbtn col-12" data-bs-toggle="modal" data-bs-target="#buySellfilter" >Filter</button>
                                    </div>
                                    <div className='col-4'>
                                        <button type="button" className={`col-12 ${isDataFiltered ? 'filterbtn' : ' btn-secondary pe-none'}`} onClick={initialRender}>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="buySellfilter" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Post</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeFilterBox"></button>
                        </div>
                        <div className="modal-body ps-4 pe-4 p-">
                            <div className="ltn__appointment-inner ">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <h6>Brand</h6>
                                        <div className="input-item input-item-name ltn__custom-icon">
                                            <input type="text" name="material" placeholder="Enter brand" onChange={(e) => SetfilterModelData({ ...filterModelData, brand: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Model</h6>
                                        <div className="input-item input-item-name ltn__custom-icon">
                                            <input type="text" name="tone" placeholder="Enter Model" onChange={(e) => SetfilterModelData({ ...filterModelData, model: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Location</h6>
                                        <div className="input-item input-item-name">
                                            <Autocomplete name="to_location"
                                                className="google-location location-input bg-transparent py-2"
                                                apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                                onPlaceSelected={(place) => {
                                                    if (place) {
                                                        handleLocation(place.address_components);
                                                    }
                                                }}
                                                value={showingToLocation}
                                                onChange={(e) => setShowingToLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Vehicle Number</h6>
                                        <div className="input-item input-item-email ltn__custom-icon">
                                            <input type="tel" name="contact_no" placeholder="Type your Vehicle Number" value={filterModelData.vehicle_number} onChange={(e) => SetfilterModelData({ ...filterModelData, vehicle_number: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Kilometers driven</h6>
                                        <div className="tel-item">
                                            <input type="number" name="kms driven" className="w-100 py-4" placeholder="Type Kms driven" value={filterModelData.kms_driven} onChange={(e) => SetfilterModelData({ ...filterModelData, kms_driven: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6>Contact Number</h6>
                                        <div className="input-item input-item-email ltn__custom-icon">
                                            <input type="tel" name="contact_no" placeholder="Type your contact number" value={filterModelData.contact_no} onChange={(e) => SetfilterModelData({ ...filterModelData, contact_no: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <h6>Descriptions (Optional)</h6>
                                            <div className="input-item input-item-textarea ltn__custom-icon">
                                                <textarea name="description" placeholder="Enter a text here" value={filterModelData.description} onChange={(e) => SetfilterModelData({ ...filterModelData, description: e.target.value })} required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                filterLoading ?
                                    <button type="button" className="btn btn-primary">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={handleApplyFilter}>Apply Filter</button>
                            }

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

            <div className='container-fluid px-lg-5 blog-list-filter-min-height'>
                <div className="row filter-min-height overflow-hidden">
                    <div className="col-2 h-100 d-none d-lg-block">
                        <div>
                            <h6>Brand</h6>
                            <div className="input-item input-item-name">
                                <input type="text" name="material" placeholder="Enter brand" onChange={(e) => SetfilterModelData({ ...filterModelData, brand: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <h6>Model</h6>
                            <div className="input-item input-item-name">
                                <input type="text" name="tone" placeholder="Enter Model" onChange={(e) => SetfilterModelData({ ...filterModelData, model: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <h6>Location</h6>
                            <div className="input-item input-item-name">
                                <Autocomplete name="to_location"
                                    className="google-location location-input bg-transparent py-2"
                                    apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                                    onPlaceSelected={(place) => {
                                        if (place) {
                                            handleLocation(place.address_components);
                                        }
                                    }}
                                    value={showingToLocation}
                                    onChange={(e) => setShowingToLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <h6>Vehicle Number</h6>
                            <div className="input-item input-item-email">
                                <input type="tel" name="contact_no" placeholder="Type your Vehicle Number" value={filterModelData.vehicle_number} onChange={(e) => SetfilterModelData({ ...filterModelData, vehicle_number: e.target.value })} required />
                            </div>
                        </div>
                        <div>
                            <h6>Kilometers driven</h6>
                            <div className="tel-item">
                                <input type="number" name="kms driven" className="w-100 py-4" placeholder="Type Kms driven" value={filterModelData.kms_driven} onChange={(e) => SetfilterModelData({ ...filterModelData, kms_driven: e.target.value })} required />
                            </div>
                        </div>
                        <div className='pt-3'>
                            <h6>Contact Number</h6>
                            <div className="input-item input-item-email">
                                <input type="tel" name="contact_no" placeholder="Type your contact number" value={filterModelData.contact_no} onChange={(e) => SetfilterModelData({ ...filterModelData, contact_no: e.target.value })} required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <h6>Descriptions (Optional)</h6>
                                <div className="input-item input-item-textarea ltn__custom-icon">
                                    <textarea name="description" placeholder="Enter a text here" value={filterModelData.description} onChange={(e) => SetfilterModelData({ ...filterModelData, description: e.target.value })} required />
                                </div>
                            </div>
                        </div>
                        <div className='col-12 d-flex flex-wrap justify-content-center pt-3'>
                            {
                                filterLoading ?
                                    <button type="button" className="btn btn-primary">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={handleApplyFilter}>Apply Filter</button>
                            }
                        </div>
                    </div>


                    <div className="col-12 col-lg-10 h-100 overflow-auto webkitScroll-buy-sell">
                        <div className="d-flex flex-wrap pt-3 pb-5 w-100 h-100">
                            {
                                filterLoading ?
                                    <div className="row w-100 h-100 justify-content-center align-items-center">
                                        <div className='col-3 text-center'>
                                            <div class="spinner-border text-info" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                            <p className='mt-2 text-info'>Loading...</p>
                                        </div>
                                    </div>
                                    :
                                    currentCards.length ?
                                        currentCards.map(card => (
                                            <div className="col-12 col-sm-6 col-xxl-4 p-2" key={card.buy_sell_id}>
                                                <div className="card card h-100 shadow truckcard">
                                                    <span className='object-fit-fill rounded justify-content-center d-flex'>
                                                        <img
                                                            className="m-3 rounded-3 justify-content-center d-flex"
                                                            src={card.images.length > 0 ? card.images[0] : ''}
                                                            alt="truck message Logo - All in one truck solutions"
                                                            style={{ width: '390px', height: '290px', objectFit: 'cover' }}
                                                        />
                                                    </span>
                                                    <div className="card-body">
                                                        <div className='col-12 col-md-12 mb-2 text-wrap'>
                                                            <div className='row'>
                                                                <div className='col-8 col-md-8 text-start ps-0'>
                                                                    <h5 className="card-title text-wrap">{card.brand}</h5>
                                                                </div>
                                                                <p className='.fs-6 mb-0 reviewtext '>
                                                                    {/* Generate the star ratings based on the response */}
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <span key={index} className="float-right">
                                                                            <i className={`text-warning fa fa-star ${index < card.rating ? '' : 'text-muted'}`}></i>
                                                                        </span>
                                                                    ))}
                                                                    <span>({card.review_count})</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label><FaLocationDot className="me-2 text-danger" />{card.location}</label>
                                                        </div>
                                                        <div>
                                                            <div className="row">
                                                                <div className="col-6 col-md-6"><FaUserAlt className="me-2" />
                                                                    {card.owner_name}
                                                                </div>
                                                                <div className="col-6 col-md-6"><FaTruckFast className="me-2" />
                                                                    {card.vehicle_number}
                                                                </div>
                                                                <div className="col-6 col-md-6"><BsFillCalendar2DateFill className="me-2" />
                                                                    {card.model}
                                                                </div>
                                                                <div className="col-6 col-md-6"><RiPinDistanceFill className="me-2" />
                                                                    {card.kms_driven} kms
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='d-flex gap-2'>
                                                            <Link to="/product-details" className='apara' onClick={() => handleSaveBusAndSellId(card)}>view details </Link>                                        <link></link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className="row w-100 h-100 justify-content-center align-items-center">
                                            <div className='col-3 text-center'>
                                                <p>No data found</p>
                                            </div>
                                        </div>
                            }
                        </div>
                    </div>
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

export default BlogList;
