// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        });

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });

    // Load image tools
    loadImageTools();
});

// Image tools data
const imageTools = [
    {
        id: 'image-to-png',
        title: 'Image to PNG Converter',
        description: 'Convert any image format to PNG',
        icon: '🖼️',
        link: 'tools/image/image-to-png.html'
    },
    {
        id: 'image-to-jpg',
        title: 'Image to JPG Converter',
        description: 'Convert any image format to JPG',
        icon: '🖼️',
        link: 'tools/image/image-to-jpg.html'
    },
    {
        id: 'image-resizer',
        title: 'Image Resizer',
        description: 'Resize your images to any dimension',
        icon: '📏',
        link: 'tools/image/image-resizer.html'
    },
    {
        id: 'image-compressor',
        title: 'Image Compressor',
        description: 'Compress images without losing quality',
        icon: '🗜️',
        link: 'tools/image/image-compressor.html'
    },
    {
        id: 'image-cropper',
        title: 'Image Cropper',
        description: 'Crop images to your desired size',
        icon: '✂️',
        link: 'tools/image/image-cropper.html'
    },
    {
        id: 'image-to-base64',
        title: 'Image to Base64',
        description: 'Convert images to Base64 format',
        icon: '🔢',
        link: 'tools/image/image-to-base64.html'
    },
    {
        id: 'webp-to-png',
        title: 'WebP to PNG',
        description: 'Convert WebP images to PNG format',
        icon: '🔄',
        link: 'tools/image/webp-to-png.html'
    },
    {
        id: 'gif-maker',
        title: 'GIF Maker',
        description: 'Create animated GIFs from images',
        icon: '🎬',
        link: 'tools/image/gif-maker.html'
    },
    {
        id: 'qr-code-generator',
        title: 'QR Code Generator',
        description: 'Generate QR codes from text or URLs',
        icon: '📱',
        link: 'tools/image/qr-code-generator.html'
    },
    {
        id: 'screenshot-to-pdf',
        title: 'Screenshot to PDF',
        description: 'Convert screenshots to PDF format',
        icon: '📸',
        link: 'tools/image/screenshot-to-pdf.html'
    }
];

// Function to load image tools
function loadImageTools() {
    const imageToolsContainer = document.querySelector('#image-tools .row');
    imageToolsContainer.innerHTML = '';

    imageTools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'col-md-4 col-sm-6 mb-4';
        toolCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tool.icon} ${tool.title}</h5>
                    <p class="card-text">${tool.description}</p>
                    <a href="${tool.link}" class="btn btn-primary">Use Tool</a>
                </div>
            </div>
        `;
        imageToolsContainer.appendChild(toolCard);
    });
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.parentElement.style.display = '';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}); 