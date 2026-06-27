import './SectionCard.css';

function SectionCard({ title, children, centered = false }) {
  return (
    <div className={`section-card ${centered ? 'section-card--centered' : ''}`}>
      {title && <h2 className="section-card__title">{title}</h2>}
      <div className="section-card__body">{children}</div>
    </div>
  );
}

export default SectionCard; 