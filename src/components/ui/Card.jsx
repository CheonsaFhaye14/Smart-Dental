import './Card.css';

function Card({ children, className = "", maxWidth }) {
  return (
    <div
      className={`ui-card ${className}`}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </div>
  );
}

export default Card;