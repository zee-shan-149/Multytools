document.addEventListener('DOMContentLoaded', function() {
    const indexCheckForm = document.getElementById('indexCheckForm');
    const resultSection = document.getElementById('resultSection');
    const indexStatus = document.getElementById('indexStatus');
    const indexDetails = document.getElementById('indexDetails');
    const specificPageInput = document.getElementById('specificPageInput');
    const checkTypeRadios = document.querySelectorAll('input[name="checkType"]');

    // Show/hide specific page input based on radio selection
    checkTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            specificPageInput.classList.toggle('d-none', this.value !== 'specific');
        });
    });

    indexCheckForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const websiteUrl = document.getElementById('websiteUrl').value;
        const checkType = document.querySelector('input[name="checkType"]:checked').value;
        const pageUrl = document.getElementById('pageUrl').value;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        indexStatus.className = 'index-status loading';
        indexStatus.innerHTML = '<i class="bi bi-hourglass-split"></i> Checking...';
        indexDetails.innerHTML = '';
        
        // In a real implementation, you would make an API call here
        // For now, we'll simulate the check with a timeout
        setTimeout(() => {
            checkIndexStatus(websiteUrl, checkType, pageUrl);
        }, 2000);
    });

    function checkIndexStatus(websiteUrl, checkType, pageUrl) {
        // This is a simulation - in a real implementation, you would:
        // 1. Use Google Search Console API
        // 2. Or use Google Custom Search API
        // 3. Or implement a site: search query
        const isIndexed = Math.random() > 0.5; // Simulating random result
        
        if (isIndexed) {
            indexStatus.className = 'index-status indexed';
            indexStatus.innerHTML = '<i class="bi bi-check-circle"></i> Page is Indexed';
            
            const details = `
                <div class="mt-3">
                    <p><strong>URL:</strong> ${checkType === 'homepage' ? websiteUrl : pageUrl}</p>
                    <p><strong>Last Crawled:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Status:</strong> Successfully indexed by Google</p>
                </div>
            `;
            indexDetails.innerHTML = details;
        } else {
            indexStatus.className = 'index-status not-indexed';
            indexStatus.innerHTML = '<i class="bi bi-x-circle"></i> Page is Not Indexed';
            
            const details = `
                <div class="mt-3">
                    <p><strong>URL:</strong> ${checkType === 'homepage' ? websiteUrl : pageUrl}</p>
                    <p><strong>Status:</strong> Not found in Google's index</p>
                    <div class="alert alert-warning mt-3">
                        <h5>Recommendations:</h5>
                        <ul>
                            <li>Submit your URL to Google Search Console</li>
                            <li>Check if the page is blocked by robots.txt</li>
                            <li>Ensure the page has proper meta tags</li>
                            <li>Create quality backlinks to the page</li>
                        </ul>
                    </div>
                </div>
            `;
            indexDetails.innerHTML = details;
        }
    }
}); 