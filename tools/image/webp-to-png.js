document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const transparencySelect = document.getElementById('transparency');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const originalPreview = document.getElementById('originalPreview');
    const convertedPreview = document.getElementById('convertedPreview');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFile = null;

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
        if (file && file.type === 'image/webp') {
            selectedFile = file;
            convertBtn.disabled = false;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                originalPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid WebP image file.');
        }
    }

    // Handle convert button click
    convertBtn.addEventListener('click', function() {
        if (!selectedFile) return;

        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // Handle transparency
                if (transparencySelect.value === 'remove') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                // Draw the image
                ctx.drawImage(img, 0, 0);

                // Convert to PNG with quality
                const quality = qualitySlider.value / 100;
                const pngData = canvas.toDataURL('image/png', quality);

                // Update preview and download link
                convertedPreview.src = pngData;
                downloadBtn.href = pngData;
                downloadBtn.download = selectedFile.name.replace('.webp', '.png');

                loadingSpinner.style.display = 'none';
                convertBtn.disabled = false;
                resultDiv.style.display = 'block';
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(selectedFile);
    });
}); 