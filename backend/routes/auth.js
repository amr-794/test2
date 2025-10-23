const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const useragent = require('useragent');

// Helper: create student_code like S2025100001
async function generateStudentCode() {
  const [rows] = await db.query('SELECT COUNT(*) as cnt FROM students');
  const n = rows[0].cnt + 1;
  const code = 'S' + new Date().getFullYear() + String(n).padStart(6,'0');
  return code;
}

router.post('/register', async (req,res)=>{
  try{
    const { name, father_number, email, password, class_id } = req.body;
    if(!name || !password) return res.status(400).json({error:'name and password required'});
    const hashed = await bcrypt.hash(password, 10);
    const student_code = await generateStudentCode();
    const [result] = await db.query('INSERT INTO students (student_code,name,father_number,email,password_hash) VALUES (?,?,?,?,?)',
      [student_code,name,father_number,email,hashed]);
    const studentId = result.insertId;
    res.json({ ok:true, studentId, student_code });
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'server error'});
  }
});

router.post('/login', async (req,res)=>{
  try{
    const { username, password, role } = req.body; // role: 'admin' or 'student'
    if(role === 'admin'){
      const [rows] = await db.query('SELECT * FROM admins WHERE username=?', [username]);
      if(!rows.length) return res.status(401).json({error:'invalid'});
      const admin = rows[0];
      const match = await bcrypt.compare(password, admin.password_hash);
      if(!match) return res.status(401).json({error:'invalid'});
      const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET || 'secret', {expiresIn:'12h'});
      return res.json({ token, role:'admin' });
    } else {
      const [rows] = await db.query('SELECT * FROM students WHERE (email=? OR student_code=?)', [username, username]);
      if(!rows.length) return res.status(401).json({error:'invalid'});
      const student = rows[0];
      const match = await bcrypt.compare(password, student.password_hash);
      if(!match) return res.status(401).json({error:'invalid'});
      const token = jwt.sign({ id: student.id, role: 'student' }, process.env.JWT_SECRET || 'secret', {expiresIn:'12h'});
      // log ip & device
      const agent = useragent.parse(req.headers['user-agent']);
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await db.query('INSERT INTO logs_login (student_id,ip,device_info,user_agent) VALUES (?,?,?,?)',
        [student.id, ip, agent.toString(), req.headers['user-agent']]);
      return res.json({ token, role:'student', student_code: student.student_code });
    }
  }catch(err){
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

module.exports = router;
