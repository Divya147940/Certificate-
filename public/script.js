// Switch between Student Search and Admin Portal view
function switchView(view) {
  const studentView = document.getElementById('student-view');
  const adminView = document.getElementById('admin-view');
  const btnStudent = document.getElementById('btn-student-view');
  const btnAdmin = document.getElementById('btn-admin-view');

  if (view === 'student') {
    studentView.classList.add('active');
    adminView.classList.remove('active');
    btnStudent.classList.add('active');
    btnAdmin.classList.remove('active');
  } else {
    adminView.classList.add('active');
    studentView.classList.remove('active');
    btnAdmin.classList.add('active');
    btnStudent.classList.remove('active');
  }
}

// Handle Student Certificate Search
async function handleSearch(event) {
  event.preventDefault();
  
  const searchIdInput = document.getElementById('search-id');
  const searchId = searchIdInput.value.trim();
  const spinner = document.getElementById('search-spinner');
  const msgBox = document.getElementById('search-message');
  const resultContainer = document.getElementById('certificate-result-container');
  const displayImage = document.getElementById('cert-display-image');

  if (!searchId) return;

  // Show loading spinner, clear message & hide previous certificate
  spinner.style.display = 'inline-block';
  msgBox.className = 'message';
  msgBox.style.display = 'none';
  resultContainer.classList.add('hidden');
  displayImage.src = '';

  try {
    const response = await fetch(`/api/certificate/${encodeURIComponent(searchId)}`);
    const data = await response.json();

    if (response.ok && data.success) {
      // Conditionally show image or PDF iframe based on file extension
      const imgPath = data.certificate.image_path;
      const displayImage = document.getElementById('cert-display-image');
      const displayPdf = document.getElementById('cert-display-pdf');

      if (imgPath.toLowerCase().endsWith('.pdf')) {
        displayImage.style.display = 'none';
        displayPdf.src = imgPath;
        displayPdf.style.display = 'block';
      } else {
        displayPdf.style.display = 'none';
        displayImage.src = imgPath;
        displayImage.style.display = 'block';
      }
      
      // Reveal Certificate
      resultContainer.classList.remove('hidden');
      
      // Smooth scroll to certificate
      setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } else {
      msgBox.textContent = data.message || "Certificate ID not found. Please verify and try again.";
      msgBox.classList.add('error');
      msgBox.style.display = 'block';
    }
  } catch (error) {
    console.error("Search Error:", error);
    msgBox.textContent = "Unable to connect to verification server. Please try again later.";
    msgBox.classList.add('error');
    msgBox.style.display = 'block';
  } finally {
    spinner.style.display = 'none';
  }
}

// Handle Admin Uploading Certificate
async function handleAdminSubmit(event) {
  event.preventDefault();

  const fileInput = document.getElementById('admin-file');
  const idInput = document.getElementById('admin-id');

  const spinner = document.getElementById('admin-spinner');
  const msgBox = document.getElementById('admin-message');

  if (fileInput.files.length === 0) {
    msgBox.textContent = "Please select a certificate image file.";
    msgBox.classList.add('error');
    msgBox.style.display = 'block';
    return;
  }

  const id = idInput.value.trim();
  if (!id) {
    msgBox.textContent = "Please provide a Unique Certificate ID.";
    msgBox.classList.add('error');
    msgBox.style.display = 'block';
    return;
  }

  const file = fileInput.files[0];

  spinner.style.display = 'inline-block';
  msgBox.className = 'message';
  msgBox.style.display = 'none';

  // Read file as Base64 Data URL
  const reader = new FileReader();
  reader.onload = async function() {
    const base64Data = reader.result;

    try {
      const response = await fetch('/api/certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          imageData: base64Data
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        msgBox.textContent = `Success: Certificate ID "${id}" uploaded and registered successfully.`;
        msgBox.classList.add('success');
        msgBox.style.display = 'block';

        // Clear all fields except passcode
        fileInput.value = '';
        idInput.value = '';
        const previewDiv = document.getElementById('detected-id-preview');
        if (previewDiv) {
          previewDiv.textContent = '';
          previewDiv.style.display = 'none';
        }
      } else {
        msgBox.textContent = data.message || "Failed to upload and register certificate.";
        msgBox.classList.add('error');
        msgBox.style.display = 'block';
      }
    } catch (error) {
      console.error("Admin Submission Error:", error);
      msgBox.textContent = "Server communication error. Please try again.";
      msgBox.classList.add('error');
      msgBox.style.display = 'block';
    } finally {
      spinner.style.display = 'none';
    }
  };

  reader.onerror = function() {
    msgBox.textContent = "Error reading the selected image file.";
    msgBox.classList.add('error');
    msgBox.style.display = 'block';
    spinner.style.display = 'none';
  };

  reader.readAsDataURL(file);
}

// Auto-fill the Certificate ID input when a file is selected
document.getElementById('admin-file').addEventListener('change', function(event) {
  const idInput = document.getElementById('admin-id');
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    const fileName = file.name;
    const detectedId = (fileName.substring(0, fileName.lastIndexOf('.')) || fileName).trim().toUpperCase();
    
    // Only auto-fill if the ID field is currently empty
    if (!idInput.value.trim()) {
      idInput.value = detectedId;
    }
  }
});
