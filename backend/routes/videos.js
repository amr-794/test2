const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Simple multer for small files (thumbnails etc.)
const upload = multer({ dest: path.join(UPLOAD_DIR,'tmp') });

// Create playlist
router.post('/playlist', async (req,res)=>{
  try{
    const { title, class_id, cover_image } = req.body;
    const [r] = await db.query('INSERT INTO playlists (class_id,title,cover_image) VALUES (?,?,?)', [class_id,title,cover_image]);
    res.json({ ok:true, id: r.insertId });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Add video metadata (embed/link/upload)
router.post('/', async (req,res)=>{
  try{
    const { playlist_id, title, description, type, source, thumbnail, is_free } = req.body;
    const [r] = await db.query('INSERT INTO videos (playlist_id,title,description,type,source,thumbnail,is_free) VALUES (?,?,?,?,?,?)',
      [playlist_id,title,description,type,source,thumbnail, is_free?1:0]);
    res.json({ ok:true, id: r.insertId });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Chunk upload start (client will send uploadId, chunkIndex, totalChunks)
router.post('/upload-chunk', upload.single('chunk'), async (req,res)=>{
  try{
    const { uploadId, chunkIndex, filename } = req.body;
    if(!uploadId || typeof chunkIndex === 'undefined') return res.status(400).json({error:'missing fields'});
    const tmpPath = req.file.path;
    // store chunk metadata
    await db.query('INSERT INTO uploads_chunks (upload_id,chunk_index,filename,tmp_path) VALUES (?,?,?,?)',
      [uploadId, parseInt(chunkIndex), filename, tmpPath]);
    res.json({ ok:true });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// Complete upload: merge chunks
router.post('/upload-complete', async (req,res)=>{
  try{
    const { uploadId, filename } = req.body;
    const [rows] = await db.query('SELECT * FROM uploads_chunks WHERE upload_id=? ORDER BY chunk_index ASC', [uploadId]);
    if(!rows.length) return res.status(400).json({error:'no chunks'});
    const finalPath = path.join(UPLOAD_DIR, filename);
    const writeStream = fs.createWriteStream(finalPath, { flags: 'w' });
    for(const r of rows){
      const buf = fs.readFileSync(r.tmp_path);
      writeStream.write(buf);
      // remove chunk file
      fs.unlinkSync(r.tmp_path);
    }
    writeStream.end();
    // remove DB chunk records
    await db.query('DELETE FROM uploads_chunks WHERE upload_id=?', [uploadId]);
    res.json({ ok:true, path: finalPath });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

// List playlists + videos (public)
router.get('/playlists', async (req,res)=>{
  try{
    const [pl] = await db.query('SELECT p.*, c.name as class_name FROM playlists p LEFT JOIN classes c ON p.class_id=c.id');
    for(const p of pl){
      const [vids] = await db.query('SELECT * FROM videos WHERE playlist_id=?', [p.id]);
      p.videos = vids;
    }
    res.json(pl);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'})}
});

module.exports = router;
