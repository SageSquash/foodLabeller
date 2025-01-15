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
  Fade,
} from "@mui/material";
import { CameraAlt, FileUpload } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Camera from "../components/Camera/Camera";
import { useApi } from "../hooks/useApi";
import { styled } from "@mui/material/styles";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  textAlign: "center",
  borderRadius: 16,
  background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const ImagePreview = styled(motion.img)({
  maxWidth: "100%",
  maxHeight: "300px",
  objectFit: "contain",
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
});

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: '160px',
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
  },
}));

const Scan = () => {
  const navigate = useNavigate();
  const { analyzeImage, loading, error: apiError } = useApi();
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleImageUpload = async (file) => {
    try {
      setError(null);
      const data = await analyzeImage(file);
      console.log("Raw analysis response:", data);
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
      setPreviewImage(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleCameraClick = () => setIsCameraOpen(true);
  
  const handleCameraCapture = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    handleImageUpload(file);
  };

  const handleCameraClose = () => {
    setIsCameraOpen(false);
    setError(null);
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                mb: 3
              }}
            >
              Scan Food Item
            </Typography>
          </motion.div>

          <AnimatePresence>
            {(error || apiError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onClose={() => setError(null)}
                >
                  {error || apiError?.message}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {previewImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Box sx={{ mt: 3, mb: 4 }}>
                  <ImagePreview
                    src={previewImage}
                    alt="Preview"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                gap: 3, 
                justifyContent: "center",
                flexWrap: "wrap",
                mt: 3 
              }}
            >
              <ActionButton
                variant="contained"
                component="label"
                startIcon={<FileUpload />}
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
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
              </ActionButton>

              <ActionButton
                variant="contained"
                startIcon={<CameraAlt />}
                disabled={loading}
                onClick={handleCameraClick}
                sx={{ 
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  }
                }}
              >
                Take Photo
              </ActionButton>
            </Box>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Box 
                  sx={{ 
                    mt: 4,
                    p: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 3,
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    gap: 2
                  }}
                >
                  <CircularProgress 
                    size={24} 
                    color="secondary"
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      color: 'text.secondary',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Analyzing image...
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </StyledPaper>
      </motion.div>

      <Camera
        open={isCameraOpen}
        onClose={handleCameraClose}
        onCapture={handleCameraCapture}
      />
    </Container>
  );
};

export default Scan;