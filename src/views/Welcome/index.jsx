export function Welcome({ subject, onStart }) {
  const steps = [
    { num: '1', label: 'Pick a topic', desc: 'Choose from regions, techniques, or tasting methodology' },
    { num: '2', label: 'Study your way', desc: 'Practice quizzes, flashcards, maps, and media' },
    { num: '3', label: 'Track progress', desc: 'See where you\'re strong and where to focus next' },
  ]

  return (
    <div className="welcome">
      {subject.heroImage && (
        <img src={subject.heroImage} className="welcome-hero" alt="" aria-hidden="true" />
      )}
      <h1 className="welcome-title">{subject.title}</h1>
      <p className="welcome-description">{subject.description}</p>

      <div className="welcome-steps">
        {steps.map(step => (
          <div key={step.num} className="welcome-step">
            <div className="welcome-step-num">{step.num}</div>
            <div>
              <div className="welcome-step-label">{step.label}</div>
              <div className="welcome-step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="welcome-meta">
        <span>{subject.topics.filter(t => !t.parentId).length} topics</span>
        <span>Pass mark: {subject.passThreshold}%</span>
        <span>Exam: {subject.examDurationMins} min</span>
      </div>

      <button className="welcome-cta" onClick={onStart}>Start studying</button>
    </div>
  )
}
