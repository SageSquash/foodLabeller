import { Button, Typography, Box } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        pt: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Food Analyzer
      </Typography>
      
      <Typography variant="body1" textAlign="center" color="text.secondary">
        Scan food items to get detailed nutritional information
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<CameraAlt />}
        onClick={() => navigate('/scan')}
        sx={{ mt: 2 }}
      >
        Start Scanning
      </Button>
    </Box>
  );
};

export default Home;