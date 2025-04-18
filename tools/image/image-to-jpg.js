document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const sizeSelect = document.getElementById('size');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
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
        if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            convertBtn.disabled = false;
            
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

    // Handle conversion
    convertBtn.addEventListener('click', function() {
        if (!selectedFile) return;

        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Set canvas size based on selected option
            let width = img.width;
            let height = img.height;

            switch (sizeSelect.value) {
                case 'small':
                    width = 800;
                    height = 600;
                    break;
                case 'medium':
                    width = 1024;
                    height = 768;
                    break;
                case 'large':
                    width = 1920;
                    height = 1080;
                    break;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPG
            const quality = qualitySlider.value / 100;
            const jpgData = canvas.toDataURL('image/jpeg', quality);

            // Update preview and download link
            previewImg.src = jpgData;
            downloadBtn.href = jpgData;
            downloadBtn.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '.jpg';

            loadingSpinner.style.display = 'none';
            convertBtn.disabled = false;
            resultDiv.style.display = 'block';
        };

        img.src = URL.createObjectURL(selectedFile);
    });
}); 