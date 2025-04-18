document.addEventListener('DOMContentLoaded', function() {
    const authorityCheckForm = document.getElementById('authorityCheckForm');
    const resultSection = document.getElementById('resultSection');
    const authorityScore = document.getElementById('authorityScore');
    const authorityDetails = document.getElementById('authorityDetails');

    authorityCheckForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const domainUrl = document.getElementById('domainUrl').value;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        authorityScore.className = 'authority-score loading';
        authorityScore.innerHTML = '<i class="bi bi-hourglass-split"></i> Analyzing...';
        authorityDetails.innerHTML = '';
        
        // In a real implementation, you would make an API call here
        // For now, we'll simulate the check with a timeout
        setTimeout(() => {
            checkDomainAuthority(domainUrl);
        }, 2000);
    });

    function checkDomainAuthority(domainUrl) {
        // This is a simulation - in a real implementation, you would:
        // 1. Use Moz API for Domain Authority
        // 2. Or use Ahrefs API
        // 3. Or implement your own metrics calculation
        
        // Simulating random scores
        const daScore = Math.floor(Math.random() * 100);
        const paScore = Math.floor(Math.random() * 100);
        const backlinks = Math.floor(Math.random() * 10000);
        const referringDomains = Math.floor(Math.random() * 1000);
        
        // Determine score class
        let scoreClass = 'score-low';
        if (daScore >= 50) {
            scoreClass = 'score-high';
        } else if (daScore >= 30) {
            scoreClass = 'score-medium';
        }
        
        authorityScore.className = `authority-score ${scoreClass}`;
        authorityScore.textContent = daScore;
        
        const details = `
            <div class="row">
                <div class="col-md-6">
                    <div class="metric-card">
                        <h5>Domain Authority (DA)</h5>
                        <div class="metric-value">${daScore}/100</div>
                        <div class="progress mt-2">
                            <div class="progress-bar" role="progressbar" 
                                 style="width: ${daScore}%" 
                                 aria-valuenow="${daScore}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="metric-card">
                        <h5>Page Authority (PA)</h5>
                        <div class="metric-value">${paScore}/100</div>
                        <div class="progress mt-2">
                            <div class="progress-bar" role="progressbar" 
                                 style="width: ${paScore}%" 
                                 aria-valuenow="${paScore}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="metric-card">
                        <h5>Total Backlinks</h5>
                        <div class="metric-value">${backlinks.toLocaleString()}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="metric-card">
                        <h5>Referring Domains</h5>
                        <div class="metric-value">${referringDomains.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <h5>Recommendations:</h5>
                <div class="alert ${daScore >= 50 ? 'alert-success' : 'alert-warning'}">
                    ${daScore >= 50 ? 
                        '<p>Your domain authority is strong! Keep up the good work by:</p>' :
                        '<p>Your domain authority needs improvement. Consider these actions:</p>'
                    }
                    <ul>
                        <li>Create high-quality, shareable content</li>
                        <li>Build relationships with authoritative websites</li>
                        <li>Improve your website's technical SEO</li>
                        <li>Focus on earning natural backlinks</li>
                        <li>Regularly update and maintain your content</li>
                    </ul>
                </div>
            </div>
        `;
        
        authorityDetails.innerHTML = details;
    }
}); 