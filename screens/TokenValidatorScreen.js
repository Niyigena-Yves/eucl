import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const TokenValidatorScreen = () => {
  const [token, setToken] = useState('');
  const [tokenValidityDays, setTokenValidityDays] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/validateToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTokenValidityDays(data.tokenValidityDays);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      Alert.alert('Error', 'An error occurred while validating the token');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Token"
        value={token}
        onChangeText={setToken}
        keyboardType="numeric"
      />
      <Button title="Validate Token" onPress={handleSubmit} />
      {tokenValidityDays !== '' && (
        <Text>{`Token Validity Days: ${tokenValidityDays}`}</Text>
      )}
    </View>
  );
};

export default TokenValidatorScreen;
