import React, { useRef, useState } from "react";
import api from "../../../api";
import "./CloudinaryUpload.css";

// Set your Cloudinary cloud name in .env as VITE_CLOUDINARY_CLOUD_NAME
// Create an unsigned upload preset named "tradenest_portfolio" in Cloudinary dashboard
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
const UPLOAD_PRESET = "tradenest_portfolio"; // unsigned preset

const CloudinaryUpload = ({ onUploadSuccess }) => {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        setError(null);

        try {
            // 1. Upload to Cloudinary (unsigned)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            const cloudRes = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: "POST", body: formData }
            );
            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) throw new Error(cloudData.error?.message || "Upload failed");

            const imageUrl = cloudData.secure_url;

            // 2. Save URL to our backend
            await api.post("/portfolio/add", { imageUrl }, { withCredentials: true });

            setUploading(false);
            onUploadSuccess?.(imageUrl);
        } catch (err) {
            setUploading(false);
            setError(err.message || "Upload failed");
            setPreview(null);
        }

        // clear input so same file can be re-selected if needed
        e.target.value = "";
    };

    return (
        <div className="cu-wrap">
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
            />

            <button
                className="cu-btn"
                onClick={() => fileRef.current.click()}
                disabled={uploading}
            >
                {uploading ? (
                    <><span className="cu-spinner" /> Uploading…</>
                ) : (
                    <>📸 Upload Work Photo</>
                )}
            </button>

            {preview && !uploading && (
                <img src={preview} alt="Uploaded" className="cu-preview" />
            )}
            {error && <p className="cu-error">{error}</p>}
        </div>
    );
};

export default CloudinaryUpload;
