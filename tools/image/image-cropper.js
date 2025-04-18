document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const cropBtn = document.getElementById('cropBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cropperContainer = document.getElementById('cropper-container');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
    const downloadBtn = document.getElementById('downloadBtn');
    const image = document.getElementById('image');

    let cropper = null;
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
            cropBtn.disabled = false;
            
            // Show image in cropper
            const reader = new FileReader();
            reader.onload = function(e) {
                image.src = e.target.result;
                cropperContainer.style.display = 'block';
                resultDiv.style.display = 'none';
                
                // Initialize cropper
                if (cropper) {
                    cropper.destroy();
                }
                
                cropper = new Cropper(image, {
                    aspectRatio: getAspectRatio(),
                    viewMode: 1,
                    autoCropArea: 1,
                    responsive: true,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: true,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    // Handle aspect ratio changes
    aspectRatioSelect.addEventListener('change', function() {
        if (cropper) {
            cropper.setAspectRatio(getAspectRatio());
        }
    });

    function getAspectRatio() {
        const ratio = aspectRatioSelect.value;
        if (ratio === 'free') return NaN;
        const [width, height] = ratio.split(':').map(Number);
        return width / height;
    }

    // Handle width/height input changes
    widthInput.addEventListener('input', function() {
        if (cropper && !isNaN(this.value) && this.value > 0) {
            const ratio = getAspectRatio();
            if (!isNaN(ratio)) {
                heightInput.value = Math.round(this.value / ratio);
            }
        }
    });

    heightInput.addEventListener('input', function() {
        if (cropper && !isNaN(this.value) && this.value > 0) {
            const ratio = getAspectRatio();
            if (!isNaN(ratio)) {
                widthInput.value = Math.round(this.value * ratio);
            }
        }
    });

    // Handle crop button click
    cropBtn.addEventListener('click', function() {
        if (!cropper) return;

        loadingSpinner.style.display = 'block';
        cropBtn.disabled = true;

        // Get cropped canvas
        const canvas = cropper.getCroppedCanvas({
            width: widthInput.value || undefined,
            height: heightInput.value || undefined,
        });

        if (!canvas) {
            alert('Please select an area to crop.');
            loadingSpinner.style.display = 'none';
            cropBtn.disabled = false;
            return;
        }

        // Convert to image with quality
        const quality = qualitySlider.value / 100;
        const croppedData = canvas.toDataURL(selectedFile.type, quality);

        // Update preview and download link
        previewImg.src = croppedData;
        downloadBtn.href = croppedData;
        downloadBtn.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '_cropped' + 
            selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));

        loadingSpinner.style.display = 'none';
        cropBtn.disabled = false;
        resultDiv.style.display = 'block';
    });
}); 