
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { addDoc, doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import UserContext from '../context/UserContext';


const CurrentEntryScreen = () => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const user = useContext(UserContext);

  const signOut = () => {
    auth.signOut();
  }

  const saveEntry = async () => {
    if (user) {
      if (currentEntry.trim() !== '') {
        try {
          const today = new Date().toLocaleDateString('en-CA');

          const collectionRef = collection(db, user.uid);
          const q = query(collectionRef, where("date", "==", today));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // No entry for today, so create a new one.
            try {
              await addDoc(collectionRef, {
                currentTitle: currentTitle,
                currentEntry: currentEntry,
                date: today
              });
              setCurrentEntry('');
              setCurrentTitle('');
              alert('Entry creation successfully!');
            } catch (error) {
              console.error("Error creating new entry: ", error);
              alert("Error creating new entry");
            }
          } else {
            // An entry for today already exists, so update it.
            const docId = querySnapshot.docs[0].id;
            try {
              const entry = doc(db, user.uid, docId);
              await updateDoc(entry, {
                currentTitle: currentTitle,
                currentEntry: currentEntry,
                date: today
              });
              setCurrentEntry('');
              setCurrentTitle('');
              alert("Entry update successful!");
            } catch (error) {
              console.error("Error updating entry: ", error);
              alert('Error updating entry.');
            }
          }
        } catch (error) {
          console.error("Error fetching entries: ", error);
          alert("Error fetching entries.");
        }
      } else {
        alert('Entry cannot be empty.');
      }
    } else {
      alert('No user logged in.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Enter the title for today's entry" 
        value={currentTitle} 
        onChangeText={setCurrentTitle} 
        style={styles.titleText} 
      />      
      <TextInput 
        placeholder="Enter today's entry" 
        value={currentEntry} 
        onChangeText={setCurrentEntry} 
        style={styles.entryText} 
        multiline={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {saveEntry()}} style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setCurrentEntry('')}} style={[styles.button, { backgroundColor: 'gray' }]}> 
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={signOut} style={[styles.button, { backgroundColor: 'red' }]}> 
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    padding: 10
  },
  titleText: {
    borderWidth: 2,
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    fontSize: 20
  },
  entryText: {
    borderWidth: 2,
    width: '100%',
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    textAlignVertical: 'top'
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    margin: 10,
    gap: 20
  }
});

export default CurrentEntryScreen;
