document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const downloadForm = document.getElementById('downloadForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const videoResults = document.getElementById('videoResults');
    const videoTitle = document.getElementById('videoTitle');
    const videoChannel = document.getElementById('videoChannel');
    const videoDuration = document.getElementById('videoDuration');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const formatOptions = document.getElementById('formatOptions');
    const downloadBtn = document.getElementById('downloadBtn');

    let selectedFormat = null;

    // Function to extract video ID from URL
    function extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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

    // Function to format duration
    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
        
        const url = videoUrlInput.value.trim();
        const videoId = extractVideoId(url);

        if (!videoId) {
            showError('Please enter a valid YouTube URL');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        hideError();
        videoResults.style.display = 'none';
        downloadBtn.disabled = true;
        selectedFormat = null;

        try {
            // In a real implementation, you would make an API call here
            // For now, we'll simulate the response with sample data
            const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const html = await response.text();
            
            // Extract video information from the HTML
            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            const channelMatch = html.match(/channelName":"(.*?)"/);
            const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
            
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Unknown Title';
            const channel = channelMatch ? channelMatch[1] : 'Unknown Channel';
            const duration = durationMatch ? formatDuration(parseInt(durationMatch[1])) : 'Unknown Duration';
            
            // Sample format options (in a real implementation, these would come from the API)
            const formats = [
                { type: 'MP4', quality: '1080p', size: '~100MB' },
                { type: 'MP4', quality: '720p', size: '~50MB' },
                { type: 'MP4', quality: '480p', size: '~25MB' },
                { type: 'MP4', quality: '360p', size: '~15MB' },
                { type: 'MP3', quality: '128kbps', size: '~5MB' }
            ];

            // Update UI
            videoTitle.textContent = `Title: ${title}`;
            videoChannel.textContent = `Channel: ${channel}`;
            videoDuration.textContent = `Duration: ${duration}`;
            videoThumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            videoThumbnail.alt = title;
            updateFormatOptions(formats);

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
        if (!selectedFormat) {
            showError('Please select a format first');
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