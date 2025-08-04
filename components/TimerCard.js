import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TimerCard({ timer, onStartPause, onReset }) {
    const [expanded, setExpanded] = useState(false);

    const isRunning = timer.status === 'running';
    const isPaused = timer.status === 'paused';
    const isCompleted = timer.status === 'completed';

    const statusText = isCompleted
        ? '✅ Completed'
        : isRunning
            ? '⏱ Running'
            : isPaused
                ? '⏸️ Paused'
                : '⏹️ Idle';

    const total = timer.duration || 1;
    const percentage = ((total - timer.remaining) / total) * 100;

    return (
        <Pressable onPress={() => setExpanded(!expanded)}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>{timer.name || 'Unnamed Timer'}</Text>
                        <Text style={styles.status}>{statusText}</Text>
                    </View>
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#888"
                    />
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                </View>

                {expanded && (
                    <>
                        <Text style={styles.time}>{formatTime(timer.remaining)}</Text>

                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={onStartPause} style={styles.button}>
                                <Text style={styles.buttonText}>
                                    {isRunning ? 'Pause' : 'Start'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={onReset} style={[styles.button, styles.resetButton]}>
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </Pressable>
    );
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(n) {
    return n < 10 ? `0${n}` : `${n}`;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 2,
    },
    status: {
        fontSize: 14,
        color: '#888',
    },
    time: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
        marginBottom: 8,
    },
    percentage: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    progressContainer: {
        height: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 4,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
    },
    resetButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});