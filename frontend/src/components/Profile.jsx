import { useState, useEffect, useContext } from "react";
import { getProfile, editprofile } from "../service/userService";
import { AuthContext } from "../context/authContext";
import "../style/Profile.css";

export const Profile = ({ onClose, onChangePassword }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { loading, setLoading } = useContext(AuthContext);

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
      const updatedProfile = updated?.data?.user ?? updated?.data ?? updated;

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
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
