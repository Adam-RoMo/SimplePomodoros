import react, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';

type Props = {
    initialSeconds: number;
    status: 'rest' | 'work';
    title: string;
    onFinish?: () => void;
};

const TimerButton = (Props) => {
    const [isPaused, setIsPaused] = react.useState(false);
    const [TimerSec, setTimerSec] = react.useState(Props.initialSeconds);

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/bell.mp3')
        );
        await sound.playAsync();
    };

    useEffect(() => {
        if (isPaused) return;

        if (TimerSec === 0) {
            if (Props.onFinish) {
                playSound();
                Props.onFinish();
            }
            return;
        }

        const interval = setInterval(() => {
            const formatTime = (s: number) => {
                const minutes = String(Math.floor(s / 60)).padStart(2, '0');
                const seconds = String(s % 60).padStart(2, '0');
                return `${minutes}:${seconds}`;
            };
            setTimerSec((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [TimerSec, isPaused]);

    const formatTime = (s: number) => {
        const minutes = String(Math.floor(s / 60)).padStart(2, '0');
        const seconds = String(s % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const pauseTimer = () => {
        if (TimerSec === 0) return;
        setIsPaused(!isPaused);
    }

    return (
        <TouchableOpacity
        activeOpacity={0.7}
        style={((Props.status === 'rest') ? (styles.circleRest) : (styles.circleWork))} onPress={pauseTimer}>
            <Text style={styles.title}>
                {Props.title}
            </Text>
            <Text style={styles.text}>
                {isPaused ? 'Paused' : formatTime(TimerSec)}
            </Text>
        </ TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    circleWork: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    circleRest: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 50,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 36,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 32,
    }
});

export default TimerButton;