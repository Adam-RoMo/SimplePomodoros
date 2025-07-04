import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Animated,

} from 'react-native';
import React from 'react';
import TimerButton from './components/TimerButton';

type TimerStep = {
  durationSec: number;
  status: 'rest' | 'work';
  title: string;
}

export default function App() {
  const sequence: TimerStep[] = [
    { durationSec: 15, status: 'work', title: "work 1" },
    { durationSec: 15, status: 'rest', title: "rest" },
    { durationSec: 15, status: 'work', title: "work 2" },
    { durationSec: 15, status: 'rest', title: "rest" },
    { durationSec: 15, status: 'work', title: "work 3" },
    { durationSec: 15, status: 'rest', title: "rest" },
    { durationSec: 15, status: 'work', title: "work 4" },
    { durationSec: 15, status: 'rest', title: "long rest" },
  ];
  const [currentStep, setCurrentStep] = React.useState(0);
  const animation = React.useRef(new Animated.Value(0)).current;

  const getColorFromStatus = (status: 'work' | 'rest') =>
    status === 'work' ? '#FCFFED' : '#D7F4FF';

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: currentStep,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const prevStep = currentStep > 0 ? currentStep - 1 : currentStep;
  const prevColor = getColorFromStatus(sequence[prevStep].status);
  const currentColor = getColorFromStatus(sequence[currentStep].status);

    const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor, currentColor],
  });


  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState: PanResponderGestureState) => {
        console.log('Gesture dx:', gestureState.dx);
        return Math.abs(gestureState.dx) > 20
      },
      onPanResponderGrant: () => {
        console.log('Pan start');
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        console.log('Pan end dx:', gestureState.dx, "current step:", currentStep);
        console.log('sequence lenght:', sequence.length);
        if (gestureState.dx > 50) {
          console.log('Swiped left');
          setCurrentStep(prev => (prev > 0 ? prev - 1 : sequence.length - 1));
        } else if (gestureState.dx < -50) {
          console.log('Swiped right');
          setCurrentStep((prev) => (prev < sequence.length - 1 ? prev + 1 : 0));
        }
      }
    })
  ).current;

  const handleFinish = () => {
    setCurrentStep(() => {
      if (currentStep === sequence.length - 1) {
        return 0;
      }
      return currentStep + 1;
    })
  }

  return (
    <Animated.View
    style={[styles.container, { backgroundColor }]}
    {...panResponder.panHandlers}>
      <Text style={styles.title}>
        {sequence[currentStep].title}
      </Text>
      <TimerButton
        key={currentStep}
        initialSeconds={sequence[currentStep].durationSec}
        status={sequence[currentStep].status}
        title={sequence[currentStep].title}
        onFinish={handleFinish} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timer: { fontSize: 60, marginBottom: 20 },
  title: {
    color: 'Blue',
    fontWeight: 'bold',
    fontSize: 36,
    paddingBottom: 20,
  },
});
