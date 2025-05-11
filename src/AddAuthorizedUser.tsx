//AddAuthorizedUser.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './supabaseClient';

export default function AddAuthorizedUser() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Media library access is required. Please grant permissions in your device settings.',
      );
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
      const filePath = `authorized_faces/${filename}`; // Full path for the file
  
      const response = await fetch(resizedPhoto.uri);
      const blob = await response.blob();
  
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('authorized_faces')
        .upload(filename, blob);
  
      if (storageError) {
        console.error('Storage Upload Error:', storageError.message);
        throw new Error(storageError.message);
      }
  
      console.log('Storage upload successful:', storageData);
  
      // Construct the image URL manually
      const imageUrl = `${supabase.storage.from('authorized_faces').getPublicUrl(filename).data.publicUrl}`;
  
      if (!imageUrl) {
        throw new Error('Failed to construct the image URL.');
      }
  
      // Insert into Supabase Database
      const { data: insertData, error: insertError } = await supabase
        .from('authorized_users')
        .insert([{ name: name.trim(), image_url: filePath }]); // Save full file path in the DB
  
      if (insertError) {
        console.error('Database Insert Error:', insertError.message);
        throw new Error(insertError.message);
      }
  
      console.log('Database insert successful:', insertData);
  
      // Success pop-up message
      Alert.alert(
        'User Added',
        `The user "${name.trim()}" has been successfully added.`,
        [
          {
            text: 'OK',
            onPress: reset, // Reset the form when the user acknowledges
          },
        ]
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Error', errorMessage);
    } finally {
      setUploading(false);
    }
  };  

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
          <View style={styles.button}>
            <Button title="Submit" onPress={handleSubmit} disabled={uploading} />
          </View>
          {uploading && <ActivityIndicator size="large" color="#0000ff" />}
          <View style={styles.button}>
            <Button title="Choose another photo" onPress={reset} />
          </View>
        </>
      ) : (
        <View style={styles.button}>
          <Button title="Select a Photo" onPress={pickImage} />
        </View>
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
  button: {
    width: '80%',
    marginVertical: 8,
  },
});
