import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1013968693210-mh56mm663iuo2vil42qiumnhudl38g6k.apps.googleusercontent.com', 
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Check if device supports Google Play on Android
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = userInfo.data;
  
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
  
      // Sign-in the user with the credential
      return signInWithCredential(auth, googleCredential);
    } catch (error) {
      Alert.alert("Sign-in Error", error.message);
    }
  }

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSigningUp ? 'Create an Account' : 'Sign In'}</Text>

      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />

      {isSigningUp ? (
        <>
          <Button title="Sign Up" onPress={handleSignUp} />
          <Text style={styles.toggleText} onPress={() => setIsSigningUp(false)}>Already have an account? Sign In</Text>
        </>
      ) : (
        <>
          <Button title="Sign In" onPress={handleSignIn} />
          <Text style={styles.toggleText} onPress={() => setIsSigningUp(true)}>Don't have an account? Sign Up</Text>
        </>
      )}

      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={onGoogleButtonPress}
      >
        <Image source={require('../assets/google.png')} style={styles.googleLogo} />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 5 },
    toggleText: { color: '#007AFF', marginTop: 15 },
    googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20, marginTop: 20, width: '100%' },
    googleLogo: { width: 24, height: 24, marginRight: 15 },
    googleButtonText: { fontSize: 16, fontWeight: '600', color: '#757575' },
});

export default AuthScreen;