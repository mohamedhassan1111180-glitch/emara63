import React, { useState } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; apt: string } | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputApt, setInputApt] = useState('1');

  // بيانات الـ 24 شقة مع أعمدة المياه، الغاز، حالة السكن، وصورة الساكن
  const [apartments, setApartments] = useState(
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      name: `شقة ${index + 1} (فارغة)`,
      phone: 'غير متوفر',
      waterMeter: 'لم يستلم',
      gasStatus: 'لم يقدم',
      occupancy: 'غير مسكون', // ساكن أو غير مسكون
      paid: false,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      isBlocked: false,
    }))
  );

  const [expenses, setExpenses] = useState<{ reason: string; amount: number }[]>([
    { reason: 'شحن كارت كهرباء السلم', amount: 500 }
  ]);
  const [newReason, setNewReason] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const [messages, setMessages] = useState<{ sender: string; text: string; type: 'text' | 'voice' }[]>([
    { sender: 'إدارة عمارة 63', text: 'أهلاً بكل جيران عمارة 63 - حي الصفوة - أكتوبر الجديدة!', type: 'text' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // تسجيل دخول الساكن وتحديث بيانات شقته تلقائياً في الداشبورد
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      alert('الرجاء كتابة الاسم بالعربي');
      return;
    }
    
    const aptNum = Number(inputApt);
    const updated = [...apartments];
    updated[aptNum - 1] = {
      ...updated[aptNum - 1],
      name: inputName,
      phone: '01xxxxxxxx',
      occupancy: 'ساكن',
    };
    setApartments(updated);
    setCurrentUser({ name: inputName, apt: inputApt });
  };

  const handleAddExpense = () => {
    if (!newReason || !newAmount) return;
    setExpenses([...expenses, { reason: newReason, amount: Number(newAmount) }]);
    setNewReason('');
    setNewAmount('');
  };

  const sendMessage = (type: 'text' | 'voice') => {
    if (type === 'text' && !chatInput) return;
    const text = type === 'voice' ? '🎤 رسالة صوتية مسجلة' : chatInput;
    setMessages([...messages, { sender: currentUser?.name || 'مجهول', text, type }]);
    setChatInput('');
  };

  if (!currentUser) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e3c72', margin: '0 0 5px 0' }}>🏢 عمارة 63</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>قطاع أ - حي الصفوة - أكتوبر الجديدة</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>الاسم الثلاثي بالعربي:</label>
              <input 
                type="text" 
                placeholder="اكتب اسمك هنا..." 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>رقم الشقة:</label>
              <select 
                value={inputApt} 
                onChange={(e) => setInputApt(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px', background: 'white' }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>شقة رقم {i + 1}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,123,255,0.3)' }}
            >
              دخول التطبيق
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <button 
              onClick={() => setCurrentUser({ name: 'المسؤول (الأدمن)', apt: '0' })}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              ⚙️ الدخول كمسؤول العمارة (الأدمن)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* شريط العنوان */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px' }}>🏢 عمارة 63 - حي الصفوة (أكتوبر الجديدة)</h1>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.9 }}>مرحباً، {currentUser.name} {currentUser.apt !== '0' ? `(شقة ${currentUser.apt})` : '(مسؤول)'}</p>
        </div>
        <button 
          onClick={() => setCurrentUser(null)}
          style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          خروج
        </button>
      </header>

      {/* لوحة تحكم الأدمن */}
      {currentUser.apt === '0' && (
        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#1e3c72', fontSize: '16px', margin: '0 0 10px 0' }}>🛠️ لوحة تحكم المسؤول (إضافة المصاريف)</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="سبب المصروف (مثل: صيانة الأسانسير)" 
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
            />
            <input 
              type="number" 
              placeholder="المبلغ (جنيه)" 
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
            />
            <button 
              onClick={handleAddExpense}
              style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              نشر المصروف
            </button>
          </div>
        </div>
      )}

      {/* المصاريف الحالية */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#1e3c72', fontSize: '15px', margin: '0 0 10px 0' }}>💡 المصاريف المطلوبة الحالية على السكان</h3>
        {expenses.map((exp, index) => (
          <div key={index} style={{ background: '#fff3cd', padding: '10px 12px', borderRadius: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', flexWrap: 'wrap', gap: '5px' }}>
            <div>
              <strong>{exp.reason}</strong>: <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{exp.amount} جنيه</span> 
              <span style={{ color: '#666', fontSize: '12px' }}> ({(exp.amount / 24).toFixed(1)} ج للشقة)</span>
            </div>
            <span style={{ background: '#ffc107', color: '#333', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>مطلوب السداد</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* جدول الشقق الاحترافي والمحدث */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ color: '#1e3c72', fontSize: '16px', margin: '0 0 12px 0' }}>📋 لوحة متابعة سكان عمارة 63 (الـ 24 شقة)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#1e3c72', color: 'white' }}>
                <th style={{ padding: '10px' }}>الشقة</th>
                <th style={{ padding: '10px' }}>الصورة</th>
                <th style={{ padding: '10px' }}>اسم الساكن</th>
                <th style={{ padding: '10px' }}>حالة السكن</th>
                <th style={{ padding: '10px' }}>عداد المياه</th>
                <th style={{ padding: '10px' }}>حالة الغاز</th>
                <th style={{ padding: '10px' }}>حالة الدفع</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #eee', background: apt.isBlocked ? '#ffdddd' : 'transparent' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>شقة {apt.id}</td>
                  <td style={{ padding: '10px' }}>
                    <img src={apt.photo} alt="صورة" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} />
                  </td>
                  <td style={{ padding: '10px', fontWeight: apt.occupancy === 'ساكن' ? 'bold' : 'normal', color: apt.occupancy === 'ساكن' ? '#333' : '#888' }}>
                    {apt.name}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', background: apt.occupancy === 'ساكن' ? '#d4edda' : '#e2e3e5', color: apt.occupancy === 'ساكن' ? '#155724' : '#383d41' }}>
                      {apt.occupancy}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.waterMeter}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].waterMeter = e.target.value;
                        setApartments(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                    >
                      <option value="مستلم">مستلم</option>
                      <option value="لم يستلم">لم يستلم</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.gasStatus}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].gasStatus = e.target.value;
                        setApartments(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px' }}
                    >
                      <option value="تم التركيب">تم التركيب</option>
                      <option value="تم التقديم">تم التقديم</option>
                      <option value="لم يقدم">لم يقدم</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => {
                        const updated = [...apartments];
                        updated[apt.id - 1].paid = !updated[apt.id - 1].paid;
                        setApartments(updated);
                      }}
                      style={{ padding: '5px 10px', background: apt.paid ? '#28a745' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                    >
                      {apt.paid ? 'تم الدفع ✅' : 'لم يدفع ❌'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* قسم الدردشة */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '350px' }}>
          <h3 style={{ color: '#1e3c72', fontSize: '16px', margin: '0 0 10px 0' }}>💬 دردشة عمارة 63</h3>
          
          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px', marginBottom: '10px', background: '#fafafa' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '8px', background: 'white', padding: '8px 10px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '11px', color: '#007bff', fontWeight: 'bold' }}>{msg.sender}:</span>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#333' }}>{msg.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="اكتب رسالة للجيران..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
            />
            <button 
              onClick={() => sendMessage('text')}
              style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              إرسال
            </button>
            <button 
              onClick={() => sendMessage('voice')}
              style={{ padding: '10px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              title="إرسال فويس"
            >
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
