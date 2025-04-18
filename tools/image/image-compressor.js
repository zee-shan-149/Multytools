document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const compressBtn = document.getElementById('compressBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const maxSizeInput = document.getElementById('maxSize');
    const formatSelect = document.getElementById('format');
    const resizeCheckbox = document.getElementById('resize');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const originalSizeSpan = document.getElementById('originalSize');
    const compressedSizeSpan = document.getElementById('compressedSize');
    const compressionRatioSpan = document.getElementById('compressionRatio');

    let selectedFile = null;
    let originalSize = 0;

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
            originalSize = file.size;
            originalSizeSpan.textContent = formatFileSize(originalSize);
            compressBtn.disabled = false;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                resultDiv.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function calculateCompressionRatio(originalSize, compressedSize) {
        return Math.round(((originalSize - compressedSize) / originalSize) * 100);
    }

    // Handle compression
    compressBtn.addEventListener('click', function() {
        if (!selectedFile) return;

        loadingSpinner.style.display = 'block';
        compressBtn.disabled = true;

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            let width = img.width;
            let height = img.height;

            // Auto-resize if needed
            if (resizeCheckbox.checked) {
                const maxSize = parseInt(maxSizeInput.value) * 1024; // Convert KB to bytes
                let quality = qualitySlider.value / 100;
                let currentSize = originalSize;

                // Try to compress with original size first
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                let mimeType = selectedFile.type;
                if (formatSelect.value !== 'original') {
                    mimeType = 'image/' + formatSelect.value;
                }

                let compressedData = canvas.toDataURL(mimeType, quality);
                currentSize = Math.round((compressedData.length - compressedData.indexOf(',') - 1) * 0.75);

                // If still too large, reduce dimensions
                if (currentSize > maxSize) {
                    const ratio = Math.sqrt(maxSize / currentSize);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    compressedData = canvas.toDataURL(mimeType, quality);
                }
            } else {
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
            }

            // Convert to selected format with quality
            const quality = qualitySlider.value / 100;
            let mimeType = selectedFile.type;
            if (formatSelect.value !== 'original') {
                mimeType = 'image/' + formatSelect.value;
            }
            const compressedData = canvas.toDataURL(mimeType, quality);

            // Calculate compressed size
            const compressedSize = Math.round((compressedData.length - compressedData.indexOf(',') - 1) * 0.75);
            const compressionRatio = calculateCompressionRatio(originalSize, compressedSize);

            // Update preview and download link
            previewImg.src = compressedData;
            downloadBtn.href = compressedData;
            downloadBtn.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '_compressed' + 
                (formatSelect.value === 'original' ? selectedFile.name.substring(selectedFile.name.lastIndexOf('.')) : '.' + formatSelect.value);

            // Update size information
            compressedSizeSpan.textContent = formatFileSize(compressedSize);
            compressionRatioSpan.textContent = compressionRatio + '%';

            loadingSpinner.style.display = 'none';
            compressBtn.disabled = false;
            resultDiv.style.display = 'block';
        };

        img.src = URL.createObjectURL(selectedFile);
    });
}); 