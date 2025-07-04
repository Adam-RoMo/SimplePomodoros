import { View, Text, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState} from 'react-native';
import React from 'react';
import TimerButton from './components/TimerButton';

type TimerStep = {
  durationSec: number;
  status: 'rest' | 'work';
  title: string;
}

export default function App() {
  const sequence: TimerStep[] = [
    { durationSec: 15, status: 'work', title: "work 1"},
    { durationSec: 15, status: 'rest', title: "rest"},
    { durationSec: 15, status: 'work', title: "work 2"},
    { durationSec: 15, status: 'rest', title: "rest"},
    { durationSec: 15, status: 'work', title: "work 3"},
    { durationSec: 15, status: 'rest', title: "rest"},
    { durationSec: 15, status: 'work', title: "work 4"},
    { durationSec: 15, status: 'rest', title: "long rest"},
  ];
  const [currentStep, setCurrentStep] = React.useState(0);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState: PanResponderGestureState) =>
        Math.abs(gestureState.dx) > 20,
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        if (gestureState.dx > 50 && currentStep > 0) {
          setCurrentStep(currentStep - 1);
        } else if (gestureState.dx < -50 && currentStep < sequence.length - 1) {
          setCurrentStep(currentStep + 1);
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
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.title}>
        {sequence[currentStep].title}
      </Text>
      <TimerButton
        key={currentStep}
        initialSeconds={sequence[currentStep].durationSec}
        status={sequence[currentStep].status}
        title={sequence[currentStep].title}
        onFinish={handleFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center' },
  timer: { fontSize: 60, marginBottom: 20},
  title: {
        color: 'Blue',
        fontWeight: 'bold',
        fontSize: 36,
        paddingBottom: 20,
    },
});
