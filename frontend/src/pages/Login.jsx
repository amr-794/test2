import React, {useState} from 'react';
import axios from 'axios';
export default function Login(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('student');
  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post(import.meta.env.VITE_API_BASE + '/auth/login', { username, password, role });
      alert('Logged in as ' + res.data.role);
      localStorage.setItem('token', res.data.token);
      if(res.data.role==='admin') window.location.href='/admin';
      else window.location.href='/student';
    }catch(err){ alert('Login failed'); console.error(err) }
  }
  return (<div className="card">
    <h3>تسجيل الدخول</h3>
    <form onSubmit={submit}>
      <div><label>اسم المستخدم/البريد/كود: <input value={username} onChange={e=>setUsername(e.target.value)} /></label></div>
      <div><label>كلمة المرور: <input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label></div>
      <div>
        <label><input type="radio" name="role" checked={role==='student'} onChange={()=>setRole('student')} /> طالب</label>
        <label style={{marginLeft:12}}><input type="radio" name="role" checked={role==='admin'} onChange={()=>setRole('admin')} /> أدمن</label>
      </div>
      <div style={{marginTop:12}}><button className="btn">دخول</button></div>
    </form>
  </div>);
}
