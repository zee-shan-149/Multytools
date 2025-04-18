document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const downloadForm = document.getElementById('downloadForm');
    const tweetUrlInput = document.getElementById('tweetUrl');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const tweetResults = document.getElementById('tweetResults');
    const tweetAuthor = document.getElementById('tweetAuthor');
    const tweetText = document.getElementById('tweetText');
    const tweetLikes = document.getElementById('tweetLikes');
    const tweetRetweets = document.getElementById('tweetRetweets');
    const tweetReplies = document.getElementById('tweetReplies');
    const videoPreview = document.getElementById('videoPreview');
    const formatOptions = document.getElementById('formatOptions');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFormat = null;

    // Function to extract tweet ID from URL
    function extractTweetId(url) {
        const regExp = /twitter\.com\/\w+\/status\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Function to show error message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        tweetResults.style.display = 'none';
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
        
        const url = tweetUrlInput.value.trim();
        const tweetId = extractTweetId(url);

        if (!tweetId) {
            showError('Please enter a valid Twitter URL');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        hideError();
        tweetResults.style.display = 'none';
        downloadBtn.disabled = true;
        selectedFormat = null;

        try {
            // In a real implementation, you would make an API call here
            // For now, we'll simulate the response with sample data
            const response = await fetch(`https://twitter.com/i/status/${tweetId}`);
            const html = await response.text();
            
            // Extract tweet information from the HTML
            const authorMatch = html.match(/"screen_name":"(.*?)"/);
            const textMatch = html.match(/"full_text":"(.*?)"/);
            const likesMatch = html.match(/"favorite_count":(\d+)/);
            const retweetsMatch = html.match(/"retweet_count":(\d+)/);
            const repliesMatch = html.match(/"reply_count":(\d+)/);
            const videoUrlMatch = html.match(/"video_url":"(.*?)"/);
            
            const author = authorMatch ? authorMatch[1] : 'Unknown User';
            const text = textMatch ? textMatch[1].replace(/\\n/g, '\n') : 'No text available';
            const likes = likesMatch ? parseInt(likesMatch[1]) : 0;
            const retweets = retweetsMatch ? parseInt(retweetsMatch[1]) : 0;
            const replies = repliesMatch ? parseInt(repliesMatch[1]) : 0;
            const videoUrl = videoUrlMatch ? videoUrlMatch[1].replace(/\\/g, '') : null;

            // Sample format options (in a real implementation, these would come from the API)
            const formats = [
                { type: 'MP4', quality: '1080p', size: '~100MB' },
                { type: 'MP4', quality: '720p', size: '~50MB' },
                { type: 'MP4', quality: '480p', size: '~25MB' },
                { type: 'MP4', quality: '360p', size: '~15MB' }
            ];

            // Update UI
            tweetAuthor.textContent = `@${author}`;
            tweetText.textContent = text;
            tweetLikes.textContent = formatNumber(likes);
            tweetRetweets.textContent = formatNumber(retweets);
            tweetReplies.textContent = formatNumber(replies);
            
            if (videoUrl) {
                videoPreview.src = videoUrl;
                videoPreview.load();
            }

            updateFormatOptions(formats);

            // Show results
            loadingIndicator.style.display = 'none';
            tweetResults.style.display = 'block';

        } catch (error) {
            showError('Error fetching tweet information. Please try again later.');
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