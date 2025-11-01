import { useState } from "react";
import AddChoice from "../components/AddChoice";
import AddModal from "../components/AddModal";

export default function Services() {
  const [open, setOpen] = useState(false);        // dropdown open/close
  const [modalOpen, setModalOpen] = useState(false); // modal open/close
  const [selected, setSelected] = useState("");   // selected choice

  const handleSelect = (choice) => {
    setSelected(choice);
    setOpen(false);
    setModalOpen(true);
  };

  const choices = ["Category", "Service"]; // categories for services

  return (
    <>
      <div className="same-row">
        <h1>Dental Services</h1>
        <div style={{ position: "relative" }}>
          <button className="btn-add" onClick={() => setOpen((prev) => !prev)}>+</button>
          {open && (
            <AddChoice
              choices={choices}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <AddModal
          selected={selected}
          choices={choices}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
