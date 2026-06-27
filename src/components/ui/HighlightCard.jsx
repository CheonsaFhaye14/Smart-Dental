import './HighlightCard.css';

const HighlightCard = ({ icon, title, desc }) => (
  <div className="highlight-card">
    <span className="card-icon">
      <i className={`ti ${icon}`} aria-hidden="true" />
    </span>
    <div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  </div>
);

export default HighlightCard;