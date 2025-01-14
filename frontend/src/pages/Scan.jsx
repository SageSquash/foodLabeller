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
import Camera from "../components/Camera/Camera";
import { useApi } from "../hooks/useApi";

const Scan = () => {
  const navigate = useNavigate();
  const { analyzeImage, loading, error: apiError } = useApi();
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageUpload = async (file) => {
    try {
      setError(null);

      // Use the analyzeImage function from useApi
      const data = await analyzeImage(file);
      console.log("Raw analysis response:", data);

      // Create a local URL for the preview image
      const imageUrl = URL.createObjectURL(file);

      navigate("/results", { 
        state: { 
          analysis: data,
          imageUrl: imageUrl,
          timestamp: new Date().toISOString()
        } 
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze image");
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

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleCameraCapture = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    handleImageUpload(file);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    setError(null); // Clear any previous errors when closing camera
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        sx={{ 
          p: 3, 
          mt: 3, 
          textAlign: "center",
          borderRadius: 2,
          boxShadow: (theme) => theme.shadows[3]
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 500,
            color: (theme) => theme.palette.primary.main 
          }}
        >
          Scan Food Item
        </Typography>

        {(error || apiError) && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: 1
            }}
            onClose={() => setError(null)}
          >
            {error || apiError?.message}
          </Alert>
        )}

        {previewImage && (
          <Box 
            sx={{ 
              mt: 2, 
              mb: 2,
              position: 'relative'
            }}
          >
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

        <Box 
          sx={{ 
            mt: 2, 
            display: "flex", 
            gap: 2, 
            justifyContent: "center",
            flexWrap: "wrap" 
          }}
        >
          <Button
            variant="contained"
            component="label"
            startIcon={<FileUpload />}
            disabled={loading}
            sx={{ 
              minWidth: '160px',
              bgcolor: (theme) => theme.palette.primary.main,
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.dark,
              }
            }}
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
            sx={{ 
              minWidth: '160px',
              bgcolor: (theme) => theme.palette.secondary.main,
              '&:hover': {
                bgcolor: (theme) => theme.palette.secondary.dark,
              }
            }}
          >
            Take Photo
          </Button>
        </Box>

        {loading && (
          <Box 
            sx={{ 
              mt: 2, 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: 2,
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: 1
            }}
          >
            <CircularProgress 
              size={24} 
              color="secondary"
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Analyzing image...
            </Typography>
          </Box>
        )}

        <Camera
          open={isCameraOpen}
          onClose={handleCameraClose}
          onCapture={handleCameraCapture}
        />
      </Paper>
    </Container>
  );
};

export default Scan;