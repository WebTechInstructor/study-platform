import { useState, useRef } from 'react'

function AudioPlayer({ item }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)

  function togglePlay() {
    if (!audioRef.current) return
    playing ? audioRef.current.pause() : audioRef.current.play()
    setPlaying(p => !p)
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100
    setProgress(isNaN(pct) ? 0 : pct)
    setCurrentTime(audioRef.current.currentTime)
  }

  function handleScrub(e) {
    if (!audioRef.current) return
    const pct = e.nativeEvent.offsetX / e.currentTarget.offsetWidth
    audioRef.current.currentTime = pct * audioRef.current.duration
  }

  function formatTime(secs) {
    if (isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const totalMins = item.durationMins ?? 0
  const totalLabel = `${totalMins}:00`

  return (
    <div style={{ padding: '12px 13px', borderTop: '0.5px solid rgba(0,0,0,0.08)', background: '#f7f6f3' }}>
      <audio
        ref={audioRef}
        src={item.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>{item.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={togglePlay}
          style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          {playing
            ? <span style={{ display: 'flex', gap: 3 }}><span style={{ width: 3, height: 12, background: '#1a1a1a', borderRadius: 1 }} /><span style={{ width: 3, height: 12, background: '#1a1a1a', borderRadius: 1 }} /></span>
            : <span style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '6px 0 6px 10px', borderColor: 'transparent transparent transparent #1a1a1a', marginLeft: 2 }} />
          }
        </button>
        <div style={{ flex: 1 }}>
          <div
            onClick={handleScrub}
            style={{ height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 5, cursor: 'pointer' }}
          >
            <div style={{ height: '100%', width: `${progress}%`, background: '#185fa5', borderRadius: 2, transition: 'width 0.1s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{totalLabel}</span>
          </div>
        </div>
      </div>
      {item.sourceType !== 'self-hosted' && (
        <div style={{ marginTop: 8, fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f0eeea', color: '#888', display: 'inline-block', border: '0.5px solid rgba(0,0,0,0.1)' }}>
          via {item.sourceType}
        </div>
      )}
    </div>
  )
}

function EmbedPlayer({ item }) {
  const embedUrl = item.sourceType === 'youtube'
    ? item.url.replace('watch?v=', 'embed/')
    : item.url.replace('open.spotify.com/', 'open.spotify.com/embed/')

  return (
    <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <iframe
        src={embedUrl}
        width="100%"
        height={item.sourceType === 'youtube' ? 200 : 152}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ display: 'block' }}
        title={item.title}
      />
    </div>
  )
}

function MapPreview({ item }) {
  return (
    <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
      <div style={{ height: 160, background: '#f0eeea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 12, color: '#888' }}>Map preview</span>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '10px 13px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, padding: '8px 0', textAlign: 'center', fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', color: '#1a1a1a', textDecoration: 'none' }}>
          Open full screen
        </a>
        <a href={item.url} download
          style={{ flex: 1, padding: '8px 0', textAlign: 'center', fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', color: '#1a1a1a', textDecoration: 'none' }}>
          Download
        </a>
      </div>
    </div>
  )
}

function PdfActions({ item }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '10px 13px', borderTop: '0.5px solid rgba(0,0,0,0.08)', background: '#f7f6f3' }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer"
        style={{ flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', color: '#1a1a1a', textDecoration: 'none' }}>
        Open in browser
      </a>
      <a href={item.url} download
        style={{ flex: 1, padding: '9px 0', textAlign: 'center', fontSize: 12, borderRadius: 8, border: 'none', background: '#e6f1fb', color: '#185fa5', textDecoration: 'none', fontWeight: 500 }}>
        Download PDF
      </a>
    </div>
  )
}

export function MediaPlayer({ item }) {
  switch (item.sourceType) {
    case 'spotify':
    case 'youtube':
      return <EmbedPlayer item={item} />
    case 'self-hosted':
      return item.type === 'podcast' ? <AudioPlayer item={item} /> : <MapPreview item={item} />
    case 'pdf':
      return <PdfActions item={item} />
    case 'image':
    default:
      return item.type === 'pdf' ? <PdfActions item={item} /> : <MapPreview item={item} />
  }
}
