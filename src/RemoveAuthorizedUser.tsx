//RemoveAuthorizedUser.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from './supabaseClient';

const RemoveAuthorizedUser: React.FC = () => {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch the list of authorized users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('authorized_users').select('id, name');

      if (error) {
        console.error('Error fetching users:', error.message);
        Alert.alert('Error', 'Failed to fetch users. Please try again later.');
        return;
      }

      if (data) {
        setUsers(data);
      }
    } catch (error: unknown) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user removal
  const handleRemoveUser = async () => {
    if (!selectedUser) {
      Alert.alert('Invalid Selection', 'Please select a user to remove.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('authorized_users').delete().eq('id', selectedUser);

      if (error) {
        console.error('Error removing user:', error.message);
        Alert.alert('Error', 'Failed to remove the user. Please try again.');
        return;
      }

      Alert.alert('Success', 'User has been removed successfully.');
      fetchUsers(); // Refresh user list after removal
      setSelectedUser(''); // Reset selection
    } catch (error: unknown) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remove Authorized User</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && users.length > 0 ? (
        <>
          <Picker
            selectedValue={selectedUser}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedUser(itemValue)}
          >
            <Picker.Item label="Select a user" value="" />
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.name} value={String(user.id)} /> 
            ))}
          </Picker>

          <View style={styles.button}>
            <Button title="Remove User" onPress={handleRemoveUser} disabled={!selectedUser} color="#d9534f" />
          </View>
        </>
      ) : (
        <Text style={styles.noUsersText}>No authorized users available.</Text>
      )}
    </View>
  );
};

// ✅ **Only ONE default export**
export default RemoveAuthorizedUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 16,
  },
  button: {
    width: '80%',
    marginVertical: 8,
  },
  noUsersText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
