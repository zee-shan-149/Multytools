document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('previewForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const previewCode = document.getElementById('previewCode');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const url = document.getElementById('url').value;
        const platform = document.getElementById('platform').value;

        if (!url) {
            alert('Please enter a valid URL');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        previewContainer.style.display = 'none';

        try {
            // Fetch URL metadata
            const metadata = await fetchUrlMetadata(url);
            
            // Generate preview based on platform
            const preview = generatePreview(metadata, platform);
            
            // Update preview content
            previewContent.innerHTML = preview.html;
            previewCode.textContent = preview.code;
            
            // Show preview container
            previewContainer.style.display = 'block';
        } catch (error) {
            console.error('Error generating preview:', error);
            alert('Error generating preview. Please try again.');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });

    async function fetchUrlMetadata(url) {
        try {
            // Use a proxy to avoid CORS issues
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            // Parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            // Extract metadata
            const metadata = {
                title: doc.querySelector('title')?.textContent || url,
                description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                image: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                       doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
                siteName: doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || 
                         new URL(url).hostname
            };

            return metadata;
        } catch (error) {
            console.error('Error fetching metadata:', error);
            throw error;
        }
    }

    function generatePreview(metadata, platform) {
        let html = '';
        let code = '';

        switch (platform) {
            case 'facebook':
                html = generateFacebookPreview(metadata);
                code = generateFacebookCode(metadata);
                break;
            case 'twitter':
                html = generateTwitterPreview(metadata);
                code = generateTwitterCode(metadata);
                break;
            case 'linkedin':
                html = generateLinkedInPreview(metadata);
                code = generateLinkedInCode(metadata);
                break;
            case 'whatsapp':
                html = generateWhatsAppPreview(metadata);
                code = generateWhatsAppCode(metadata);
                break;
            default:
                html = generateDefaultPreview(metadata);
                code = generateDefaultCode(metadata);
        }

        return { html, code };
    }

    function generateDefaultPreview(metadata) {
        return `
            <div class="card">
                ${metadata.image ? `<img src="${metadata.image}" class="card-img-top preview-image" alt="${metadata.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${metadata.title}</h5>
                    <p class="card-text">${metadata.description}</p>
                    <small class="text-muted">${metadata.siteName}</small>
                </div>
            </div>
        `;
    }

    function generateDefaultCode(metadata) {
        return `
<meta property="og:title" content="${metadata.title}">
<meta property="og:description" content="${metadata.description}">
<meta property="og:image" content="${metadata.image}">
<meta property="og:site_name" content="${metadata.siteName}">
        `;
    }

    function generateFacebookPreview(metadata) {
        return `
            <div class="card">
                ${metadata.image ? `<img src="${metadata.image}" class="card-img-top preview-image" alt="${metadata.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${metadata.title}</h5>
                    <p class="card-text">${metadata.description}</p>
                    <small class="text-muted">${metadata.siteName}</small>
                </div>
            </div>
        `;
    }

    function generateFacebookCode(metadata) {
        return `
<meta property="og:title" content="${metadata.title}">
<meta property="og:description" content="${metadata.description}">
<meta property="og:image" content="${metadata.image}">
<meta property="og:url" content="${document.getElementById('url').value}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${metadata.siteName}">
        `;
    }

    function generateTwitterPreview(metadata) {
        return `
            <div class="card">
                ${metadata.image ? `<img src="${metadata.image}" class="card-img-top preview-image" alt="${metadata.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${metadata.title}</h5>
                    <p class="card-text">${metadata.description}</p>
                    <small class="text-muted">${metadata.siteName}</small>
                </div>
            </div>
        `;
    }

    function generateTwitterCode(metadata) {
        return `
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${metadata.title}">
<meta name="twitter:description" content="${metadata.description}">
<meta name="twitter:image" content="${metadata.image}">
        `;
    }

    function generateLinkedInPreview(metadata) {
        return `
            <div class="card">
                ${metadata.image ? `<img src="${metadata.image}" class="card-img-top preview-image" alt="${metadata.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${metadata.title}</h5>
                    <p class="card-text">${metadata.description}</p>
                    <small class="text-muted">${metadata.siteName}</small>
                </div>
            </div>
        `;
    }

    function generateLinkedInCode(metadata) {
        return `
<meta property="og:title" content="${metadata.title}">
<meta property="og:description" content="${metadata.description}">
<meta property="og:image" content="${metadata.image}">
<meta property="og:url" content="${document.getElementById('url').value}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${metadata.siteName}">
        `;
    }

    function generateWhatsAppPreview(metadata) {
        return `
            <div class="card">
                ${metadata.image ? `<img src="${metadata.image}" class="card-img-top preview-image" alt="${metadata.title}">` : ''}
                <div class="card-body">
                    <h5 class="card-title">${metadata.title}</h5>
                    <p class="card-text">${metadata.description}</p>
                    <small class="text-muted">${metadata.siteName}</small>
                </div>
            </div>
        `;
    }

    function generateWhatsAppCode(metadata) {
        return `
<meta property="og:title" content="${metadata.title}">
<meta property="og:description" content="${metadata.description}">
<meta property="og:image" content="${metadata.image}">
<meta property="og:url" content="${document.getElementById('url').value}">
<meta property="og:type" content="website">
        `;
    }

    // Make copyPreview function available globally
    window.copyPreview = function() {
        const code = previewCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Preview code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy code:', err);
            alert('Failed to copy code. Please try again.');
        });
    };
}); 