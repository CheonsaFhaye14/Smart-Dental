import "./PageSpinner.css";

export default function PageSpinner() {
  return (
    <div className="page-spinner">
      <div className="page-spinner__circle" />
      <span className="page-spinner__text">Loading...</span>
    </div>
  );
}