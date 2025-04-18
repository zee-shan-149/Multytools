document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resizeForm');
    const imageInput = document.getElementById('imageInput');
    const platformCards = document.querySelectorAll('.platform-card');
    const customDimensions = document.getElementById('customDimensions');
    const customWidth = document.getElementById('customWidth');
    const customHeight = document.getElementById('customHeight');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const dimensionsInfo = document.getElementById('dimensionsInfo');
    const downloadButton = document.getElementById('downloadImage');

    // Platform dimensions
    const platformDimensions = {
        instagram: { width: 1080, height: 1080 },
        facebook: { width: 1200, height: 630 },
        twitter: { width: 1200, height: 675 },
        linkedin: { width: 1200, height: 627 },
        pinterest: { width: 1000, height: 1500 }
    };

    let selectedPlatform = 'instagram';
    let originalImage = null;
    let resizedImage = null;

    // Handle platform selection
    platformCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            platformCards.forEach(c => c.classList.remove('active'));
            // Add active class to selected card
            this.classList.add('active');
            
            selectedPlatform = this.dataset.platform;
            
            // Show/hide custom dimensions
            if (selectedPlatform === 'custom') {
                customDimensions.classList.remove('d-none');
            } else {
                customDimensions.classList.add('d-none');
            }
        });
    });

    // Set first platform as active by default
    platformCards[0].classList.add('active');

    // Update quality value display
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = `${this.value}%`;
    });

    // Handle image upload
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.src = e.target.result;
                originalImage.onload = function() {
                    // Show original dimensions
                    dimensionsInfo.textContent = `Original: ${originalImage.width} x ${originalImage.height}px`;
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!originalImage) {
            alert('Please upload an image first');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        previewSection.classList.add('d-none');

        // Get target dimensions
        let targetWidth, targetHeight;
        if (selectedPlatform === 'custom') {
            targetWidth = parseInt(customWidth.value);
            targetHeight = parseInt(customHeight.value);
            
            if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
                alert('Please enter valid custom dimensions');
                loadingIndicator.style.display = 'none';
                return;
            }
        } else {
            targetWidth = platformDimensions[selectedPlatform].width;
            targetHeight = platformDimensions[selectedPlatform].height;
        }

        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Calculate aspect ratio
        const originalRatio = originalImage.width / originalImage.height;
        const targetRatio = targetWidth / targetHeight;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = originalImage.width;
        let sourceHeight = originalImage.height;
        
        // Maintain aspect ratio
        if (originalRatio > targetRatio) {
            sourceWidth = originalImage.height * targetRatio;
            sourceX = (originalImage.width - sourceWidth) / 2;
        } else {
            sourceHeight = originalImage.width / targetRatio;
            sourceY = (originalImage.height - sourceHeight) / 2;
        }
        
        // Draw and resize image
        ctx.drawImage(
            originalImage,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, targetWidth, targetHeight
        );
        
        // Convert to blob with quality
        const quality = parseInt(qualitySlider.value) / 100;
        canvas.toBlob(function(blob) {
            resizedImage = URL.createObjectURL(blob);
            
            // Update preview
            previewImage.src = resizedImage;
            dimensionsInfo.textContent = `Resized: ${targetWidth} x ${targetHeight}px`;
            
            // Show preview section
            loadingIndicator.style.display = 'none';
            previewSection.classList.remove('d-none');
        }, 'image/jpeg', quality);
    });

    // Handle download
    downloadButton.addEventListener('click', function() {
        if (!resizedImage) return;
        
        const link = document.createElement('a');
        link.href = resizedImage;
        link.download = `resized-${selectedPlatform}-${Date.now()}.jpg`;
        link.click();
    });
}); 