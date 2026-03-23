import { useState, useEffect } from 'react';

// 投票倒计时逻辑
const useVoteTimer = (initialTime: number = 30) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const resetTimer = (newTime: number = initialTime) => {
    setTimeLeft(newTime);
    setIsActive(false);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  // 计算进度百分比
  const progressPercentage = (timeLeft / initialTime) * 100;

  return {
    timeLeft,
    isActive,
    isCompleted,
    progressPercentage,
    startTimer,
    resetTimer,
    pauseTimer,
  };
};

export default useVoteTimer;