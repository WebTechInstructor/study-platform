import { useState } from 'react'
import { MediaCard } from './MediaCard.jsx'
import { EmptyState } from '../../components/index.jsx'

const TYPE_GROUPS = [
  { type: 'podcast', label: 'Podcasts' },
  { type: 'video',   label: 'Videos'   },
  { type: 'image',   label: 'Maps'     },
  { type: 'pdf',     label: 'PDFs'     },
]

const s = {
  label: { fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, marginTop: 16 },
}

export function Media({ media, onNavigate }) {
  const [openId, setOpenId] = useState(null)

  function handleToggle(id) {
    setOpenId(prev => prev === id ? null : id)
  }

  if (!media || media.length === 0) {
    return (
      <EmptyState
        title="No media yet"
        message="Podcasts, maps, and PDFs will appear here once added to the content pack."
        action="Back to dashboard"
        onAction={() => onNavigate('dashboard')}
      />
    )
  }

  return (
    <div style={{ paddingTop: 8, paddingBottom: 32 }}>
      {TYPE_GROUPS.map(group => {
        const items = media.filter(m => m.type === group.type)
        if (items.length === 0) return null

        return (
          <div key={group.type}>
            <div style={s.label}>{group.label}</div>
            {items.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
