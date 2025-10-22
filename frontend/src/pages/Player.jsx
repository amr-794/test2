import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export default function Player(){
  const { id } = useParams();
  const [video,setVideo]=useState(null);
  useEffect(()=>{ axios.get(import.meta.env.VITE_API_BASE + '/videos/playlists').then(r=>{
    // simple find
    const all = r.data.flatMap(p=>p.videos.map(v=>v));
    const v = all.find(x=>String(x.id)===id);
    setVideo(v);
  })},[id]);
  if(!video) return <div className="card">جار التحميل...</div>;
  return (<div className="card"><h3>{video.title}</h3>
    {video.type==='embed' ? <div dangerouslySetInnerHTML={{__html: video.source}} /> :
      (video.type==='link' ? <iframe src={video.source} style={{width:'100%',height:480}} /> : <video controls src={video.source} style={{width:'100%'}} />)}
    <p>{video.description}</p>
  </div>);
}
