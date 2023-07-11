const pdf = require('html-pdf');
const path = require('path');

async function generatePDF(html) {
    return new Promise((resolve, reject) => {
        const options = { 
            format: 'Letter',
            phantomPath: "./node_modules/phantomjs/bin/phantomjs"
        };
        //pdf.create(html, options).toFile('Certificate_1.pdf',(err, buffer) => {
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