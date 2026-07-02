import { useEffect, useState } from "react";

export function useStepper(stepCount: number, autoPlay: boolean, intervalMs = 1050) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [stepCount]);

  useEffect(() => {
    if (!autoPlay || stepCount <= 1) return undefined;
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % stepCount);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, intervalMs, stepCount]);

  return {
    step,
    setStep,
    next: () => setStep((current) => Math.min(stepCount - 1, current + 1)),
    previous: () => setStep((current) => Math.max(0, current - 1)),
  };
}
