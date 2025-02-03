document.addEventListener('DOMContentLoaded', () => {
    // Emotion selection logic
    let selectedEmotion = null;
    const emotionBtns = document.querySelectorAll('.emotion-btn');
    
    emotionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            emotionBtns.forEach(b => b.classList.remove('bg-[var(--light-gold)]', 'border-[var(--deep-saffron)]'));
            
            // Add active state to clicked button
            btn.classList.add('bg-[var(--light-gold)]', 'border-[var(--deep-saffron)]');
            selectedEmotion = btn.textContent.trim();
        });
    });

    // Form submission handler
    document.getElementById('poemForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const names = document.getElementById('names').value.split(',').map(n => n.trim());
        const hindiContainer = document.getElementById('hindi-poem-container');
        const englishContainer = document.getElementById('english-poem-container');
        
        // Validate inputs
        if (!names.length || names.some(n => !n)) {
            alert('Please enter at least one valid name');
            return;
        }
        
        if (!selectedEmotion) {
            alert('Please select an emotion');
            return;
        }

        // Show loading state
        hindiContainer.innerHTML = '<div class="text-center py-4">🌀 Generating Hindi poem...</div>';
        englishContainer.innerHTML = '<div class="text-center py-4">🌀 Generating English poem...</div>';

        try {
            // API call
            const response = await fetch('/generate-poem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names, emotion: selectedEmotion })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Process and display poems
            const [hindiPart, englishPart] = data.poem.split('---').map(p => p.trim());
            
            hindiContainer.innerHTML = `
                <p class="font-devanagari text-lg leading-relaxed">
                    ${hindiPart.replace(/\n/g, '<br>')}
                </p>
            `;
            
            englishContainer.innerHTML = `
                <p class="text-lg leading-relaxed">
                    ${englishPart.replace(/\n/g, '<br>')}
                </p>
            `;

        } catch (error) {
            console.error('Error:', error);
            hindiContainer.innerHTML = '<p class="text-red-600">Error generating poem. Please try again.</p>';
            englishContainer.innerHTML = '<p class="text-red-600">Error generating poem. Please try again.</p>';
            setTimeout(() => {
                hindiContainer.innerHTML = '<p class="text-center">आपकी हिंदी कविता यहाँ दिखाई देगी</p>';
                englishContainer.innerHTML = '<p class="text-center">Your generated English poem will appear here</p>';
            }, 3000);
        }
    });
});