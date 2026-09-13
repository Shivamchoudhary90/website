import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css";

function Registration() {
  const[showPassword,setShowPassword]= useState(false);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    captchaInput: ""
  });

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
    }
    setCaptcha(code.trim());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      alert("Kripya 10 ankon ka mobile number darj karein!");
      return;
    }

    if (formData.captchaInput.replace(/\s+/g, "") !== captcha.replace(/\s+/g, "")) {
      alert("Captcha galat hai!");
      generateCaptcha();
      return;
    }

    try {
      const res = await  fetch("https://website-r1i5.onrender.com/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Registration Safal! Aapka Registration No hai: ${data.name}`);
        // Form clear karne ke liye
        setFormData({
          name: "",
          mobile: "",
          email: "",
          password: "",
          captchaInput: ""
        });
        generateCaptcha();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Backend server se connect nahi ho pa raha! Pehle terminal me 'node index.js' run karein.");
    }
  };

  return (
    <div className="auth-card" id="reg-auth-card">
      <div className="card-header">
        <span className="cap-icon">🎓</span>
        <h3 className="card-header-title">STUDENT/CANDIDATE REGISTRATION </h3>
      </div>

      <form onSubmit={handleSubmit} className="form-body">
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="name"
            id="reg-name-field"
            placeholder="Enter Candidate Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <span className="input-icon">📱</span>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="input-group password-group">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="captcha-row">
          <div className="captcha-box">{captcha}</div>
          <button type="button" className="refresh-btn" onClick={generateCaptcha}>
            🔄
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="captchaInput"
            placeholder="Enter Captcha"
            value={formData.captchaInput}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          REGISTER
        </button>

        {/* ⚠️ Is line ko direct navigate lagaya hai taaki koi dusra page na khule */}
        <div className="card-footer">
          <p>
            Already Registered?{" "}
            <span
              role="button"
              onClick={() => navigate("/?auth=login")}
              style={{ color: "#7b1113", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
            >
              Login Here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Registration;
