// frontend/src/pages/Results.jsx
import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AnalysisResults from "../components/Results/AnalysisResults";

// frontend/src/pages/Results.jsx
const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('Full location state:', location.state);
  console.log('Analysis data:', location.state?.analysis);

  const handleScanAgain = () => {
    navigate('/scan');
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analysis Results
        </Typography>

        {location.state?.imageUrl && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={location.state.imageUrl}
              alt="Analyzed food"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                borderRadius: '8px',
              }}
            />
          </Box>
        )}

        <AnalysisResults data={location.state?.analysis} />

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleScanAgain}
            sx={{ minWidth: 200 }}
          >
            SCAN ANOTHER ITEM
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Results;