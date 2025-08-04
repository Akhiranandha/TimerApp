import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TimerContext } from '../context/AppContext';
import TimerCard from '../components/TimerCard';

export default function HomeScreen() {
  const { state, dispatch } = useContext(TimerContext);
  const { timers } = state;
  const [collapsed, setCollapsed] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const initialCollapsed = {};
    Object.keys(timers).forEach((cat) => {
      if (!(cat in collapsed)) {
        initialCollapsed[cat] = true;
      }
    });
    if (Object.keys(initialCollapsed).length > 0) {
      setCollapsed((prev) => ({ ...prev, ...initialCollapsed }));
    }
  }, [timers]);

  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleStartPause = (category, id, currentStatus) => {
    dispatch({
      type: currentStatus === 'running' ? 'PAUSE_TIMER' : 'START_TIMER',
      payload: { category, id },
    });
  };

  const handleReset = (category, id) => {
    dispatch({
      type: 'RESET_TIMER',
      payload: { category, id },
    });
  };

  const handleStartAll = (category) => {
    dispatch({
      type: 'START_ALL_IN_CATEGORY',
      payload: { category },
    });
  };

  const handlePauseAll = (category) => {
    dispatch({
      type: 'PAUSE_ALL_IN_CATEGORY',
      payload: { category },
    });
  };

  const handleResetAll = (category) => {
    dispatch({
      type: 'RESET_ALL_IN_CATEGORY',
      payload: { category },
    });
  };

  const filteredCategories = selectedCategory === 'All'
    ? Object.entries(timers)
    : [[selectedCategory, timers[selectedCategory]]];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="All" value="All" />
          {Object.keys(timers).map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {filteredCategories.map(([category, categoryTimers]) => {
        const isCollapsed = collapsed[category];
        return (
          <View key={category} style={styles.categoryBlock}>
            <TouchableOpacity onPress={() => toggleCollapse(category)}>
              <Text style={styles.categoryTitle}>
                {isCollapsed ? '▶' : '▼'} {category}
              </Text>
            </TouchableOpacity>

            {!isCollapsed && (
              <>
                <View style={styles.bulkButtons}>
                  <TouchableOpacity
                    style={[styles.bulkButton, styles.startAll]}
                    onPress={() => handleStartAll(category)}
                  >
                    <Text style={styles.bulkButtonText}>Start All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.bulkButton, styles.pauseAll]}
                    onPress={() => handlePauseAll(category)}
                  >
                    <Text style={styles.bulkButtonText}>Pause All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.bulkButton, styles.resetAll]}
                    onPress={() => handleResetAll(category)}
                  >
                    <Text style={styles.bulkButtonText}>Reset All</Text>
                  </TouchableOpacity>
                </View>

                {categoryTimers.map((timer) => (
                  <TimerCard
                    key={timer.id}
                    timer={timer}
                    onStartPause={() => handleStartPause(category, timer.id, timer.status)}
                    onReset={() => handleReset(category, timer.id)}
                  />
                ))}
              </>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  filterContainer: {
    margin: 16,
    marginBottom: 0,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  categoryBlock: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 16,
    marginVertical: 12,
    color: '#333',
  },
  bulkButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  bulkButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  startAll: {
    backgroundColor: '#4CAF50',
  },
  pauseAll: {
    backgroundColor: '#FFC107',
  },
  resetAll: {
    backgroundColor: '#F44336',
  },
  bulkButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
