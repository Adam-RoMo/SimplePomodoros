import react, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Image } from 'react-native';
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
            style={styles.wrapper}
            activeOpacity={0.7}
            onPress={pauseTimer}>
            <Image
                source={require('../assets/images/Pomodoro.png')}
                style={styles.circleWork}
            />
            <View style={styles.overlay}>
                <Text style={styles.text}>
                    {isPaused ? 'Paused' : formatTime(TimerSec)}
                </Text>
            </View>

        </ TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: 250,
        height: 250,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleWork: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        resizeMode: 'contain',
        position: 'absolute'
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
    text: {
        color: 'white',
        fontSize: 32,
        paddingTop: 20,
    }
});

export default TimerButton;