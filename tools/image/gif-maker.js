document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const createBtn = document.getElementById('createBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const frameDelayInput = document.getElementById('frameDelay');
    const loopCountInput = document.getElementById('loopCount');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspectCheckbox = document.getElementById('maintainAspect');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('result');
    const gifPreview = document.getElementById('gifPreview');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFiles = [];
    let previewImages = [];

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });

    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        handleFileSelection(e.target.files);
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
        handleFileSelection(e.dataTransfer.files);
    });

    function handleFileSelection(files) {
        selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (selectedFiles.length > 0) {
            createBtn.disabled = false;
            previewSection.style.display = 'block';
            imagePreview.innerHTML = '';
            previewImages = [];

            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-thumbnail';
                    img.alt = `Frame ${index + 1}`;
                    imagePreview.appendChild(img);
                    previewImages.push(img);
                };
                reader.readAsDataURL(file);
            });
        } else {
            alert('Please select valid image files.');
        }
    }

    // Handle width/height input changes
    widthInput.addEventListener('input', function() {
        if (maintainAspectCheckbox.checked && previewImages.length > 0) {
            const aspectRatio = previewImages[0].naturalHeight / previewImages[0].naturalWidth;
            heightInput.value = Math.round(this.value * aspectRatio);
        }
    });

    heightInput.addEventListener('input', function() {
        if (maintainAspectCheckbox.checked && previewImages.length > 0) {
            const aspectRatio = previewImages[0].naturalWidth / previewImages[0].naturalHeight;
            widthInput.value = Math.round(this.value * aspectRatio);
        }
    });

    // Handle create button click
    createBtn.addEventListener('click', function() {
        if (selectedFiles.length === 0) return;

        loadingSpinner.style.display = 'block';
        createBtn.disabled = true;

        const gif = new GIF({
            workers: 2,
            quality: qualitySlider.value,
            width: widthInput.value || previewImages[0].naturalWidth,
            height: heightInput.value || previewImages[0].naturalHeight,
            repeat: loopCountInput.value,
            delay: frameDelayInput.value
        });

        // Add frames to GIF
        previewImages.forEach(img => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = widthInput.value || img.naturalWidth;
            canvas.height = heightInput.value || img.naturalHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            gif.addFrame(canvas, {delay: frameDelayInput.value});
        });

        // Render GIF
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            gifPreview.src = url;
            downloadBtn.href = url;
            downloadBtn.download = 'animated.gif';

            loadingSpinner.style.display = 'none';
            createBtn.disabled = false;
            resultDiv.style.display = 'block';
        });

        gif.render();
    });
}); 