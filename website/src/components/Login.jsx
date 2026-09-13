import React, { useState, useEffect } from "react";
import "./Login.css";

function Login({ onSwitchToRegister }) {
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    captchaInput: ""
  });

  // Forgot Password State
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Regular Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.captchaInput.replace(/\s+/g, "") !== captcha.replace(/\s+/g, "")) {
      alert("Captcha match nahi hua!");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch("https://website-r1i5.onrender.com/api/login", {
       method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Swagatam! ${data.user.name} Login Safal.`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server connect nahi ho pa raha!");
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://website-r1i5.onrender.com/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setForgotStep(2);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("OTP bhejne me dikkat aayi!");
    }
  };

  // Step 2: Verify & Change Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://website-r1i5.onrender.com/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otp,
          newPassword: newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setShowForgot(false);
        setForgotStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Password reset nahi ho saka!");
    }
  };

  return (
    <div className="auth-card" id="login-auth-card">
      <div className="card-header">
        <span className="cap-icon">🎓</span>
        <h3 className="card-header-title">STUDENT / CANDIDATE LOGIN</h3>
      </div>

      {!showForgot ? (
        <form onSubmit={handleSubmit} className="form-body">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Enter Candidate Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="captcha-row">
            <div className="captcha-box">{captcha}</div>
            <button
              type="button"
              className="refresh-btn"
              onClick={generateCaptcha}
            >
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
            LOGIN
          </button>

          <div className="card-footer">
            <p className="forgot-link">
              <span
                style={{ cursor: "pointer", color: "#0066cc" }}
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </span>
            </p>
            <p className="switch-link">
              New Student ?{" "}
              <span role="button" onClick={onSwitchToRegister} className="link-text">
                Register Here
              </span>
            </p>
          </div>
        </form>
      ) : (
        /* Forgot Password Section */
        <div className="form-body">
          <h4 style={{ textAlign: "center", marginBottom: "15px" }}>Reset Password</h4>

          {forgotStep === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="Apna Registered Email Daalein"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                SEND OTP
              </button>
              <button
                type="button"
                className="submit-btn"
                style={{ background: "#666", marginTop: "8px" }}
                onClick={() => setShowForgot(false)}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <span className="input-icon">🔑</span>
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                SAVE NEW PASSWORD
              </button>
              <button
                type="button"
                className="submit-btn"
                style={{ background: "#666", marginTop: "8px" }}
                onClick={() => setForgotStep(1)}
              >
                Back
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
