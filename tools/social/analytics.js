document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('analyticsForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const exportButton = document.getElementById('exportData');
    
    // Chart instances
    let engagementChart = null;
    let postTypesChart = null;

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const platform = document.getElementById('platform').value;
        const timeRange = document.getElementById('timeRange').value;
        const username = document.getElementById('username').value;
        const apiKey = document.getElementById('apiKey').value;
        
        if (!username) {
            alert('Please enter a username/page name');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        resultsSection.classList.add('d-none');

        try {
            // Fetch real analytics data
            const analyticsData = await fetchAnalyticsData(platform, username, apiKey, timeRange);
            
            // Update metrics
            updateMetrics(analyticsData.metrics);
            
            // Update charts
            updateCharts(analyticsData.charts);
            
            // Update top posts table
            updateTopPosts(analyticsData.topPosts);
            
            // Generate recommendations
            generateRecommendations(analyticsData.metrics);
            
            // Show results
            loadingIndicator.style.display = 'none';
            resultsSection.classList.remove('d-none');
        } catch (error) {
            console.error('Error fetching analytics:', error);
            alert('Error fetching analytics data. Please check your API key and try again.');
            loadingIndicator.style.display = 'none';
        }
    });

    async function fetchAnalyticsData(platform, username, apiKey, timeRange) {
        // API endpoints for different platforms
        const apiEndpoints = {
            instagram: `https://graph.instagram.com/v12.0/${username}/insights?metric=impressions,reach,engagement&access_token=${apiKey}`,
            facebook: `https://graph.facebook.com/v12.0/${username}/insights?metric=page_impressions,page_engaged_users&access_token=${apiKey}`,
            twitter: `https://api.twitter.com/2/users/${username}/tweets?tweet.fields=public_metrics&max_results=100`,
            linkedin: `https://api.linkedin.com/v2/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${username}`,
            tiktok: `https://open.tiktokapis.com/v2/user/info/?fields=username,follower_count,following_count,likes_count,video_count`
        };

        try {
            const response = await fetch(apiEndpoints[platform], {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return processAnalyticsData(data, platform, timeRange);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    function processAnalyticsData(data, platform, timeRange) {
        // Process data based on platform
        switch (platform) {
            case 'instagram':
                return processInstagramData(data, timeRange);
            case 'facebook':
                return processFacebookData(data, timeRange);
            case 'twitter':
                return processTwitterData(data, timeRange);
            case 'linkedin':
                return processLinkedInData(data, timeRange);
            case 'tiktok':
                return processTikTokData(data, timeRange);
            default:
                throw new Error('Unsupported platform');
        }
    }

    function processInstagramData(data, timeRange) {
        const metrics = {
            followers: data.followers_count || 0,
            followersChange: calculateChange(data.followers_count, data.previous_followers_count),
            engagementRate: calculateEngagementRate(data.engagement, data.impressions),
            engagementChange: calculateChange(data.engagement, data.previous_engagement),
            postCount: data.media_count || 0,
            postsChange: calculateChange(data.media_count, data.previous_media_count),
            reach: data.reach || 0,
            reachChange: calculateChange(data.reach, data.previous_reach)
        };

        const charts = {
            engagement: {
                labels: generateDateLabels(timeRange),
                data: data.engagement_over_time || []
            },
            postTypes: {
                labels: ['Image', 'Video', 'Carousel', 'Story'],
                data: [
                    data.image_posts || 0,
                    data.video_posts || 0,
                    data.carousel_posts || 0,
                    data.story_posts || 0
                ]
            }
        };

        const topPosts = data.top_posts || [];

        return { metrics, charts, topPosts };
    }

    function processFacebookData(data, timeRange) {
        // Similar processing for Facebook data
        // Implementation depends on Facebook API response structure
    }

    function processTwitterData(data, timeRange) {
        // Similar processing for Twitter data
        // Implementation depends on Twitter API response structure
    }

    function processLinkedInData(data, timeRange) {
        // Similar processing for LinkedIn data
        // Implementation depends on LinkedIn API response structure
    }

    function processTikTokData(data, timeRange) {
        // Similar processing for TikTok data
        // Implementation depends on TikTok API response structure
    }

    function calculateChange(current, previous) {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }

    function calculateEngagementRate(engagement, impressions) {
        if (!impressions || impressions === 0) return 0;
        return ((engagement / impressions) * 100).toFixed(1);
    }

    function generateDateLabels(timeRange) {
        const days = parseInt(timeRange);
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
        }
        return labels;
    }

    function updateMetrics(metrics) {
        // Update followers
        document.getElementById('followersCount').textContent = metrics.followers.toLocaleString();
        updateTrendIndicator('followersTrend', metrics.followersChange);

        // Update engagement rate
        document.getElementById('engagementRate').textContent = `${metrics.engagementRate}%`;
        updateTrendIndicator('engagementTrend', metrics.engagementChange);

        // Update post count
        document.getElementById('postCount').textContent = metrics.postCount;
        updateTrendIndicator('postsTrend', metrics.postsChange);

        // Update reach
        document.getElementById('reachCount').textContent = metrics.reach.toLocaleString();
        updateTrendIndicator('reachTrend', metrics.reachChange);
    }

    function updateTrendIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
        
        if (change > 0) {
            element.innerHTML = `<i class="bi bi-arrow-up trend-up">${change}%</i>`;
        } else if (change < 0) {
            element.innerHTML = `<i class="bi bi-arrow-down trend-down">${Math.abs(change)}%</i>`;
        } else {
            element.innerHTML = '<i class="bi bi-dash">0%</i>';
        }
    }

    function updateCharts(charts) {
        // Update engagement chart
        if (engagementChart) {
            engagementChart.destroy();
        }
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        engagementChart = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: charts.engagement.labels,
                datasets: [{
                    label: 'Engagement',
                    data: charts.engagement.data,
                    borderColor: '#0d6efd',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Update post types chart
        if (postTypesChart) {
            postTypesChart.destroy();
        }
        const postTypesCtx = document.getElementById('postTypesChart').getContext('2d');
        postTypesChart = new Chart(postTypesCtx, {
            type: 'doughnut',
            data: {
                labels: charts.postTypes.labels,
                datasets: [{
                    data: charts.postTypes.data,
                    backgroundColor: [
                        '#0d6efd',
                        '#198754',
                        '#ffc107',
                        '#dc3545'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    function updateTopPosts(posts) {
        const tableBody = document.getElementById('topPostsTable');
        tableBody.innerHTML = '';
        
        posts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.date}</td>
                <td>${post.type}</td>
                <td>${post.engagement.toLocaleString()}</td>
                <td>${post.reach.toLocaleString()}</td>
                <td>${post.likes.toLocaleString()}</td>
                <td>${post.comments.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function generateRecommendations(metrics) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        
        const recommendations = [
            {
                condition: metrics.engagementRate < 3,
                text: 'Your engagement rate is below average. Try posting more interactive content and engaging with your audience.'
            },
            {
                condition: metrics.postCount < 20,
                text: 'Consider increasing your posting frequency to maintain audience engagement.'
            },
            {
                condition: metrics.followersChange < 0,
                text: 'Your follower growth is negative. Review your content strategy and posting times.'
            },
            {
                condition: metrics.reach < 10000,
                text: 'Your content reach is limited. Try using more relevant hashtags and posting at optimal times.'
            }
        ];

        const applicableRecommendations = recommendations.filter(rec => rec.condition);
        
        if (applicableRecommendations.length === 0) {
            recommendationsList.innerHTML = '<p class="text-success">Your social media performance is good! Keep up the great work.</p>';
        } else {
            const list = document.createElement('ul');
            list.className = 'list-group';
            
            applicableRecommendations.forEach(rec => {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.textContent = rec.text;
                list.appendChild(item);
            });
            
            recommendationsList.appendChild(list);
        }
    }

    // Handle export
    exportButton.addEventListener('click', function() {
        const data = {
            metrics: {
                followers: document.getElementById('followersCount').textContent,
                engagementRate: document.getElementById('engagementRate').textContent,
                postCount: document.getElementById('postCount').textContent,
                reach: document.getElementById('reachCount').textContent
            },
            platform: document.getElementById('platform').value,
            timeRange: document.getElementById('timeRange').value,
            username: document.getElementById('username').value
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `social-media-analytics-${data.username}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    });
}); 