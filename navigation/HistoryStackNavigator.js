import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HistoryScreen from '../screens/HistoryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';

const Stack = createStackNavigator();

const HistoryStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HistoryList" component={HistoryScreen} options={{ title: 'History' }}/>
      <Stack.Screen 
        name="EntryDetail" 
        component={EntryDetailScreen} 
        options={({ route }) => ({
          title: route.params.entry.date,
          headerBackTitle: 'Back'
        })} 
      />
    </Stack.Navigator>
  );
};
export default HistoryStackNavigator;
