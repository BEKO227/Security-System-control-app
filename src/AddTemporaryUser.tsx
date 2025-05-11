//AddTemporaryUser.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './supabaseClient';

export default function AddTemporaryUser() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [time, setTime] = useState<number>(30); // Default time in minutes
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library access is required.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets) {
        const selectedAsset = result.assets[0];
        setPhoto(selectedAsset);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      Alert.alert('ImagePicker Error', errorMessage);
    }
  };

  const reset = () => {
    setPhoto(null);
    setName('');
    setTime(30); // Reset time to default
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !photo) {
      Alert.alert('Invalid Input', 'Please provide a valid name and select a photo.');
      return;
    }

    setUploading(true);

    try {
      if (!photo.uri) {
        throw new Error('Photo URI is undefined.');
      }

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const filename = `${name.trim()}_${Date.now()}.jpg`;
      const filePath = `temporary_faces/${filename}`;

      const response = await fetch(resizedPhoto.uri);
      const blob = await response.blob();

      // Upload photo to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('temporary_faces')
        .upload(filename, blob);

      if (storageError) {
        console.error('Storage Upload Error:', storageError.message);
        throw new Error(storageError.message);
      }

      // Generate image URL
      const imageUrl = `${supabase.storage.from('temporary_faces').getPublicUrl(filename).data.publicUrl}`;

      if (!imageUrl) {
        throw new Error('Failed to construct the image URL.');
      }

      // Insert user into database with expiration time
      const expirationTime = new Date().getTime() + time * 60000; // Set expiration time

      const { data: insertData, error: insertError } = await supabase
        .from('temporary_users')
        .insert([{ name: name.trim(), image_url: filePath, expiration_time: expirationTime }]);

      if (insertError) {
        console.error('Database Insert Error:', insertError.message);
        throw new Error(insertError.message);
      }

      // Success pop-up message
      Alert.alert('User Added', `The temporary user "${name.trim()}" has been added for ${time} minutes.`, [
        {
          text: 'OK',
          onPress: reset,
        },
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Polling to remove expired users
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentTime = new Date().getTime();

      // Check for expired users
      const { data, error } = await supabase
        .from('temporary_users')
        .select('*')
        .lt('expiration_time', currentTime); // Users with expiration time less than current time

      if (data && data.length > 0) {
        // Remove expired users
        const userIds = data.map((user) => user.id);
        const { error: deleteError } = await supabase
          .from('temporary_users')
          .delete()
          .in('id', userIds);

        if (deleteError) {
          console.error('Error removing expired users:', deleteError.message);
        } else {
          console.log('Expired users removed.');
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.container}>
      {photo ? (
        <>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Set time in minutes"
            value={String(time)}
            onChangeText={(value) => setTime(Number(value))}
            keyboardType="numeric"
          />
          <Button title="Submit" onPress={handleSubmit} disabled={uploading} />
          <Button title="Cancel" onPress={reset} color="red" />
          {uploading && <Text>Uploading...</Text>}
        </>
      ) : (
        <Button title="Select a Photo" onPress={pickImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  preview: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});
