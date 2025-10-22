const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const path = require('path');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

const PORT = process.env.PORT || 4000;

// --- auto-init default admin on startup ---
const bcrypt = require('bcrypt');
(async function ensureDefaultAdmin(){
  try{
    const pool = require('./db');
    const username = 'amr';
    const password = '123456';
    const [rows] = await pool.query('SELECT * FROM admins WHERE username=?', [username]);
    if(rows.length === 0){
      const hash = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO admins (username, password_hash) VALUES (?,?)', [username, hash]);
      console.log('Default admin created: amr / 123456');
    } else {
      console.log('Default admin already exists.');
    }
  }catch(e){
    console.error('Could not ensure default admin (DB might not be ready):', e.message || e);
  }
})();
// --- end auto-init ---
app.listen(PORT, ()=> console.log('Server running on', PORT));
