// file: /app/createTimer.jsx
import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TimerContext } from '../context/AppContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FDFDFD',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function CreateTimerScreen() {
  const { dispatch } = useContext(TimerContext);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const createTimer = () => {
    const trimmedName = name.trim();
    const trimmedCategory = category.trim() || 'Uncategorized';
    const numericDuration = Number(duration.trim());

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Please enter a timer name.');
      return;
    }

    if (isNaN(numericDuration) || numericDuration <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration in seconds.');
      return;
    }

    dispatch({
      type: 'ADD_TIMER',
      payload: {
        name: trimmedName,
        duration: numericDuration,
        category: trimmedCategory,
      },
    });

    setName('');
    setDuration('');
    setCategory('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.header}>Create New Timer</Text>

      <Text style={styles.label}>Timer Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g., Study Timer"
        style={styles.input}
      />

      <Text style={styles.label}>Duration (seconds)</Text>
      <TextInput
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        placeholder="e.g., 1500"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="e.g., Productivity"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={createTimer}>
        <Text style={styles.buttonText}>Create Timer</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
