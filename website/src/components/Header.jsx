import "./Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleAuthAction = (type) => {
    // Ye direct home page par URL parameter change karega bina naye page par redirect kiye
    navigate(`/?auth=${type}`);

    setTimeout(() => {
      const cardId = type === "register" ? "reg-auth-card" : "login-auth-card";
      const formElement = document.getElementById(cardId);

      if (formElement) {
        formElement.classList.remove("active-glow");
        void formElement.offsetWidth;
        formElement.classList.add("active-glow");

        const firstInput = formElement.querySelector("input");
        if (firstInput) firstInput.focus();

        setTimeout(() => {
          formElement.classList.remove("active-glow");
        }, 3000);
      }
    }, 100);
  };

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-circle">
          <img
  src={`${import.meta.env.BASE_URL}logo.png`}
  alt="Foundation Logo"
/>
        </div>
        <div>
          <h1>संत श्री किशनाराम फाउंडेशन</h1>
          <h2>संस्था सरनाऊ</h2>
          <p>ONLINE EXAMINATION &amp; MANAGEMENT PORTAL</p>
        </div>
      </div>

      <div className="gyaan-text">
        <div className="line">
          <div>
            <h3>ज्ञान से उज्जवल भविष्य</h3>
            <h3>संस्कारों से महान जीवन</h3>
          </div>
        </div>
      </div>

      <div className="header-buttons">
        {/* Maroon Login Button (No <Link to="/login">) */}
        <button
          type="button"
          className="student-btn"
          onClick={() => handleAuthAction("login")}
        >
          <span>👤</span> Login
        </button>

        {/* Light Yellow Registration Button */}
        <button
          type="button"
          className="registration-btn"
          onClick={() => handleAuthAction("register")}
        >
          <span>📝</span> Registration
        </button>
      </div>
    </header>
  );
}

export default Header;
