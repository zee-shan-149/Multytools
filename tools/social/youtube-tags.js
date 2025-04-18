document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const tagsForm = document.getElementById('tagsForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadingIndicator = document.querySelector('.loading');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('errorText');
    const tagsResults = document.getElementById('tagsResults');
    const videoTitle = document.getElementById('videoTitle');
    const videoChannel = document.getElementById('videoChannel');
    const totalTags = document.getElementById('totalTags');
    const tagCloud = document.getElementById('tagCloud');
    const copyTagsBtn = document.getElementById('copyTagsBtn');
    const downloadTagsBtn = document.getElementById('downloadTagsBtn');

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
        tagsResults.style.display = 'none';
    }

    // Function to hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Function to create tag element
    function createTagElement(tag) {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.textContent = tag;
        tagElement.title = 'Click to copy';
        tagElement.addEventListener('click', () => {
            navigator.clipboard.writeText(tag).then(() => {
                const originalText = tagElement.textContent;
                tagElement.textContent = 'Copied!';
                setTimeout(() => {
                    tagElement.textContent = originalText;
                }, 1000);
            });
        });
        return tagElement;
    }

    // Function to update tag cloud
    function updateTagCloud(tags) {
        tagCloud.innerHTML = '';
        tags.forEach(tag => {
            tagCloud.appendChild(createTagElement(tag));
        });
    }

    // Function to download tags
    function downloadTags(tags) {
        const blob = new Blob([tags.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-tags.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Form submission handler
    tagsForm.addEventListener('submit', async function(e) {
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
        tagsResults.style.display = 'none';

        try {
            // In a real implementation, you would make an API call here
            // For now, we'll simulate the response with sample data
            const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
            const html = await response.text();
            
            // Extract video title and channel name from the HTML
            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            const channelMatch = html.match(/channelName":"(.*?)"/);
            
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Unknown Title';
            const channel = channelMatch ? channelMatch[1] : 'Unknown Channel';
            
            // Extract tags from the HTML
            const tagsMatch = html.match(/"keywords":\[(.*?)\]/);
            const tags = tagsMatch ? 
                JSON.parse(`[${tagsMatch[1]}]`) : 
                ['No tags available'];

            // Update UI
            videoTitle.textContent = `Title: ${title}`;
            videoChannel.textContent = `Channel: ${channel}`;
            totalTags.textContent = tags.length;
            updateTagCloud(tags);

            // Show results
            loadingIndicator.style.display = 'none';
            tagsResults.style.display = 'block';

        } catch (error) {
            showError('Error extracting tags. Please try again later.');
            console.error('Error:', error);
        }
    });

    // Copy tags button handler
    copyTagsBtn.addEventListener('click', function() {
        const tags = Array.from(tagCloud.querySelectorAll('.tag-item'))
            .map(tag => tag.textContent);
        navigator.clipboard.writeText(tags.join('\n')).then(() => {
            const originalText = copyTagsBtn.innerHTML;
            copyTagsBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                copyTagsBtn.innerHTML = originalText;
            }, 1000);
        });
    });

    // Download tags button handler
    downloadTagsBtn.addEventListener('click', function() {
        const tags = Array.from(tagCloud.querySelectorAll('.tag-item'))
            .map(tag => tag.textContent);
        downloadTags(tags);
    });
}); 