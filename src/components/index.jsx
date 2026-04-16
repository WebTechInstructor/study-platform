import ReactMarkdown from 'react-markdown'

export function TopicBadge({ topicId, topics }) {
  const topic = topics?.find(t => t.id === topicId)
  if (!topic) return null
  return <span className="topic-badge">{topic.title}</span>
}

export function MarkdownRenderer({ content, className }) {
  if (!content) return null
  return <div className={`markdown ${className ?? ''}`}><ReactMarkdown>{content}</ReactMarkdown></div>
}

export function ScoreRing({ pct, size = 80, passThreshold }) {
  const r = (size / 2) - 6
  const circumference = 2 * Math.PI * r
  const offset = circumference - (pct / 100) * circumference
  const color = pct >= passThreshold ? 'var(--accent)' : 'var(--danger)'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-2)" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="500" fill="var(--text)">{Math.round(pct)}%</text>
    </svg>
  )
}

export function EmptyState({ title, message, action, onAction }) {
  return (
    <div className="empty-state">
      <p className="empty-title">{title}</p>
      <p className="empty-message">{message}</p>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  )
}

export function LoadingScreen() {
  return <div className="loading-screen"><div className="loading-spinner" /></div>
}

export function ErrorScreen({ onRetry }) {
  return (
    <div className="error-screen">
      <p className="error-title">Unable to load content</p>
      <p className="error-message">Check your connection and try again.</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  )
}
