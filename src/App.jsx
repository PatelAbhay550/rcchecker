import React, { useState } from "react";
import "./App.css";
import { Helmet } from "react-helmet";

const App = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [owner, setOwner] = useState("");
  const [rcDetails, setRcDetails] = useState(null);
  const [error, setError] = useState(null);

  const fetchRCDetails = async () => {
    if (!vehicleNo) {
      setError("Please enter a vehicle number.");
      return;
    }

    try {
      setError(null);
      // Replace with your actual API call here
      const response = await fetch(
        `https://api-rcchecker.vercel.app//rc-details?vehicleno=${vehicleNo}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch RC details");
      }

      const result = await response.json();

      // Extracting data from the first section of the webSections array
      const webSection = result.pageProps.rcDetailsResponse.data.webSections[0];
      setOwner(webSection.message.title);

      // Extracting relevant details from messages
      const ownerName =
        webSection.messages.find((msg) => msg.title === "Owner Name")
          ?.subtitle || "Not available";

      const vehicleNumber =
        webSection.messages.find((msg) => msg.title === "Number")?.subtitle ||
        "Not available";

      const city =
        webSection.messages.find((msg) => msg.title === "City")?.subtitle ||
        "Not available";

      const state =
        webSection.messages.find((msg) => msg.title === "State")?.subtitle ||
        "Not available";

      const rtoPhoneNumber =
        webSection.messages.find((msg) => msg.title === "RTO Phone number")
          ?.subtitle || "Not available";

      const email =
        webSection.messages.find((msg) => msg.title === "Email")?.subtitle ||
        "Not available";

      const vehicleModel = webSection.message.subtitle || "Not available";

      // Setting the relevant data
      setRcDetails({
        ownerName,
        vehicleNumber,
        city,
        state,
        rtoPhoneNumber,
        email,
        vehicleModel,
      });
    } catch (err) {
      setError(err.message);
      setRcDetails(null);
    }
  };

  return (
    <div className="container">
      <h1>Free RC Search Online</h1>
      <div className="input-container">
        <input
          type="text"
          className="input"
          placeholder="Enter Vehicle Number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
        />
        <button className="button" onClick={fetchRCDetails}>
          Search
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {rcDetails && (
        <div className="rc-details-container">
          <Helmet>
            <script type="application/ld+json">
              {`
      {
        "@context": "https://schema.org",
        "@type": "Car",
        "vehicleIdentificationNumber": "${rcDetails.vehicleNumber}",
        "manufacturer": "${rcDetails.vehicleModel}",
        "vehicleType": "Car",
        "owner": {
          "@type": "Person",
          "name": "${rcDetails.ownerName}",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "${rcDetails.city}",
            "addressRegion": "${rcDetails.state}"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "${rcDetails.rtoPhoneNumber}",
            "contactType": "Customer Service"
          }
        }
      }
    `}
            </script>
          </Helmet>

          <h2>RC Details</h2>
          <div>
            <h3>Owner Name:</h3>
            <p>{owner}</p>
          </div>
          <div>
            <h3>Vehicle Number:</h3>
            <p>{rcDetails.vehicleNumber}</p>
          </div>
          <div>
            <h3>City:</h3>
            <p>{rcDetails.city}</p>
          </div>
          <div>
            <h3>State:</h3>
            <p>{rcDetails.state}</p>
          </div>
          <div>
            <h3>RTO Phone Number:</h3>
            <p>{rcDetails.rtoPhoneNumber}</p>
          </div>
          <div>
            <h3>Email:</h3>
            <p>{rcDetails.email}</p>
          </div>
          <div>
            <h3>Vehicle Model:</h3>
            <p>{rcDetails.vehicleModel}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
