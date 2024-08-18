// EditModal.js

import React, { useState } from 'react';
import axios from 'axios';

const EditModal = ({ item, onUpdate }) => {
  const [formData, setFormData] = useState({
    company_name: item.company_name,
    contact_no: item.contact_no,
    description: item.description,
    from_location: item.from_location,
    id: item.id,
    load_id: item.load_id,
    material: item.material,
    no_of_tyres: item.no_of_tyres,
    to_location: item.to_location,
    tone: item.tone,
    truck_body_type: item.truck_body_type,
    updt: item.updt,
    user_id: item.user_id
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://truck.truckmessage.com/load_details', formData)
      .then(response => {
        // Handle success, e.g., show toast, update state, etc.
        onUpdate(formData); // Update the state in parent component
        console.log('Data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  return (
    <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editModalLabel">Edit Load Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input type="text" className="form-control" name="company_name" value={formData.company_name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input type="text" className="form-control" name="contact_no" value={formData.contact_no} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">From Location</label>
                <input type="text" className="form-control" name="from_location" value={formData.from_location} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">To Location</label>
                <input type="text" className="form-control" name="to_location" value={formData.to_location} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Material</label>
                <input type="text" className="form-control" name="material" value={formData.material} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Tone</label>
                <input type="text" className="form-control" name="tone" value={formData.tone} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Truck Body Type</label>
                <input type="text" className="form-control" name="truck_body_type" value={formData.truck_body_type} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Number of Tyres</label>
                <input type="text" className="form-control" name="no_of_tyres" value={formData.no_of_tyres} onChange={handleChange} required />
              </div>
              {/* Add any other fields as needed */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
