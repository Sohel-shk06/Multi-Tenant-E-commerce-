import { useState } from "react";

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1 = login, 2 = OTP
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Login Successful!");
    }, 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* Logo / Title */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🛒</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>
            {step === 1 ? "Sign in to your account" : "Verify your identity"}
          </p>
        </div>

        {/* Step 1 - Login Form */}
        {step === 1 && (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.forgotRow}>
              <span style={styles.forgotLink}>Forgot Password?</span>
            </div>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Please wait..." : "Continue →"}
            </button>
          </form>
        )}

        {/* Step 2 - OTP Form */}
        {step === 2 && (
          <form onSubmit={handleVerify} style={styles.form}>
            <p style={styles.otpInfo}>
              📱 OTP sent to your registered phone number
            </p>

            <div style={styles.otpRow}>
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  style={styles.otpBox}
                />
              ))}
            </div>

            <p style={styles.resend}>
              Didn't receive?{" "}
              <span style={styles.forgotLink}>Resend OTP</span>
            </p>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <p
              style={styles.backBtn}
              onClick={() => setStep(1)}
            >
              ← Back to Login
            </p>
          </form>
        )}
        <p style={{textAlign:"center", marginTop:"10px", fontSize:"13px", color:"#6366f1", cursor:"pointer"}}
onClick={() => window.location.href = "/setpassword"}>
First time? Set your password
</p>
      </div>

    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logoIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    background: "#f8fafc",
    transition: "border 0.2s",
  },
  forgotRow: {
    textAlign: "right",
    marginTop: "-8px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: "600",
  },
  btn: {
    padding: "13px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "4px",
  },
  otpInfo: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "10px",
    borderRadius: "8px",
    margin: 0,
  },
  otpRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  otpBox: {
    width: "45px",
    height: "50px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: "700",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#1e293b",
    outline: "none",
  },
  resend: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  backBtn: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: "600",
    margin: 0,
  },
};

export default AdminLogin;