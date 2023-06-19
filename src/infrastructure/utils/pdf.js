const pdf = require('html-pdf');

async function generatePDF(html) {
    return new Promise((resolve, reject) => {
        const options = { format: 'Letter' };
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}

module.exports = {generatePDF}