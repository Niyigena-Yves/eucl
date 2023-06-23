import React, { useState } from 'react';
import { View, TextInput, Button, Alert, FlatList, Text } from 'react-native';

const ViewTokensScreen = () => {
  const [meterNumber, setMeterNumber] = useState('');
  const [tokens, setTokens] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/getTokens/${meterNumber}`);
      const data = await response.json();

      if (response.ok) {
        setTokens(data.tokens);
      } else {
        Alert.alert('Error', data.error);
        setTokens([]);
      }
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      Alert.alert('Error', 'An error occurred while retrieving the tokens');
      setTokens([]);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Meter Number"
        value={meterNumber}
        onChangeText={setMeterNumber}
        keyboardType="numeric"
      />
      <Button title="Search Tokens" onPress={handleSearch} />
      {tokens.length > 0 ? (
        <FlatList
          data={tokens}
          keyExtractor={(item) => item.token}
          renderItem={({ item }) => (
            <Text>{`Token: ${item.token}, Validity Days: ${item.token_value_days}`}</Text>
          )}
        />
      ) : (
        <Text>No tokens found</Text>
      )}
    </View>
  );
};

export default ViewTokensScreen;
