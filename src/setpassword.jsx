import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>🔐</div>
          <h1 style={styles.title}>Set Your Password</h1>
          <p style={styles.subtitle}>
            Create a strong password for your admin account
          </p>
        </div>

        {success ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>Password Set Successfully!</h2>
            <p style={styles.successText}>
              You can now login with your new password
            </p>
            <button style={styles.btn} onClick={() => navigate("/")}>
              Go to Login →
            </button>
          </div>
        ) : (
          <div style={styles.form}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.rulesBox}>
              <p style={styles.rulesTitle}>Password must have:</p>
              <p style={styles.rule}>✓ At least 8 characters</p>
              <p style={styles.rule}>✓ One uppercase letter</p>
              <p style={styles.rule}>✓ One number</p>
              <p style={styles.rule}>✓ One special character</p>
            </div>

            <button
              style={styles.btn}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Setting password..." : "Set Password →"}
            </button>

            <p style={styles.backBtn} onClick={() => navigate("/")}>
              ← Back to Login
            </p>

          </div>
        )}

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
  },
  rulesBox: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "10px",
    padding: "12px 16px",
  },
  rulesTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#0369a1",
    margin: "0 0 6px 0",
  },
  rule: {
    fontSize: "12px",
    color: "#0369a1",
    margin: "3px 0",
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
  },
  backBtn: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6366f1",
    cursor: "pointer",
    fontWeight: "600",
    margin: 0,
  },
  successBox: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  successIcon: {
    fontSize: "50px",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  successText: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
};

export default SetPassword;