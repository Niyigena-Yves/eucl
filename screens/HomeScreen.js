import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [amount, setAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [token, setToken] = useState('');
  const [tokenValidityDays, setTokenValidityDays] = useState('');

  const handlePurchaseToken = () => {
    // Perform validation on the amount and meter number inputs
    if (!amount || !meterNumber) {
      return Alert.alert('Error', 'Amount and meter number are required');
    }

    if (!/^\d{6}$/.test(meterNumber)) {
      return Alert.alert('Error', 'Meter number should be 6 digits');
    }

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber < 100) {
      return Alert.alert('Error', 'Amount should be at least 100 Rwf');
    }

    const tokenValidityDays = Math.floor(amountNumber / 100);
    if (tokenValidityDays > 1825) {
      return Alert.alert('Error', 'Amount should not exceed 5 years (1825 days)');
    }

    // Call the API to generate a token using axios
    axios
      .post('http://localhost:3000/generateToken', {
        amount,
        meterNumber,
      })
      .then(response => {
        const data = response.data;
        setToken(data.token);
        setTokenValidityDays(data.tokenValidityDays);
      })
      .catch(error => {
        console.error('Error purchasing token:', error);
        Alert.alert('Error', 'An error occurred while purchasing the token');
      });
  };

  return (
    <View>
      <Text>Welcome EUCL System</Text>
      <Text>Purchase Electricity</Text>
      <TextInput
        placeholder="Amount (in Rwf)"
        keyboardType="numeric"
        value={amount}
        onChangeText={text => setAmount(text)}
      />
      <TextInput
        placeholder="Meter Number"
        keyboardType="numeric"
        value={meterNumber}
        onChangeText={text => setMeterNumber(text)}
      />
      <Button title="Purchase" onPress={handlePurchaseToken} />
      {token && (
        <View>
          <Text>Token: {token}</Text>
          <Text>Token Validity (in Days): {tokenValidityDays}</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
