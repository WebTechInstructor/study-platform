import { useState } from 'react'
import { MediaPlayer } from './MediaPlayer.jsx'

function TypeIcon({ type }) {
  const configs = {
    podcast: { bg: '#faeeda', dot: '#ba7517' },
    image:   { bg: '#eaf3de', dot: '#639922' },
    pdf:     { bg: '#fcebeb', dot: '#e24b4a' },
    video:   { bg: '#eeedfe', dot: '#534ab7' },
  }
  const c = configs[type] ?? configs.podcast
  return (
    <div style={{ width: 36, height: 36, borderRadius: 8, background: c.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot }} />
    </div>
  )
}

export function MediaCard({ item, isOpen, onToggle }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, marginBottom: 6, overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = '#f7f6f3'}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
      >
        <TypeIcon type={item.type} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.title}
          </div>
          <div style={{ fontSize: 11, color: '#888', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.durationMins && <span>{item.durationMins} min</span>}
            {item.durationMins && <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ccc', display: 'inline-block' }} />}
            <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 20, background: '#e6f1fb', color: '#185fa5' }}>
              {item.tags?.[0] ?? item.type}
            </span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#ccc', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>
          ›
        </div>
      </div>

      {isOpen && <MediaPlayer item={item} />}
    </div>
  )
}
