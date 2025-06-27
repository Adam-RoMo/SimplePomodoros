import { View, Text, Button, StyleSheet} from 'react-native';
import React from 'react';
import TimerButton from './components/TimerButton';

type TimerStep = {
  durationSec: number;
  status: 'rest' | 'work';
  title: string;
}

export default function App() {
  const sequence: TimerStep[] = [
    { durationSec: 2, status: 'work', title: "work 1"},
    { durationSec: 2, status: 'rest', title: "rest"},
    { durationSec: 2, status: 'work', title: "work 2"},
    { durationSec: 2, status: 'rest', title: "rest"},
    { durationSec: 2, status: 'work', title: "work 3"},
    { durationSec: 2, status: 'rest', title: "rest"},
    { durationSec: 2, status: 'work', title: "work 4"},
    { durationSec: 2, status: 'rest', title: "long rest"},
  ];
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleFinish = () => {
    setCurrentStep(() => {      
      if (currentStep === sequence.length - 1) {
        return 0;
      }
      return currentStep + 1;
    })
  }

  return (
    <View style={styles.container}>
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timer: { fontSize: 60, marginBottom: 20 },
});
