document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('speedCheckForm');
    const resultSection = document.getElementById('resultSection');
    const speedScore = document.getElementById('speedScore');
    const recommendationsList = document.getElementById('recommendations');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pageUrl = document.getElementById('pageUrl').value;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        speedScore.className = 'speed-score loading';
        speedScore.innerHTML = '<i class="bi bi-hourglass-split"></i> Analyzing...';
        
        // Clear previous recommendations
        recommendationsList.innerHTML = '';
        
        // Simulate API call with timeout
        setTimeout(() => {
            checkPageSpeed(pageUrl);
        }, 2000);
    });

    function checkPageSpeed(url) {
        // Simulated metrics (in a real implementation, these would come from an API)
        const metrics = {
            fcp: Math.random() * 3, // First Contentful Paint in seconds
            lcp: Math.random() * 4, // Largest Contentful Paint in seconds
            tti: Math.random() * 5, // Time to Interactive in seconds
            tbt: Math.random() * 300 // Total Blocking Time in milliseconds
        };

        // Calculate overall score (0-100)
        const score = calculateOverallScore(metrics);
        
        // Update UI with results
        updateMetrics(metrics);
        updateScore(score);
        generateRecommendations(metrics);
    }

    function calculateOverallScore(metrics) {
        // Weighted scoring system
        const weights = {
            fcp: 0.3,
            lcp: 0.3,
            tti: 0.2,
            tbt: 0.2
        };

        // Convert metrics to scores (0-100)
        const fcpScore = Math.max(0, 100 - (metrics.fcp * 20));
        const lcpScore = Math.max(0, 100 - (metrics.lcp * 15));
        const ttiScore = Math.max(0, 100 - (metrics.tti * 10));
        const tbtScore = Math.max(0, 100 - (metrics.tbt / 10));

        // Calculate weighted average
        return Math.round(
            fcpScore * weights.fcp +
            lcpScore * weights.lcp +
            ttiScore * weights.tti +
            tbtScore * weights.tbt
        );
    }

    function updateMetrics(metrics) {
        // Update FCP
        document.getElementById('fcpScore').textContent = `${metrics.fcp.toFixed(2)}s`;
        document.querySelector('#fcpScore + .progress .progress-bar').style.width = 
            `${Math.max(0, 100 - (metrics.fcp * 20))}%`;

        // Update LCP
        document.getElementById('lcpScore').textContent = `${metrics.lcp.toFixed(2)}s`;
        document.querySelector('#lcpScore + .progress .progress-bar').style.width = 
            `${Math.max(0, 100 - (metrics.lcp * 15))}%`;

        // Update TTI
        document.getElementById('ttiScore').textContent = `${metrics.tti.toFixed(2)}s`;
        document.querySelector('#ttiScore + .progress .progress-bar').style.width = 
            `${Math.max(0, 100 - (metrics.tti * 10))}%`;

        // Update TBT
        document.getElementById('tbtScore').textContent = `${Math.round(metrics.tbt)}ms`;
        document.querySelector('#tbtScore + .progress .progress-bar').style.width = 
            `${Math.max(0, 100 - (metrics.tbt / 10))}%`;
    }

    function updateScore(score) {
        let scoreClass = 'score-low';
        let scoreIcon = '<i class="bi bi-exclamation-triangle"></i>';
        
        if (score >= 90) {
            scoreClass = 'score-high';
            scoreIcon = '<i class="bi bi-check-circle"></i>';
        } else if (score >= 50) {
            scoreClass = 'score-medium';
            scoreIcon = '<i class="bi bi-exclamation-circle"></i>';
        }

        speedScore.className = `speed-score ${scoreClass}`;
        speedScore.innerHTML = `${scoreIcon} ${score}/100`;
    }

    function generateRecommendations(metrics) {
        const recommendations = [];

        // FCP recommendations
        if (metrics.fcp > 1.8) {
            recommendations.push({
                icon: 'bi-lightning',
                text: 'Optimize First Contentful Paint by reducing server response time and minimizing render-blocking resources'
            });
        }

        // LCP recommendations
        if (metrics.lcp > 2.5) {
            recommendations.push({
                icon: 'bi-image',
                text: 'Improve Largest Contentful Paint by optimizing images and using proper image formats'
            });
        }

        // TTI recommendations
        if (metrics.tti > 3.8) {
            recommendations.push({
                icon: 'bi-cpu',
                text: 'Reduce Time to Interactive by minimizing JavaScript execution and optimizing third-party code'
            });
        }

        // TBT recommendations
        if (metrics.tbt > 200) {
            recommendations.push({
                icon: 'bi-hourglass-split',
                text: 'Decrease Total Blocking Time by breaking up long tasks and optimizing JavaScript'
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
            li.innerHTML = '<i class="bi bi-check-circle"></i> Your page speed is good! Keep up the good work.';
            recommendationsList.appendChild(li);
        }
    }
}); 