// frontend/src/pages/Results.jsx
import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AnalysisResults from "../components/Results/AnalysisResults";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Log the location state to debug
  console.log('Location State:', location.state);

  const handleScanAgain = () => {
    navigate('/scan');
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analysis Results
        </Typography>

        {/* Display the analysis results */}
        <AnalysisResults data={location.state?.analysis} />

        {/* Scan Again Button */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleScanAgain}
            sx={{ minWidth: 200 }}
          >
            Scan Another Item
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Results;