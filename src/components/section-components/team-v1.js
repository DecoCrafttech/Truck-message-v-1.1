import React, { useState } from 'react';
import axios from 'axios';

const TeamV1 = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  const calculateToll = async () => {
    try {
      const response = await axios.get(`/tollgate-pricing?origin=${origin}&destination=${destination}`);
      setRoute(response.data.route);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error calculating toll:', error);
      setError('Failed to calculate toll. Please try again.'); // Set error message
      setRoute(null); // Clear route on error
    }
  };

  return (
    <div className="tollgate-calculator">
      <h2>Tollgate Pricing Calculator</h2>
      <form onSubmit={(e) => { e.preventDefault(); calculateToll(); }}>
        <div className="form-group">
          <label>Origin:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter origin"
            required
          />
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            required
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {route && (
        <div className="result">
          <h3>Route Details</h3>
          <p>Distance: {route.distance}</p>
          <p>Duration: {route.duration}</p>
          <p>Toll Cost: {route.tollCost}</p>
        </div>
      )}
    </div>
  );
};

export default TeamV1;


