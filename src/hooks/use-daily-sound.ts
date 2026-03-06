import { useEffect, useState } from 'react';

const STORAGE_KEY = 'bravecom_countdown_sound_played';

export function useDailySound() {
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(STORAGE_KEY);

    if (lastPlayed !== today) {
      setCanPlay(true);
    }
  }, []);

  const markAsPlayed = () => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, today);
    setCanPlay(false);
  };

  const playSound = (soundUrl: string) => {
    if (!canPlay) return;

    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().then(() => {
      markAsPlayed();
    }).catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  return { canPlay, playSound };
}