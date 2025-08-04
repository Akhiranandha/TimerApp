// file: /context/AppContext.js

import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const TimerContext = createContext();

const initialState = {
    timers: {}, // category: [timers]
    history: [],
};

const reducer = (state, action) => {
    const { category, id } = action.payload || {};
    switch (action.type) {
        case 'LOAD_STATE': {
            return {
                ...state,
                timers: action.payload.timers || {},
                history: action.payload.history || [],
            };
        }

        case 'ADD_TIMER': {
            const { name, duration, category } = action.payload;
            const newTimer = {
                id: uuid.v4(),
                name,
                duration,
                remaining: duration,
                status: 'paused',
                createdAt: Date.now(),
            };
            console.log(newTimer)
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
            const { timers } = state;
            const timersInCategory = timers[category] || [];
            const updatedTimers = timersInCategory.map((t) => {
                if (t.id !== id) return t;

                switch (action.type) {
                    case 'START_TIMER':
                        return { ...t, status: 'running' };
                    case 'PAUSE_TIMER':
                        return { ...t, status: 'paused' };
                    case 'RESET_TIMER':
                        return { ...t, remaining: t.duration, status: 'paused' };
                    default:
                        return t;
                }
            });

            return {
                ...state,
                timers: {
                    ...timers,
                    [category]: updatedTimers,
                },
            };
        }


        case 'TICK': {
            const newTimers = {};
            Object.entries(state.timers).forEach(([cat, timers]) => {
                newTimers[cat] = timers.map((timer) => {
                    if (timer.status === 'running' && timer.remaining > 0) {
                        return { ...timer, remaining: timer.remaining - 1 };
                    } else if (timer.status === 'running' && timer.remaining === 0) {
                        return { ...timer, status: 'paused' };
                    }
                    return timer;
                });
            });
            return {
                ...state,
                timers: newTimers,
            };
        }

        case 'START_ALL_IN_CATEGORY':
        case 'PAUSE_ALL_IN_CATEGORY':
        case 'RESET_ALL_IN_CATEGORY': {
            const actionType = action.type;
            console.log("Hello" + state.timers[category])
            const updatedTimers = state.timers[category]?.map((t) => {
                if (actionType === 'START_ALL_IN_CATEGORY') {
                    return { ...t, status: 'running' };
                } else if (actionType === 'PAUSE_ALL_IN_CATEGORY') {
                    return { ...t, status: 'paused' };
                } else if (actionType === 'RESET_ALL_IN_CATEGORY') {
                    return { ...t, remaining: t.duration, status: 'paused' };
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

    // Load timers from storage on mount
    useEffect(() => {
        const loadState = async () => {
            const timers = await AsyncStorage.getItem("timers");
            const history = await AsyncStorage.getItem("history");
            dispatch({
                type: "LOAD_STATE",
                payload: {
                    timers: timers ? JSON.parse(timers) : {},
                    history: history ? JSON.parse(history) : [],
                },
            });
        };
        loadState();
    }, []);

    // Save to AsyncStorage on state update
    useEffect(() => {
        AsyncStorage.setItem("timers", JSON.stringify(state.timers));
        AsyncStorage.setItem("history", JSON.stringify(state.history));
    }, [state]);

    // Global TICK interval
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
