document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('hashtagForm');
    const keywordInput = document.getElementById('keyword');
    const platformSelect = document.getElementById('platform');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const hashtagList = document.getElementById('hashtagList');
    const trendingHashtags = document.getElementById('trendingHashtags');
    const copyAllButton = document.getElementById('copyAllHashtags');
    const downloadButton = document.getElementById('downloadHashtags');
    const categoryButtons = document.querySelectorAll('.category-badge');

    // Hashtag database
    const hashtagDatabase = {
        general: [
            '#trending', '#viral', '#instagood', '#photooftheday', '#like4like',
            '#follow4follow', '#instadaily', '#picoftheday', '#instamood', '#instalike'
        ],
        business: [
            '#entrepreneur', '#business', '#startup', '#marketing', '#success',
            '#leadership', '#innovation', '#digitalmarketing', '#smallbusiness', '#entrepreneurship'
        ],
        lifestyle: [
            '#lifestyle', '#life', '#motivation', '#inspiration', '#happy',
            '#love', '#instalife', '#lifestyleblogger', '#lifestylephotography', '#lifestylegoals'
        ],
        tech: [
            '#technology', '#tech', '#innovation', '#digital', '#future',
            '#science', '#engineering', '#programming', '#coding', '#artificialintelligence'
        ],
        travel: [
            '#travel', '#travelgram', '#wanderlust', '#adventure', '#explore',
            '#vacation', '#travelphotography', '#traveltheworld', '#travelblogger', '#traveling'
        ],
        food: [
            '#food', '#foodie', '#foodporn', '#instafood', '#yummy',
            '#delicious', '#foodphotography', '#foodstagram', '#homemade', '#cooking'
        ],
        fashion: [
            '#fashion', '#style', '#ootd', '#outfit', '#fashionista',
            '#streetstyle', '#fashionblogger', '#stylish', '#fashionstyle', '#fashiongram'
        ],
        fitness: [
            '#fitness', '#workout', '#gym', '#fit', '#healthylifestyle',
            '#training', '#motivation', '#bodybuilding', '#fitnessmotivation', '#fitlife'
        ]
    };

    // Trending hashtags by platform
    const trendingByPlatform = {
        instagram: [
            '#instagood', '#photooftheday', '#instamood', '#picoftheday', '#instagram',
            '#instadaily', '#instalike', '#instafollow', '#instalove', '#instacool'
        ],
        twitter: [
            '#trending', '#viral', '#news', '#breaking', '#twitter',
            '#tweet', '#follow', '#retweet', '#twitterverse', '#socialmedia'
        ],
        facebook: [
            '#facebook', '#socialmedia', '#community', '#friends', '#family',
            '#share', '#like', '#comment', '#follow', '#facebooklive'
        ],
        linkedin: [
            '#linkedin', '#career', '#professional', '#networking', '#business',
            '#job', '#work', '#success', '#leadership', '#entrepreneur'
        ],
        tiktok: [
            '#tiktok', '#viral', '#fyp', '#foryou', '#trending',
            '#tiktokviral', '#tiktoktrend', '#tiktokdance', '#tiktokchallenge', '#tiktokindia'
        ]
    };

    // Handle category selection
    let selectedCategories = new Set(['general']);
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            if (selectedCategories.has(category)) {
                selectedCategories.delete(category);
                this.classList.remove('active');
            } else {
                selectedCategories.add(category);
                this.classList.add('active');
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const keyword = keywordInput.value.trim();
        const platform = platformSelect.value;
        
        if (!keyword) {
            alert('Please enter a keyword or topic');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        resultsSection.classList.add('d-none');

        // Simulate API call
        setTimeout(() => {
            generateHashtags(keyword, platform);
        }, 1000);
    });

    function generateHashtags(keyword, platform) {
        // Clear previous results
        hashtagList.innerHTML = '';
        trendingHashtags.innerHTML = '';

        // Generate hashtags based on keyword and selected categories
        const generatedHashtags = new Set();
        
        // Add keyword-based hashtags
        const keywordVariations = generateKeywordVariations(keyword);
        keywordVariations.forEach(variation => {
            generatedHashtags.add(`#${variation}`);
        });

        // Add category-based hashtags
        selectedCategories.forEach(category => {
            hashtagDatabase[category].forEach(hashtag => {
                generatedHashtags.add(hashtag);
            });
        });

        // Display generated hashtags
        generatedHashtags.forEach(hashtag => {
            const hashtagElement = createHashtagElement(hashtag);
            hashtagList.appendChild(hashtagElement);
        });

        // Display trending hashtags for the selected platform
        trendingByPlatform[platform].forEach(hashtag => {
            const hashtagElement = createHashtagElement(hashtag);
            trendingHashtags.appendChild(hashtagElement);
        });

        // Show results
        loadingIndicator.style.display = 'none';
        resultsSection.classList.remove('d-none');
    }

    function generateKeywordVariations(keyword) {
        const words = keyword.toLowerCase().split(' ');
        const variations = new Set();

        // Add original keyword
        variations.add(words.join(''));

        // Add variations
        words.forEach(word => {
            variations.add(word);
            variations.add(word + 's');
            variations.add(word + 'ing');
        });

        // Add combinations
        if (words.length > 1) {
            variations.add(words.join(''));
            variations.add(words.join('and'));
            variations.add(words.join('or'));
        }

        return Array.from(variations);
    }

    function createHashtagElement(hashtag) {
        const element = document.createElement('div');
        element.className = 'hashtag-item';
        element.textContent = hashtag;
        
        element.addEventListener('click', function() {
            navigator.clipboard.writeText(hashtag)
                .then(() => {
                    this.classList.add('copied');
                    setTimeout(() => {
                        this.classList.remove('copied');
                    }, 1000);
                })
                .catch(err => {
                    console.error('Failed to copy hashtag:', err);
                });
        });

        return element;
    }

    // Handle copy all button
    copyAllButton.addEventListener('click', function() {
        const allHashtags = Array.from(hashtagList.querySelectorAll('.hashtag-item'))
            .map(item => item.textContent)
            .join(' ');
        
        navigator.clipboard.writeText(allHashtags)
            .then(() => {
                alert('All hashtags copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy hashtags:', err);
            });
    });

    // Handle download button
    downloadButton.addEventListener('click', function() {
        const allHashtags = Array.from(hashtagList.querySelectorAll('.hashtag-item'))
            .map(item => item.textContent)
            .join('\n');
        
        const blob = new Blob([allHashtags], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'hashtags.txt';
        link.click();
    });
}); 