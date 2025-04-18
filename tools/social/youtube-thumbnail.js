document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('thumbnailForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingDiv = document.querySelector('.loading');
    const errorDiv = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const thumbnailResults = document.getElementById('thumbnailResults');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    const qualityBtns = document.querySelectorAll('.quality-btn');

    let currentVideoId = '';
    let currentThumbnailUrl = '';

    // Function to extract video ID from URL
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Function to get thumbnail URL based on quality
    function getThumbnailUrl(videoId, quality) {
        const qualities = {
            'maxres': `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            'high': `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            'medium': `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            'standard': `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
        };
        return qualities[quality] || qualities.standard;
    }

    // Function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        loadingDiv.style.display = 'none';
        thumbnailResults.style.display = 'none';
    }

    // Function to hide error message
    function hideError() {
        errorDiv.style.display = 'none';
    }

    // Function to check if thumbnail exists
    async function checkThumbnailExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Function to update thumbnail preview
    async function updateThumbnailPreview(quality) {
        const url = getThumbnailUrl(currentVideoId, quality);
        const exists = await checkThumbnailExists(url);
        
        if (exists) {
            thumbnailPreview.src = url;
            thumbnailPreview.style.display = 'block';
            currentThumbnailUrl = url;
            downloadBtn.disabled = false;
        } else {
            showError('This quality is not available for this video. Please try another quality.');
        }
    }

    // Event listener for form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const videoUrl = videoUrlInput.value.trim();
        const videoId = extractVideoId(videoUrl);

        if (!videoId) {
            showError('Please enter a valid YouTube video URL');
            return;
        }

        currentVideoId = videoId;
        hideError();
        loadingDiv.style.display = 'block';
        thumbnailResults.style.display = 'none';

        // Check if maxres thumbnail exists
        const maxresUrl = getThumbnailUrl(videoId, 'maxres');
        const maxresExists = await checkThumbnailExists(maxresUrl);

        if (!maxresExists) {
            // If maxres doesn't exist, try standard quality
            const standardUrl = getThumbnailUrl(videoId, 'standard');
            const standardExists = await checkThumbnailExists(standardUrl);

            if (!standardExists) {
                showError('Could not find thumbnails for this video. Please check the URL and try again.');
                return;
            }
        }

        loadingDiv.style.display = 'none';
        thumbnailResults.style.display = 'block';
        
        // Set initial thumbnail
        updateThumbnailPreview('maxres');
    });

    // Event listeners for quality buttons
    qualityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quality = this.dataset.quality;
            updateThumbnailPreview(quality);
            
            // Update active state
            qualityBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Event listener for download button
    downloadBtn.addEventListener('click', function() {
        if (currentThumbnailUrl) {
            const link = document.createElement('a');
            link.href = currentThumbnailUrl;
            link.download = `youtube-thumbnail-${currentVideoId}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    // Add active class to first quality button by default
    if (qualityBtns.length > 0) {
        qualityBtns[0].classList.add('active');
    }
}); 