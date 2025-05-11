// NLPQuery.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Image,ActivityIndicator } from 'react-native';

// Define your Supabase URL
const SUPABASE_URL = 'https://qbgypzbzjedeiqnqmslp.supabase.co';

const NLPQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [authorizedResponse, setAuthorizedResponse] = useState<any[]>([]);
  const [nonAuthorizedResponse, setNonAuthorizedResponse] = useState<any[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a query');
      return;
    }

    try {
      const nlpResponse = await processQuery(query);
      setAuthorizedResponse(nlpResponse.authorized);
      setNonAuthorizedResponse(nlpResponse.nonAuthorized);
    } catch (error) {
      console.error('Error processing query:', error);
      Alert.alert('Error', 'Failed to process the query');
    } 
  };

  const processQuery = async (query: string): Promise<{ authorized: any[]; nonAuthorized: any[] }> => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/query?query=${encodeURIComponent(query)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (responseData.status === 'success') {
        return separateResponse(responseData.data);
      } else {
        return { authorized: [], nonAuthorized: [{ message: responseData.message }] };
      }
    } catch (error: unknown) {
      console.error('Error processing query:', error);
      if (error instanceof Error) {
        return { authorized: [], nonAuthorized: [{ message: `Error: "${error.message}"` }] };
      } else {
        return { authorized: [], nonAuthorized: [{ message: 'An unknown error occurred.' }] };
      }
    }
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    // If the URL is already a full URL, return it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Construct the full Supabase URL
    return `${SUPABASE_URL}/storage/v1/object/public/authorized_faces/${imageUrl}`;
  };

  const separateResponse = (data: any) => {
    const authorized: any[] = [];
    const nonAuthorized: any[] = [];

    if (data && data.length > 0) {
      data.forEach((entry: any) => {
        const formattedEntry = {
          name: entry.name,
          timestamp: formatDate(entry.timestamp),
          authorized: entry.authorized,
          imageUrl: getImageUrl(entry.image_url), // Use image_url from the database
        };

        if (entry.authorized) {
          authorized.push(formattedEntry);
        } else {
          nonAuthorized.push(formattedEntry);
        }
      });
    }

    return { authorized, nonAuthorized };
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const renderImage = (imageUrl: string | null, index: string) => {
    const defaultAvatarPath = require('./default-avatar.jpg'); // Adjust the path if needed
    
    return (
      <View>
        <Image
          source={imageUrl ? { uri: imageUrl } : defaultAvatarPath}
          style={styles.image}
          onLoadStart={() => setImageLoadingStates(prev => ({ ...prev, [index]: true }))}
          onLoadEnd={() => setImageLoadingStates(prev => ({ ...prev, [index]: false }))}
          onError={(error) => {
            console.log('Image loading error:', error);
            setImageLoadingStates(prev => ({ ...prev, [index]: false }));
          }}
        />
        {imageLoadingStates[index] && (
          <ActivityIndicator
            style={[StyleSheet.absoluteFill, styles.loader]}
            color="#000000"
          />
        )}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ask a question"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Submit Query" onPress={handleQuerySubmit} />

      {authorizedResponse.length > 0 && (
        <View style={[styles.responseContainer, styles.authorizedContainer]}>
          <Text style={styles.responseTitle}>Authorized</Text>
          {authorizedResponse.map((item, index) => (
            <View key={index} style={styles.responseItemContainer}>
              {renderImage(item.imageUrl, `auth_${index}`)}
              <Text style={styles.responseItem}>{`${item.name} | ${item.timestamp}`}</Text>
            </View>
          ))}
        </View>
      )}

      {nonAuthorizedResponse.length > 0 && (
        <View style={[styles.responseContainer, styles.nonAuthorizedContainer]}>
          <Text style={styles.responseTitle}>Not Authorized</Text>
          {nonAuthorizedResponse.map((item, index) => (
            <View key={index} style={styles.responseItemContainer}>
              {renderImage(item.imageUrl, `nonauth_${index}`)}
              <Text style={styles.responseItem}>{`${item.name} | ${item.timestamp}`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  responseContainer: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  authorizedContainer: {
    borderColor: 'green',
    backgroundColor: '#e9f7e4',
  },
  nonAuthorizedContainer: {
    borderColor: 'red',
    backgroundColor: '#f8d7da',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  responseItemContainer: {
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  responseItem: {
    fontSize: 14,
    textAlign: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
    overflow: 'hidden',
  },
  loader: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default NLPQuery;