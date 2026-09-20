import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; apt: string } | null>(() => {
    const saved = localStorage.getItem('emara63_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputName, setInputName] = useState('');
  const [inputApt, setInputApt] = useState('1');

  // تخزين بيانات الشقق الـ 24
  const [apartments, setApartments] = useState(() => {
    const savedApts = localStorage.getItem('emara63_apartments');
    if (savedApts) return JSON.parse(savedApts);
    return Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      name: `شقة ${index + 1} (فارغة)`,
      waterMeter: 'لم يستلم',
      gasStatus: 'لم يقدم',
      occupancy: 'غير مسكون',
      isLocked: false,
    }));
  });

  useEffect(() => {
    localStorage.setItem('emara63_apartments', JSON.stringify(apartments));
  }, [apartments]);

  // التحقق من الاسم الثلاثي وعدم تكرار الاسم أو الشقة
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = inputName.trim();
    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length < 3) {
      alert('⚠️ تنبيه: يجب إدخال الاسم ثلاثياً على الأقل بالعربي!');
      return;
    }

    const aptNum = Number(inputApt);
    const updated = [...apartments];

    // 1. التأكد أن الشقة لم تُسجل من قبل
    if (updated[aptNum - 1].isLocked) {
      alert('⚠️ هذه الشقة مسجلة بالفعل ولا يمكن التسجيل فيها مرة أخرى!');
      return;
    }

    // 2. التأكد أن الاسم غير مكرر في شقة أخرى
    const nameExists = updated.some(apt => apt.name === trimmedName);
    if (nameExists) {
      alert('⚠️ هذا الاسم مسجل مسبقاً في شقة أخرى، لا يمكن تكرار نفس الاسم!');
      return;
    }

    // حفظ البيانات بنجاح
    updated[aptNum - 1] = {
      ...updated[aptNum - 1],
      name: trimmedName,
      occupancy: 'ساكن',
      isLocked: true,
    };

    setApartments(updated);
    const userInfo = { name: trimmedName, apt: inputApt };
    localStorage.setItem('emara63_user', JSON.stringify(userInfo));
    setCurrentUser(userInfo);
  };

  // حساب عدد السكان المسجلين فعلياً وتوزيع المبلغ عليهم فقط
  const registeredResidentsCount = apartments.filter(apt => apt.occupancy === 'ساكن').length;
  const totalCamerasCost = 18500;
  const costPerRegisteredApt = registeredResidentsCount > 0 ? (totalCamerasCost / registeredResidentsCount).toFixed(1) : '0';

  if (!currentUser) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e3c72', margin: '0 0 5px 0' }}>🏢 عمارة 63</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>قطاع أ - حي الصفوة - أكتوبر الجديدة</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>الاسم الثلاثي أو الرباعي:</label>
              <input 
                type="text" 
                placeholder="اكتب اسمك ثلاثياً على الأقل..." 
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
              style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              تسجيل ودخول الداشبورد
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px' }}>🏢 عمارة 63 - حي الصفوة (أكتوبر الجديدة)</h1>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.9 }}>مرحباً بك، {currentUser.name} (شقة {currentUser.apt})</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('emara63_user');
            setCurrentUser(null);
          }}
          style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          خروج
        </button>
      </header>

      {/* قسم التكلفة وتوزيعها على السكان المسجلين فقط */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRight: '5px solid #ffc107' }}>
        <h3 style={{ color: '#1e3c72', fontSize: '15px', margin: '0 0 8px 0' }}>📷 تكلفة سيستم الكاميرات وشفرة الباب</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
          الإجمالي المطلوب: <strong style={{ color: '#d9534f' }}>{totalCamerasCost} جنيه</strong> | 
          عدد السكان المسجلين: <strong style={{ color: '#007bff' }}>{registeredResidentsCount} ساكن</strong> | 
          الحصة الفردية: <strong style={{ color: '#28a745' }}>{costPerRegisteredApt} جنيه</strong>
        </p>
      </div>

      {/* جدول الداشبورد */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <h3 style={{ color: '#1e3c72', fontSize: '16px', margin: '0 0 12px 0' }}>📋 لوحة متابعة سكان عمارة 63 (الـ 24 شقة)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px', minWidth: '650px' }}>
          <thead>
            <tr style={{ background: '#1e3c72', color: 'white' }}>
              <th style={{ padding: '10px' }}>الشقة</th>
              <th style={{ padding: '10px' }}>اسم الساكن</th>
              <th style={{ padding: '10px' }}>حالة السكن</th>
              <th style={{ padding: '10px' }}>عداد المياه</th>
              <th style={{ padding: '10px' }}>حالة الغاز</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => {
              const isMyApt = Number(currentUser.apt) === apt.id;
              return (
                <tr key={apt.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>شقة {apt.id}</td>
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
                      disabled={!isMyApt}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].waterMeter = e.target.value;
                        setApartments(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: isMyApt ? 'white' : '#f9f9f9', cursor: isMyApt ? 'pointer' : 'not-allowed' }}
                    >
                      <option value="مستلم">مستلم</option>
                      <option value="لم يستلم">لم يستلم</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.gasStatus}
                      disabled={!isMyApt}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].gasStatus = e.target.value;
                        setApartments(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: isMyApt ? 'white' : '#f9f9f9', cursor: isMyApt ? 'pointer' : 'not-allowed' }}
                    >
                      <option value="تم التركيب">تم التركيب</option>
                      <option value="تم التقديم">تم التقديم</option>
                      <option value="لم يقدم">لم يقدم</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
