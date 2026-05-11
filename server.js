function getTimestamp() {
  const now = new Date();

  const date = now.toISOString().split("T")[0];

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 → 12

  return `${date} ${hours}:${minutes} ${ampm}`;
}
const express = require("express");
const { PDFDocument } = require("pdf-lib");

const app = express();
const PORT = 3000;

// ✅ Format date
function formatDate(date) {
  if (!date) return "N/A";
  try {
    return date.toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
}

app.get("/pdf-meta", async (req, res) => {

  // ✅ ✅ YOUR FULL LIST RESTORED
  const urls = [
    "https://www.irs.gov/pub/irs-pdf/f1042s.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1095b.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1095c.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1098.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1098e.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099a.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099c.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099div.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099int.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099ltc.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099msc.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099nec.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099ptr.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099q.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099r.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099s.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099sa.pdf",
    "https://www.irs.gov/pub/irs-pdf/f1099sb.pdf",
    "https://www.irs.gov/pub/irs-pdf/p1220.pdf",
    "https://www.irs.gov/pub/irs-pdf/f5498.pdf",
    "https://www.irs.gov/pub/irs-pdf/f5498sa.pdf",
    "https://www.irs.gov/pub/irs-pdf/fw2.pdf",
    "https://www.irs.gov/pub/irs-pdf/fw2g.pdf",
    "https://www.irs.gov/pub/irs-pdf/fw9.pdf"
  ];

  let html = `
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="refresh" content="600">
<style>
body {
  background-color: #eef2f7;
  font-family: "Segoe UI", Tahoma, sans-serif;
  padding: 30px;
}

h2 {
  color: #172b4d;
  margin-bottom: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  border-left: 5px solid #0052cc;
}

.title a {
  font-size: 18px;
  font-weight: 600;
  color: #0052cc;
  text-decoration: none;
}

.title a:hover {
  text-decoration: underline;
}

.date {
  margin-top: 6px;
  font-size: 14px;
  color: #5e6c84;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
</head>
<body>

<div style="display:flex; justify-content:space-between; align-items:center;">
  <h2>Current Tax Forms from IRS</h2>
  <div style="font-size:14px; color:#5e6c84;">
    Last refreshed: ${getTimestamp()}
  </div>
</div>

`;

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(buffer);

      const creationDate = pdfDoc.getCreationDate();
      const name = url.split("/").pop().replace(".pdf", "");

      html += `
        <div class="card">
          <div class="title">
            <a href="${url}" target="_blank">${name}</a>
          </div>
          <div class="date">
            <b>Creation Date:</b> ${formatDate(creationDate)}
          </div>
        </div>
      `;
    } catch (err) {
      const name = url.split("/").pop();

      html += `
        <div class="card">
          <div class="error">${name} - Error loading PDF</div>
        </div>
      `;
    }
  }

  html += `
</body>
</html>
`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000/pdf-meta");
});
