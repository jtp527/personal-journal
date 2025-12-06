import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import UserContext from '../context/UserContext';

const HistoryScreen = () => {
  const [entries, setEntries] = useState([]);
  const navigation = useNavigation();
  const user = useContext(UserContext)

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const collectionRef = collection(db, user.uid);
    // Query to order the entries by date, descending
    const q = query(collectionRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(fetchedEntries);
    }, error => {
      console.error("Error listening to entries: ", error);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteEntry = async (item) => {
    try{
      const docRef = doc(db, user.uid, item.id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting entry: ", error);
      alert("Error deleting entry.");
    }
  }
  if (entries && entries.length > 0) {
    return (
      <FlatList 
        data={entries}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.entry}
            onPress={() => navigation.navigate('EntryDetail', { entry: item })}
          >
            <Text style={styles.text}>Date: {item.date}</Text>
            <Text style={styles.entryContentText} numberOfLines={1}>
              {item.currentTitle ? `Title: ${item.currentTitle}` : `Entry: ${item.currentEntry}`}
            </Text>
            <TouchableOpacity onPress={() => deleteEntry(item)}>
              <AntDesign name={'delete'} size={20} />
            </TouchableOpacity>  
          </TouchableOpacity>
        )}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No entries found.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  entry: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'lightgray',
  },
  text: {
    fontSize: 16,
    marginRight: 10
  },
  entryContentText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  }
});

export default HistoryScreen;