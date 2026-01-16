[٤:٣٧ ص, ١٦‏/١‏/٢٠٢٦] ⁦+966 55 058 9569⁩: import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
[٤:٣٨ ص, ١٦‏/١‏/٢٠٢٦] ⁦+966 55 058 9569⁩: import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { LayoutDashboard, Table as TableIcon, ArrowRight, Star, XCircle } from 'lucide-react';

ChartJS.register(...registerables);

// البيانات الكاملة لجميع المقررات لعام 2026
const initialData = {
  "Economy": { color: "#734073", logic: "best_4_of_5", assessments: [
    { type: "Midterm 1", total: 15, obtained: 13 }, { type: "Midterm 2", total: 15, obtained: 15 },
    { type: "Quiz 1", total: 5, obtained: 5 }, { type: "Quiz 2", total: 5, obtained: 4 },
    { type: "Quiz 3", total: 5, obtained: 5 }, { type: "Quiz 4", total: 5, obtained: 3 },
    { type: "Quiz 5", total: 5, obtained: 4.5 }, { type: "Final exam", total: 50, obtained: 0 }
  ]},
  "Math": { color: "#0cbce", logic: "fixed", assessments: [
    { type: "Midterm", total: 25, obtained: 22 }, { type: "Quiz 1", total: 10, obtained: 10 },
    { type: "Quiz 2", total: 10, obtained: 9 }, { type: "Quiz 3", total: 10, obtained: 9.5 },
    { type: "Laboratory test", total: 5, obtained: 5 }, { type: "Final", total: 50, obtained: 0 }
  ]},
  "Technology": { color: "#5baee5", logic: "fixed", assessments: [
    { type: "Midterm 1", total: 20, obtained: 20 }, { type: "Midterm 2", total: 20, obtained: 18 },
    { type: "Quiz 1", total: 5, obtained: 5 }, { type: "Quiz 2", total: 5, obtained: 3 },
    { type: "Quiz 3", total: 5, obtained: 4 }, { type: "Final", total: 50, obtained: 0 }
  ]},
  "Administration": { color: "#836191", logic: "fixed", assessments: [
    { type: "Midterm 1", total: 20, obtained: 20 }, { type: "Midterm 2", total: 20, obtained: 17 },
    { type: "Report", total: 10, obtained: 10 }, { type: "Final", total: 50, obtained: 0 }
  ]},
  "Islamic": { color: "#a09cb8", logic: "fixed", assessments: [
    { type: "Midterm", total: 20, obtained: 17 }, { type: "Performance tasks", total: 20, obtained: 20 },
    { type: "Final", total: 60, obtained: 0 }
  ]},
  "Arabica": { color: "#c5d8e1", logic: "fixed", assessments: [
    { type: "Midterm", total: 20, obtained: 19 }, { type: "Various activities", total: 20, obtained: 20 },
    { type: "Final", total: 60, obtained: 0 }
  ]}
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedSub, setSelectedSub] = useState('Economy');

  // حسابات المنطق (استبعاد أقل كويز)
  const calculateData = (subjectName) => {
    const sub = initialData[subjectName];
    let items = [...sub.assessments];
    let excludedIdx = -1;

    if (sub.logic === "best_4_of_5") {
      let quizzes = items.filter(a => a.type.includes("Quiz"));
      let minVal = Math.min(...quizzes.map(q => q.obtained));
      excludedIdx = items.findIndex(a => a.type.includes("Quiz") && a.obtained === minVal);
    }

    const currentTotal = items.reduce((acc, curr, idx) => idx === excludedIdx ? acc : acc + curr.obtained, 0);
    const possibleTotal = items.reduce((acc, curr, idx) => idx === excludedIdx ? acc : acc + curr.total, 0);
    
    return { items, excludedIdx, currentTotal, possibleTotal };
  };

  const { items, excludedIdx, currentTotal, possibleTotal } = calculateData(selectedSub);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#c3c3d4', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#312936', color: 'white', padding: '25px' }}>
        <h1 style={{ color: '#D4AF37', fontSize: '24px', marginBottom: '40px' }}>My Grade 2026</h1>
        <div onClick={() => setView('dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', color: view === 'dashboard' ? '#D4AF37' : 'white' }}>
          <LayoutDashboard size={20} /> Dashboard
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>المقررات</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {Object.keys(initialData).map(name => (
            <li key={name} onClick={() => { setSelectedSub(name); setView('table'); }} style={{ padding: '12px 0', cursor: 'pointer', color: (selectedSub === name && view === 'table') ? '#D4AF37' : '#ccc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TableIcon size={16} /> {name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {view === 'dashboard' ? (
          <Dashboard initialData={initialData} calculateData={calculateData} onSelect={(s) => {setSelectedSub(s); setView('table')}} />
        ) : (
          <SubjectView name={selectedSub} items={items} excludedIdx={excludedIdx} total={currentTotal} possible={possibleTotal} onBack={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}

// مكون الداشبورد الرئيسي
function Dashboard({ initialData, calculateData, onSelect }) {
  const [activeSub, setActiveSub] = useState('Economy');
  const { currentTotal, possibleTotal } = calculateData(activeSub);
  
  const donutData = {
    labels: ['المحقق', 'المتبقي'],
    datasets: [{
      data: [currentTotal, 100 - currentTotal],
      backgroundColor: [initialData[activeSub].color, '#e0e0e0'],
      borderWidth: 0
    }]
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#312936' }}>Dashboard Overview</h2>
        <select onChange={(e) => setActiveSub(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D4AF37' }}>
          {Object.keys(initialData).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <p>أعمال السنة الحالية</p>
          <h2 style={{ color: initialData[activeSub].color }}>{currentTotal} / 50</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <p>فرصة الـ A+</p>
          <div style={{ color: (100 - currentTotal <= 50) ? '#90EE90' : '#8FBC8F', fontWeight: 'bold' }}>
            {(100 - currentTotal <= 50) ? 'ممكنة جداً' : 'تحتاج مجهود'}
          </div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }} onClick={() => onSelect(activeSub)}>
          <p>عرض التفاصيل</p>
          <ArrowRight style={{ margin: 'auto' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px' }}>
          <h3>توزيع الدرجات (Bar Chart)</h3>
          <Bar data={{
            labels: initialData[activeSub].assessments.map(a => a.type),
            datasets: [{ label: 'الدرجة', data: initialData[activeSub].assessments.map(a => a.obtained), backgroundColor: initialData[activeSub].color }]
          }} />
        </div>
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center' }}>
          <h3>التقدم الحالي (Donut)</h3>
          <Doughnut data={donutData} />
        </div>
      </div>
    </div>
  );
}

// مكون جدول المقرر
function SubjectView({ name, items, excludedIdx, total, possible, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: '20px', background: '#D4AF37', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>العودة للرئيسية</button>
      <h2 style={{ marginBottom: '20px' }}>تفاصيل مقرر: {name}</h2>
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '15px' }}>نوع التقييم</th>
              <th>الدرجة الكلية</th>
              <th>الدرجة المحققة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} style={{ textAlign: 'center', borderBottom: '1px solid #eee', opacity: idx === excludedIdx ? 0.4 : 1, backgroundColor: idx === excludedIdx ? '#f9f9f9' : 'transparent' }}>
                <td style={{ padding: '15px' }}>{item.type}</td>
                <td>{item.total}</td>
                <td style={{ fontWeight: 'bold' }}>{item.obtained}</td>
                <td>
                  {idx === excludedIdx ? <XCircle color="red" size={18} /> : (item.obtained === item.total && item.total > 0 ? <Star color="#D4AF37" size={18} fill="#D4AF37" /> : '-')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'left', fontWeight: 'bold', fontSize: '18px', color: '#312936' }}>
          الإجمالي المحتسب: {total} / {possible}
        </div>
      </div>
    </div>
  );
}
