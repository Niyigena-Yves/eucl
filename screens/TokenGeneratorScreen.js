import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const TokenGeneratorScreen = () => {
  const [amount, setAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/generateToken', {
        amount,
        meterNumber,
      });

      const data = response.data;
      if (response.status === 200) {
        Alert.alert(
          'Token Generated',
          `Token: ${data.token}\nValidity Days: ${data.tokenValidityDays}`
        );
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
