import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

// 🏢 بيانات مشروعك السحابي على Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7fBFUOpvDljRyS8EVw-c",
  authDomain: "emara63-303b1.firebaseapp.com",
  projectId: "emara63-303b1",
  storageBucket: "emara63-303b1.firebasestorage.app",
  messagingSenderId: "349478615775",
  appId: "1:349478615775:web:a6f8527afa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; apt: string; isAdmin: boolean } | null>(() => {
    const saved = localStorage.getItem('emara63_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputName, setInputName] = useState('');
  const [inputApt, setInputApt] = useState('1');
  const [adminPass, setAdminPass] = useState('');
  const [loginMode, setLoginMode] = useState<'resident' | 'admin'>('resident');

  const initialApartments = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    name: `شقة ${index + 1} (فارغة)`,
    phone: '01xxxxxxxx',
    residencyStatus: 'غير مقيم',
    cameraApproval: 'غير موافق',
    waterMeter: 'لم يستلم',
    gasStatus: 'لم يقدم',
  }));

  const [apartments, setApartments] = useState(initialApartments);

  // جلب البيانات لحظياً من سحابة فايربيس لكل الجيران
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "apartments"));
        if (!querySnapshot.empty) {
          const loadedApts: any[] = [];
          querySnapshot.forEach((doc) => {
            loadedApts.push(doc.data());
          });
          loadedApts.sort((a, b) => a.id - b.id);
          setApartments(loadedApts);
        } else {
          initialApartments.forEach(async (apt) => {
            await setDoc(doc(db, "apartments", String(apt.id)), apt);
          });
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      }
    };
    fetchApartments();
  }, []);

  const updateApartmentInFirebase = async (updatedList: any[]) => {
    setApartments(updatedList);
    try {
      for (const apt of updatedList) {
        await setDoc(doc(db, "apartments", String(apt.id)), apt);
      }
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
    }
  };

  const handleResidentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = inputName.trim();
    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length < 3) {
      alert('⚠️ تنبيه: يجب إدخال الاسم ثلاثياً على الأقل بالعربي!');
      return;
    }

    const aptNum = Number(inputApt);
    const updated = [...apartments];

    const isNameTaken = updated.some((apt, index) => index !== (aptNum - 1) && apt.name === trimmedName);
    if (isNameTaken) {
      alert('⚠️ هذا الاسم مسجل مسبقاً لشخص آخر في العمارة، لا يمكن تكرار نفس الاسم!');
      return;
    }

    updated[aptNum - 1] = {
      ...updated[aptNum - 1],
      name: trimmedName,
      residencyStatus: 'مقيم',
    };

    updateApartmentInFirebase(updated);
    const userInfo = { name: trimmedName, apt: inputApt, isAdmin: false };
    localStorage.setItem('emara63_user', JSON.stringify(userInfo));
    setCurrentUser(userInfo);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin63') {
      const adminInfo = { name: 'المسؤول (الأدمن)', apt: '0', isAdmin: true };
      localStorage.setItem('emara63_user', JSON.stringify(adminInfo));
      setCurrentUser(adminInfo);
    } else {
      alert('⚠️ كلمة مرور المسؤول غير صحيحة!');
    }
  };

  const handleResetApp = async () => {
    if (window.confirm('هل أنت متأكد من مسح وإعادة ضبط بيانات العمارة بالكامل؟')) {
      try {
        for (const apt of initialApartments) {
          await setDoc(doc(db, "apartments", String(apt.id)), apt);
        }
        localStorage.clear();
        window.location.reload();
      } catch (error) {
        alert('حدث خطأ أثناء إعادة الضبط');
      }
    }
  };

  // الحساب المباشر والتلقائي للحصة الفردية بناءً على الموافقين
  const approvedCount = apartments.filter(apt => apt.cameraApproval === 'موافق').length;
  const totalCamerasCost = 18500;
  const costPerApprovedApt = approvedCount > 0 ? Math.round(totalCamerasCost / approvedCount) : totalCamerasCost;

  if (!currentUser) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Cairo, sans-serif', 
        direction: 'rtl', 
        background: 'linear-gradient(rgba(15, 32, 67, 0.85), rgba(37, 74, 123, 0.85)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.96)', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#1e3c72', margin: '0 0 5px 0' }}>🏢 عمارة 63</h2>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>قطاع أ - حي الصفوة - أكتوبر الجديدة</p>
          </div>

          <div style={{ display: 'flex', marginBottom: '20px', background: '#e9ecef', borderRadius: '8px', padding: '4px' }}>
            <button 
              type="button"
              onClick={() => setLoginMode('resident')}
              style={{ flex: 1, padding: '8px', background: loginMode === 'resident' ? '#007bff' : 'transparent', color: loginMode === 'resident' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              دخول ساكن
            </button>
            <button 
              type="button"
              onClick={() => setLoginMode('admin')}
              style={{ flex: 1, padding: '8px', background: loginMode === 'admin' ? '#007bff' : 'transparent', color: loginMode === 'admin' ? 'white' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              دخول مسؤول (أدمن)
            </button>
          </div>
          
          {loginMode === 'resident' ? (
            <form onSubmit={handleResidentLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>الاسم الثلاثي أو الرباعي:</label>
                <input 
                  type="text" 
                  placeholder="اكتب اسمك ثلاثياً على الأقل..." 
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>رقم الشقة:</label>
                <select 
                  value={inputApt} 
                  onChange={(e) => setInputApt(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '13px', background: 'white' }}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>شقة رقم {i + 1}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
              >
                تسجيل ودخول الداشبورد
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>كلمة مرور المسؤول (الأدمن):</label>
                <input 
                  type="password" 
                  placeholder="اكتب كلمة المرور..." 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '13px' }}
                  required
                />
              </div>
              <button 
                type="submit" 
                style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
              >
                دخول لوحة تحكم المسؤول
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', fontFamily: 'Cairo, sans-serif', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px' }}>🏢 عمارة 63 - حي الصفوة (أكتوبر الجديدة)</h1>
          <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
            {currentUser.isAdmin ? '👑 لوحة تحكم المسؤول (الأدمن)' : `مرحباً بك، ${currentUser.name} (شقة ${currentUser.apt})`}
          </p>
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

      {currentUser.isAdmin && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', fontSize: '14px', border: '1px solid #c3e6cb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span>👑 أهلاً بك يا أدمن! التعديلات تحفظ سحابياً وتظهر لكل السكان فوراً.</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              تحديث البيانات 🔄
            </button>
            <button 
              onClick={handleResetApp}
              style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              إعادة ضبط التطبيق 🗑️
            </button>
          </div>
        </div>
      )}

      {/* قسم التكلفة وتوزيعها على الموافقين فقط أوتوماتيك */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderRight: '5px solid #ffc107' }}>
        <h3 style={{ color: '#1e3c72', fontSize: '15px', margin: '0 0 8px 0' }}>📷 تكلفة سيستم الكاميرات وشفرة الباب</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
          الإجمالي المطلوب: <strong style={{ color: '#d9534f' }}>{totalCamerasCost} جنيه</strong> | 
          عدد الموافقين: <strong style={{ color: '#007bff' }}>{approvedCount} ساكن</strong> | 
          الحصة الفردية لكل موافق: <strong style={{ color: '#28a745' }}>{costPerApprovedApt} جنيه</strong>
        </p>
      </div>

      {/* جدول الداشبورد الشامل */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <h3 style={{ color: '#1e3c72', fontSize: '16px', margin: '0 0 12px 0' }}>📋 لوحة متابعة سكان عمارة 63 (الـ 24 شقة)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '13px', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#1e3c72', color: 'white' }}>
              <th style={{ padding: '10px' }}>الشقة</th>
              <th style={{ padding: '10px' }}>اسم الساكن</th>
              <th style={{ padding: '10px' }}>رقم التليفون</th>
              <th style={{ padding: '10px' }}>حالة الإقامة</th>
              <th style={{ padding: '10px' }}>موافقة الكاميرات</th>
              <th style={{ padding: '10px' }}>عداد المياه</th>
              <th style={{ padding: '10px' }}>حالة الغاز</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => {
              const hasPermission = currentUser.isAdmin || (Number(currentUser.apt) === apt.id);
              return (
                <tr key={apt.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>شقة {apt.id}</td>
                  <td style={{ padding: '10px' }}>
                    {currentUser.isAdmin ? (
                      <input 
                        type="text" 
                        value={apt.name}
                        onChange={(e) => {
                          const updated = [...apartments];
                          updated[apt.id - 1].name = e.target.value;
                          updateApartmentInFirebase(updated);
                        }}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #007bff', fontSize: '12px', width: '120px' }}
                      />
                    ) : (
                      <span style={{ fontWeight: !apt.name.includes('فارغة') ? 'bold' : 'normal', color: !apt.name.includes('فارغة') ? '#333' : '#888' }}>
                        {apt.name}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    {hasPermission ? (
                      <input 
                        type="text" 
                        value={apt.phone}
                        onChange={(e) => {
                          const updated = [...apartments];
                          updated[apt.id - 1].phone = e.target.value;
                          updateApartmentInFirebase(updated);
                        }}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', width: '90px' }}
                      />
                    ) : (
                      <span>{apt.phone}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.residencyStatus}
                      disabled={!hasPermission}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].residencyStatus = e.target.value;
                        updateApartmentInFirebase(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: hasPermission ? 'white' : '#f9f9f9', cursor: hasPermission ? 'pointer' : 'not-allowed' }}
                    >
                      <option value="مقيم">مقيم</option>
                      <option value="غير مقيم">غير مقيم</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.cameraApproval}
                      disabled={!hasPermission}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].cameraApproval = e.target.value;
                        updateApartmentInFirebase(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: hasPermission ? '#e2f0d9' : '#f9f9f9', cursor: hasPermission ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                    >
                      <option value="موافق">موافق</option>
                      <option value="غير موافق">غير موافق</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.waterMeter}
                      disabled={!hasPermission}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].waterMeter = e.target.value;
                        updateApartmentInFirebase(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: hasPermission ? 'white' : '#f9f9f9', cursor: hasPermission ? 'pointer' : 'not-allowed' }}
                    >
                      <option value="مستلم">مستلم</option>
                      <option value="لم يستلم">لم يستلم</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <select 
                      value={apt.gasStatus}
                      disabled={!hasPermission}
                      onChange={(e) => {
                        const updated = [...apartments];
                        updated[apt.id - 1].gasStatus = e.target.value;
                        updateApartmentInFirebase(updated);
                      }}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '12px', background: hasPermission ? 'white' : '#f9f9f9', cursor: hasPermission ? 'pointer' : 'not-allowed' }}
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
