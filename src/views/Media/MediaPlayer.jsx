import { useState, useRef } from 'react'

function AudioPlayer({ item }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  function togglePlay() { if (!audioRef.current) return; playing ? audioRef.current.pause() : audioRef.current.play(); setPlaying(p=>!p) }
  function handleTimeUpdate() { if (!audioRef.current) return; const p=(audioRef.current.currentTime/audioRef.current.duration)*100; setProgress(isNaN(p)?0:p); setCurrentTime(audioRef.current.currentTime) }
  function handleScrub(e) { if (!audioRef.current) return; audioRef.current.currentTime = (e.nativeEvent.offsetX/e.currentTarget.offsetWidth)*audioRef.current.duration }
  function fmt(s) { if(isNaN(s))return'0:00'; return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}` }

  return (
    <div className="player-wrap">
      <audio ref={audioRef} src={item.url} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
      <div className="player-title">{item.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="play-btn" onClick={togglePlay}>
          {playing
            ? <span style={{ display:'flex', gap:3 }}><span style={{ width:3,height:12,background:'var(--text)',borderRadius:1 }}/><span style={{ width:3,height:12,background:'var(--text)',borderRadius:1 }}/></span>
            : <span style={{ width:0,height:0,borderStyle:'solid',borderWidth:'6px 0 6px 10px',borderColor:'transparent transparent transparent var(--text)',marginLeft:2 }}/>}
        </button>
        <div style={{ flex: 1 }}>
          <div className="scrub-track" onClick={handleScrub}><div className="scrub-fill" style={{ width: `${progress}%` }} /></div>
          <div className="scrub-times"><span>{fmt(currentTime)}</span><span>{item.durationMins ?? 0}:00</span></div>
        </div>
      </div>
      {item.sourceType !== 'self-hosted' && <div className="source-badge">via {item.sourceType}</div>}
    </div>
  )
}

function EmbedPlayer({ item }) {
  const url = item.sourceType === 'youtube' ? item.url.replace('watch?v=','embed/') : item.url.replace('open.spotify.com/','open.spotify.com/embed/')
  return <div style={{ borderTop: '0.5px solid var(--border)' }}><iframe src={url} width="100%" height={item.sourceType==='youtube'?200:152} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen" style={{ display:'block' }} title={item.title} /></div>
}

function MapPreview({ item }) {
  return (
    <div style={{ borderTop: '0.5px solid var(--border)' }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
        <img
          src={item.url}
          alt={item.title}
          style={{ width: '100%', display: 'block', maxHeight: 320, objectFit: 'contain', background: 'var(--bg-raised)' }}
          onError={e => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
        <div style={{ display: 'none', height: 120, alignItems: 'center', justifyContent: 'center', background: 'var(--bg-raised)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Image unavailable</span>
        </div>
      </a>
      <div style={{ display: 'flex', gap: 6, padding: '10px 14px', borderTop: '0.5px solid var(--border)' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:'8px 0', textAlign:'center', fontSize:12, borderRadius:'var(--radius-md)', border:'0.5px solid var(--border-2)', background:'var(--bg-card)', color:'var(--text)', textDecoration:'none' }}>Open full screen</a>
        <a href={item.url} download style={{ flex:1, padding:'8px 0', textAlign:'center', fontSize:12, borderRadius:'var(--radius-md)', border:'0.5px solid var(--border-2)', background:'var(--bg-card)', color:'var(--text)', textDecoration:'none' }}>Download</a>
      </div>
    </div>
  )
}

function PdfActions({ item }) {
  return (
    <div style={{ display:'flex', gap:6, padding:'10px 14px', borderTop:'0.5px solid var(--border)', background:'var(--bg-raised)' }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:'9px 0', textAlign:'center', fontSize:12, borderRadius:'var(--radius-md)', border:'0.5px solid var(--border-2)', background:'var(--bg-card)', color:'var(--text)', textDecoration:'none' }}>Open in browser</a>
      <a href={item.url} download style={{ flex:1, padding:'9px 0', textAlign:'center', fontSize:12, borderRadius:'var(--radius-md)', border:'none', background:'var(--info-bg)', color:'var(--info-text)', textDecoration:'none', fontWeight:500 }}>Download PDF</a>
    </div>
  )
}

export function MediaPlayer({ item }) {
  switch (item.sourceType) {
    case 'spotify': case 'youtube': return <EmbedPlayer item={item} />
    case 'self-hosted': return item.type === 'podcast' ? <AudioPlayer item={item} /> : <MapPreview item={item} />
    case 'pdf': return <PdfActions item={item} />
    default: return item.type === 'pdf' ? <PdfActions item={item} /> : <MapPreview item={item} />
  }
}
