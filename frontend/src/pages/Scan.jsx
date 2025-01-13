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
} from "@mui/material";
import { CameraAlt, FileUpload } from "@mui/icons-material";

const Scan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending request to analyze endpoint...");
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Received response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      // Navigate to results with the analysis data
      navigate("/results", { 
        state: { 
          analysis: data,
          imageUrl: previewImage // Pass the image preview as well
        } 
      });
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Scan Food Item
        </Typography>

        {previewImage && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUpload />}
            disabled={loading}
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
            onClick={() => {
              // Implement camera functionality
            }}
          >
            Take Photo
          </Button>
        </Box>

        {loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Scan;