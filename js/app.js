/**
 * Main application logic — handles UI, events, and orchestrates crop + canvas modules.
 */
(() => {
  // DOM elements
  const uploadSection = document.getElementById('upload-section');
  const editorSection = document.getElementById('editor-section');
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const cropImage = document.getElementById('crop-image');
  const previewCanvas = document.getElementById('preview-canvas');
  const borderWidthInput = document.getElementById('border-width');
  const borderWidthValue = document.getElementById('border-width-value');
  const btnDownload = document.getElementById('btn-download');
  const btnReset = document.getElementById('btn-reset');
  const shapeCircle = document.getElementById('shape-circle');
  const shapeSquare = document.getElementById('shape-square');

  // State
  let isCircle = true;
  let currentCroppedCanvas = null;

  // --- Upload handlers ---

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  });

  // Drag & drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  });

  // --- Image loading ---

  function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      cropImage.src = e.target.result;
      showEditor();
    };
    reader.readAsDataURL(file);
  }

  function showEditor() {
    uploadSection.classList.remove('active');
    editorSection.classList.add('active');

    // Wait for image to load before initializing cropper
    cropImage.onload = () => {
      CropManager.init(cropImage, onCropChange);
      cropImage.onload = null;
    };
    // If already loaded (cached)
    if (cropImage.complete && cropImage.naturalWidth > 0) {
      CropManager.init(cropImage, onCropChange);
    }
  }

  function showUpload() {
    CropManager.destroy();
    editorSection.classList.remove('active');
    uploadSection.classList.add('active');
    fileInput.value = '';
    currentCroppedCanvas = null;
  }

  // --- Crop change → update preview ---

  function onCropChange(croppedCanvas) {
    currentCroppedCanvas = croppedCanvas;
    updatePreview();
  }

  function updatePreview() {
    if (!currentCroppedCanvas) return;
    PalestineBorder.render(currentCroppedCanvas, {
      borderPercent: parseInt(borderWidthInput.value, 10),
      isCircle,
    }, previewCanvas);
  }

  // --- Controls ---

  borderWidthInput.addEventListener('input', () => {
    borderWidthValue.textContent = borderWidthInput.value + '%';
    updatePreview();
  });

  shapeCircle.addEventListener('click', () => {
    isCircle = true;
    shapeCircle.classList.add('active');
    shapeSquare.classList.remove('active');
    updatePreview();
  });

  shapeSquare.addEventListener('click', () => {
    isCircle = false;
    shapeSquare.classList.add('active');
    shapeCircle.classList.remove('active');
    updatePreview();
  });

  // --- Download ---

  btnDownload.addEventListener('click', async () => {
    if (!currentCroppedCanvas) return;

    const blob = await PalestineBorder.exportPNG(currentCroppedCanvas, {
      borderPercent: parseInt(borderWidthInput.value, 10),
      isCircle,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palestine-border.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // --- Reset ---

  btnReset.addEventListener('click', showUpload);
})();
