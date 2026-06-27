import React from "react";
import './DownloadApp.css';
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function DownloadApp() {
  return (
    <div className="download-container">
      <div className="download-wrapper">
        <Card className="download-card">

          <div className="download-icon" aria-hidden="true">
            <i className="ti ti-device-mobile" />
          </div>

          <h1>Get the Smart Dental App</h1>
          <p>
            Experience 3D dental visualization, manage appointments, and keep
            your records safe — all in one app!
          </p>

          <div className="download-buttons">
            <Button
              text="⬇ Download the App"
              href="https://drive.google.com/uc?export=download&id=1maTYnsjtd7mITpMNHpcKSy5YWaKTbD0-"
              variant="primary"
            />
          </div>

          <p className="note">*Available on mobile devices only</p>

        </Card>
      </div>
    </div>
  );
}

export default DownloadApp;