const fs = require("fs");
const PDFDocument = require("pdfkit");
const data = require("./advice-mini"); // Source JSON DATA

const doc = new PDFDocument({
    layout: "portrait",
    size: "A4", // PAGE SIZE
});
// Output PDF
const outputStream = fs.createWriteStream(
    `./outputs/output${Math.floor(Math.random() * 10)}.pdf`
);

doc.pipe(outputStream);

function addContentToPDF(data) {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const person = data[key];

            // For custom font use local font with relative path.
            doc.font("Helvetica-Bold")
                .fontSize(20)
                .text(person.name, { align: "center" });

            const quotes = JSON.parse(person.content);

            quotes.forEach((quote, index) => {
                doc.font("Helvetica-Bold")
                    .fontSize(14)
                    .text(`Advice: ${quote.adviceTitle}`);

                doc.font("Helvetica")
                    .fontSize(12)
                    .text(`- ${quote.advice}`, { continued: true });

                doc.font("Helvetica-Oblique")
                    .fontSize(10)
                    .text(`(Reference: ${quote.reference})`, {
                        continued: true,
                    });

                doc.font("Helvetica-Bold")
                    .fontSize(12)
                    .text(`Question: ${quote.question}`);

                if (index < quotes.length - 1) {
                    doc.moveDown(1);
                }
            });
            if (key !== Object.keys(data)[Object.keys(data).length - 1]) {
                doc.addPage();
            }
        }
    }
}

addContentToPDF(data);

doc.end();

outputStream.on("finish", () => {
    console.log("PDF created successfully.");
});

outputStream.on("error", (err) => {
    console.error("Error creating PDF:", err);
});
