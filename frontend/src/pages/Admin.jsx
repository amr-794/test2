import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function Admin(){
  const [students,setStudents]=useState([]);
  useEffect(()=>{ fetchList(); },[]);
  async function fetchList(){
    const base = import.meta.env.VITE_API_BASE;
    const res = await axios.get(base + '/admin/students');
    setStudents(res.data);
  }
  return (<div className="grid">
    <div className="card">
      <h3>لوحة الأدمن</h3>
      <p>هنا تحكم الطلاب، إنشاء قوائم تشغيل، رفع محاضرات، أنظمة الاختبارات، وغيرها.</p>
      <h4>الطلاب</h4>
      <table style={{width:'100%'}}><thead><tr><th>كود</th><th>الاسم</th><th>بريد</th></tr></thead>
        <tbody>{students.map(s=> <tr key={s.id}><td>{s.student_code}</td><td>{s.name}</td><td>{s.email}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="card">
      <h4>إجراءات سريعة</h4>
      <p>بدء admin default: <a className="btn" href="#" onClick={async (e)=>{ e.preventDefault(); await axios.get(import.meta.env.VITE_API_BASE + '/admin/init-default-admin'); alert('default admin created'); }}>إنشاء amr/123456</a></p>
      <p>ملاحظة: غير كلمة المرور بعد ذلك من الإعدادات</p>
    </div>
  </div>);
}
