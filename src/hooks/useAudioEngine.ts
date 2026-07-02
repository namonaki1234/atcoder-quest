import { useCallback, useEffect, useRef } from "react";

type AudioEngineOptions = {
  enabled: boolean;
  volume: number;
};

type ManagedAudioContext = AudioContext & {
  webkitAudioContext?: typeof AudioContext;
};

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const melody = [392, 523, 587, 659, 587, 523, 440, 523];

export function useAudioEngine({ enabled, volume }: AudioEngineOptions) {
  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const enabledRef = useRef(enabled);
  const volumeRef = useRef(volume);

  enabledRef.current = enabled;
  volumeRef.current = volume;

  const getContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) return null;
      const context = new AudioContextClass() as ManagedAudioContext;
      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      contextRef.current = context;
      masterGainRef.current = gain;
    }
    return contextRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration = 0.12, toneVolume = 0.32) => {
      const context = getContext();
      const masterGain = masterGainRef.current;
      if (!context || !masterGain || !enabledRef.current) return;

      void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "triangle";
      gain.gain.value = volumeRef.current * toneVolume;
      oscillator.connect(gain);
      gain.connect(masterGain);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
      oscillator.stop(context.currentTime + duration);
    },
    [getContext],
  );

  const playBgmNote = useCallback(() => {
    const context = getContext();
    const masterGain = masterGainRef.current;
    if (!context || !masterGain || !enabledRef.current) return;

    const frequency = melody[noteIndexRef.current % melody.length];
    noteIndexRef.current += 1;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volumeRef.current * 0.075), context.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.42);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.44);
  }, [getContext]);

  const startBgm = useCallback((forceEnabled = false) => {
    const context = getContext();
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;

    if (forceEnabled) enabledRef.current = true;
    void context.resume();
    masterGain.gain.setTargetAtTime(enabledRef.current ? volumeRef.current : 0, context.currentTime, 0.08);

    if (intervalRef.current === null) {
      playBgmNote();
      intervalRef.current = window.setInterval(playBgmNote, 420);
    }
  }, [getContext, playBgmNote]);

  const stopBgm = useCallback(() => {
    const context = contextRef.current;
    const masterGain = masterGainRef.current;
    if (context && masterGain) {
      masterGain.gain.setTargetAtTime(0, context.currentTime, 0.06);
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const context = getContext();
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    masterGain.gain.setTargetAtTime(enabled ? volume : 0, context.currentTime, 0.08);
    if (!enabled) stopBgm();
  }, [enabled, getContext, stopBgm, volume]);

  useEffect(() => () => stopBgm(), [stopBgm]);

  return {
    startBgm,
    stopBgm,
    playSelect: () => playTone(520, 0.08, 0.24),
    playLocked: () => playTone(180, 0.08, 0.2),
    playClear: () => {
      playTone(740, 0.18, 0.3);
      window.setTimeout(() => playTone(980, 0.18, 0.3), 120);
    },
  };
}
