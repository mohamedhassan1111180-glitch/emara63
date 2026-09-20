import React, { useState } from 'react';

export default function App() {
  const [apartments, setApartments] = useState(
    Array.from({ length: 24 }, (_, index) => ({
      id: index + 1,
      name: `ساكن شقة ${index + 1}`,
      phone: '01xxxxxxxx',
      waterMeter: 'مستلم',
      gasStatus: 'تم التقديم',
      balanceDue: 0,
    }))
  );

  const [cardBalance, setCardBalance] = useState(45);
  const [maintenanceCost, setMaintenanceCost] = useState(0);

  const distributeCost = (totalAmount: number) => {
    const perApartment = totalAmount / 24;
    setApartments(
      apartments.map((apt) => ({
        ...apt,
        balanceDue: Math.round(perApartment * 100) / 100,
      }))
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px', background: '#007bff', color: 'white', padding: '20px', borderRadius: '10px' }}>
        <h1>🏢 نظام إدارة عمارة 24 شقة</h1>
        <p>إدارة السكان، عدادات المياه والغاز، وكارت كهرباء السلم</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, background: cardBalance < 50 ? '#ff4d4d' : '#28a745', color: 'white', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>⚡ رصيد كارت كهرباء السلم</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{cardBalance} جنيه</p>
          {cardBalance < 50 && <span style={{ background: 'white', color: '#ff4d4d', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>⚠️ تنبيه: الكارت وشك على النفاذ!</span>}
        </div>

        <div style={{ flex: 1, background: '#ffc107', color: '#333', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>🛠️ مصاريف العمارة المطلوبة</h3>
          <input 
            type="number" 
            placeholder="اكتب المبلغ الإجمالي" 
            onChange={(e) => setMaintenanceCost(Number(e.target.value))}
            style={{ padding: '8px', width: '60%', borderRadius: '5px', border: '1px solid #ccc', marginLeft: '10px' }}
          />
          <button 
            onClick={() => distributeCost(maintenanceCost)}
            style={{ padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            توزيع على الـ 24 شقة
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: '#343a40', color: 'white' }}>
              <th style={{ padding: '12px' }}>رقم الشقة</th>
              <th style={{ padding: '12px' }}>اسم الساكن</th>
              <th style={{ padding: '12px' }}>رقم الموبايل</th>
              <th style={{ padding: '12px' }}>عداد المياه</th>
              <th style={{ padding: '12px' }}>حالة الغاز</th>
              <th style={{ padding: '12px' }}>المبلغ المطلوب</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr key={apt.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>شقة {apt.id}</td>
                <td style={{ padding: '10px' }}>
                  <input 
                    type="text" 
                    value={apt.name} 
                    onChange={(e) => {
                      const updated = [...apartments];
                      updated[apt.id - 1].name = e.target.value;
                      setApartments(updated);
                    }}
                    style={{ padding: '5px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '10px' }}>
                  <input 
                    type="text" 
                    value={apt.phone} 
                    onChange={(e) => {
                      const updated = [...apartments];
                      updated[apt.id - 1].phone = e.target.value;
                      setApartments(updated);
                    }}
                    style={{ padding: '5px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '10px' }}>
                  <select 
                    value={apt.waterMeter}
                    onChange={(e) => {
                      const updated = [...apartments];
                      updated[apt.id - 1].waterMeter = e.target.value;
                      setApartments(updated);
                    }}
                    style={{ padding: '5px', borderRadius: '4px' }}
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
                    style={{ padding: '5px', borderRadius: '4px' }}
                  >
                    <option value="تم التركيب">تم التركيب</option>
                    <option value="تم التقديم">تم التقديم</option>
                    <option value="لم يقدم">لم يقدم</option>
                  </select>
                </td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: apt.balanceDue > 0 ? 'red' : 'green' }}>
                  {apt.balanceDue} جنيه
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
