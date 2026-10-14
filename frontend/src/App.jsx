import { useState } from "react";
import "./App.css";

function App() {
  // Submission states
  const [passportNumber, setPassportNumber] = useState("");
  const [name, setName] = useState("");
  const [passportImage, setPassportImage] = useState(null);
  const [result, setResult] = useState("");
  const [passportDetails, setPassportDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Status update states
  const [newStatus, setNewStatus] = useState("Pending");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  // Submit passport details
  const verifyPassport = async (event) => {
    event.preventDefault();

    if (!passportNumber.trim() || !name.trim()) {
      setResult("Please enter your passport number and full name.");
      setPassportDetails(null);
      return;
    }

    if (!passportImage) {
      setResult("Please upload a passport image.");
      setPassportDetails(null);
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setPassportDetails(null);

      const formData = new FormData();
      formData.append("passportNumber", passportNumber.trim());
      formData.append("name", name.trim());
      formData.append("passportImage", passportImage);

      const response = await fetch("http://localhost:5000/verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Passport submission failed.");
      }

      setResult(data.message || "Passport record saved successfully.");
      setPassportDetails(data.passport);
      setPassportNumber("");
      setName("");
      setPassportImage(null);

      event.target.reset();
    } catch (error) {
      console.error("Submission error:", error);
      setResult(error.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // Search passport records
  const searchPassport = async (event) => {
    event.preventDefault();

    if (!searchNumber.trim()) {
      setSearchMessage("Please enter a passport number.");
      setSearchResult(null);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchMessage("");
      setSearchResult(null);
      setStatusMessage("");

      const response = await fetch(
        `http://localhost:5000/passport/${encodeURIComponent(
          searchNumber.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Passport record not found.");
      }

      setSearchResult(data.passport);
      setNewStatus(data.passport.verificationStatus || "Pending");
      setSearchMessage("Passport record found successfully.");
    } catch (error) {
      setSearchMessage(error.message || "Unable to search passport.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Update passport status in MongoDB
  const updatePassportStatus = async () => {
    if (!searchResult) {
      setStatusMessage("Search for a passport record first.");
      return;
    }

    try {
      setStatusLoading(true);
      setStatusMessage("");

      const response = await fetch(
        `http://localhost:5000/passport/${encodeURIComponent(
          searchResult.passportNumber
        )}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status.");
      }

      setSearchResult(data.passport);
      setNewStatus(data.passport.verificationStatus);
      setStatusMessage(data.message || "Status updated successfully.");
    } catch (error) {
      console.error("Status update error:", error);
      setStatusMessage(error.message || "Unable to connect to backend.");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>Passport Verify</span>
        </div>

        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#submit">Verify Passport</a>
          <a href="#records">Records</a>
        </div>
      </nav>

      {/* Heading */}
      <header className="page-heading" id="dashboard">
        <h1>Passport Verification</h1>
        <p>
          Manage passport submissions, review saved records, and update
          verification status.
        </p>
      </header>

      {/* Submission and status cards */}
      <section className="main-grid">
        <div className="card" id="submit">
          <h2 className="card-heading">Submit for Verification</h2>
          <p className="card-description">
            Enter passport details and upload an image to create a record.
          </p>

          <form onSubmit={verifyPassport}>
            <label className="field-label" htmlFor="passportNumber">
              Passport Number
            </label>
            <input
              id="passportNumber"
              type="text"
              placeholder="Enter passport number"
              value={passportNumber}
              onChange={(event) =>
                setPassportNumber(event.target.value)
              }
              required
            />

            <label className="field-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label className="field-label" htmlFor="passportImage">
              Passport Image
            </label>
            <input
              id="passportImage"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setPassportImage(event.target.files?.[0] || null)
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>

          {result && (
            <div className="result" role="status">
              {result}
            </div>
          )}

          {passportDetails && (
            <div className="passport-details">
              <h2>Submitted Passport Details</h2>
              <p>
                <strong>Passport Number:</strong>{" "}
                {passportDetails.passportNumber}
              </p>
              <p>
                <strong>Full Name:</strong> {passportDetails.name}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {passportDetails.verificationStatus}
              </p>
            </div>
          )}
        </div>

        {/* Status panel */}
        <aside className="status-card">
          <div>
            <span className="status-label">Verification Status</span>
            <h2 className="status-title">
              {passportDetails
                ? passportDetails.verificationStatus
                : searchResult
                  ? searchResult.verificationStatus
                  : "Ready for Review"}
            </h2>

            <span className="status-badge">
              <span>●</span>
              {passportDetails
                ? passportDetails.verificationStatus
                : searchResult
                  ? searchResult.verificationStatus
                  : "Awaiting Submission"}
            </span>

            <p className="status-message">
              A saved record starts as Pending. Its status can be managed
              below for demonstration purposes.
            </p>
          </div>

          <div className="security-illustration" aria-hidden="true">
            <div className="passport-graphic">
              <span>▤</span>
              <small>PASSPORT</small>
            </div>
            <div className="shield-bubble">✓</div>
          </div>
        </aside>
      </section>

      {/* Search records */}
      <section className="card search-card" id="records">
        <h2 className="card-heading">Search Existing Records</h2>
        <p className="card-description">
          Find a passport record saved in your MongoDB database.
        </p>

        <form className="search-row" onSubmit={searchPassport}>
          <div>
            <label className="field-label" htmlFor="searchNumber">
              Passport Number
            </label>
            <input
              id="searchNumber"
              type="text"
              placeholder="Enter passport number to search"
              value={searchNumber}
              onChange={(event) => setSearchNumber(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search Record"}
          </button>
        </form>

        {searchMessage && (
          <div className="result" role="status">
            {searchMessage}
          </div>
        )}

        {searchResult && (
          <div className="passport-details">
            <h2>Passport Record Found</h2>

            <p>
              <strong>Passport Number:</strong>{" "}
              {searchResult.passportNumber}
            </p>

            <p>
              <strong>Full Name:</strong> {searchResult.name}
            </p>

            <p>
              <strong>Current Status:</strong>{" "}
              {searchResult.verificationStatus}
            </p>

            <hr />

            <label className="field-label" htmlFor="newStatus">
              Update Verification Status
            </label>

            <select
              id="newStatus"
              value={newStatus}
              onChange={(event) => setNewStatus(event.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button
              type="button"
              onClick={updatePassportStatus}
              disabled={statusLoading}
            >
              {statusLoading ? "Updating..." : "Update Status"}
            </button>

            {statusMessage && (
              <div className="result" role="status">
                {statusMessage}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        Passport Verify · Student Project Demo
        <br />
        Use dummy test data. Status updates do not authenticate passport
        authenticity.
      </footer>
    </div>
  );
}

export default App;
