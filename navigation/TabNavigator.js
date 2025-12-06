
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CurrentEntryScreen from '../screens/CurrentEntryScreen';
import HistoryStackNavigator from './HistoryStackNavigator';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === "CurrentEntry") {
          iconName = 'today';
          return <Ionicons name={iconName} size={size} color={color} />
        } else if (route.name === "History") {
          iconName = 'history';
          return <AntDesign name={iconName} size={size} color={color}/>
        }
      },
      tabBarActiveTintColor: 'tomato', // Customize active tab color
      tabBarInactiveTintColor: 'gray', // Customize inactive tab color
    })}>

      <Tab.Screen 
        name="CurrentEntry"
        component={CurrentEntryScreen}
        options={{title: "Today's Entry"}}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStackNavigator} 
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
