document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('schedulerForm');
    const postPreview = document.getElementById('postPreview');
    const previewContent = document.getElementById('previewContent');
    const previewMedia = document.getElementById('previewMedia');
    const previewHashtags = document.getElementById('previewHashtags');
    const scheduledPostsList = document.getElementById('scheduledPostsList');
    const mediaUpload = document.getElementById('mediaUpload');

    // Load scheduled posts from localStorage
    let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
    updateScheduledPostsList();

    // Handle form input changes for preview
    form.addEventListener('input', function() {
        updatePreview();
    });

    // Handle media upload for preview
    mediaUpload.addEventListener('change', function() {
        updatePreview();
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const platform = document.getElementById('platform').value;
        const scheduleDate = document.getElementById('scheduleDate').value;
        const postContent = document.getElementById('postContent').value;
        const hashtags = document.getElementById('hashtags').value;
        const mediaFile = mediaUpload.files[0];

        // Create new post object
        const newPost = {
            id: Date.now(),
            platform,
            scheduleDate,
            postContent,
            hashtags,
            mediaFile: mediaFile ? {
                name: mediaFile.name,
                type: mediaFile.type,
                size: mediaFile.size
            } : null,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        // Add to scheduled posts
        scheduledPosts.push(newPost);
        localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));

        // Update UI
        updateScheduledPostsList();
        form.reset();
        postPreview.classList.add('d-none');

        // Show success message
        alert('Post scheduled successfully!');
    });

    function updatePreview() {
        const postContent = document.getElementById('postContent').value;
        const hashtags = document.getElementById('hashtags').value;
        const mediaFile = mediaUpload.files[0];

        if (postContent || hashtags || mediaFile) {
            postPreview.classList.remove('d-none');

            // Update content preview
            previewContent.innerHTML = postContent ? `<p>${postContent}</p>` : '';

            // Update media preview
            previewMedia.innerHTML = '';
            if (mediaFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (mediaFile.type.startsWith('image/')) {
                        previewMedia.innerHTML = `<img src="${e.target.result}" class="media-preview" alt="Media preview">`;
                    } else if (mediaFile.type.startsWith('video/')) {
                        previewMedia.innerHTML = `<video src="${e.target.result}" class="media-preview" controls></video>`;
                    }
                };
                reader.readAsDataURL(mediaFile);
            }

            // Update hashtags preview
            previewHashtags.innerHTML = hashtags ? `<p class="text-primary">${hashtags}</p>` : '';
        } else {
            postPreview.classList.add('d-none');
        }
    }

    function updateScheduledPostsList() {
        scheduledPostsList.innerHTML = '';

        if (scheduledPosts.length === 0) {
            scheduledPostsList.innerHTML = '<p class="text-muted">No scheduled posts</p>';
            return;
        }

        // Sort posts by schedule date
        scheduledPosts.sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate));

        scheduledPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>${post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} Post</h5>
                        <p class="mb-1">${post.postContent}</p>
                        ${post.hashtags ? `<p class="text-primary mb-1">${post.hashtags}</p>` : ''}
                        <small class="text-muted">Scheduled for: ${new Date(post.scheduleDate).toLocaleString()}</small>
                    </div>
                    <div class="text-end">
                        <span class="post-status status-${post.status}">${post.status}</span>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePost(${post.id})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            scheduledPostsList.appendChild(postElement);
        });
    }

    // Make deletePost function available globally
    window.deletePost = function(postId) {
        if (confirm('Are you sure you want to delete this scheduled post?')) {
            scheduledPosts = scheduledPosts.filter(post => post.id !== postId);
            localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
            updateScheduledPostsList();
        }
    };

    // Check and update post statuses periodically
    setInterval(checkScheduledPosts, 60000); // Check every minute
    checkScheduledPosts(); // Initial check

    function checkScheduledPosts() {
        const now = new Date();
        scheduledPosts.forEach(post => {
            if (post.status === 'scheduled' && new Date(post.scheduleDate) <= now) {
                // Simulate posting to social media
                post.status = 'published';
                localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
                updateScheduledPostsList();
            }
        });
    }
}); 