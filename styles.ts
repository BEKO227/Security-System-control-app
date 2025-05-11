import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  darkModeContainer: {
    backgroundColor: '#1e1e1e', // Dark mode background color
  },
  lightModeContainer: {
    backgroundColor: '#f9f9f9', // Light mode background color
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15, // Increase padding
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 15, // Adjust this value to move it down
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10, // Optional margin to separate from the text
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333', // Text color
    flex: 1, // Ensures the name takes available space
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6, // Simulate shadow effect in React Native
    elevation: 4, // Shadow for Android
  },
  darkModeSection: {
    backgroundColor: '#2c2c2c', // Dark mode card background
  },
  lightModeSection: {
    backgroundColor: '#fff', // Light mode card background
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  darkModeText: {
    color: '#f5f5f5', // Light text color in dark mode
  },
  lightModeText: {
    color: '#333', // Dark text color in light mode
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  darkModeInput: {
    backgroundColor: '#2c2c2c',
    color: '#f5f5f5',
  },
  lightModeInput: {
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  lightModeButton: {
    backgroundColor: '#007bff', // Button color for light mode
    color: '#fff',
  },
  darkModeButton: {
    backgroundColor: '#0056b3', // Button color for dark mode
    color: '#fff',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#999',
  },
  errorInput: {
    borderColor: 'red',
    backgroundColor: '#ffe6e6', // Light red background for error
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 8,
  },
  logoutButtonContainer: {
    marginTop: 20, // Add some space above the button
    marginBottom: 20, // Add some space below the button
    paddingHorizontal: 16, // Optional: for alignment
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loginImage: {
    width: '100%', // or set a specific width and height
    height: 200, // You can adjust the height as per your design
    marginBottom: 20, // Space between the image and the form
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default styles;
