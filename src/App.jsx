import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TimeProvider } from './context/TimeContext';
import Home from './pages/Home';
import Wallet from './pages/Wallet';

function App() {
  return (
    <TimeProvider>
      <Router>
        <div style={{ fontFamily: 'Arial', direction: 'rtl', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
          {/* الهيدر العلوي */}
          <nav style={navStyle}>
            <Link to="/" style={linkStyle}>🏠 الرئيسية</Link>
            <Link to="/wallet" style={linkStyle}>💰 المحفظة</Link>
          </nav>

          {/* محتوى الصفحات */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </div>
      </Router>
    </TimeProvider>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '15px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #ddd'
};

const linkStyle = { textDecoration: 'none', color: '#333', fontWeight: 'bold' };

export default App;
