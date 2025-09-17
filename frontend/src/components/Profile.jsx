import { useState, useEffect, useContext } from "react";
import { getProfile } from "../service/userService";
import { AuthContext } from "../context/authContext";
import "../style/Profile.css";

export const Profile = ({ onClose, onEdit, onChangePassword }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const { loading, setLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await getProfile();
                setProfile(response.data || response);
            } catch (err) {
                setError("Failed to fetch profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div className="profile-container" onClick={(e) => e.stopPropagation()}>
                <div className="profile-header">
                    <h2 className="profile-title">Your Profile</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="profile-content">
                    {loading ? (
                        <div className="loading">Loading profile...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : ( 
                    <div>
                        <div className="profile-card">
                            <div className="profile-field">
                                <span className="label">Name:</span>
                                <span className="value">{profile?.name}</span>
                            </div>
                            <div className="profile-field">
                                <span className="label">Email:</span>
                                <span className="value">{profile?.email}</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="primary-btn" onClick={onEdit}>Edit Profile</button>
                            <button className="secondary-btn" onClick={onChangePassword}>Change Password</button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};
