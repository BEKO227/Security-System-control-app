//HeaderComponent.tsx
import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation types for your app's stack
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'MainApp'>;

interface HeaderProps {
  userName: string;
  avatarUrl: string;
}

const HeaderComponent: React.FC<HeaderProps> = ({ userName, avatarUrl }) => {
  const navigation = useNavigation<NavigationProps>(); // Explicitly type the navigation prop

  const handleLogout = () => {
    navigation.replace('Login'); // Navigate to Login screen
  };

  return (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} color="#007bff" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
