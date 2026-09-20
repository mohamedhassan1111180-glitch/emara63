import React, { useState } from 'react';

export default function App() {
  // حالة تسجيل الدخول للساكن
  const [currentUser, setCurrentUser] = useState<{ name: string; apt: string } | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputApt, setInputApt] = useState('1');
  const [role, setRole] = useState<'resident' | 'admin'>('resident');

  // بيانات الشقق الـ 24 والسكان
  const [apartments, setApartments] = useState(
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      name: `ساكن شقة ${index + 1}`,
      phone: '01xxxxxxxx',
      waterMeter: 'مستلم',
      gasStatus: 'تم التقديم',
      paid: false,
      photo: 'https://via.placeholder.com/60',
      isBlocked: false,
    }))
  );

  // مصاريف العمارة العامة
  const [expenses, setExpenses] = useState<{ reason: string; amount: number; active: boolean }[]>([
    { reason: 'شحن كارت كهرباء السلم', amount: 500, active: true }
  ]);
  const [newReason, setNewReason] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // الدردشة والرسائل الصوتية
  const [messages, setMessages] = useState<{ sender: string; text: string; type: 'text' | 'voice' }[]>([
    { sender: 'أحمد (مسؤول العمارة)', text: 'أهلاً بكل سكن عمارة 63 - حي الصفوة!', type: 'text' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // تسجيل دخول الساكن مع التحقق من عدم التكرار
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      alert('الرجاء كتابة الاسم بالعربي بشكل صحيح');
      return;
    }
    setCurrentUser({ name: inputName, apt: inputApt });
  };

  // إضافة مصروف جديد من المسؤول
  const handleAddExpense = () => {
    if (!newReason || !newAmount) return;
    setExpenses([...expenses, { reason: newReason, amount: Number(newAmount), active: true }]);
    setNewReason('');
    setNewAmount('');
  };

  // إرسال رسالة دردشة
  const sendMessage = (type: 'text' | 'voice') => {
    if (type === 'text' && !chatInput) return;
    const text = type === 'voice' ? '🎤 رسالة صوتية مسجلة' : chatInput;
    setMessages([...messages, { sender: currentUser?.name || 'مجهول', text, type }]);
    setChatInput('');
  };

  // إذا لم يتم تسجيل الدخول، اعرض شاشة الترحيب وتسجيل الدخول
  if (!currentUser) {
    return (
      <div style={{ padding: '30px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', background: 'linear-gradient(135deg, #0062cc, #009688)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>🏢 عمارة 63</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' }}>قطاع أ - حي الصفوة - أكتوبر الجديدة</p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>الاسم الثلاثي بالعربي:</label>
              <input 
                type="text" 
                placeholder="مثال: محمد أحمد علي" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>رقم الشقة:</label>
              <select 
                value={inputApt} 
                onChange={(e) => setInputApt(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>شقة رقم {i + 1}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              دخول التطبيق
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => setCurrentUser({ name: 'المسؤول (الأدمن)', apt: '0' })}
              style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              الدخول كمسؤول العمارة (الأدمن)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // الواجهة الرئيسية للبرنامج بعد الدخول
  return (
    <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* شريط العنوان العلوي */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, #1e3c72, #2a5298)', color: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px' }}>🏢 عمارة 63 - حي الصفوة (أكتوبر الجديدة)</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px', opacity: 0.9 }}>مرحباً بك، {currentUser.name} (شقة {currentUser.apt})</p>
        </div>
        <button 
          onClick={() => setCurrentUser(null)}
          style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          خروج
        </button>
      </header>

      {/* لوحة تحكم المسؤول (تظهر لو دخل كأدمن) */}
      {currentUser.apt === '0' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#1e3c72', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🛠️ لوحة تحكم المسؤول (إضافة المصاريف)</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            <input 
              type="text" 
              placeholder="سبب المصروف (مثل: كارت كهرباء السلم)" 
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input 
              type="number" 
              placeholder="المبلغ المطلوب (جنيه)" 
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={handleAddExpense}
              style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              نشر المصروف للسكان
            </button>
          </div>
        </div>
      )}

      {/* قسم المصاريف الحالية */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#1e3c72' }}>💡 المصاريف المطلوبة الحالية على السكان</h3>
        {expenses.map((exp, index) => (
          <div key={index} style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{exp.reason}</strong> - الإجمالي المطلوب: <span style={{ color: 'red', fontWeight: 'bold' }}>{exp.amount} جنيه</span> 
              (مقسمة على 24 شقة = {(exp.amount / 24).toFixed(1)} جنيه للشقة)
            </div>
            <span style={{ background: '#ffc107', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>نشط</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* جدول الشقق والسكان */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ color: '#1e3c72', marginBottom: '15px' }}>📋 دليل سكان عمارة 63 (الـ 24 شقة)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#1e3c72', color: 'white' }}>
                <th style={{ padding: '10px' }}>الشقة</th>
                <th style={{ padding: '10px' }}>الصورة</th>
                <th style={{ padding: '10px' }}>الساكن</th>
                <th style={{ padding: '10px' }}>الموبايل</th>
                <th style={{ padding: '10px' }}>حالة الدفع</th>
                {currentUser.apt === '0' && <th style={{ padding: '10px' }}>إدارة الحظر</th>}
              </tr>
            </thead>
            <tbody>
              {apartments.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #eee', background: apt.isBlocked ? '#ffdddd' : 'transparent' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>شقة {apt.id}</td>
                  <td style={{ padding: '10px' }}>
                    <img src={apt.photo} alt="صورة" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  </td>
                  <td style={{ padding: '10px' }}>{apt.name} {apt.isBlocked && '🚫 (محظور)'}</td>
                  <td style={{ padding: '10px' }}>{apt.phone}</td>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => {
                        const updated = [...apartments];
                        updated[apt.id - 1].paid = !updated[apt.id - 1].paid;
                        setApartments(updated);
                      }}
                      style={{ padding: '5px 10px', background: apt.paid ? '#28a745' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {apt.paid ? 'تم الدفع ✅' : 'لم يدفع ❌'}
                    </button>
                  </td>
                  {currentUser.apt === '0' && (
                    <td style={{ padding: '10px' }}>
                      <button 
                        onClick={() => {
                          const updated = [...apartments];
                          updated[apt.id - 1].isBlocked = !updated[apt.id - 1].isBlocked;
                          setApartments(updated);
                        }}
                        style={{ padding: '5px 8px', background: apt.isBlocked ? '#28a745' : '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {apt.isBlocked ? 'إلغاء الحظر' : 'حظر'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* قسم الدردشة والرسائل الصوتية */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '500px' }}>
          <h3 style={{ color: '#1e3c72', marginBottom: '10px' }}>💬 دردشة عمارة 63</h3>
          
          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px', marginBottom: '10px', background: '#fafafa' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', background: 'white', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '11px', color: '#007bff', fontWeight: 'bold' }}>{msg.sender}:</span>
                <p style={{ margin: '3px 0 0 0', fontSize: '14px' }}>{msg.text}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              placeholder="اكتب رسالة..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={() => sendMessage('text')}
              style={{ padding: '8px 12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              إرسال
            </button>
            <button 
              onClick={() => sendMessage('voice')}
              style={{ padding: '8px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
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
