// frontend/src/components/Results/AnalysisResults.jsx
import React from 'react';
import { Box, Card, Typography, Grid, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const MacroItem = styled(Box)(({ theme }) => ({
  background: '#f8f9fa',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
}));

const MacroValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.2em',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const AnalysisResults = ({ data }) => {
  // Add console.log to debug the incoming data
  console.log('Analysis Results Data:', data);

  // If no data is provided, show a message
  if (!data) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          No analysis data available
        </Typography>
      </Box>
    );
  }

  // Sample static data for testing
  const sampleData = {
    calories: "200",
    protein: "10g",
    carbs: "25g",
    fat: "8g",
    fiber: "3g",
    sugars: "5g"
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Basic Nutritional Information */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Basic Nutrition Facts
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(sampleData).map(([key, value]) => (
            <Grid item xs={6} sm={4} key={key}>
              <MacroItem>
                <Typography variant="body2">
                  {key.toUpperCase()}
                </Typography>
                <MacroValue>
                  {value}
                </MacroValue>
              </MacroItem>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Health Score */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Health Score
        </Typography>
        <Typography variant="h4" align="center" sx={{ color: 'success.main' }}>
          🏆 7/10
        </Typography>
      </Card>

      {/* Recommendations */}
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recommendations
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body2">
              Good source of protein
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body2">
              Moderate in calories
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body2">
              Consider adding more fiber to your meal
            </Typography>
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default AnalysisResults;