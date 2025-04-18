document.addEventListener('DOMContentLoaded', function() {
    const sitemapForm = document.getElementById('sitemapForm');
    const resultSection = document.getElementById('resultSection');
    const sitemapOutput = document.getElementById('sitemapOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    sitemapForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const websiteUrl = document.getElementById('websiteUrl').value;
        const crawlDepth = document.getElementById('crawlDepth').value;
        
        // Show loading state
        sitemapOutput.textContent = 'Generating sitemap...';
        resultSection.classList.remove('d-none');
        
        // In a real implementation, you would make an API call here
        // For now, we'll simulate a basic sitemap generation
        setTimeout(() => {
            generateSitemap(websiteUrl, crawlDepth);
        }, 1000);
    });

    copyBtn.addEventListener('click', function() {
        const text = sitemapOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    downloadBtn.addEventListener('click', function() {
        const text = sitemapOutput.textContent;
        const blob = new Blob([text], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function generateSitemap(url, depth) {
        // Basic XML sitemap structure
        const baseUrl = new URL(url);
        const today = new Date().toISOString().split('T')[0];
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Add homepage
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl.origin}/</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>1.0</priority>\n`;
        xml += `  </url>\n`;
        
        // Simulate some additional pages based on depth
        for (let i = 1; i <= depth; i++) {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl.origin}/page${i}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.${10-i}</priority>\n`;
            xml += `  </url>\n`;
        }
        
        xml += '</urlset>';
        
        sitemapOutput.textContent = xml;
    }
}); 