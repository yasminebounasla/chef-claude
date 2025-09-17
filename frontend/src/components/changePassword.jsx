import { AuthContext } from "../context/authContext";
import { useState, useContext } from "react";
import { changePassword } from "../service/userService";
import "../style/ChangePassword.css";

export const ChangePassword = ({ onClose }) => {
  const { loading, setLoading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmNewPassword 
      );
      setSuccess(response?.message || "Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (err) {
      console.error("changePassword error:", err);
      setError("Failed to change your password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-overlay" onClick={onClose}>
      <div className="password-container" onClick={(e) => e.stopPropagation()}>
        <div className="password-header">
          <h2 className="password-title">Change Password</h2>
          <button className="close-btn" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="password-content">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="password-field">
            <label className="label">Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="password-field">
            <label className="label">New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="password-field">
            <label className="label">Confirm New Password:</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="password-actions">
            <button className="primary-btn" onClick={handleSave} disabled={loading}>
              Save
            </button>
            <button className="secondary-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
