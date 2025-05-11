//lockUnlockComponent.tsx
import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Alert, Text } from "react-native";
import axios from "axios";
import { supabase } from './supabaseClient';

const RASPBERRY_PI_API = "http://192.168.137.152:5000"; 

const LedControlComponent = () => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const fetchLedState = async () => {
      try {
        const { data, error } = await supabase
          .from('led_state')
          .select('status')
          .single();

        if (error) throw error;

        setIsOn(data.status === "on");
      } catch (error) {
        console.error("Error fetching LED status:", error);
      }
    };
    fetchLedState();
  }, []);

  const handleTurnOn = async () => {
    try {
      await axios.post(`${RASPBERRY_PI_API}/on`);
      setIsOn(true);
      await supabase.from('led_state').upsert({ status: 'on' }).single();
    } catch (error) {
      Alert.alert("Error", "Failed to turn on the LED.");
    }
  };

  const handleTurnOff = async () => {
    try {
      await axios.post(`${RASPBERRY_PI_API}/off`);
      setIsOn(false);
      await supabase.from('led_state').upsert({ status: 'off' }).single();
    } catch (error) {
      Alert.alert("Error", "Failed to turn off the LED.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerWrapper}>
        <View style={styles.dflContainer}>
          <Button title="Unlock" onPress={handleTurnOn} color="#4CAF50" />
          <Button title="Lock" onPress={handleTurnOff} color="#D32F2F" />
        </View>
      </View>
      <View style={styles.containerWrapper}>
        <Text style={styles.title}>Device Free Localization</Text>
        <View style={styles.dflContainer}>
          <View style={styles.containerDFL}>
            <Button title="DFL Start" onPress={handleTurnOn} color="#673AB7" />
            <Button title="DFL Stop" onPress={handleTurnOff} color="#E91E63" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerWrapper: {
    marginVertical: 10,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 40,
  },
  dflContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  containerDFL: {
    flexDirection: "row",
    justifyContent: "space-between",
  }
});

export default LedControlComponent;
