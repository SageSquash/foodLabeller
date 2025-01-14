// frontend/src/components/Results/AnalysisResults.jsx
import React from 'react';
import { Box, Card, Typography, Grid, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const AnalysisResults = ({ data }) => {
  console.log('Raw analysis data:', data);

  if (!data) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">
          No analysis data available
        </Typography>
      </Box>
    );
  }

  // Determine if it's a packaged product or raw food
  const isPackagedProduct = Boolean(data.product_info);
  const rawFoodInfo = data.nutritional_info?.[0] || {};

  return (
    <Box sx={{ mt: 3 }}>
      {isPackagedProduct ? (
        // Packaged Product Display
        <>
          {/* Product Information */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Information
            </Typography>
            <Typography variant="body1">
              {data.product_info.product_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Brand: {data.product_info.brand}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Package Size: {data.product_info.package_size}
            </Typography>
          </Card>

          {/* Nutrition Facts */}
          {data.nutrition_facts && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Nutrition Facts
              </Typography>
              
              {/* Serving Size */}
              <Typography variant="body2" gutterBottom>
                Serving Size: {data.nutrition_facts.serving_size.amount} {data.nutrition_facts.serving_size.unit}
                {data.nutrition_facts.serving_size.servings_per_container && 
                  ` (${data.nutrition_facts.serving_size.servings_per_container} servings per container)`}
              </Typography>

              <Grid container spacing={2}>
                {/* Calories */}
                <Grid item xs={6} sm={4}>
                  <MacroItem>
                    <Typography variant="body2">CALORIES</Typography>
                    <MacroValue>{data.nutrition_facts.calories}</MacroValue>
                  </MacroItem>
                </Grid>

                {/* Macronutrients */}
                {Object.entries(data.nutrition_facts.macronutrients).map(([key, value]) => (
                  <Grid item xs={6} sm={4} key={key}>
                    <MacroItem>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      <MacroValue>
                        {value.amount}{value.unit}
                      </MacroValue>
                      {value.daily_value && (
                        <Typography variant="caption" color="text.secondary">
                          {value.daily_value} DV
                        </Typography>
                      )}
                    </MacroItem>
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}

          {/* Vitamins and Minerals */}
          {data.nutrition_facts?.vitamins_minerals && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Vitamins & Minerals
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(data.nutrition_facts.vitamins_minerals).map(([key, value]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <MacroItem>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      <MacroValue>
                        {value.amount}{value.unit}
                      </MacroValue>
                      {value.daily_value && (
                        <Typography variant="caption" color="text.secondary">
                          {value.daily_value} DV
                        </Typography>
                      )}
                    </MacroItem>
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}

          {/* Ingredients */}
          {data.ingredients && data.ingredients.length > 0 && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Typography variant="body2">
                {data.ingredients.join(', ')}
              </Typography>
            </Card>
          )}

          {/* Allergens */}
          {data.allergens && data.allergens.length > 0 && (
            <Card sx={{ mb: 2, p: 2, bgcolor: '#fff3e0' }}>
              <Typography variant="h6" gutterBottom color="warning.main">
                Allergens
              </Typography>
              <Typography variant="body2" color="error">
                Contains: {data.allergens.join(', ')}
              </Typography>
            </Card>
          )}

          {/* Dietary Information */}
          {data.dietary_info && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dietary Information
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(data.dietary_info).map(([key, value]) => (
                  <Grid item xs={12} sm={4} key={key}>
                    <Typography variant="body2">
                      {key.replace(/_/g, ' ').replace('is', '').trim()}: {value ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          )}

          {/* Storage Instructions */}
          {data.storage_instructions && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Storage Instructions
              </Typography>
              <Typography variant="body2">
                {data.storage_instructions}
              </Typography>
            </Card>
          )}
        </>
      ) : (
        // Raw Food Display
        <>
          {/* Food Identification */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Food Information
            </Typography>
            <Typography variant="body1">
              {data.food_identification?.items?.join(', ') || rawFoodInfo.food_name}
            </Typography>
          </Card>

          {/* Nutritional Information */}
          <Card sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nutrition Facts
            </Typography>
            {rawFoodInfo.serving_size && (
              <Typography variant="body2" gutterBottom>
                Serving Size: {rawFoodInfo.serving_size}
              </Typography>
            )}

            <Grid container spacing={2}>
              {/* Calories */}
              {rawFoodInfo.nutrition_facts?.calories && (
                <Grid item xs={6} sm={4}>
                  <MacroItem>
                    <Typography variant="body2">CALORIES</Typography>
                    <MacroValue>
                      {rawFoodInfo.nutrition_facts.calories}
                    </MacroValue>
                  </MacroItem>
                </Grid>
              )}

              {/* Macronutrients */}
              {rawFoodInfo.nutrition_facts?.macronutrients && 
                Object.entries(rawFoodInfo.nutrition_facts.macronutrients).map(([key, value]) => (
                  <Grid item xs={6} sm={4} key={key}>
                    <MacroItem>
                      <Typography variant="body2">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      <MacroValue>{value}</MacroValue>
                    </MacroItem>
                  </Grid>
                ))}
            </Grid>
          </Card>

          {/* Health Benefits */}
          {rawFoodInfo.health_benefits?.length > 0 && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Health Benefits
              </Typography>
              <List>
                {rawFoodInfo.health_benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2">• {benefit}</Typography>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {/* Combination Suggestions */}
          {data.combination_suggestions?.length > 0 && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Serving Suggestions
              </Typography>
              <List>
                {data.combination_suggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2">• {suggestion}</Typography>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}

          {/* Seasonal Information */}
          {data.seasonal_info && Object.keys(data.seasonal_info).length > 0 && (
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Seasonal Information
              </Typography>
              {data.seasonal_info.season && (
                <Typography variant="body2" gutterBottom>
                  Season: {data.seasonal_info.season}
                </Typography>
              )}
              {data.seasonal_info.availability && (
                <Typography variant="body2">
                  {data.seasonal_info.availability}
                </Typography>
              )}
            </Card>
          )}

          {/* Storage Tips */}
          {rawFoodInfo.storage_tips?.length > 0 && (
            <Card sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Storage Tips
              </Typography>
              <List>
                {rawFoodInfo.storage_tips.map((tip, index) => (
                  <ListItem key={index}>
                    <Typography variant="body2">• {tip}</Typography>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

// Styled components
const MacroItem = styled(Box)(({ theme }) => ({
  background: '#f8f9fa',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const MacroValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.2em',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  marginTop: theme.spacing(1),
}));

export default AnalysisResults;