document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sitemapValidatorForm');
    const resultSection = document.getElementById('resultSection');
    const validationStatus = document.getElementById('validationStatus');
    const urlList = document.getElementById('urlList');
    const errorDetails = document.getElementById('errorDetails');
    const errorMessage = document.getElementById('errorMessage');
    const recommendationsList = document.getElementById('recommendations');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sitemapUrl = document.getElementById('sitemapUrl').value;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        validationStatus.className = 'validation-status loading';
        validationStatus.innerHTML = '<i class="bi bi-hourglass-split"></i> Validating...';
        
        // Clear previous results
        urlList.innerHTML = '';
        errorDetails.classList.add('d-none');
        recommendationsList.innerHTML = '';
        
        // Simulate API call with timeout
        setTimeout(() => {
            validateSitemap(sitemapUrl);
        }, 2000);
    });

    function validateSitemap(url) {
        try {
            // Simulated sitemap data (in a real implementation, this would be fetched from the URL)
            const sitemapData = {
                urls: [
                    { url: 'https://example.com/', lastmod: '2024-03-15', changefreq: 'daily', priority: '1.0' },
                    { url: 'https://example.com/about', lastmod: '2024-03-14', changefreq: 'monthly', priority: '0.8' },
                    { url: 'https://example.com/contact', lastmod: '2024-03-13', changefreq: 'monthly', priority: '0.7' },
                    { url: 'https://example.com/invalid-url', lastmod: '2024-03-12', changefreq: 'weekly', priority: '0.5' }
                ],
                errors: [
                    { url: 'https://example.com/invalid-url', error: '404 Not Found' }
                ]
            };

            // Update statistics
            document.getElementById('totalUrls').textContent = sitemapData.urls.length;
            document.getElementById('validUrls').textContent = sitemapData.urls.length - sitemapData.errors.length;
            document.getElementById('invalidUrls').textContent = sitemapData.errors.length;

            // Update validation status
            if (sitemapData.errors.length === 0) {
                validationStatus.className = 'validation-status status-valid';
                validationStatus.innerHTML = '<i class="bi bi-check-circle"></i> Sitemap is valid';
            } else if (sitemapData.errors.length === sitemapData.urls.length) {
                validationStatus.className = 'validation-status status-invalid';
                validationStatus.innerHTML = '<i class="bi bi-x-circle"></i> Sitemap is invalid';
            } else {
                validationStatus.className = 'validation-status status-warning';
                validationStatus.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Sitemap has issues';
            }

            // Display URLs
            sitemapData.urls.forEach(urlData => {
                const li = document.createElement('li');
                const isInvalid = sitemapData.errors.some(error => error.url === urlData.url);
                
                li.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <i class="bi ${isInvalid ? 'bi-x-circle text-danger' : 'bi-check-circle text-success'}"></i>
                            <a href="${urlData.url}" target="_blank">${urlData.url}</a>
                        </div>
                        <div class="text-muted">
                            <small>Last modified: ${urlData.lastmod}</small>
                        </div>
                    </div>
                    <div class="mt-2">
                        <span class="badge bg-secondary">${urlData.changefreq}</span>
                        <span class="badge bg-info">Priority: ${urlData.priority}</span>
                    </div>
                `;
                
                urlList.appendChild(li);
            });

            // Display errors if any
            if (sitemapData.errors.length > 0) {
                errorDetails.classList.remove('d-none');
                errorMessage.textContent = sitemapData.errors.map(error => 
                    `URL: ${error.url}\nError: ${error.error}`
                ).join('\n\n');
            }

            // Generate recommendations
            generateRecommendations(sitemapData);
        } catch (error) {
            validationStatus.className = 'validation-status status-invalid';
            validationStatus.innerHTML = '<i class="bi bi-x-circle"></i> Error validating sitemap';
            errorDetails.classList.remove('d-none');
            errorMessage.textContent = error.message;
        }
    }

    function generateRecommendations(sitemapData) {
        const recommendations = [];

        // Check for missing required attributes
        const hasMissingAttributes = sitemapData.urls.some(url => 
            !url.lastmod || !url.changefreq || !url.priority
        );
        if (hasMissingAttributes) {
            recommendations.push({
                icon: 'bi-info-circle',
                text: 'Add missing attributes (lastmod, changefreq, priority) to all URLs'
            });
        }

        // Check for invalid URLs
        if (sitemapData.errors.length > 0) {
            recommendations.push({
                icon: 'bi-exclamation-triangle',
                text: 'Fix invalid URLs or remove them from the sitemap'
            });
        }

        // Check for sitemap size
        if (sitemapData.urls.length > 50000) {
            recommendations.push({
                icon: 'bi-file-earmark-text',
                text: 'Consider splitting the sitemap into multiple files as it exceeds 50,000 URLs'
            });
        }

        // Check for update frequency
        const oldUrls = sitemapData.urls.filter(url => {
            const lastMod = new Date(url.lastmod);
            const now = new Date();
            const diffDays = Math.floor((now - lastMod) / (1000 * 60 * 60 * 24));
            return diffDays > 365;
        });
        if (oldUrls.length > 0) {
            recommendations.push({
                icon: 'bi-calendar',
                text: 'Update URLs that haven\'t been modified in over a year'
            });
        }

        // Add recommendations to the list
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="bi ${rec.icon}"></i> ${rec.text}`;
            recommendationsList.appendChild(li);
        });

        // If no specific recommendations, add a general one
        if (recommendations.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<i class="bi bi-check-circle"></i> Your sitemap looks good! Keep up the good work.';
            recommendationsList.appendChild(li);
        }
    }
}); 