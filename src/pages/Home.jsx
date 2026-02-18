import React from 'react';
import { useTime } from '../context/TimeContext';

const Home = () => {
  const { spendMinutes } = useTime();

  const skills = [
    { id: 1, name: "تعليم برمجة React", cost: 20 },
    { id: 2, name: "تصميم شعارات (Logo)", cost: 30 },
    { id: 3, name: "محادثة إنجليزية", cost: 15 },
  ];

  const handleBook = (skill) => {
    const success = spendMinutes(skill.cost, skill.name);
    if (success) {
      alert(`تم حجز جلسة ${skill.name} بنجاح!`);
    } else {
      alert("عذراً، رصيدك لا يكفي.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>اكتشف المهارات 💡</h2>
      {skills.map(skill => (
        <div key={skill.id} style={cardStyle}>
          <h4>{skill.name}</h4>
          <p>التكلفة: {skill.cost} دقيقة</p>
          <button onClick={() => handleBook(skill)} style={btnStyle}>بدء التعلم الآن</button>
        </div>
      ))}
    </div>
  );
};

const cardStyle = { backgroundColor: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const btnStyle = { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', width: '100%' };

export default Home;
