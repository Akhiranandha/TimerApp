import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Modal, Text, View, Pressable, StyleSheet } from 'react-native';
import { TimerProvider, TimerContext } from '../context/AppContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';

function GlobalModal() {
  const { state, dispatch } = useContext(TimerContext);
  const completed = state.completedTimer;
  const halfway = state.halfwayTimer;

  const handleClose = () => {
    dispatch({ type: 'CLEAR_COMPLETED_TIMER' });
  };

  return (
    <>
      <Modal visible={!!completed} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.congrats}>🎉 Timer Completed!</Text>
            <Text style={styles.name}>{completed?.name}</Text>
            <Pressable onPress={handleClose} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={!!halfway} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.congrats}>⏳ Halfway There!</Text>
            <Text style={styles.name}>{halfway?.name}</Text>
            <Pressable onPress={handleClose} style={styles.button}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  return (
    <TimerProvider>
      <GlobalModal />
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Entypo name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="createTimer"
          options={{
            title: 'Create Timer',
            tabBarIcon: ({ color }) => <AntDesign name="pluscircleo" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <FontAwesome5 name="history" size={24} color={color} />,
          }}
        />
      </Tabs>
    </TimerProvider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  congrats: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  name: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
