document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const resizeBtn = document.getElementById('resizeBtn');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspect = document.getElementById('maintainAspect');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFile = null;
    let originalWidth = 0;
    let originalHeight = 0;

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        handleFileSelection(e.target.files[0]);
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#007bff';
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.style.borderColor = '#ddd';
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#ddd';
        handleFileSelection(e.dataTransfer.files[0]);
    });

    function handleFileSelection(file) {
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            resizeBtn.disabled = false;
            
            // Show preview and get original dimensions
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                resultDiv.style.display = 'block';

                // Get original dimensions
                const img = new Image();
                img.onload = function() {
                    originalWidth = img.width;
                    originalHeight = img.height;
                    widthInput.value = originalWidth;
                    heightInput.value = originalHeight;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    // Handle aspect ratio maintenance
    maintainAspect.addEventListener('change', function() {
        if (this.checked) {
            heightInput.disabled = true;
            updateHeight();
        } else {
            heightInput.disabled = false;
        }
    });

    widthInput.addEventListener('input', function() {
        if (maintainAspect.checked) {
            updateHeight();
        }
    });

    function updateHeight() {
        if (originalWidth && originalHeight) {
            const newWidth = parseInt(widthInput.value);
            const ratio = originalHeight / originalWidth;
            heightInput.value = Math.round(newWidth * ratio);
        }
    }

    // Handle resizing
    resizeBtn.addEventListener('click', function() {
        if (!selectedFile) return;

        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Please enter valid dimensions.');
            return;
        }

        loadingSpinner.style.display = 'block';
        resizeBtn.disabled = true;

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            canvas.width = width;
            canvas.height = height;

            // Draw image with new dimensions
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to image with quality
            const quality = qualitySlider.value / 100;
            const resizedData = canvas.toDataURL(selectedFile.type, quality);

            // Update preview and download link
            previewImg.src = resizedData;
            downloadBtn.href = resizedData;
            downloadBtn.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '_resized' + selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));

            loadingSpinner.style.display = 'none';
            resizeBtn.disabled = false;
            resultDiv.style.display = 'block';
        };

        img.src = URL.createObjectURL(selectedFile);
    });
}); 