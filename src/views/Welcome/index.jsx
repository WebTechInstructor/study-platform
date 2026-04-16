export function Welcome({ subject, onStart }) {
  return (
    <div className="welcome">
      {subject.heroImage && <img src={subject.heroImage} className="welcome-hero" alt="" aria-hidden="true" />}
      <h1 className="welcome-title">{subject.title}</h1>
      <p className="welcome-description">{subject.description}</p>
      <div className="welcome-meta">
        <span>{subject.topics.length} topics</span>
        <span>Pass mark: {subject.passThreshold}%</span>
        <span>Exam: {subject.examDurationMins} min</span>
      </div>
      <button className="welcome-cta" onClick={onStart}>Start studying</button>
    </div>
  )
}
