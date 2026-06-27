import "./PublicFooter.css";

function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Smart Dental Clinic.
          All rights reserved.
        </p>

        <p>
          Contact Us:
          <a href="mailto:toothpixo0o@gmail.com">
            {" "}toothpixo0o@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default PublicFooter;