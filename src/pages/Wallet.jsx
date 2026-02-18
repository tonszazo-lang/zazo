import React from 'react';
import { useTime } from '../context/TimeContext';

const Wallet = () => {
  const { balance, history } = useTime();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={balanceCard}>
        <p>رصيدك الحالي</p>
        <h1 style={{ fontSize: '50px', margin: '10px 0' }}>{balance}</h1>
        <p>دقيقة معرفية</p>
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <h3>سجل النشاطات 📜</h3>
        {history.length === 0 ? <p>لا توجد عمليات بعد.</p> : 
          history.map(item => (
            <div key={item.id} style={historyItem}>
              <span>{item.title}</span>
              <span style={{ color: 'red' }}>{item.amount} د</span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const balanceCard = { background: '#1a1a1a', color: '#ff9800', padding: '30px', borderRadius: '20px' };
const historyItem = { display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' };

export default Wallet;
