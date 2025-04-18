document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const downloadForm = document.getElementById('downloadForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const videoResults = document.getElementById('videoResults');
    const videoTitle = document.getElementById('videoTitle');
    const videoAuthor = document.getElementById('videoAuthor');
    const videoLikes = document.getElementById('videoLikes');
    const videoComments = document.getElementById('videoComments');
    const videoShares = document.getElementById('videoShares');
    const videoPreview = document.getElementById('videoPreview');
    const downloadBtn = document.getElementById('downloadBtn');

    // Function to extract video ID from URL
    function extractVideoId(url) {
        const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        videoResults.style.display = 'none';
    }

    // Function to hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Function to format numbers
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Form submission handler
    downloadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = videoUrlInput.value.trim();
        const videoId = extractVideoId(url);

        if (!videoId) {
            showError('Please enter a valid TikTok URL');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        hideError();
        videoResults.style.display = 'none';

        try {
            // In a real implementation, you would make an API call here
            // For now, we'll simulate the response with sample data
            const response = await fetch(`https://www.tiktok.com/@user/video/${videoId}`);
            const html = await response.text();
            
            // Extract video information from the HTML
            const titleMatch = html.match(/"desc":"(.*?)"/);
            const authorMatch = html.match(/"authorName":"(.*?)"/);
            const likesMatch = html.match(/"diggCount":(\d+)/);
            const commentsMatch = html.match(/"commentCount":(\d+)/);
            const sharesMatch = html.match(/"shareCount":(\d+)/);
            const videoUrlMatch = html.match(/"videoUrl":"(.*?)"/);
            
            const title = titleMatch ? titleMatch[1] : 'Untitled Video';
            const author = authorMatch ? authorMatch[1] : 'Unknown Author';
            const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
            const comments = commentsMatch ? parseInt(commentsMatch[1]) : 0;
            const shares = sharesMatch ? parseInt(sharesMatch[1]) : 0;
            const videoUrl = videoUrlMatch ? videoUrlMatch[1].replace(/\\/g, '') : null;

            // Update UI
            videoTitle.textContent = `Title: ${title}`;
            videoAuthor.textContent = `Author: @${author}`;
            videoLikes.textContent = formatNumber(likes);
            videoComments.textContent = formatNumber(comments);
            videoShares.textContent = formatNumber(shares);
            
            if (videoUrl) {
                videoPreview.src = videoUrl;
                videoPreview.load();
            }

            // Show results
            loadingIndicator.style.display = 'none';
            videoResults.style.display = 'block';

        } catch (error) {
            showError('Error fetching video information. Please try again later.');
            console.error('Error:', error);
        }
    });

    // Download button handler
    downloadBtn.addEventListener('click', function() {
        if (!videoPreview.src) {
            showError('No video available to download');
            return;
        }

        // In a real implementation, you would initiate the download here
        // For now, we'll just show a success message
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="bi bi-check"></i> Download Started!';
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
        }, 2000);
    });
}); 