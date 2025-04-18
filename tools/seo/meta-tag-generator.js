document.addEventListener('DOMContentLoaded', function() {
    const metaTagForm = document.getElementById('metaTagForm');
    const resultDiv = document.getElementById('result');
    const metaTagsOutput = document.getElementById('metaTagsOutput');
    const copyBtn = document.getElementById('copyBtn');

    metaTagForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const keywords = document.getElementById('keywords').value;
        const author = document.getElementById('author').value;
        const robots = document.getElementById('robots').value;
        const viewport = document.getElementById('viewport').value;
        const canonical = document.getElementById('canonical').value;

        // Generate meta tags
        let metaTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">`;

        if (keywords) {
            metaTags += `\n<meta name="keywords" content="${keywords}">`;
        }

        if (author) {
            metaTags += `\n<meta name="author" content="${author}">`;
        }

        metaTags += `\n<meta name="robots" content="${robots}">
<meta name="viewport" content="${viewport}">`;

        if (canonical) {
            metaTags += `\n<link rel="canonical" href="${canonical}">`;
        }

        // Open Graph Meta Tags
        metaTags += `\n\n<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">`;

        if (canonical) {
            metaTags += `\n<meta property="og:url" content="${canonical}">`;
        }

        // Twitter Meta Tags
        metaTags += `\n\n<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;

        if (canonical) {
            metaTags += `\n<meta property="twitter:url" content="${canonical}">`;
        }

        // Display the generated meta tags
        metaTagsOutput.textContent = metaTags;
        resultDiv.style.display = 'block';
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', function() {
        const text = metaTagsOutput.textContent;
        navigator.clipboard.writeText(text).then(function() {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(function() {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    });
}); 