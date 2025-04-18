document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const convertBtn = document.getElementById('convertBtn');
    const outputFormat = document.getElementById('outputFormat');
    const imageQuality = document.getElementById('imageQuality');
    const preserveFormatting = document.getElementById('preserveFormatting');

    let selectedFile = null;

    // Function to format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
    }

    // Function to hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Function to clear selected file
    function clearFile() {
        selectedFile = null;
        fileInput.value = '';
        fileInfo.style.display = 'none';
        convertBtn.disabled = true;
        hideError();
    }

    // Function to handle file selection
    function handleFile(file) {
        if (file.type !== 'application/pdf') {
            showError('Please select a valid PDF file');
            return;
        }

        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
        convertBtn.disabled = false;
        hideError();
    }

    // Drag and drop event handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    // Convert button click handler
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) {
            showError('Please select a PDF file first');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        hideError();

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('outputFormat', outputFormat.value);
            formData.append('imageQuality', imageQuality.value);
            formData.append('preserveFormatting', preserveFormatting.checked);

            // In a real implementation, you would send this to your backend API
            // For now, we'll simulate the conversion process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate successful conversion
            const convertedFileName = selectedFile.name.replace('.pdf', `.${outputFormat.value}`);
            
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob(['Simulated converted file'], { type: 'application/octet-stream' }));
            link.download = convertedFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset the form
            clearFile();
        } catch (error) {
            showError('An error occurred during conversion. Please try again.');
            console.error('Conversion error:', error);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });
}); 