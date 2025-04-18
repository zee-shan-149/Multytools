document.addEventListener('DOMContentLoaded', function() {
    const robotsForm = document.getElementById('robotsForm');
    const resultSection = document.getElementById('resultSection');
    const robotsOutput = document.getElementById('robotsOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const addRuleBtn = document.getElementById('addRuleBtn');
    const userAgentRules = document.getElementById('userAgentRules');

    // Add new rule button functionality
    addRuleBtn.addEventListener('click', function() {
        const newRule = document.createElement('div');
        newRule.className = 'user-agent-rule mb-3';
        newRule.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">User-agent</label>
                    <select class="form-select user-agent-select">
                        <option value="*">All (*)</option>
                        <option value="Googlebot">Googlebot</option>
                        <option value="Bingbot">Bingbot</option>
                        <option value="Slurp">Yahoo! Slurp</option>
                        <option value="DuckDuckBot">DuckDuckBot</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Action</label>
                    <select class="form-select action-select">
                        <option value="allow">Allow</option>
                        <option value="disallow">Disallow</option>
                    </select>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-11">
                    <label class="form-label">Path</label>
                    <input type="text" class="form-control path-input" placeholder="/admin/">
                </div>
                <div class="col-1 d-flex align-items-end">
                    <button type="button" class="btn btn-outline-danger btn-sm remove-rule">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        userAgentRules.appendChild(newRule);
    });

    // Remove rule functionality
    userAgentRules.addEventListener('click', function(e) {
        if (e.target.closest('.remove-rule')) {
            e.target.closest('.user-agent-rule').remove();
        }
    });

    robotsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sitemapUrl = document.getElementById('sitemapUrl').value;
        const crawlDelay = document.getElementById('crawlDelay').value;
        
        // Show loading state
        robotsOutput.textContent = 'Generating robots.txt...';
        resultSection.classList.remove('d-none');
        
        // Generate robots.txt content
        setTimeout(() => {
            generateRobotsTxt(sitemapUrl, crawlDelay);
        }, 500);
    });

    copyBtn.addEventListener('click', function() {
        const text = robotsOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    downloadBtn.addEventListener('click', function() {
        const text = robotsOutput.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robots.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function generateRobotsTxt(sitemapUrl, crawlDelay) {
        let robotsTxt = '';
        
        // Add sitemap if provided
        if (sitemapUrl) {
            robotsTxt += `Sitemap: ${sitemapUrl}\n\n`;
        }

        // Get all rules
        const rules = document.querySelectorAll('.user-agent-rule');
        let currentUserAgent = null;

        rules.forEach(rule => {
            const userAgent = rule.querySelector('.user-agent-select').value;
            const action = rule.querySelector('.action-select').value;
            const path = rule.querySelector('.path-input').value;

            // Add user-agent line if it's different from the previous one
            if (userAgent !== currentUserAgent) {
                if (currentUserAgent !== null) {
                    robotsTxt += '\n';
                }
                robotsTxt += `User-agent: ${userAgent}\n`;
                currentUserAgent = userAgent;
            }

            // Add allow/disallow line
            robotsTxt += `${action.charAt(0).toUpperCase() + action.slice(1)}: ${path}\n`;
        });

        // Add crawl-delay if provided
        if (crawlDelay) {
            robotsTxt += `\nCrawl-delay: ${crawlDelay}\n`;
        }

        robotsOutput.textContent = robotsTxt;
    }
}); 