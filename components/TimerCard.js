import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
} from 'react-native';

export default function TimerCard({ timer, onStartPause, onReset }) {
    const isRunning = timer.status === 'running';
    const isPaused = timer.status === 'paused';
    const isCompleted = timer.remaining === 0;

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isCompleted) {
            setShowModal(true);
        }
    }, [isCompleted]);

    const statusText = isCompleted
        ? '✅ Completed'
        : isRunning
            ? '⏱ Running'
            : isPaused
                ? '⏸️ Paused'
                : '⏹️ Idle';

    const total = timer.duration || 1; // prevent divide by zero
    const percentage = ((total - timer.remaining) / total) * 100;

    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.label}>{timer.name || 'Unnamed Timer'}</Text>
                <Text style={styles.status}>{statusText}</Text>
                <Text style={styles.time}>{formatTime(timer.remaining)}</Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity onPress={onStartPause} style={styles.button}>
                    <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onReset} style={[styles.button, styles.resetButton]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/* Completion Modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 Great job!</Text>
                        <Text style={styles.modalText}>
                            You completed: <Text style={{ fontWeight: 'bold' }}>{timer.name}</Text>
                        </Text>
                        <Pressable
                            onPress={() => setShowModal(false)}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
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
    info: {
        marginBottom: 12,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    time: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginHorizontal: 32,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
