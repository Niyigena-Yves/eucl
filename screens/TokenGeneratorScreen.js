import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const TokenGeneratorScreen = () => {
  const [amount, setAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generateToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          meterNumber,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Token Generated', `Token: ${data.token}\nValidity Days: ${data.tokenValidityDays}`);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error generating token:', error);
      Alert.alert('Error', 'An error occurred while generating the token');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Meter Number"
        value={meterNumber}
        onChangeText={setMeterNumber}
        keyboardType="numeric"
      />
      <Button title="Generate Token" onPress={handleSubmit} />
    </View>
  );
};

export default TokenGeneratorScreen;
