import { useState } from 'react'
import { MediaCard } from './MediaCard.jsx'
import { EmptyState } from '../../components/index.jsx'

const GROUPS = [{ type:'podcast', label:'Podcasts' }, { type:'video', label:'Videos' }, { type:'image', label:'Maps' }, { type:'pdf', label:'PDFs' }]

export function Media({ media, onNavigate }) {
  const [openId, setOpenId] = useState(null)
  if (!media?.length) return <EmptyState title="No media yet" message="Podcasts, maps, and PDFs will appear here once added." action="Back to dashboard" onAction={() => onNavigate('dashboard')} />
  return (
    <div style={{ paddingTop: 8, paddingBottom: 40 }}>
      {GROUPS.map(group => {
        const items = media.filter(m => m.type === group.type)
        if (!items.length) return null
        return (
          <div key={group.type}>
            <div className="section-label">{group.label}</div>
            {items.map(item => <MediaCard key={item.id} item={item} isOpen={openId===item.id} onToggle={() => setOpenId(p => p===item.id ? null : item.id)} />)}
          </div>
        )
      })}
    </div>
  )
}
