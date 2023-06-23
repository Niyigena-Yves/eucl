import React from 'react';
import { View, Text } from 'react-native';

const GenerateTokenScreen = ({ route }) => {
  const { token, tokenValidityDays } = route.params;

  return (
    <View>
      <Text>Generated Token: {token}</Text>
      <Text>Token Validity: {tokenValidityDays} day(s)</Text>
    </View>
  );
};

export default GenerateTokenScreen;
