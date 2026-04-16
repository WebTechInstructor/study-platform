import { MediaPlayer } from './MediaPlayer.jsx'

const TYPE_CONFIG = {
  podcast: { bg: 'var(--warn-bg)',   dot: 'var(--warn)'   },
  image:   { bg: 'var(--accent-bg)', dot: 'var(--accent)' },
  pdf:     { bg: 'var(--danger-bg)', dot: 'var(--danger)' },
  video:   { bg: 'var(--info-bg)',   dot: 'var(--info)'   },
}

export function MediaCard({ item, isOpen, onToggle }) {
  const c = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.podcast
  return (
    <div className="media-card">
      <div className="media-row" onClick={onToggle}>
        <div className="media-icon" style={{ background: c.bg }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="media-title">{item.title}</div>
          <div className="media-meta">
            {item.durationMins && <><span>{item.durationMins} min</span><span style={{ width:3,height:3,borderRadius:'50%',background:'var(--text-3)',display:'inline-block' }} /></>}
            <span className="topic-badge">{item.tags?.[0] ?? item.type}</span>
          </div>
        </div>
        <div className={`media-arrow ${isOpen ? 'open' : ''}`}>›</div>
      </div>
      {isOpen && <MediaPlayer item={item} />}
    </div>
  )
}
