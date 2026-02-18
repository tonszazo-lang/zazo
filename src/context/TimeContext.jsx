import React, { createContext, useState, useContext } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [balance, setBalance] = useState(100); // الرصيد الابتدائي
  const [history, setHistory] = useState([]);

  const spendMinutes = (amount, task) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setHistory([{ id: Date.now(), title: task, amount: -amount }, ...history]);
      return true;
    }
    return false;
  };

  return (
    <TimeContext.Provider value={{ balance, history, spendMinutes }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);
