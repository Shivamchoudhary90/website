const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "users.json");

// users.json ensure karein
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 1. REGISTRATION API
app.post("/api/register", (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "Kripya saari details bharein!" });
    }

    const fileData = fs.readFileSync(DATA_FILE, "utf-8");
    const users = fileData ? JSON.parse(fileData) : [];

    const exists = users.find(
      (u) =>
        (u.name && u.name.trim().toLowerCase() === name.trim().toLowerCase()) ||
        u.mobile === mobile ||
        u.email === email
    );

    if (exists) {
      return res.status(400).json({ message: "Yeh Name, Mobile ya Email pehle se registered hai!" });
    }

    const newUser = {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      password: password.trim()
    };

    users.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    return res.json({ message: "Registration Safal Hua!", name: newUser.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// 2. LOGIN API
app.post("/api/login", (req, res) => {
  try {
    const inputName = (req.body.name || req.body.username || "").toString().trim().toLowerCase();
    const inputPassword = (req.body.password || "").toString().trim();

    if (!inputName || !inputPassword) {
      return res.status(400).json({ message: "Name aur Password dono darj karein!" });
    }

    const fileData = fs.readFileSync(DATA_FILE, "utf-8");
    const users = fileData ? JSON.parse(fileData) : [];

    const user = users.find((u) => {
      const uName = (u.name || "").toString().trim().toLowerCase();
      const uPass = (u.password || "").toString().trim();
      return uName === inputName && uPass === inputPassword;
    });

    if (!user) {
      return res.status(400).json({ message: "Galat Name ya Password!" });
    }

    return res.json({ message: "Login Safal!", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
const nodemailer = require("nodemailer");

// In-memory OTP store (OTP aur Expiry ke liye)
let otpStore = {};

// Gmail Transporter Setup
// YAHAN APNI GMAIL AUR 16-DIGIT APP PASSWORD DAALEIN:
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Port 465 ke liye true
  auth: {
    user: "thecreed9694@gmail.com", // Pura email address
    pass: "kuaspjpbahvxeohe"      // 16 digit bina kisi space ke
  },
  tls:{
    rejectUnauthorized:false
  }
});

// 1. API: Send OTP to Email
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email darj karein!" });
  }

  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(404).json({ message: "Yeh Email registered nahi hai!" });
  }

  // 6 Digit Random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.trim().toLowerCase()] = {
    otp: otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 Minute valid
  };

  const mailOptions = {
    from: "Student Portal Support<thecreed9694@gmail.com>",
    to: email.trim(),
    subject: "Password Reset Verification Code",
    text: `Aapka Password Reset OTP hai: ${otp}. Yeh code agle 5 minute tak valid hai.`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ message: "Aapke email par OTP bhej diya gaya hai!" });
  } catch (err) {
    console.error("Mail Error:", err);
    return res.status(500).json({ message: "Email bhejne me samasya aayi!" });
  }
});

// 2. API: Verify OTP & Change Password
app.post("/api/reset-password", (req, res) => {
  const { email, otp, newPassword } = req.body;
  const userEmail = (email || "").trim().toLowerCase();

  const record = otpStore[userEmail];

  if (!record || record.otp !== otp.trim()) {
    return res.status(400).json({ message: "Galat ya Expired OTP!" });
  }

  if (Date.now() > record.expires) {
    delete otpStore[userEmail];
    return res.status(400).json({ message: "OTP expire ho chuka hai! Dubara request karein." });
  }

  // Password update in users.json
  const users = JSON.parse(fs.readFileSync(DATA_FILE));
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === userEmail);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User nahi mila!" });
  }

  users[userIndex].password = newPassword.trim();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

  // Clear OTP
  delete otpStore[userEmail];

  return res.json({ message: "Password safaltapoorvak badal diya gaya! Ab Login karein." });
});
// Port 5000 par listen karega
app.listen(5000, () => {
  console.log("=== SERVER RUNNING ON PORT 5000 ===");
});