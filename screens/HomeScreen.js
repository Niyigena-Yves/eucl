import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const HomeScreen = () => {
  const [amount, setAmount] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [token, setToken] = useState('');
  const [tokenValidityDays, setTokenValidityDays] = useState('');

  const handlePurchaseToken = () => {
    // Perform validation on the amount and meter number inputs
    if (!amount || !meterNumber) {
      return alert('Amount and meter number are required');
    }

    if (!/^\d{6}$/.test(meterNumber)) {
      return alert('Meter number should be 6 digits');
    }

    const amountNumber = parseInt(amount);
    if (isNaN(amountNumber) || amountNumber < 100) {
      return alert('Amount should be at least 100 Rwf');
    }

    const tokenValidityDays = Math.floor(amountNumber / 100);
    if (tokenValidityDays > 1825) {
      return alert('Amount should not exceed 5 years (1825 days)');
    }

    // Call the API to generate a token
    fetch('http://localhost:3000/api/generateToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        meterNumber,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setToken(data.token);
        setTokenValidityDays(data.tokenValidityDays);
      })
      .catch(error => {
        console.error('Error purchasing token:', error);
        alert('An error occurred while purchasing the token');
      });
  };

  return (
    <View>
      <Text>Welcome to the Home Screen!</Text>
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
