import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { auth } from './firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import AuthScreen from './screens/AuthScreen';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserContext from './context/UserContext';

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1013968693210-u6llm6hfj4ic94ec24n5b2hogrec6shh.apps.googleusercontent.com',
      iosClientId: '1013968693210-lrk8o6lar4s2eoj3l0crql58nldah1qv.apps.googleusercontent.com',
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <UserContext.Provider value={user}>
          <TabNavigator />
        </UserContext.Provider>
      ) : (
        <AuthScreen />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;