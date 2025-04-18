document.addEventListener('DOMContentLoaded', function() {
    const backlinkCheckForm = document.getElementById('backlinkCheckForm');
    const resultSection = document.getElementById('resultSection');
    const backlinksList = document.getElementById('backlinksList');
    const totalBacklinks = document.getElementById('totalBacklinks');
    const referringDomains = document.getElementById('referringDomains');
    const dofollowLinks = document.getElementById('dofollowLinks');
    const nofollowLinks = document.getElementById('nofollowLinks');

    backlinkCheckForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const domainUrl = document.getElementById('domainUrl').value;
        const showDofollow = document.getElementById('showDofollow').checked;
        const showNofollow = document.getElementById('showNofollow').checked;
        const showInternal = document.getElementById('showInternal').checked;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        backlinksList.innerHTML = '<div class="loading"><i class="bi bi-hourglass-split"></i> Analyzing backlinks...</div>';
        
        // In a real implementation, you would make an API call here
        // For now, we'll simulate the check with a timeout
        setTimeout(() => {
            checkBacklinks(domainUrl, showDofollow, showNofollow, showInternal);
        }, 2000);
    });

    function checkBacklinks(domainUrl, showDofollow, showNofollow, showInternal) {
        // This is a simulation - in a real implementation, you would:
        // 1. Use Ahrefs API
        // 2. Or use Moz API
        // 3. Or use SEMrush API
        
        // Simulating backlink data
        const backlinks = generateMockBacklinks(20);
        
        // Filter backlinks based on user preferences
        const filteredBacklinks = backlinks.filter(link => {
            if (!showDofollow && link.type === 'dofollow') return false;
            if (!showNofollow && link.type === 'nofollow') return false;
            if (!showInternal && link.isInternal) return false;
            return true;
        });

        // Update statistics
        const stats = calculateStats(filteredBacklinks);
        updateStats(stats);

        // Display backlinks
        displayBacklinks(filteredBacklinks);
    }

    function generateMockBacklinks(count) {
        const backlinks = [];
        const domains = [
            'example.com', 'blog.example.com', 'news.example.com',
            'techblog.com', 'webdev.net', 'seotools.org',
            'marketingpro.com', 'digitalmarketing.io', 'webmaster.com'
        ];
        
        for (let i = 0; i < count; i++) {
            const isInternal = Math.random() > 0.7;
            const domain = isInternal ? 'example.com' : domains[Math.floor(Math.random() * domains.length)];
            const type = Math.random() > 0.3 ? 'dofollow' : 'nofollow';
            const da = Math.floor(Math.random() * 100);
            
            backlinks.push({
                url: `https://${domain}/article-${i}`,
                anchor: `Link to ${domainUrl}`,
                type: type,
                isInternal: isInternal,
                domainAuthority: da,
                date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            });
        }
        
        return backlinks;
    }

    function calculateStats(backlinks) {
        const stats = {
            total: backlinks.length,
            domains: new Set(backlinks.map(link => new URL(link.url).hostname)).size,
            dofollow: backlinks.filter(link => link.type === 'dofollow').length,
            nofollow: backlinks.filter(link => link.type === 'nofollow').length
        };
        return stats;
    }

    function updateStats(stats) {
        totalBacklinks.textContent = stats.total.toLocaleString();
        referringDomains.textContent = stats.domains.toLocaleString();
        dofollowLinks.textContent = stats.dofollow.toLocaleString();
        nofollowLinks.textContent = stats.nofollow.toLocaleString();
    }

    function displayBacklinks(backlinks) {
        if (backlinks.length === 0) {
            backlinksList.innerHTML = '<div class="alert alert-info">No backlinks found matching your criteria.</div>';
            return;
        }

        const html = backlinks.map(link => `
            <div class="backlink-item">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-1">
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer">
                                ${link.url}
                            </a>
                        </h5>
                        <p class="mb-1">Anchor Text: "${link.anchor}"</p>
                        <div class="d-flex gap-2">
                            <span class="link-type ${link.type}">${link.type}</span>
                            ${link.isInternal ? '<span class="link-type">Internal</span>' : ''}
                            <span class="domain-authority">DA: ${link.domainAuthority}</span>
                        </div>
                    </div>
                    <small class="text-muted">
                        ${link.date.toLocaleDateString()}
                    </small>
                </div>
            </div>
        `).join('');

        backlinksList.innerHTML = html;
    }
}); 