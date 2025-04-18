document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const downloadForm = document.getElementById('downloadForm');
    const postUrlInput = document.getElementById('postUrl');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const postResults = document.getElementById('postResults');
    const postAuthor = document.getElementById('postAuthor');
    const postText = document.getElementById('postText');
    const postLikes = document.getElementById('postLikes');
    const postComments = document.getElementById('postComments');
    const postImage = document.getElementById('postImage');
    const videoPreview = document.getElementById('videoPreview');
    const formatOptions = document.getElementById('formatOptions');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFormat = null;

    // Function to extract post ID from URL
    function extractPostId(url) {
        const regExp = /instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        postResults.style.display = 'none';
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

    // Function to create format option element
    function createFormatOption(format) {
        const option = document.createElement('div');
        option.className = 'format-option';
        option.innerHTML = `
            <div>
                <strong>${format.type}</strong>
                <span class="badge bg-primary quality-badge">${format.quality}</span>
            </div>
            <small class="text-muted">${format.size}</small>
        `;
        
        option.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.format-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selected class to clicked option
            option.classList.add('selected');
            selectedFormat = format;
            downloadBtn.disabled = false;
        });
        
        return option;
    }

    // Function to update format options
    function updateFormatOptions(formats) {
        formatOptions.innerHTML = '';
        formats.forEach(format => {
            formatOptions.appendChild(createFormatOption(format));
        });
    }

    // Form submission handler
    downloadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = postUrlInput.value.trim();
        const postId = extractPostId(url);

        if (!postId) {
            showError('Please enter a valid Instagram post URL');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        hideError();
        postResults.style.display = 'none';
        downloadBtn.disabled = true;
        selectedFormat = null;

        try {
            // In a real implementation, you would make an API call here
            // For now, we'll simulate the response with sample data
            const response = await fetch(`https://www.instagram.com/p/${postId}/`);
            const html = await response.text();
            
            // Extract post information from the HTML
            const authorMatch = html.match(/"username":"(.*?)"/);
            const textMatch = html.match(/"caption":"(.*?)"/);
            const likesMatch = html.match(/"like_count":(\d+)/);
            const commentsMatch = html.match(/"comment_count":(\d+)/);
            const imageUrlMatch = html.match(/"display_url":"(.*?)"/);
            const videoUrlMatch = html.match(/"video_url":"(.*?)"/);
            
            const author = authorMatch ? authorMatch[1] : 'Unknown User';
            const text = textMatch ? textMatch[1].replace(/\\n/g, '\n') : 'No caption available';
            const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
            const comments = commentsMatch ? parseInt(commentsMatch[1]) : 0;
            const imageUrl = imageUrlMatch ? imageUrlMatch[1].replace(/\\/g, '') : null;
            const videoUrl = videoUrlMatch ? videoUrlMatch[1].replace(/\\/g, '') : null;

            // Sample format options (in a real implementation, these would come from the API)
            const formats = [
                { type: 'MP4', quality: '1080p', size: '~100MB' },
                { type: 'MP4', quality: '720p', size: '~50MB' },
                { type: 'MP4', quality: '480p', size: '~25MB' },
                { type: 'MP4', quality: '360p', size: '~15MB' }
            ];

            // Update UI
            postAuthor.textContent = `@${author}`;
            postText.textContent = text;
            postLikes.textContent = formatNumber(likes);
            postComments.textContent = formatNumber(comments);
            
            if (imageUrl) {
                postImage.src = imageUrl;
                postImage.style.display = 'block';
            } else {
                postImage.style.display = 'none';
            }
            
            if (videoUrl) {
                videoPreview.src = videoUrl;
                videoPreview.load();
            }

            updateFormatOptions(formats);

            // Show results
            loadingIndicator.style.display = 'none';
            postResults.style.display = 'block';

        } catch (error) {
            showError('Error fetching post information. Please try again later.');
            console.error('Error:', error);
        }
    });

    // Download button handler
    downloadBtn.addEventListener('click', function() {
        if (!selectedFormat) {
            showError('Please select a format first');
            return;
        }

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