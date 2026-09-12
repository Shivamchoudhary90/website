import "./H1.css";
import React from "react";
import { useSearchParams } from "react-router-dom";
import Registration from "../components/Registration";
import Login from "../components/Login";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL me '?auth=register' hoga toh Registration dikhega, varna Login dikhega
  const authMode = searchParams.get("auth") || "login";

  return (
    <div className="home">
      {/* Left side text and banner content */}
      <div className="left-content">
        <h1 className="banner-title-hi">
          संत श्री किशनाराम <br />
          फाउंडेशन संस्था सरनाऊ
        </h1>

        <h5 className="banner-subtitle-en">
          ONLINE EXAMINATION &amp; <br />
          MANAGEMENT PORTAL
        </h5>

        <div className="line"></div>

        <p className="banner-tagline">
          शिक्षा का प्रकाश, सफलता की ओर प्रयास
        </p>
      </div>

      {/* Right side Container: Toggle Login aur Registration */}
      <div className="right-auth-container" id="reg-section">
        {authMode === "register" ? (
          <Registration onSwitchToLogin={() => setSearchParams({ auth: "login" })} />
        ) : (
          <Login onSwitchToRegister={() => setSearchParams({ auth: "register" })} />
        )}
      </div>
    </div>
  );
}

export default Home;