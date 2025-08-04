import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { TimerContext } from '../context/AppContext';

export default function HistoryScreen() {
  const { state } = useContext(TimerContext);

  const handleExport = async () => {
    try {
      const jsonString = JSON.stringify(state.history, null, 2);
      const fileUri = FileSystem.documentDirectory + 'timer_history.json';

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available on this device');
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Completed Timers</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>Timer name: {item.timer.name}</Text>
            <Text style={styles.time}>Completed Time: {new Date(item.completedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  exportButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  exportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    padding: 12,
    backgroundColor: '#eee',
    marginBottom: 8,
    borderRadius: 6,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  time: { fontSize: 14, color: '#666' },
});
