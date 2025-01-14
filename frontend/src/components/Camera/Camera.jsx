// frontend/src/components/Camera/Camera.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Modal, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera, Cameraswitch, Close } from '@mui/icons-material';

const Camera = ({ open, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        onClose();
      }, 'image/jpeg', 0.8);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="camera-capture-modal"
    >
      <CameraContainer>
        <CameraHeader>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
          <IconButton onClick={switchCamera} sx={{ color: 'white' }}>
            <Cameraswitch />
          </IconButton>
        </CameraHeader>

        <VideoPreview
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <CameraControls>
          <CaptureButton onClick={captureImage}>
            <PhotoCamera />
          </CaptureButton>
        </CameraControls>
      </CameraContainer>
    </Modal>
  );
};

// Styled components
const CameraContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'black',
  display: 'flex',
  flexDirection: 'column',
});

const CameraHeader = styled(Box)({
  padding: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
});

const VideoPreview = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const CameraControls = styled(Box)({
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
});

const CaptureButton = styled(Button)({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

export default Camera;