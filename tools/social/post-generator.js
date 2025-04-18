document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('postGeneratorForm');
    const postTypeSelect = document.getElementById('postType');
    const mediaUploadSection = document.getElementById('mediaUploadSection');
    const mediaUpload = document.getElementById('mediaUpload');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const previewContent = document.getElementById('previewContent');
    const previewHashtags = document.getElementById('previewHashtags');
    const downloadButton = document.getElementById('downloadPost');
    const copyButton = document.getElementById('copyToClipboard');

    // Show/hide media upload section based on post type
    postTypeSelect.addEventListener('change', function() {
        if (this.value === 'image') {
            mediaUploadSection.classList.remove('d-none');
        } else {
            mediaUploadSection.classList.add('d-none');
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postType = postTypeSelect.value;
        const platform = document.getElementById('platform').value;
        const content = document.getElementById('postContent').value;
        const hashtags = document.getElementById('hashtags').value;
        const imageFile = mediaUpload.files[0];

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        previewSection.classList.add('d-none');

        if (postType === 'image') {
            if (imageFile) {
                processImagePost(imageFile, content, hashtags, platform);
            } else {
                alert('Please upload an image for image post');
                loadingIndicator.style.display = 'none';
            }
        } else {
            // Text post
            generateTextPost(content, hashtags, platform);
        }
    });

    async function processImagePost(imageFile, content, hashtags, platform) {
        try {
            // Process image
            const processedImage = await processImage(imageFile, content, hashtags);
            
            // Create image element
            const imgElement = imagePreview.querySelector('img');
            imgElement.src = URL.createObjectURL(processedImage);
            imagePreview.classList.remove('d-none');
            
            updatePreview(content, hashtags, platform, 'image', processedImage);
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function generateTextPost(content, hashtags, platform) {
        // Update preview
        imagePreview.classList.add('d-none');
        updatePreview(content, hashtags, platform, 'text');
        loadingIndicator.style.display = 'none';
    }

    function updatePreview(content, hashtags, platform, type, processedFile = null) {
        previewSection.classList.remove('d-none');
        previewContent.textContent = content;
        previewHashtags.textContent = hashtags;

        // Update download button
        downloadButton.onclick = function() {
            if (type === 'image') {
                // Create a canvas to ensure proper image format
                const canvas = document.createElement('canvas');
                const img = imagePreview.querySelector('img');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Convert to PNG format
                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `social-media-image-${platform}.png`;
                    link.click();
                }, 'image/png');
            } else {
                // For text posts, create a formatted HTML file
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Social Media Post</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .content { margin-bottom: 20px; }
                            .hashtags { color: #1DA1F2; }
                        </style>
                    </head>
                    <body>
                        <div class="content">${content}</div>
                        <div class="hashtags">${hashtags}</div>
                    </body>
                    </html>
                `;
                
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `social-media-post-${platform}.html`;
                link.click();
            }
        };

        // Update copy button
        copyButton.onclick = function() {
            const textToCopy = `${content}\n\n${hashtags}`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('Post content copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        };
    }

    function processImage(imageFile, content, hashtags) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Create a canvas to process the image
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw the image
                    ctx.drawImage(img, 0, 0);
                    
                    // Add text overlay if needed
                    if (content) {
                        ctx.font = '20px Arial';
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.fillText(content, canvas.width/2, 30);
                    }
                    
                    // Convert to PNG format
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/png');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(imageFile);
        });
    }
}); 