import './GlobalSpinner.css';

function GlobalSpinner() {
  return (
    <div className="global-spinner-overlay">
      <div className="global-spinner">
        <div className="spinner-cloud">
          <span className="spinner-sparkle s1">✦</span>
          <span className="spinner-sparkle s2">✦</span>
          <span className="spinner-sparkle s3">✦</span>
          <div className="cloud-body"></div>
          <div className="cloud-blush left"></div>
          <div className="cloud-blush right"></div>
          <div className="cloud-face">
            <span className="cloud-eye"></span>
            <span className="cloud-eye"></span>
          </div>
        </div>
        <p className="spinner-text">
          Loading
          <span className="spinner-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default GlobalSpinner;