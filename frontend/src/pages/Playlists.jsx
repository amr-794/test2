import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function Playlists(){
  const [lists,setLists]=useState([]);
  useEffect(()=>{ axios.get(import.meta.env.VITE_API_BASE + '/videos/playlists').then(r=>setLists(r.data)).catch(()=>{}) },[]);
  return (<div className="card"><h3>قوائم التشغيل</h3>
    {lists.map(pl=> <div key={pl.id} style={{marginBottom:12}}><h4>{pl.title} <small>({pl.class_name||'عام'})</small></h4>
      <div>{pl.videos.map(v=> <div key={v.id}><Link to={'/player/'+v.id}>{v.title}</Link> {v.is_free?'<مجانا>':''}</div>)}</div></div>)}
  </div>);
}
