import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaWeightHanging, FaTruck, FaLocationDot } from "react-icons/fa6";
import { SiMaterialformkdocs } from "react-icons/si";
import { GiCarWheel } from "react-icons/gi";
import { CiStar } from "react-icons/ci";
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import { FaStar, FaUserAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { RiPinDistanceFill } from "react-icons/ri";
import shortid from "https://cdn.skypack.dev/shortid@2.2.16";
import { useSelector } from "react-redux";

const WishList = () => {
  let publicUrl = process.env.PUBLIC_URL + "/";
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const [gettingDetails, setGettingDetails] = useState(false);
  const [feedbackRating, setRating] = useState('');
  const [feedbackHover, setHover] = useState('')

  const LoginDetails = useSelector((state) => state.login);
  const pageRender = useNavigate();

  useEffect(() => {
    if (!Cookies.get("usrin")) {
      pageRender("/");
    }
  }, [LoginDetails.isLoggedIn]);

  const [contactError, setContactError] = useState("");
  const [editingData, setEditingData] = useState({
    company_name: "",
    contact_no: "",
    description: "",
    material: "",
    no_of_tyres: "",
    tone: "",
    truck_body_type: "",
  });

  const [showingFromLocation, setShowingFromLocation] = useState("");
  const [showingToLocation, setShowingToLocation] = useState("");
  const [showingBuyAndSellLocation, setShowingBuyAndSellLocation] =
    useState("");
  const [deletingData, setDeletingData] = useState({});
  const [feedbackRadio, setFeedbackRadio] = useState("NO");
  const [feedback, setfeedback] = useState({
    feedbackCnt: "",
    mobNum: "",
  });

  useEffect(() => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        initialRender("user_load_details");
        break;
      case "/wishlist/truck":
        initialRender("user_truck_details");
        break;
      case "/wishlist/driver":
        initialRender("user_driver_details");
        break;
      case "/wishlist/buy_sell":
        initialRender("user_buy_sell_details");
        break;
      default:
        break;
    }
  }, [reload]);

  const handleFromLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingFromLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const handleToLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingToLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const handleBuyAndSellLocation = (selectedLocation) => {
    if (selectedLocation) {
      const cityComponent = selectedLocation.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = selectedLocation.find((component) =>
        component.types.includes("administrative_area_level_1")
      );

      if (cityComponent && stateComponent) {
        setShowingBuyAndSellLocation(
          `${cityComponent.long_name}, ${stateComponent.long_name}`
        );
      }
    }
  };

  const initialRender = async (newPath) => {
    const getUser = Cookies.get("usrin");
    setGettingDetails(true);
    if (getUser) {
      const data = {
        user_id: window.atob(getUser),
      };
      try {
        axios
          .post(`https://truck.truckmessage.com/${newPath}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.data.success && Array.isArray(response.data.data)) {
              setData(response.data.data);
              setGettingDetails(false);
            } else {
              console.error("Unexpected response format:", response.data);
              setGettingDetails(false);
            }
          })
          .catch((error) => {
            console.error("There was an error fetching the data!", error);
            setGettingDetails(false);
          });
      } catch (err) {
        toast.error(err);
      }
    } else {
      toast.error("plaese login to get data");
    }
  };

  const handleChooseUpdate = async () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        var userId = window.atob(Cookies.get("usrin"));
        const load_details = {
          company_name: editingData.company_name,
          contact_no: editingData.contact_no,
          from: showingFromLocation,
          to: showingToLocation,
          material: editingData.material,
          tone: editingData.tone,
          truck_body_type: editingData.truck_body_type,
          no_of_tyres: editingData.no_of_tyres,
          description: editingData.description,
          load_id: JSON.stringify(editingData.load_id),
          user_id: userId,
        };
        handleUpdate("load_details", load_details);
        break;
      case "/wishlist/truck":
        var userId = window.atob(Cookies.get("usrin"));
        const truck_entry = {
          company_name: editingData.company_name,
          vehicle_number: editingData.vehicle_number,
          contact_no: editingData.contact_no,
          from: showingFromLocation,
          to: showingToLocation,
          tone: editingData.tone,
          truck_body_type: editingData.truck_body_type,
          no_of_tyres: editingData.no_of_tyres,
          description: editingData.description,
          truck_name: editingData.truck_name,
          truck_id: JSON.stringify(editingData.truck_id),
          user_id: userId,
        };
        handleUpdate("truck_entry", truck_entry);
        break;
      case "/wishlist/driver":
        var userId = window.atob(Cookies.get("usrin"));
        const driver_entry = {
          company_name: editingData.company_name,
          vehicle_number: editingData.vehicle_number,
          contact_no: editingData.contact_no,
          from: showingFromLocation,
          to: showingToLocation,
          tone: editingData.tone,
          truck_body_type: editingData.truck_body_type,
          no_of_tyres: editingData.no_of_tyres,
          description: editingData.description,
          truck_name: editingData.truck_name,
          driver_name: editingData.driver_name,
          driver_id: JSON.stringify(editingData.driver_id),
          user_id: userId,
        };
        handleUpdate("driver_entry", driver_entry);
        break;
      case "/wishlist/buy_sell":
        var userId = window.atob(Cookies.get("usrin"));
        const truck_buy_sell = {
          buy_sell_id: JSON.stringify(editingData.buy_sell_id),
          user_id: userId,
        };
        handleUpdate("truck_buy_sell", truck_buy_sell);
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        return document.getElementById("closeModelOne").click();
      case "/wishlist/truck":
        return document.getElementById("closeModelTwo").click();
      case "/wishlist/driver":
        return document.getElementById("closeModelThree").click();
      case "/wishlist/buy_sell":
        return document.getElementById("closeModelOne").click();
      default:
        break;
    }
  };

  const handleUpdate = async (updationPath, updationData) => {
    try {
      const res = await axios.post(
        `https://truck.truckmessage.com/${updationPath}`,
        updationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.error_code === 0) {
        setReload(!reload);
        toast.success(res.data.message);

        closeModal();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update.");
      console.error("There was an error!", error);
    }
  };

  const handleChooseDelete = (deletionId) => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        const remove_load_details = {
          load_id: JSON.stringify(deletionId.load_id),
        };

        hanldeDelete("remove_load_details", remove_load_details);
        break;
      case "/wishlist/truck":
        const remove_truck_entry = {
          truck_id: JSON.stringify(deletionId.truck_id),
        };
        hanldeDelete("remove_truck_entry", remove_truck_entry);
        break;
      case "/wishlist/driver":
        const remove_driver_entry = {
          driver_id: JSON.stringify(deletionId.driver_id),
        };
        hanldeDelete("remove_driver_entry", remove_driver_entry);
        break;
      case "/wishlist/buy_sell":
        const remove_truck_buy_sell = {
          buy_sell_id: JSON.stringify(deletionId.buy_sell_id),
        };
        hanldeDelete("remove_truck_buy_sell", remove_truck_buy_sell);
        break;
      default:
        break;
    }
  };

  const hanldeDelete = async (deletionPath, deletionData) => {
    try {
      const res = await axios.post(
        `https://truck.truckmessage.com/${deletionPath}`,
        deletionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.error_code === 0) {
        toast.success(res.data.message);
        setReload(!reload);

        document.getElementById("deleteCloseModel").click();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete.");
      console.error("There was an error!", error);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const getPath = window.location.pathname;
      if (getPath === "/wishlist/load") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.load_id),
          via_app: feedbackRadio,
          ref_name: "load",
        };
      } else if (getPath === "/wishlist/truck") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.truck_id),
          via_app: feedbackRadio,
          ref_name: "truck",
        };
      } else if (getPath === "/wishlist/driver") {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.driver_id),
          via_app: feedbackRadio,
          ref_name: "driver",
        };
      } else {
        var data = {
          user_id: window.atob(Cookies.get("usrin")),
          ref_id: JSON.stringify(deletingData.buy_sell_id),
          via_app: feedbackRadio,
          ref_name: "buy and sell",
        };
      }

      if (feedbackRadio === "NO") {
        const object = { ...data };

        object.feedback = feedback.feedbackCnt;

        if (feedback.feedbackCnt !== "") {
          const res = await axios.post(
            "https://truck.truckmessage.com/user_feedback",
            object
          );
          if (res.data.error_code === 0) {
            handleChooseDelete(deletingData);
          } else {
            toast.error(res.data.message);
          }
        } else {
          toast.error("Feedback required");
        }
      } else {
        const object = { ...data };
        object.mobile_no = feedback.mobNum;
        object.ratings = feedbackRating;

        if (feedback.mobNum !== "" && feedback.mobNum.length === 10) {
          if (feedbackRating) {
            const res = await axios.post(
              "https://truck.truckmessage.com/user_feedback",
              object
            );
            if (res.data.error_code === 0) {
              handleChooseDelete(deletingData);
            } else {
              toast.error(res.data.message);
            }
          }else{
            toast.error("ratings required");
          }
        } else if (feedback.mobNum === "") {
          toast.error("Mobile number required");
        } else {
          toast.error("Invalid mobile number");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (editObject) => {
    if (editObject.from_location) {
      setShowingFromLocation(editObject.from_location);
    }
    if (editObject.to_location) {
      setShowingToLocation(editObject.to_location);
    }
    if (editObject.location) {
      setShowingBuyAndSellLocation(editObject.location);
    }
    setEditingData(editObject);
  };

  //Image upload and delete functions
  const [selectedfile, SetSelectedFile] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    if (e.target.files.length > 0) {
      setMultipleImages([...multipleImages, ...e.target.files]);
    }

    // --For Multiple File Input
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      images.push(e.target.files[i]);
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
              datetime:
                e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(e.target.files[i].size),
            },
          ];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };

  const DeleteSelectFile = (id) => {
    const result = selectedfile.filter((data) => data.id !== id);
    SetSelectedFile(result);

    const overallFile = result.map((data) => data.filename);

    var newImages = [];
    for (let i = 0; i < multipleImages.length; i++) {
      if (overallFile.includes(multipleImages[i].name)) {
        newImages[newImages.length] = multipleImages[i];
      }
    }
    setMultipleImages(newImages);
  };
  //

  const handleBuyAndSellUpdate = async () => {
    const userId = window.atob(Cookies.get("usrin"));

    const edit = { ...editingData };

    const formData = new FormData();

    formData.append("user_id", userId);
    formData.append("brand", edit.brand);
    formData.append("buy_sell_id", edit.buy_sell_id);
    formData.append("contact_no", edit.contact_no);
    formData.append("description", edit.description);
    formData.append("id", edit.id);
    formData.append("kms_driven", edit.kms_driven);
    formData.append("location", edit.location);
    formData.append("model", edit.model);
    formData.append("owner_name", edit.owner_name);
    formData.append("vehicle_number", edit.vehicle_number);

    if (multipleImages.length > 0) {
      for (let i = 0; i < multipleImages.length; i++) {
        formData.append(`truck_image${i + 1}`, multipleImages[i]);
      }
    }

    try {
      const res = await axios.post(
        "https://truck.truckmessage.com/truck_buy_sell",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.error_code === 0) {
        document.getElementById("clodeBuySellModel").click();
        toast.success(res.data.message);
        initialRender("user_buy_sell_details");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderLoadCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <FaWeightHanging className="me-2" />
                        {item.tone} ton
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <SiMaterialformkdocs className="me-2" />
                        {item.material}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setRating(0);
                        setHover(0);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    ) : null;
  };

  const renderTruckCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <FaWeightHanging className="me-2" />
                        {item.tone} ton
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <div>
                      <label>
                        <SiMaterialformkdocs className="me-2" />
                        {item.material}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-6">
                    <h5 className="card-title mt-3">Truck name</h5>
                    <p className="card-text paragraph">{item.truck_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">vehicle number</h5>
                    <p className="card-text paragraph">{item.vehicle_number}</p>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModaltwo"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                        setRating(0)
                        setHover(0)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    ) : null;
  };

  const renderDriverCard = () => {
    return !gettingDetails ? (
      data.length > 0 ? (
        data.map((item) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
            <div className="card h-100 shadow truckcard">
              <div className="card-header mt-2 border-0 mb-2">
                <h5 className="card-title cardmodify">{item.company_name}</h5>
              </div>
              <div className="card-body p-3 mt-2 mb-2">
                <div className="row">
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-danger" />
                        {item.from_location}
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-12 cardicon">
                    <div>
                      <label>
                        <FaLocationDot className="me-2 text-success" />
                        {item.to_location}
                      </label>
                    </div>
                  </div>
                </div>

                <hr className="hr m-2" />
                <div className="row">
                  <div className="col-lg-6 cardicon">
                    <label>
                      <GiCarWheel className="me-2" />
                      {item.no_of_tyres} wheels
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.truck_body_type}
                    </label>
                  </div>
                  <div className="col-lg-6 cardicon">
                    <label>
                      <FaTruck className="me-2" />
                      {item.contact_no}
                    </label>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-6">
                    <h5 className="card-title mt-3">Driver name</h5>
                    <p className="card-text paragraph">{item.driver_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">Truck name</h5>
                    <p className="card-text paragraph">{item.truck_name}</p>
                  </div>
                  <div className="col-6">
                    <h5 className="card-title mt-3">vehicle number</h5>
                    <p className="card-text paragraph">{item.vehicle_number}</p>
                  </div>
                </div>
                <div className="m-2">
                  <h5 className="card-title mt-3">Description</h5>
                  <p className="card-text paragraph">{item.description}</p>
                </div>
              </div>
              <div className="card-footer mb-3">
                <div>
                  <div className="d-flex gap-2 justify-content-between mt-3">
                    <button
                      className="btn btn-success"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalthree"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn cardbutton"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#handleDeleteModel"
                      onClick={() => {
                        setDeletingData(item);
                        setfeedback({
                          feedbackCnt: "",
                          mobNum: "",
                        });
                        setRating(0)
                        setHover(0)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card vh-100 m-2">
          <div className="card-body h-25 row align-items-center justify-content-center w-100">
            <div className="col-4 text-center">
              <img
                src={publicUrl + "assets/img/2953962.jpg"}
                height={"250px"}
                alt="no data image"
                className="w-100"
              />
            </div>
          </div>
        </div>
      )
    ) : null;
  };

  const renderBuyandSell = () => {
    return (
      <div className="container mb-3">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {!gettingDetails ? (
            data.length > 0 ? (
              data.map((card) => (
                <div className="col" key={card.buy_sell_id}>
                  <div className="card card h-100 shadow truckcard">
                    <span className="object-fit-fill rounded justify-content-center d-flex">
                      <img
                        className="m-3 rounded-3 justify-content-center d-flex"
                        src={
                          card.images !== undefined
                            ? card.images.length > 0
                              ? card.images[0]
                              : ""
                            : ""
                        }
                        alt="truck message Logo - All in one truck solutions"
                        style={{
                          width: "390px",
                          height: "290px",
                          objectFit: "cover",
                        }}
                      />
                    </span>
                    <div className="card-body">
                      <div className="col-12 col-md-12 mb-2 text-wrap">
                        <div className="row">
                          <div className="col-8 col-md-8 text-start ps-0">
                            <h5 className="card-title text-wrap">
                              {card.brand} {card.model}
                            </h5>
                          </div>
                          <div className="col-4 col-md-4 text-end .fs-6 pe-0">
                            <p className=".fs-6 reviewtext">
                              (12)
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                              <span className="float-right">
                                <i className="text-warning fa fa-star"></i>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label>
                          <FaLocationDot className="me-2 text-danger" />
                          {card.location}
                        </label>
                      </div>
                      <div>
                        <div className="row">
                          <div className="col-6 col-md-6">
                            <FaUserAlt className="me-2" />
                            {card.owner_name}
                          </div>
                          <div className="col-6 col-md-6">
                            <FaTruckFast className="me-2" />
                            {card.vehicle_number}
                          </div>
                          <div className="col-6 col-md-6">
                            <BsFillCalendar2DateFill className="me-2" />
                            {card.model}
                          </div>
                          <div className="col-6 col-md-6">
                            <RiPinDistanceFill className="me-2" />
                            {card.kms_driven} kms
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-between mt-3">
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#buyAndSellModal"
                          onClick={() => {
                            handleEdit(card);
                            SetSelectedFile([]);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn cardbutton"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#handleDeleteModel"
                          onClick={() => {
                            setDeletingData(card);
                            setfeedback({
                              feedbackCnt: "",
                              mobNum: "",
                            });
                            setRating(0)
                            setHover(0)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card vh-100 w-100 my-2">
                <div className="card-body h-25 row align-items-center">
                  <p className="text-center">No data found</p>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const getPath = window.location.pathname;
    switch (getPath) {
      case "/wishlist/load":
        return <div className="row">{renderLoadCard()}</div>;
      case "/wishlist/truck":
        return <div className="row">{renderTruckCard()}</div>;
      case "/wishlist/driver":
        return <div className="row">{renderDriverCard()}</div>;
      case "/wishlist/buy_sell":
        return <div className="row">{renderBuyandSell()}</div>;
      default:
        return null;
    }
  }

  const getWhishlistData = (tabEndpoint) => {
    setData([]);
    setGettingDetails(true);
    const getUser = Cookies.get("usrin");
    if (getUser) {
      const data = {
        user_id: window.atob(getUser),
      };
      try {
        axios
          .post(`https://truck.truckmessage.com/${tabEndpoint}`, data)
          .then((response) => {
            if (response.data.success && Array.isArray(response.data.data)) {
              setData(response.data.data);
              setGettingDetails(false);
            } else {
              console.error("Unexpected response format:", response.data);
              setGettingDetails(false);
            }
          })
          .catch((error) => {
            console.error("There was an error fetching the data!", error);
            setGettingDetails(false);
          });
      } catch (err) {
        toast.error(err);
      }
    } else {
      toast.error("plaese login to get data");
    }
  };

  return (
    <div className="container">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink
            to="/wishlist/load"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_load_details")}
          >
            Load availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/truck"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_truck_details")}
          >
            Truck availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/driver"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_driver_details")}
          >
            Driver availability post
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/wishlist/buy_sell"
            className={"nav-link"}
            onClick={() => getWhishlistData("user_buy_sell_details")}
          >
            Buy & Sell Post
          </NavLink>
        </li>
      </ul>
      <div className="tab-content mt-3">{renderTabContent()}</div>

      {/* Modal 01 */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelOne"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Company Name</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
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
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="tel"
                        name="contact_no"
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
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>From</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="from_location"
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
                      <Autocomplete
                        name="to_location"
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
                      <input
                        type="text"
                        name="material"
                        placeholder="What type of material"
                        value={editingData.material}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            material: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Ton</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
                        name="tone"
                        placeholder="Example: 2 tones"
                        value={editingData.tone}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Truck Body Type</h6>
                    <div className="input-item">
                      <select
                        className="nice-select"
                        name="truck_body_type"
                        value={editingData.truck_body_type}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            truck_body_type: e.target.value,
                          })
                        }
                      >
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
                      <select
                        className="nice-select"
                        name="tyre_count"
                        value={editingData.no_of_tyres}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            no_of_tyres: e.target.value,
                          })
                        }
                      >
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
                      <textarea
                        name="description"
                        placeholder="Enter a text here"
                        value={editingData.description}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 02 */}
      <div
        className="modal fade"
        id="exampleModaltwo"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelOne"
              ></button>
            </div>

            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Company Name</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
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
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="tel"
                        name="contact_no"
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
                    <h6>Truck name</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Name of the Owner"
                        value={editingData.truck_name}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            truck_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Vehicle Number</h6>
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="tel"
                        name="contact_no"
                        placeholder="Type your contact number"
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
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>From</h6>
                    <div className="input-item input-item-name">
                      <Autocomplete
                        name="from_location"
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
                      <Autocomplete
                        name="to_location"
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
                      <input
                        type="text"
                        name="material"
                        placeholder="What type of material"
                        value={editingData.material}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            material: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Ton</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
                        name="tone"
                        placeholder="Example: 2 tones"
                        value={editingData.tone}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Truck Body Type</h6>
                    <div className="input-item">
                      <select
                        className="nice-select"
                        name="truck_body_type"
                        value={editingData.truck_body_type}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            truck_body_type: e.target.value,
                          })
                        }
                      >
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
                      <select
                        className="nice-select"
                        name="tyre_count"
                        value={editingData.no_of_tyres}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            no_of_tyres: e.target.value,
                          })
                        }
                      >
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
                      <textarea
                        name="description"
                        placeholder="Enter a text here"
                        value={editingData.description}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 03 */}
      <div
        className="modal fade"
        id="exampleModalthree"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModelThree"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <h6>Driver Name</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
                        name="company_name"
                        placeholder="Name of the Owner"
                        value={editingData.driver_name}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            driver_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <h6>Vehicle Number</h6>
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="tel"
                        name="contact_no"
                        placeholder="Type your contact number"
                        value={editingData.vehicle_number}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            vehicle_number: e.target.value,
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
                    <h6>Company Name</h6>
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input
                        type="text"
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
                    <div className="input-item input-item-email ltn__custom-icon">
                      <input
                        type="tel"
                        name="contact_no"
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
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6">
                  <h6>From</h6>
                  <div className="input-item input-item-name">
                    <Autocomplete
                      name="from_location"
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
                    <Autocomplete
                      name="to_location"
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
                    <input
                      type="text"
                      name="material"
                      placeholder="What type of material"
                      value={editingData.material}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          material: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <h6>Ton</h6>
                  <div className="input-item input-item-name ltn__custom-icon">
                    <input
                      type="text"
                      name="tone"
                      placeholder="Example: 2 tones"
                      value={editingData.tone}
                      onChange={(e) =>
                        setEditingData({ ...editingData, tone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <h6>Truck Body Type</h6>
                  <div className="input-item">
                    <select
                      className="nice-select"
                      name="truck_body_type"
                      value={editingData.truck_body_type}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          truck_body_type: e.target.value,
                        })
                      }
                    >
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
                    <select
                      className="nice-select"
                      name="tyre_count"
                      value={editingData.no_of_tyres}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          no_of_tyres: e.target.value,
                        })
                      }
                    >
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
                    <textarea
                      name="description"
                      placeholder="Enter a text here"
                      value={editingData.description}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleChooseUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal 4 */}
      <div
        className="modal fade"
        id="buyAndSellModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Add Load
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="clodeBuySellModel"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ltn__appointment-inner">
                <div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <h6>Brand</h6>
                      <div className="input-item input-item-name ltn__custom-icon">
                        <input
                          type="text"
                          name="company_name"
                          placeholder="Name of the Brand"
                          value={editingData.brand}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              brand: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h6>Model</h6>
                      <div className="input-item input-item-name ltn__custom-icon">
                        <input
                          type="text"
                          name="company_name"
                          placeholder="Name of the Model"
                          value={editingData.model}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              model: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h6>Owner Name</h6>
                      <div className="input-item input-item-name ltn__custom-icon">
                        <input
                          type="text"
                          name="owner_name"
                          placeholder="Name of the Owner"
                          value={editingData.owner_name}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              owner_name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h6>Vehicle Number</h6>
                      <div className="input-item input-item-email ltn__custom-icon">
                        <input
                          type="tel"
                          name="contact_no"
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
                      <h6>Kilometers driven</h6>
                      <div className="input-item">
                        <input
                          type="number"
                          name="contact_no"
                          placeholder="Type Kilometers driven"
                          className="w-100 py-3"
                          value={editingData.kms_driven}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              kms_driven: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h6>Contact Number</h6>
                      <div className="input-item input-item-email ltn__custom-icon">
                        <input
                          type="tel"
                          name="contact_no"
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
                      <h6>Location</h6>
                      <div className="input-item input-item-name">
                        <Autocomplete
                          name="from_location"
                          className="google-location location-input bg-transparent py-2"
                          apiKey="AIzaSyA09V2FtRwNpWu7Xh8hc7nf-HOqO7rbFqw"
                          onPlaceSelected={(place) => {
                            if (place) {
                              handleBuyAndSellLocation(
                                place.address_components
                              );
                            }
                          }}
                          required
                          value={showingBuyAndSellLocation}
                          onChange={(e) =>
                            setShowingBuyAndSellLocation(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <h6>Truck Body Type</h6>
                      <div className="input-item">
                        <select
                          className="nice-select"
                          name="truck_body_type"
                          required
                          value={editingData.truck_body_type}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              truck_body_type: e.target.value,
                            })
                          }
                        >
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
                        <select
                          className="nice-select"
                          name="tyre_count"
                          value={editingData.no_of_tyres}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              no_of_tyres: e.target.value,
                            })
                          }
                          required
                        >
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

                  <div className="mb-3">
                    <label for="formFileMultiple" className="form-label">
                      Multiple files input example
                    </label>
                    <input
                      type="file"
                      id="fileupload"
                      className="file-upload-input form-control"
                      accept="image/jpg, image/jpeg"
                      onChange={InputChange}
                      multiple
                    />
                  </div>
                  <div className="my-3">
                    {selectedfile.map((data, index) => {
                      const {
                        id,
                        filename,
                        filetype,
                        fileimage,
                        datetime,
                        filesize,
                      } = data;
                      return (
                        <div className="file-atc-box" key={id}>
                          {filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                            <div className="file-image">
                              {" "}
                              <img src={fileimage} alt="" />
                            </div>
                          ) : (
                            <div className="file-image">
                              <i className="far fa-file-alt"></i>
                            </div>
                          )}
                          <div className="file-detail row">
                            <h6>{filename}</h6>
                            <div className="col-9">
                              <p>
                                <span>Size : {filesize}</span>,
                                <span className="ps-1 ml-2">
                                  Modified Time : {datetime}
                                </span>
                              </p>
                            </div>
                            <div className="file-actions col-3">
                              <button
                                type="button"
                                className="file-action-btn"
                                onClick={() => DeleteSelectFile(id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h6>Descriptions (Optional)</h6>
                    <div className="input-item input-item-textarea ltn__custom-icon">
                      <textarea
                        name="description"
                        placeholder="Enter a text here"
                        value={editingData.description}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary col-12 col-md-3"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary col-12 col-md-3"
                    onClick={handleBuyAndSellUpdate}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* delete model  */}
      <div
        className="modal fade"
        id="handleDeleteModel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="deleteCloseModel"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p></p>
              <div className="row">
                <div className="col-7">
                  <p>Did you get leads using this platform</p>
                </div>
                <div className="col-5 row">
                  <div className="form-check col-6">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="YES"
                      id="radioYes"
                      onChange={(e) => setFeedbackRadio(e.target.value)}
                      checked={feedbackRadio === "YES"}
                    />
                    <label className="form-check-label" htmlFor="radioYes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check col-6">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      value="NO"
                      id="radioNo"
                      onChange={(e) => setFeedbackRadio(e.target.value)}
                      checked={feedbackRadio === "NO"}
                    />
                    <label className="form-check-label" htmlFor="radioNo">
                      No
                    </label>
                  </div>
                </div>
                {feedbackRadio === "NO" ? (
                  <div className="col-12">
                    <div className="mb-3">
                      <label
                        htmlFor="feedbackModelTextarea"
                        className="form-label"
                      >
                        Feedback
                      </label>
                      <textarea
                        className="form-control"
                        id="feedbackModelTextarea"
                        rows="6"
                        value={feedback.feedbackCnt}
                        onChange={(e) =>
                          setfeedback({
                            ...feedback,
                            feedbackCnt: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label
                        htmlFor="feedbackModelMobilenumber"
                        className="form-label"
                      >
                        Phone number
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="feedbackModelMobilenumber"
                        placeholder="Enter your mobile number"
                        value={feedback.mobNum}
                        onChange={(e) =>
                          setfeedback({ ...feedback, mobNum: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3 row align-items-center">
                      <div className="col-2">
                        <h6 className="mb-0">Ratings</h6>
                      </div>
                      <div className="col-10 row p-0">
                        {[...Array(5)].map((star, i) => {
                          const ratingsValue = i + 1;
                          return (
                            <label className="ratingLabel">
                              <input type="radio" name="rating" className="ratingInput" value={ratingsValue} onClick={() => setRating(ratingsValue)} />
                              <FaStar
                                className="star"
                                color={ratingsValue <= (feedbackHover || feedbackRating) ? "#ffc107" : "#e4e5e9"}
                                size={25}
                                onMouseEnter={() => setHover(ratingsValue)}
                                onMouseLeave={() => setHover(0)}
                              />
                            </label>
                          )
                        })
                        }

                      </div>
                    </div>
                  </>
                )}
              </div>


            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary col-12 col-md-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary col-12 col-md-3"
                onClick={handleSubmitFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishList;
