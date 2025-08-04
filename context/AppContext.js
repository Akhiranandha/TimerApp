import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const TimerContext = createContext();

const initialState = {
    timers: {},
    history: [],
    completedTimer: null,
    halfwayTimer: null,
};

const reducer = (state, action) => {
    const { category, id } = action.payload || {};

    switch (action.type) {
        case 'LOAD_STATE':
            return {
                ...state,
                timers: action.payload.timers || {},
                history: action.payload.history || [],
            };

        case 'ADD_TIMER': {
            const { name, duration } = action.payload;
            const newTimer = {
                id: uuid.v4(),
                name,
                duration,
                remaining: duration,
                status: 'paused',
                halfwayTriggered: false,
                createdAt: Date.now(),
            };
            return {
                ...state,
                timers: {
                    ...state.timers,
                    [category]: [...(state.timers[category] || []), newTimer],
                },
            };
        }

        case 'START_TIMER':
        case 'PAUSE_TIMER':
        case 'RESET_TIMER': {
            const timersInCategory = state.timers[category] || [];
            const updatedTimers = timersInCategory.map((t) => {
                if (t.id !== id) return t;

                switch (action.type) {
                    case 'START_TIMER':
                        return { ...t, status: 'running' };
                    case 'PAUSE_TIMER':
                        return { ...t, status: 'paused' };
                    case 'RESET_TIMER':
                        return {
                            ...t,
                            remaining: t.duration,
                            status: 'paused',
                            halfwayTriggered: false,
                        };
                    default:
                        return t;
                }
            });

            return {
                ...state,
                timers: {
                    ...state.timers,
                    [category]: updatedTimers,
                },
            };
        }

        case 'TICK': {
            const newTimers = {};
            let completedTimer = null;
            let halfwayTimer = null;
            const updatedHistory = [...state.history];

            Object.entries(state.timers).forEach(([cat, timers]) => {
                newTimers[cat] = timers.map((timer) => {
                    if (timer.status !== 'running') return timer;

                    const halfway = Math.floor(timer.duration / 2);

                    if (!timer.halfwayTriggered && timer.remaining === halfway) {
                        halfwayTimer = timer;
                        return { ...timer, halfwayTriggered: true, remaining: timer.remaining - 1 };
                    }

                    if (timer.remaining > 1) {
                        return { ...timer, remaining: timer.remaining - 1 };
                    } else if (timer.remaining === 1) {
                        const completed = { ...timer, status: 'completed', remaining: 0 };
                        completedTimer = completed;

                        updatedHistory.push({
                            timer: completed,
                            completedAt: new Date().toISOString(),
                        });

                        return completed;
                    }

                    return timer;
                });
            });

            return {
                ...state,
                timers: newTimers,
                completedTimer,
                halfwayTimer,
                history: updatedHistory,
            };
        }

        case 'CLEAR_COMPLETED_TIMER':
            return {
                ...state,
                completedTimer: null,
            };

        case 'CLEAR_HALFWAY_TIMER':
            return {
                ...state,
                halfwayTimer: null,
            };

        case 'START_ALL_IN_CATEGORY':
        case 'PAUSE_ALL_IN_CATEGORY':
        case 'RESET_ALL_IN_CATEGORY': {
            const updatedTimers = state.timers[category]?.map((t) => {
                if (action.type === 'START_ALL_IN_CATEGORY') {
                    return t.status === 'completed' ? t : { ...t, status: 'running' };
                } else if (action.type === 'PAUSE_ALL_IN_CATEGORY') {
                    return t.status === 'completed' ? t : { ...t, status: 'paused' };
                } else if (action.type === 'RESET_ALL_IN_CATEGORY') {
                    return {
                        ...t,
                        remaining: t.duration,
                        status: 'paused',
                        halfwayTriggered: false,
                    };
                }
                return t;
            });

            return {
                ...state,
                timers: {
                    ...state.timers,
                    [category]: updatedTimers,
                },
            };
        }

        default:
            return state;
    }
};

export const TimerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const loadState = async () => {
            try {
                const timers = await AsyncStorage.getItem('timers');
                const history = await AsyncStorage.getItem('history');
                dispatch({
                    type: 'LOAD_STATE',
                    payload: {
                        timers: timers ? JSON.parse(timers) : {},
                        history: history ? JSON.parse(history) : [],
                    },
                });
            } catch (error) {
                console.error('Error loading state:', error);
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('timers', JSON.stringify(state.timers));
        AsyncStorage.setItem('history', JSON.stringify(state.history));
    }, [state.timers, state.history]);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: 'TICK', payload: {} });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TimerContext.Provider value={{ state, dispatch }}>
            {children}
        </TimerContext.Provider>
    );
};
