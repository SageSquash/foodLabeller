// frontend/src/pages/Scan.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CameraAlt, FileUpload } from "@mui/icons-material";

const Scan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

// frontend/src/pages/Scan.jsx
const handleImageUpload = async (file) => {
  try {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    console.log("Starting image analysis...");
    
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw analysis response:", data);

    // Create a local URL for the preview image
    const imageUrl = URL.createObjectURL(file);

    // Pass the raw response data directly
    navigate("/results", { 
      state: { 
        analysis: data,  // Pass the entire response
        imageUrl: imageUrl,
        timestamp: new Date().toISOString()
      } 
    });
  } catch (err) {
    console.error("Analysis error:", err);
    setError(err.message || "Failed to analyze image");
  } finally {
    setLoading(false);
  }
};

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview immediately
      setPreviewImage(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Implementation for camera functionality
      // This is a placeholder for now
      console.log("Camera access granted:", stream);
      // You'll need to implement the actual camera UI and capture functionality
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied or not available");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Scan Food Item
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {previewImage && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        )}

        <Box sx={{ 
          mt: 2, 
          display: "flex", 
          gap: 2, 
          justifyContent: "center",
          flexWrap: "wrap" 
        }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUpload />}
            disabled={loading}
            sx={{ minWidth: '160px' }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>

          <Button
            variant="contained"
            startIcon={<CameraAlt />}
            disabled={loading}
            onClick={handleCameraClick}
            sx={{ minWidth: '160px' }}
          >
            Take Photo
          </Button>
        </Box>

        {loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Analyzing image...
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Scan;