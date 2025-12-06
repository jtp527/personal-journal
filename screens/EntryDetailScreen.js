import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const EntryDetailScreen = ({ route }) => {
  const { entry } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {entry.currentTitle && <Text style={styles.title}>{entry.currentTitle}</Text>}
        <Text style={styles.text}>{entry.currentEntry}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  }
});

export default EntryDetailScreen;
