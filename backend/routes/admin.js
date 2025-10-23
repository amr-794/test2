const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Simple middleware to protect admin routes using Basic token (improvement: JWT)
// For brevity we skip middleware here and assume protected by other means in production.

// Initialize default admin (run once)
router.get('/init-default-admin', async (req,res)=>{
  try{
    const username = 'amr';
    const password = '123456';
    const [rows] = await db.query('SELECT * FROM admins WHERE username=?', [username]);
    if(rows.length) return res.json({ ok:true, message:'already exists' });
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO admins (username,password_hash) VALUES (?,?)', [username,hash]);
    res.json({ ok:true, username, password });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Get students list
router.get('/students', async (req,res)=>{
  try{
    const [rows] = await db.query('SELECT id,student_code,name,email,created_at FROM students');
    res.json(rows);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Get student details + last login logs
router.get('/student/:id', async (req,res)=>{
  try{
    const id = req.params.id;
    const [[student]] = await db.query('SELECT id,student_code,name,email,created_at FROM students WHERE id=?', [id]);
    const [logs] = await db.query('SELECT * FROM logs_login WHERE student_id=? ORDER BY created_at DESC LIMIT 10', [id]);
    res.json({ student, logs });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Change admin password
router.post('/change-admin-password', async (req,res)=>{
  try{
    const { username, new_password } = req.body;
    const hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE admins SET password_hash=? WHERE username=?', [hash, username]);
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Change student password (admin action)
router.post('/change-student-password', async (req,res)=>{
  try{
    const { student_id, new_password } = req.body;
    const hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE students SET password_hash=? WHERE id=?', [hash, student_id]);
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Manage access codes (create)
router.post('/codes', async (req,res)=>{
  try{
    const { code, video_id, created_by_admin } = req.body;
    const [r] = await db.query('INSERT INTO access_codes (code,video_id,created_by_admin) VALUES (?,?,?)', [code,video_id,created_by_admin]);
    res.json({ ok:true, id: r.insertId });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

module.exports = router;
