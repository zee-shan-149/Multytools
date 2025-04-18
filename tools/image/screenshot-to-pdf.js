document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const pageSizeSelect = document.getElementById('pageSize');
    const orientationSelect = document.getElementById('orientation');
    const marginInput = document.getElementById('margin');
    const autoRotateCheckbox = document.getElementById('autoRotate');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('result');
    const pdfPreview = document.getElementById('pdfPreview');
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
            convertBtn.disabled = false;
            previewSection.style.display = 'block';
            imagePreview.innerHTML = '';
            previewImages = [];

            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-thumbnail';
                    img.alt = `Screenshot ${index + 1}`;
                    imagePreview.appendChild(img);
                    previewImages.push(img);
                };
                reader.readAsDataURL(file);
            });
        } else {
            alert('Please select valid image files.');
        }
    }

    // Get page dimensions in mm
    function getPageDimensions() {
        const pageSize = pageSizeSelect.value;
        const orientation = orientationSelect.value;
        let width, height;

        switch (pageSize) {
            case 'a4':
                width = 210;
                height = 297;
                break;
            case 'letter':
                width = 216;
                height = 279;
                break;
            case 'legal':
                width = 216;
                height = 356;
                break;
            case 'a3':
                width = 297;
                height = 420;
                break;
            case 'a5':
                width = 148;
                height = 210;
                break;
        }

        return orientation === 'landscape' ? { width: height, height: width } : { width, height };
    }

    // Handle convert button click
    convertBtn.addEventListener('click', async function() {
        if (selectedFiles.length === 0) return;

        loadingSpinner.style.display = 'block';
        convertBtn.disabled = true;

        try {
            const { jsPDF } = window.jspdf;
            const dimensions = getPageDimensions();
            const margin = marginInput.value;
            const quality = qualitySlider.value / 100;

            const pdf = new jsPDF({
                orientation: orientationSelect.value,
                unit: 'mm',
                format: pageSizeSelect.value
            });

            for (let i = 0; i < previewImages.length; i++) {
                if (i > 0) {
                    pdf.addPage();
                }

                const img = previewImages[i];
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;

                // Calculate dimensions to fit the page
                let width = dimensions.width - (margin * 2);
                let height = (width * imgHeight) / imgWidth;

                if (height > dimensions.height - (margin * 2)) {
                    height = dimensions.height - (margin * 2);
                    width = (height * imgWidth) / imgHeight;
                }

                // Auto-rotate if needed
                if (autoRotateCheckbox.checked) {
                    if (imgWidth > imgHeight && orientationSelect.value === 'portrait') {
                        pdf.setPageOrientation('landscape');
                    } else if (imgHeight > imgWidth && orientationSelect.value === 'landscape') {
                        pdf.setPageOrientation('portrait');
                    }
                }

                // Center the image on the page
                const x = (dimensions.width - width) / 2;
                const y = (dimensions.height - height) / 2;

                pdf.addImage(img.src, 'JPEG', x, y, width, height, undefined, 'FAST');
            }

            // Save and display the PDF
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            pdfPreview.src = pdfUrl;
            downloadBtn.href = pdfUrl;
            downloadBtn.download = 'screenshots.pdf';

            resultDiv.style.display = 'block';
        } catch (error) {
            alert('Error generating PDF: ' + error.message);
        } finally {
            loadingSpinner.style.display = 'none';
            convertBtn.disabled = false;
        }
    });
}); 