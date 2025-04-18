document.addEventListener('DOMContentLoaded', function() {
    const contentInput = document.getElementById('content');
    const sizeInput = document.getElementById('size');
    const errorCorrectionSelect = document.getElementById('errorCorrection');
    const foregroundColorInput = document.getElementById('foreground');
    const backgroundColorInput = document.getElementById('background');
    const marginInput = document.getElementById('margin');
    const formatSelect = document.getElementById('format');
    const generateBtn = document.getElementById('generateBtn');
    const resultDiv = document.getElementById('result');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');

    let currentQRCode = null;

    // Handle generate button click
    generateBtn.addEventListener('click', function() {
        const content = contentInput.value.trim();
        if (!content) {
            alert('Please enter some content for the QR code.');
            return;
        }

        const options = {
            width: sizeInput.value,
            height: sizeInput.value,
            color: {
                dark: foregroundColorInput.value,
                light: backgroundColorInput.value
            },
            margin: marginInput.value,
            errorCorrectionLevel: errorCorrectionSelect.value
        };

        // Clear previous QR code
        qrCodeContainer.innerHTML = '';

        // Generate QR code
        if (formatSelect.value === 'svg') {
            QRCode.toString(content, options, function(err, svg) {
                if (err) {
                    alert('Error generating QR code: ' + err);
                    return;
                }
                qrCodeContainer.innerHTML = svg;
                currentQRCode = svg;
                resultDiv.style.display = 'block';
            });
        } else {
            QRCode.toCanvas(content, options, function(err, canvas) {
                if (err) {
                    alert('Error generating QR code: ' + err);
                    return;
                }
                qrCodeContainer.appendChild(canvas);
                currentQRCode = canvas;
                resultDiv.style.display = 'block';
            });
        }
    });

    // Handle download button click
    downloadBtn.addEventListener('click', function() {
        if (!currentQRCode) return;

        const content = contentInput.value.trim();
        const format = formatSelect.value;
        const filename = `qr-code-${content.substring(0, 20)}.${format}`;

        if (format === 'svg') {
            const blob = new Blob([currentQRCode], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            const a = document.createElement('a');
            a.href = currentQRCode.toDataURL('image/png');
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // Handle copy button click
    copyBtn.addEventListener('click', function() {
        if (!currentQRCode) return;

        if (formatSelect.value === 'svg') {
            navigator.clipboard.writeText(currentQRCode)
                .then(() => {
                    showCopyFeedback();
                })
                .catch(err => {
                    alert('Failed to copy QR code: ' + err);
                });
        } else {
            currentQRCode.toBlob(blob => {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]).then(() => {
                    showCopyFeedback();
                }).catch(err => {
                    alert('Failed to copy QR code: ' + err);
                });
            });
        }
    });

    function showCopyFeedback() {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }

    // Auto-generate QR code when content changes
    contentInput.addEventListener('input', function() {
        if (this.value.trim()) {
            generateBtn.click();
        }
    });

    // Update QR code when settings change
    [sizeInput, errorCorrectionSelect, foregroundColorInput, backgroundColorInput, marginInput, formatSelect]
        .forEach(element => {
            element.addEventListener('change', function() {
                if (contentInput.value.trim()) {
                    generateBtn.click();
                }
            });
        });
}); 