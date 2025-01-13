import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, CameraAlt, History } from '@mui/icons-material';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0 
      }} 
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="Scan"
          value="/scan"
          icon={<CameraAlt />}
        />
        <BottomNavigationAction
          label="History"
          value="/history"
          icon={<History />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;