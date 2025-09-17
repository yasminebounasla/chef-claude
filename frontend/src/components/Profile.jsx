import { useState, useEffect, useContext } from "react";
import { getProfile, editprofile, deleteProfile } from "../service/userService";
import { AuthContext } from "../context/authContext";
import "../style/Profile.css";

export const Profile = ({ onClose, onChangePassword }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const { loading, setLoading, logout } = useContext(AuthContext);

  // fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        const profileData = response.data;

        setProfile(profileData);
        setFormData({
          name: profileData?.name ?? "",
          email: profileData?.email ?? ""
        });
      } catch (err) {
        setError("Failed to fetch profile");
        console.error("getProfile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setLoading]);

  // start editing
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // update input values
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // save updated profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await editprofile(formData.name, formData.email);
      const updatedProfile = updated.data;

      setProfile(updatedProfile);
      setFormData({
        name: updatedProfile?.name ?? "",
        email: updatedProfile?.email ?? ""
      });
      setIsEditing(false);
    } catch (err) {
      console.error("editprofile error:", err);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name ?? "",
      email: profile?.email ?? ""
    });
    setIsEditing(false);
  };

  // Show delete confirmation modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteError("");
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteError("");
  };

  // Confirm delete with password
  const handleDeleteConfirm = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Please enter your password");
      return;
    }

    setLoading(true);
    setDeleteError("");
    
    try {
      await deleteProfile(deletePassword);
      logout();
      alert("Your account has been deleted.");
      onClose();
    } catch (err) {
      console.error("deleteProfile error:", err);
      setDeleteError("Incorrect password or failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="profile-header">
          <h2 className="profile-title">Your Profile</h2>
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

        {/* Content */}
        <div className="profile-content">
          {loading ? (
            <div className="loading">Loading profile...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div>
              {/* Profile fields */}
              <div className="profile-card">
                {isEditing ? (
                  <>
                    <div className="profile-field">
                      <label className="label">Full Name:</label>
                      <input
                        name="name"
                        type="text"
                        value={formData?.name ?? ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="profile-field">
                      <label className="label">Email:</label>
                      <input
                        name="email"
                        type="email"
                        value={formData?.email ?? ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="profile-field">
                      <span className="label">Full Name:</span>
                      <span className="value">{profile?.name}</span>
                    </div>

                    <div className="profile-field">
                      <span className="label">Email:</span>
                      <span className="value">{profile?.email}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button
                      className="primary-btn"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      className="secondary-btn"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="action-buttons">
                      <button
                        className="primary-btn"
                        onClick={handleEditClick}
                        disabled={loading || !profile}
                      >
                        Edit Profile
                      </button>
                      <button
                        className="secondary-btn"
                        onClick={onChangePassword}
                        disabled={loading}
                      >
                        Change Password
                      </button>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={handleDeleteClick}
                      disabled={loading}
                    >
                      Delete Account
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={handleDeleteCancel}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Account</h3>
              <button className="close-btn" onClick={handleDeleteCancel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div className="delete-modal-content">
              <p className="delete-warning">
                This action cannot be undone. Please enter your password to confirm account deletion.
              </p>
              
              {deleteError && <div className="delete-error">{deleteError}</div>}
              
              <div className="delete-password-field">
                <label>Enter your password:</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your current password"
                  onKeyDown={(e) => e.key === 'Enter' && handleDeleteConfirm()}
                />
              </div>
              
              <div className="delete-modal-actions">
                <button 
                  className="delete-confirm-btn" 
                  onClick={handleDeleteConfirm}
                  disabled={loading || !deletePassword.trim()}
                >
                  {loading ? "Deleting..." : "Delete Account"}
                </button>
                <button 
                  className="delete-cancel-btn" 
                  onClick={handleDeleteCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};