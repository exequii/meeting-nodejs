
const {generatePDF} = require('../../infrastructure/utils/pdf');

const downloadCertificatePDF = async (html) => {
    try{
        const pdf = await generatePDF(html);
        return pdf;
    }catch(error){
        throw new Error(error);
    }
}

module.exports = {downloadCertificatePDF}