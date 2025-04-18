document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const formatSelect = document.getElementById('format');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
    const base64Output = document.getElementById('base64Output');
    const copyBtn = document.getElementById('copyBtn');

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
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file.');
        }
    }

    // Handle convert button click
    convertBtn.addEventListener('click', function() {
        if (!selectedFile) return;

        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        const reader = new FileReader();
        reader.onload = function(e) {
            const quality = qualitySlider.value / 100;
            const format = formatSelect.value;
            let base64String = e.target.result;

            if (format === 'base64') {
                // Extract the base64 part from the data URL
                base64String = base64String.split(',')[1];
            }

            // Update output
            base64Output.value = base64String;
            resultDiv.style.display = 'block';
            loadingSpinner.style.display = 'none';
            convertBtn.disabled = false;
        };

        reader.readAsDataURL(selectedFile);
    });

    // Handle copy button click
    copyBtn.addEventListener('click', function() {
        base64Output.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
}); 