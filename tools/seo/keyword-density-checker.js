document.addEventListener('DOMContentLoaded', function() {
    const contentTextarea = document.getElementById('content');
    const keywordsInput = document.getElementById('keywords');
    const minLengthInput = document.getElementById('minLength');
    const excludeWordsInput = document.getElementById('excludeWords');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsDiv = document.getElementById('results');
    const totalWordsSpan = document.getElementById('totalWords');
    const uniqueWordsSpan = document.getElementById('uniqueWords');
    const keywordTableBody = document.getElementById('keywordTableBody');

    analyzeBtn.addEventListener('click', function() {
        const content = contentTextarea.value.trim();
        if (!content) {
            alert('Please enter some content to analyze.');
            return;
        }

        const minLength = parseInt(minLengthInput.value) || 3;
        const excludeWords = excludeWordsInput.value.split(',').map(word => word.trim().toLowerCase());
        const targetKeywords = keywordsInput.value.split(',').map(word => word.trim().toLowerCase());

        // Process the content
        const words = content.toLowerCase()
            .replace(/[^\w\s]/g, ' ') // Remove special characters
            .split(/\s+/) // Split by whitespace
            .filter(word => word.length >= minLength); // Filter by minimum length

        // Count word occurrences
        const wordCounts = {};
        words.forEach(word => {
            if (!excludeWords.includes(word)) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });

        // Calculate total words and unique words
        const totalWords = words.length;
        const uniqueWords = Object.keys(wordCounts).length;

        // Update statistics
        totalWordsSpan.textContent = totalWords;
        uniqueWordsSpan.textContent = uniqueWords;

        // Prepare keywords to analyze
        const keywordsToAnalyze = targetKeywords.length > 0 ? targetKeywords : Object.keys(wordCounts);

        // Clear previous results
        keywordTableBody.innerHTML = '';

        // Find maximum count for scaling the visual bars
        const maxCount = Math.max(...Object.values(wordCounts));

        // Add rows for each keyword
        keywordsToAnalyze.forEach(keyword => {
            const count = wordCounts[keyword] || 0;
            const density = ((count / totalWords) * 100).toFixed(2);
            const barWidth = (count / maxCount * 100).toFixed(2);

            const row = document.createElement('tr');
            row.className = 'keyword-row';
            row.innerHTML = `
                <td>${keyword}</td>
                <td>${count}</td>
                <td>${density}%</td>
                <td>
                    <div class="density-bar">
                        <div class="density-fill" style="width: ${barWidth}%"></div>
                    </div>
                </td>
            `;
            keywordTableBody.appendChild(row);
        });

        // Show results
        resultsDiv.style.display = 'block';
    });
}); 