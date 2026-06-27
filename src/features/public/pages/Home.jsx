import './Home.css';
import { useNavigate } from 'react-router-dom';
import HighlightCard from '../../../components/ui/HighlightCard';
import Button from '../../../components/ui/Button';

const highlights = [
  {
    icon: 'ti-3d-cube-sphere',
    title: '3D Dental Visualization',
    desc: 'See your dental treatments in interactive 3D models for a clear and engaging experience.',
  },
  {
    icon: 'ti-calendar-check',
    title: 'Quick & Easy Appointments',
    desc: 'Book, manage, and track your appointments directly from your device without hassle.',
  },
  {
    icon: 'ti-shield-check',
    title: 'Safe & Organized Records',
    desc: 'All your dental records are stored securely and easily accessible anytime.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-wrapper">         {/* ← handles vertical centering */}
        <div className="home-content">

          <section className="hero">
            <i className="ti ti-tooth hero-icon" aria-hidden="true" />
            <span className="badge">✦ New 3D Experience</span>
            <h1>Welcome to Smart Dental Clinic</h1>
            <p className="subtitle">
              Experience dental care like never before with our 3D dental visualization system!
            </p>
            <Button
              text="Get the App"
              onClick={() => navigate('/download')}
            />
          </section>

          <section className="highlights">
            {highlights.map((h) => (
              <HighlightCard key={h.title} {...h} />
            ))}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Home;