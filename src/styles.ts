import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  darkModeContainer: {
    backgroundColor: '#333',
  },
  lightModeContainer: {
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  errorInput: {
    borderColor: '#ff0000', // Highlight error with red border
  },
  errorText: {
    color: '#ff0000', // Red text for error messages
    marginBottom: 8,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
  },
  darkModeSection: {
    backgroundColor: '#444',
  },
  lightModeSection: {
    backgroundColor: '#f9f9f9',
  },
  darkModeText: {
    color: '#fff',
  },
  lightModeText: {
    color: '#000',
  },
  // New styles for video and buttons
  video: {
    width: '100%',
    height: 400,
    backgroundColor: 'black', // Add necessary styles for the video element
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40, // Increased marginTop to move buttons down
  },
  button: {
    width: '40%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default styles;
