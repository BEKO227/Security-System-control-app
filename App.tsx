//App.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, Button, ScrollView, Modal, Image, StyleSheet, Alert, Switch } from 'react-native';
import AddAuthorizedUser from './src/AddAuthorizedUser';
import CameraComponent from './src/CameraComponent';
import RemoveAuthorizedUser from './src/RemoveAuthorizedUser';
import NLPQuery from './src/NlpQueryComponent';
import AddTemporaryUser from './src/AddTemporaryUser';
import styles from './styles'; // Import the styles
import LockUnlockButtonComponent from './src/LockUnlockButtonComponent';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HeaderComponent({ userName, avatarUrl, onLogout, darkMode, setDarkMode }: { 
  userName: string; 
  avatarUrl: string; 
  onLogout: () => void; 
  darkMode: boolean; 
  setDarkMode: (value: boolean) => void; 
}) {
  return (
    <View style={styles.headerBar}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.userName}>{userName}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => setDarkMode(value)} // Toggle dark mode
        />
      </View>
      <Button title="Logout" onPress={onLogout} color="#d9534f" />
    </View>
  );
}

function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email and password cannot be empty.');
      return;
    }
  
    const correctEmail = 'admin@example.com';
    const correctPassword = 'password';
  
    if (email !== correctEmail) {
      setError('Invalid email. Please try again.');
      return;
    }
  
    if (password !== correctPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }
  
    // Clear error and navigate to the main app
    setError('');
    navigation.replace('MainApp');
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        style={[styles.input, error && !email ? styles.errorInput : null]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, error && !password ? styles.errorInput : null]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} color="#007bff" />
    </View>
  );
}

function HomeScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, darkMode ? styles.darkModeContainer : styles.lightModeContainer]}
    >
      <View style={[styles.section, darkMode ? styles.darkModeSection : styles.lightModeSection]}>
        <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
          Add Authorized User
        </Text>
        <AddAuthorizedUser />
      </View>

      <View style={[styles.section, darkMode ? styles.darkModeSection : styles.lightModeSection]}>
        <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
          Add Temporary User
        </Text>
        <AddTemporaryUser />
      </View>

      <View style={[styles.section, darkMode ? styles.darkModeSection : styles.lightModeSection]}>
        <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
          Remove Authorized User
        </Text>
        <RemoveAuthorizedUser />
      </View>

      <View style={styles.footer}>
        <Text style={darkMode ? styles.darkModeText : styles.lightModeText}>
          &copy; {new Date().getFullYear()} Surveillance System with Indoor Device-Free Localization. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

function QueryScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, darkMode ? styles.darkModeContainer : styles.lightModeContainer]}
    >
      <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
        Ask your Question about history
      </Text>
      <NLPQuery />
    </ScrollView>
  );
}

function LiveCameraFeedScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, darkMode ? styles.darkModeContainer : styles.lightModeContainer]}
    >
      <View style={[styles.section, darkMode ? styles.darkModeSection : styles.lightModeSection]}>
        <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
          Live Camera Feed
        </Text>
        <CameraComponent />
      </View>
    </ScrollView>
  );
}

function ActionScreen({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, darkMode ? styles.darkModeContainer : styles.lightModeContainer]}
    >
      <View style={[styles.section, darkMode ? styles.darkModeSection : styles.lightModeSection]}>
        <Text style={[darkMode ? styles.darkModeText : styles.lightModeText, { fontWeight: 'bold' }]}>
          Make a lock down for Home
        </Text>
        <LockUnlockButtonComponent />
      </View>
    </ScrollView>
  );
}

function MainApp({ navigation }: { navigation: any }) {
  const userName = 'Youssef Hashish'; // Replace with dynamic user data
  const avatarUrl = 'https://i.ibb.co/Kv6c6Q2/Youssef-avatar.jpg'; // Replace with actual avatar URL

  const [darkMode, setDarkMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    setIsModalVisible(true); // Show the modal when the user clicks Logout
  };

  return (
    <>
      <HeaderComponent 
        userName={userName} 
        avatarUrl={avatarUrl} 
        onLogout={handleLogout} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
      />
      
      {/* Modal for logout confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} // Close the modal if the user presses back button
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)} // Close the modal if the user clicks Cancel
              />
              <Button
                title="Log Out"
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.replace('Login'); // Navigate to Login screen
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab Navigator */}
      <Tab.Navigator>
        <Tab.Screen name="Users Manager">
          {() => <HomeScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
        </Tab.Screen>
        <Tab.Screen name="Query">
          {() => <QueryScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
        </Tab.Screen>
        <Tab.Screen name="Live Camera Feed">
          {() => <LiveCameraFeedScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
        </Tab.Screen>
        <Tab.Screen name="Action Tab">
          {() => <ActionScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp">
          {({ navigation }) => <MainApp navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
