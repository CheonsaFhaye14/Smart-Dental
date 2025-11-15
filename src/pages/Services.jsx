import { useState, useEffect } from "react";
import AddChoice from "../components/AddChoice";
import AddModal from "../components/AddModal";
import ExpandableTable from "../components/ExpandableTable"; // ✅ services table
import { serviceFieldTemplates } from "../data/ServicesfieldTemplates";
import { getAllServices } from "../services/getAllServicesApi";
import { useAdminAuth } from "../hooks/useAdminAuth";
import MessageModal from "../components/MessageModal";
import QuestionModal from "../components/QuestionModal";
import EditModal from "../components/EditModal";
import { editCategory, editService } from "../services/EditServicesApi"; // or wherever your file is
import { addCategory, addService } from "../services/AddServicesApi";

export default function Services() {
  const [open, setOpen] = useState(false);        // dropdown open/close
  const [modalOpen, setModalOpen] = useState(false); // modal open/close
  const [selected, setSelected] = useState("");   // selected choice
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "success" or "error"
  const { token } = useAdminAuth(); // get token from context
const [refreshKey, setRefreshKey] = useState(0);
  const [editData, setEditData] = useState(null); // Data to edit
   const [editModalOpen, setEditModalOpen] = useState(false); // For EditModal

  // ✅ state for services list
  const [services, setServices] = useState([]);
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
const mainColumns = [
    { header: "Category", accessor: "name" },
  ];
  const serviceColumns = [
    {
      header: "Service Name",
      accessor: "name",
     render: (row) => capitalize(row.name || "Unknown")
    },
    { 
      header: "Price", 
      accessor: "price",
      render: (row) => row.price || "Unknown"
    },
  ];
  const handleSelect = (choice) => {
    setSelected(choice);
    setOpen(false);
    setModalOpen(true);
  };

  const choices = ["Category", "Service"]; // add menu choices

useEffect(() => { 
  if (!token) return;

  const fetchServices = async (currentToken) => {
    setLoading(true);
    setError("");
    console.log("🔄 Starting fetchServices...");

    try {
      const res = await getAllServices(currentToken);
      if (!res.success) {
        setError(res.message);
        return;
      }

      const grouped = res.data;
      setServices(grouped);

      // Category modal
      const noCategory = grouped.find(cat => cat.name === "No Category");
      const unlinkedServices = noCategory?.services || [];
      const categoryField = serviceFieldTemplates.Category.find(f => f.name === "services");
      if (categoryField) {
        categoryField.options = unlinkedServices.map(s => ({
          label: s.name,
          value: s.id ?? s.name,
        }));
      }

      // Service modal
      const serviceCategoryField = serviceFieldTemplates.Service.find(f => f.name === "category");
      if (serviceCategoryField) {
        serviceCategoryField.options = grouped
          .filter(cat => cat.name !== "No Category")
          .map(cat => ({
            label: cat.name,
            value: cat.id ?? cat.name,
          }));
      }

    } catch (err) {
      setError("Failed to fetch services.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchServices(token);
}, [token, refreshKey]); // ✅ now stable

const handleModalSubmit = async (formValues) => {
  if (!token) {
    console.warn("No token available for adding category/service");
    setMessageType("error");
    setMessage("You must be logged in as admin.");
    return;
  }

  console.log("📄 Raw form values before processing:", formValues);

  // Determine table type
  let tableType;
  if ("services" in formValues) tableType = "category";
  else if ("categories" in formValues || "price" in formValues) tableType = "service";
  else {
    console.error("Unable to determine table type:", formValues);
    setMessageType("error");
    setMessage("Invalid form submission.");
    return;
  }

  console.log("📌 Determined table type:", tableType);

 // ===================== CATEGORY =====================
if (tableType === "category") {
  try {
    let servicesArray = null;

    if (formValues.services) {
      if (Array.isArray(formValues.services) && formValues.services.length > 0) {
        servicesArray = formValues.services.map(s => (typeof s === "number" ? s : s.value));
      } else if (typeof formValues.services === "number" || formValues.services.value) {
        servicesArray = [typeof formValues.services === "number" ? formValues.services : formValues.services.value];
      }
    }

    // Build payload
    const newCategoryData = { name: formValues.name };
    if (servicesArray) newCategoryData.services = servicesArray; // only send if not null

    console.log("🟢 Processed data to send for CATEGORY:", newCategoryData);

    const res = await addCategory(token, newCategoryData);
    console.log("🟣 API Response (Category):", res);

    if (res.success) {
      setMessageType("success");
      setMessage("✅ Category added successfully!");
      setModalOpen(false);
      setRefreshKey(prev => prev + 1);
    } else {
      setMessageType("error");
      setMessage(res.message || "Something went wrong.");
    }
  } catch (err) {
    console.error("❌ handleAddCategory error:", err);
    setMessageType("error");
    setMessage("Failed to add category.");
  }
}
else if (tableType === "service") {
  try {
    // Normalize category ID
    let categoryId = null;
    if (formValues.category) {
      // formValues.category could be a string from FormData
      if (!isNaN(Number(formValues.category))) {
        categoryId = Number(formValues.category);
      }
    }

    // Normalize numeric fields
    const price = parseFloat(formValues.price) || 0;
    const installmentTimes = parseInt(formValues.installment_times) || 0;
    const customIntervalDays = formValues.installment_interval === "custom"
      ? parseInt(formValues.custom_interval_days) || null
      : null;

    // Build service data dynamically
    const newServiceData = {
      name: formValues.name,
      description: formValues.description || null,
      price: price,
      allow_installment: formValues.allow_installment === "yes",
      installment_times: installmentTimes,
      installment_interval: formValues.installment_interval || null,
      custom_interval_days: customIntervalDays,
      // Only include categories if a valid ID exists
      ...(categoryId && { categories: categoryId }),
    };

    console.log("🟢 Processed data to send for SERVICE:", newServiceData);

    const res = await addService(token, newServiceData);
    console.log("🟣 API Response (Service):", res);

    if (res.success) {
      setMessageType("success");
      setMessage("✅ Service added successfully!");
      setModalOpen(false);
      setRefreshKey(prev => prev + 1); // refresh list
    } else {
      setMessageType("error");
      setMessage(res.message || "Failed to add service.");
    }
  } catch (err) {
    console.error("❌ handleAddService error:", err);
    setMessageType("error");
    setMessage("Failed to add service.");
  }
}


};

const handleEdit = (item, type) => {  
  console.log("🔹 Editing item:", item);
  console.log("🔹 Editing type:", type);
  console.log("🔹 Current services state:", services);

  // Clone templates so you don't mutate originals
  const fieldsCopy = JSON.parse(JSON.stringify(serviceFieldTemplates));

  /* ======================================================
     CATEGORY EDIT
  ====================================================== */
  if (type === "Category") {
    const noCategory = services.find(cat => cat.name === "No Category");
    const unlinkedServices = noCategory?.services || [];

    const categoryField = fieldsCopy.Category.find(f => f.name === "services");

    if (categoryField) {
      const combinedOptions = [
        ...unlinkedServices.map(s => ({
          label: s.name,
          value: String(s.id)
        })),
        ...(item.services || []).map(s => ({
          label: s.name,
          value: String(s.id)
        }))
      ];

      const uniqueOptions = Array.from(
        new Map(combinedOptions.map(o => [o.value, o])).values()
      );

      categoryField.options = uniqueOptions;

      categoryField.defaultValue = (item.services || []).map(s => ({
        label: s.name,
        value: String(s.id)
      }));
    }

  } 
  
  
  /* ======================================================
     SERVICE EDIT
  ====================================================== */
  else if (type === "Service") {

    /* CATEGORY SELECT */
    const serviceCategoryField = fieldsCopy.Service.find(f => f.name === "category");

    let cleanedCategoryValue = null;

    if (serviceCategoryField) {
      const options = services
        .filter(cat => cat.name !== "No Category")
        .map(cat => ({
          label: cat.name,
          value: String(cat.id)
        }));

      serviceCategoryField.options = options;

      const selectedCategory = services.find(cat => cat.id === item.categories);

      cleanedCategoryValue = selectedCategory
        ? {
            label: selectedCategory.name,
            value: String(selectedCategory.id)
          }
        : null;

      serviceCategoryField.defaultValue = cleanedCategoryValue;
    }

    /* ALLOW INSTALLMENT SELECT */
    const installmentField = fieldsCopy.Service.find(f => f.name === "allow_installment");

    let cleanedInstallmentValue = null;

    if (installmentField) {
      installmentField.options = [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ];

      cleanedInstallmentValue = item.allow_installment
        ? { label: "Yes", value: true }
        : { label: "No", value: false };

      installmentField.defaultValue = cleanedInstallmentValue;
    }

    // -------------------------------------------
    // OVERRIDE RAW VALUES HERE SO item DOESN'T BREAK IT
    // -------------------------------------------
    item = {
      ...item,
      categories: cleanedCategoryValue,
      allow_installment: cleanedInstallmentValue
    };
  }

  /* ======================================================
     CONNECTED INFO
  ====================================================== */
  const connectedInfo = type === "Category"
    ? {
        services: (item.services || []).map(s => ({
          label: s.name,
          value: String(s.id)
        }))
      }
    : {
        connectedCategory: item.categories
      };

  /* ======================================================
     FINAL PAYLOAD (SAFE)
  ====================================================== */
  const editDataPayload = {
    ...item,              // now item contains cleaned values
    type,
    fields: fieldsCopy[type],
    ...connectedInfo
  };

  console.log("🔹 FINAL editData payload (SAFE):", editDataPayload);

  setEditData(editDataPayload);
  setEditModalOpen(true);
};





// Handle EditModal submission
const handleEditSubmit = async (formValues) => {
  if (!token) {
    console.warn("No token available for editing category/service");
    setMessageType("error");
    setMessage("You must be logged in as admin.");
    return;
  }

  console.log("📄 Raw edit form values:", formValues);

  // Determine type
  let tableType;
  if (formValues.type === "Category") tableType = "category";
  else if (formValues.type === "Service") tableType = "service";
  else {
    console.error("Unable to determine type:", formValues);
    setMessageType("error");
    setMessage("Invalid form submission.");
    return;
  }

  console.log("📌 Determined table type for edit:", tableType);

  // ===================== CATEGORY =====================
  if (tableType === "category") {
    try {
      let servicesArray = null;

      if (formValues.services) {
        if (Array.isArray(formValues.services) && formValues.services.length > 0) {
          servicesArray = formValues.services.map(s => {
            if (typeof s === "object" && s.value !== undefined) return Number(s.value);
            return Number(s); // handles string or number
          });
        } else if (typeof formValues.services === "number" || (typeof formValues.services === "string" && formValues.services)) {
          servicesArray = [Number(formValues.services)];
        }
      }

      const updatedCategoryData = { name: formValues.name };
      if (servicesArray) updatedCategoryData.services = servicesArray;

      console.log("🟢 Processed data to send for CATEGORY edit:", updatedCategoryData);

      const res = await editCategory(token, formValues.id, updatedCategoryData);
      console.log("🟣 API Response (Category edit):", res);

      if (res.success) {
        setMessageType("success");
        setMessage("✅ Category updated successfully!");
        setEditModalOpen(false);
        setRefreshKey(prev => prev + 1);
      } else {
        setMessageType("error");
        setMessage(res.message || "Failed to update category.");
      }

    } catch (err) {
      console.error("❌ handleEditCategory error:", err);
      setMessageType("error");
      setMessage("Failed to update category.");
    }
  }

  // ===================== SERVICE =====================
  else if (tableType === "service") {
    try {
      let categoryId = null;
      if (formValues.category) {
        categoryId = Number(formValues.category); // ensures numeric ID
      }

      const price = parseFloat(formValues.price) || 0;
      const installmentTimes = parseInt(formValues.installment_times) || 0;
      const customIntervalDays = formValues.installment_interval === "custom"
        ? parseInt(formValues.custom_interval_days) || null
        : null;

      const updatedServiceData = {
        name: formValues.name,
        description: formValues.description || null,
        price,
        allow_installment: formValues.allow_installment === "yes",
        installment_times: installmentTimes,
        installment_interval: formValues.installment_interval || null,
        custom_interval_days: customIntervalDays,
        ...(categoryId && { categories: categoryId }),
      };

      console.log("🟢 Processed data to send for SERVICE edit:", updatedServiceData);

      const res = await editService(token, formValues.id, updatedServiceData);
      console.log("🟣 API Response (Service edit):", res);

      if (res.success) {
        setMessageType("success");
        setMessage("✅ Service updated successfully!");
        setEditModalOpen(false);
        setRefreshKey(prev => prev + 1);
      } else {
        setMessageType("error");
        setMessage(res.message || "Failed to update service.");
      }

    } catch (err) {
      console.error("❌ handleEditService error:", err);
      setMessageType("error");
      setMessage("Failed to update service.");
    }
  }
};



return (
  <>
    {/* Header and Add button */}
    <div className="same-row">
      <h1>Dental Services</h1>
      <div style={{ position: "relative" }}>
        <button className="btn-add" onClick={() => setOpen(prev => !prev)}>+</button>
        {open && <AddChoice choices={choices} onSelect={handleSelect} />}
      </div>
    </div>

    {/* Add Modal */}
    {modalOpen && (
      <AddModal
        datatype="table"
        selected={selected}
        choices={choices}
        fields={serviceFieldTemplates}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    )}

  {/* Edit Modal */}
      {editModalOpen && editData && (
       <EditModal
  isOpen={editModalOpen}
  data={editData}
  fields={editData.fields} // ✅ use the processed fields
  onClose={() => setEditModalOpen(false)}
  onSubmit={handleEditSubmit}
/>
      )}

    {/* Loading / Error */}
    {loading && <p>Loading services...</p>}
    {!loading && error && <p style={{ color: "red" }}>{error}</p>}

    {/* Services Table */}
    {!loading && !error && services?.length > 0 && (
<ExpandableTable
  columns={mainColumns}
  data={services.map((service) => ({
    ...service,
    onEdit: () => handleEdit(service, "Category"), // Open EditModal for category
    onDelete: service.onDelete || (() => console.log("Delete", service)),
    services: (service.services || []).map((nested) => ({
      ...nested,
      onEdit: () => handleEdit(nested, "Service"), // Open EditModal for service
      onDelete: nested.onDelete || (() => console.log("Delete", nested)),
    })),
  }))}
  expandColumns={serviceColumns}
  nestedKey="services"
  hideActionsCondition={(row) => row.name === "No Category"} // Hide buttons for "No Category"
/>
    )}

    {/* Message Modal */}
    <MessageModal
      message={message}
      type={messageType}
      onClose={() => setMessage("")}
    />
  </>
);

}
