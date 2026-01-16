import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const initialData = {
  "Economy": { logic: "best_4_of_5", color: "#734073", assessments: [
    { type: "Midterm 1", total: 15, obtained: 13 },
    { type: "Midterm 2", total: 15, obtained: 15 },
    { type: "Quiz 1", total: 5, obtained: 5 },
    { type: "Quiz 2", total: 5, obtained: 4 },
    { type: "Quiz 3", total: 5, obtained: 5 },
    { type: "Quiz 4", total: 5, obtained: 3 },
    { type: "Quiz 5", total: 5, obtained: 4.5 },
    { type: "Final exam", total: 50, obtained: 0 }
  ]},
  "Math": { logic: "fixed", color: "#0cbce", assessments: [
    { type: "Midterm", total: 25, obtained: 22 },
    { type: "Quiz 1", total: 10, obtained: 10 },
    { type: "Quiz 2", total: 10, obtained: 9 },
    { type: "Quiz 3", total: 10, obtained: 9.5 },
    { type: "Laboratory test", total: 5, obtained: 5 },
    { type: "Final", total: 50, obtained: 0 }
  ]}
  // ... سيتم إضافة البقية بنفس النمط
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#c3c3d4' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#312936', padding: '20px', color: '#D4AF37' }}>
        <h2>My Grade</h2>
        <div onClick={() => setView('dashboard')} style={{ cursor: 'pointer', marginBottom: '20px' }}>Dashboard</div>
        <ul>
          {Object.keys(initialData).map(name => (
            <li key={name} onClick={() => { setSelectedSubject(name); setView('table'); }} style={{ cursor: 'pointer', padding: '10px 0' }}>
              {name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {view === 'dashboard' ? (
          <div>
            <h1>Dashboard Overview</h1>
            {/* هنا سنضع الرسوم البيانية */}
          </div>
        ) : (
          <SubjectTable name={selectedSubject} data={initialData[selectedSubject]} />
        )}
      </main>
    </div>
  );
}

function SubjectTable({ name, data }) {
  return (
    <div>
      <h2 style={{ color: '#312936' }}>{name} Details</h2>
      <table style={{ width: '100%', background: 'white', borderRadius: '10px', padding: '20px' }}>
        <thead>
          <tr><th>Type</th><th>Total</th><th>Obtained</th></tr>
        </thead>
        <tbody>
          {data.assessments.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.total}</td>
              <td>{item.obtained}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
