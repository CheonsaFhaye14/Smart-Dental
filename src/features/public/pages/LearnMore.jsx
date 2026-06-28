import './LearnMore.css';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import SectionCard from '../../../components/ui/SectionCard';

function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="learnmore-container">

      {/* Page header */}
      <div className="learnmore-header">
        <span className="learnmore-badge">✦ Smart Dental Clinic</span>
        <h1 className="learnmore-title">Everything You Need to Know</h1>
        <p className="learnmore-subtitle">
          Modern dental care powered by 3D visualization, smart scheduling, and secure records.
        </p>
      </div>

      {/* 2-column card grid */}
      <div className="learnmore-grid">
        <SectionCard title="Our Mission">
          <p>
            At Smart Dental Clinic, we aim to make dental care interactive, easy, and
            understandable for everyone. Our 3D visualization system lets patients see
            treatments before they happen and understand their oral health better.
          </p>
        </SectionCard>

        <SectionCard title="General Objective">
          <p>
            To develop an efficient dental management system that facilitates appointment
            scheduling, patient record management, and total payment tracking — while
            utilizing 3D Model dental visualization.
          </p>
        </SectionCard>

        {/* Specific objectives spans full width */}
        <div className="learnmore-full">
          <SectionCard title="Specific Objectives">
            <ul>
              <li>Create a secure and easy-to-use system for managing and storing patient records, ensuring quick access and accuracy of information.</li>
              <li>Develop a feature that simplifies scheduling appointments and sending reminders to patients and staff, reducing missed appointments.</li>
              <li>Add 3D Model dental visualization technology, allowing patients to see "before and after" images of treatments, improving understanding of procedures.</li>
              <li>Build a payment tracking feature that records and monitors all patient transactions for organized financial management.</li>
            </ul>
          </SectionCard>
        </div>
      </div>

      {/* CTA full width */}
      <div className="learnmore-cta">
        <SectionCard title="Ready to Get Started?" centered>
          <p>Download our app now and explore your 3D dental experience!</p>
          <Button text="Download the App" onClick={() => navigate('/downloadapp')} />
        </SectionCard>
      </div>

    </div>
  );
}

export default LearnMore;