//CameraComponent.tsx
import React, { useRef, useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native'; // Import React Native's Button and ActivityIndicator
import styles from './styles'; // Import the shared styles

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loading, setLoading] = useState(false); // For managing loading state

  const startCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on component unmount
  }, []);

  return (
    <View style={styles.container}>
      <video ref={videoRef} style={styles.video} autoPlay playsInline muted></video>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Start Camera"
            onPress={startCamera}
            disabled={isCameraOn || loading}
            color="#007bff" // Light blue color for the start button
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Stop Camera"
            onPress={stopCamera}
            disabled={!isCameraOn || loading}
            color="#ff4d4d" // Red color for the stop button
          />
        </View>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default CameraComponent;
