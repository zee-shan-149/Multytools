document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mobileTestForm');
    const resultSection = document.getElementById('resultSection');
    const testStatus = document.getElementById('testStatus');
    const issuesList = document.getElementById('issuesList');
    const recommendationsList = document.getElementById('recommendations');
    const mobilePreview = document.getElementById('mobilePreview');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pageUrl = document.getElementById('pageUrl').value;
        
        // Show loading state
        resultSection.classList.remove('d-none');
        testStatus.className = 'test-status loading';
        testStatus.innerHTML = '<i class="bi bi-hourglass-split"></i> Analyzing...';
        
        // Clear previous results
        issuesList.innerHTML = '';
        recommendationsList.innerHTML = '';
        mobilePreview.innerHTML = '';
        
        // Simulate API call with timeout
        setTimeout(() => {
            testMobileFriendliness(pageUrl);
        }, 2000);
    });

    function testMobileFriendliness(url) {
        try {
            // Simulated test results (in a real implementation, this would come from an API)
            const testResults = {
                viewport: {
                    score: 90,
                    hasViewportMeta: true,
                    initialScale: 1.0
                },
                text: {
                    score: 85,
                    fontSizeIssues: 2,
                    lineHeightIssues: 1
                },
                touch: {
                    score: 80,
                    smallTouchTargets: 3,
                    closeElements: 2
                },
                content: {
                    score: 95,
                    horizontalScroll: false,
                    contentWidth: '100%'
                },
                issues: [
                    {
                        type: 'text',
                        message: 'Some text elements are too small (less than 16px)',
                        severity: 'warning'
                    },
                    {
                        type: 'touch',
                        message: 'Some touch targets are too close together',
                        severity: 'warning'
                    },
                    {
                        type: 'viewport',
                        message: 'Viewport meta tag is missing initial-scale',
                        severity: 'error'
                    }
                ]
            };

            // Update metrics
            updateMetrics(testResults);

            // Update test status
            const hasErrors = testResults.issues.some(issue => issue.severity === 'error');
            const hasWarnings = testResults.issues.some(issue => issue.severity === 'warning');
            
            if (hasErrors) {
                testStatus.className = 'test-status status-fail';
                testStatus.innerHTML = '<i class="bi bi-x-circle"></i> Not Mobile-Friendly';
            } else if (hasWarnings) {
                testStatus.className = 'test-status status-warning';
                testStatus.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Needs Improvement';
            } else {
                testStatus.className = 'test-status status-pass';
                testStatus.innerHTML = '<i class="bi bi-check-circle"></i> Mobile-Friendly';
            }

            // Display issues
            testResults.issues.forEach(issue => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <i class="bi ${issue.severity === 'error' ? 'bi-x-circle text-danger' : 'bi-exclamation-triangle text-warning'}"></i>
                    ${issue.message}
                `;
                issuesList.appendChild(li);
            });

            // Generate recommendations
            generateRecommendations(testResults);

            // Simulate mobile preview
            simulateMobilePreview(url);
        } catch (error) {
            testStatus.className = 'test-status status-fail';
            testStatus.innerHTML = '<i class="bi bi-x-circle"></i> Error testing mobile-friendliness';
            const li = document.createElement('li');
            li.innerHTML = `<i class="bi bi-x-circle text-danger"></i> ${error.message}`;
            issuesList.appendChild(li);
        }
    }

    function updateMetrics(results) {
        // Update viewport score
        document.getElementById('viewportScore').textContent = `${results.viewport.score}%`;
        document.querySelector('#viewportScore + .progress .progress-bar').style.width = `${results.viewport.score}%`;

        // Update text score
        document.getElementById('textScore').textContent = `${results.text.score}%`;
        document.querySelector('#textScore + .progress .progress-bar').style.width = `${results.text.score}%`;

        // Update touch score
        document.getElementById('touchScore').textContent = `${results.touch.score}%`;
        document.querySelector('#touchScore + .progress .progress-bar').style.width = `${results.touch.score}%`;

        // Update content score
        document.getElementById('contentScore').textContent = `${results.content.score}%`;
        document.querySelector('#contentScore + .progress .progress-bar').style.width = `${results.content.score}%`;
    }

    function generateRecommendations(results) {
        const recommendations = [];

        // Viewport recommendations
        if (!results.viewport.hasViewportMeta) {
            recommendations.push({
                icon: 'bi-phone',
                text: 'Add viewport meta tag to ensure proper mobile rendering'
            });
        }

        // Text recommendations
        if (results.text.fontSizeIssues > 0) {
            recommendations.push({
                icon: 'bi-text-paragraph',
                text: 'Increase font size for better readability on mobile devices'
            });
        }

        // Touch recommendations
        if (results.touch.smallTouchTargets > 0) {
            recommendations.push({
                icon: 'bi-hand-index',
                text: 'Increase size of touch targets to at least 44x44 pixels'
            });
        }

        // Content recommendations
        if (results.content.horizontalScroll) {
            recommendations.push({
                icon: 'bi-arrows-angle-contract',
                text: 'Fix content width to prevent horizontal scrolling'
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
            li.innerHTML = '<i class="bi bi-check-circle"></i> Your page is mobile-friendly! Keep up the good work.';
            recommendationsList.appendChild(li);
        }
    }

    function simulateMobilePreview(url) {
        // In a real implementation, this would use an iframe or API to show the actual page
        mobilePreview.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>Mobile Preview</h3>
                <p>This is a simulated mobile preview of your page.</p>
                <p>In a real implementation, this would show the actual page rendered in a mobile viewport.</p>
            </div>
        `;
    }
}); 