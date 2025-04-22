const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Submit form data to the backend API
 *
 * @param {Object} formData - Form data to be submitted
 * @returns {Promise} - API response
 */
export const submitForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

/**
 * Upload files with optional form data
 * Files are stored temporarily on server until form submission
 *
 * @param {Object} files - Object containing file objects
 * @param {Object} formData - Additional form data (must include email)
 * @returns {Promise} - API response
 */
export const uploadFiles = async (files, formData = {}) => {
  try {
    // Email is required for associating files with the correct user
    if (!formData.email) {
      throw new Error("Email is required for file uploads");
    }

    const formDataObj = new FormData();

    // Append files to FormData
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataObj.append(key, file);
      }
    });

    // Append form data to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataObj.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE_URL}/upload-documents`, {
      method: "POST",
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
