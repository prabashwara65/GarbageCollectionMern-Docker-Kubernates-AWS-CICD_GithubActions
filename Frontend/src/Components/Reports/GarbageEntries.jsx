import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

function GarbageEntriesReport() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Fetch garbage entries from API
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/garbage/allEntries"
      );
      setEntries(response.data);
      setLoading(false);
      prepareChartData(response.data); // Prepare chart data after fetching entries
    } catch (error) {
      setError("Failed to fetch garbage entries.");
      setLoading(false);
    }
  };

  // Prepare data for the bar chart
  const prepareChartData = (data) => {
    const labels = [];
    const quantityData = [];
    const categories = {};

    data.forEach((entry) => {
      const formattedDate = new Date(entry.createdAt).toLocaleDateString();
      if (!labels.includes(formattedDate)) {
        labels.push(formattedDate);
      }

      // Aggregate data by category
      if (!categories[entry.category]) {
        categories[entry.category] = {};
      }
      if (!categories[entry.category][formattedDate]) {
        categories[entry.category][formattedDate] = 0;
      }
      categories[entry.category][formattedDate] += entry.quantity;
    });

    // Create datasets for each category
    const datasets = Object.keys(categories).map((category) => ({
      label: category,
      data: labels.map((date) => categories[category][date] || 0),
      backgroundColor: randomColor(), // Random color for each bar
    }));

    setChartData({ labels, datasets });
  };

  // Function to generate a random color
  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    const lineHeight = 10;
  
    // Set initial positions
    let startY = 22; // Start Y for the report title
    let currentPageY = startY;
  
    doc.setFontSize(18);
    doc.text("SuwaMihikatha: Garbage Collection Report", margin, startY);
  
    doc.setFontSize(12);
    const currentDateTime = new Date().toLocaleString();
    doc.text(`Date & Time: ${currentDateTime}`, margin, (currentPageY += 10));
  
    doc.text("Contact Us: SuwaMihikatha@gmail.com", margin, (currentPageY += 10));
  
    currentPageY += 20; // Adjust Y position for table
  
    // Column titles for the table
    const headers = ["Name", "Address", "Quantity", "Category", "Date"];
    const columnWidths = [30, 80, 25, 25, 30];
  
    const drawTableHeader = () => {
      let startX = margin;
      headers.forEach((header, index) => {
        doc.text(header, startX + 4, currentPageY + 4);
        doc.rect(startX, currentPageY, columnWidths[index], lineHeight);
        startX += columnWidths[index];
      });
      currentPageY += lineHeight;
    };
  
    // Draw header for the table
    drawTableHeader();
  
    // Function to wrap text for the 'address' column
    const wrapText = (doc, text, x, y, maxWidth, lineHeight) => {
      const splitText = doc.splitTextToSize(text, maxWidth);
      splitText.forEach((line, index) => {
        doc.text(line, x, y + index * lineHeight);
      });
      return splitText.length * lineHeight;
    };
  
    // Draw table rows with page break logic
    entries.forEach((entry, rowIndex) => {
      if (currentPageY + lineHeight > pageHeight - 20) {
        doc.addPage();
        currentPageY = 20; // Start right at the top of the new page (without margin)
      }
  
      let startX = margin;
      const formattedDate = new Date(entry.createdAt).toLocaleDateString();
  
      const row = [
        entry.name,
        entry.address,
        entry.quantity,
        entry.category,
        formattedDate,
      ];
  
      row.forEach((data, colIndex) => {
        let finalY = currentPageY;
  
        if (colIndex === 1) {
          // Apply word wrap only for the address column (index 1)
          const textHeight = wrapText(
            doc,
            String(data),
            startX + 4,
            currentPageY + 4,
            columnWidths[colIndex] - 4 * 2,
            8
          ); // Reduced lineHeight
          finalY = currentPageY; // Adjust the final row height based on the wrapped text height
        } else {
          doc.text(String(data), startX + 4, currentPageY + 4);
        }
  
        doc.rect(startX, currentPageY, columnWidths[colIndex], lineHeight);
        startX += columnWidths[colIndex];
      });
  
      currentPageY += lineHeight;
    });
  
    // Add some space after the table before printing the chart
    currentPageY += 10;
  
    // Capture chart and add it below the table in the PDF
    const canvas = document.getElementById("chart");
    if (canvas) {
      const chartCanvas = await html2canvas(canvas);
      const imgData = chartCanvas.toDataURL("image/png");
  
      // Set your desired width and height for the chart in the PDF
      const chartWidth = pageWidth - margin * 2; // Fit the chart within page width
      const chartHeight = (chartWidth / canvas.width) * canvas.height; // Maintain aspect ratio
  
      // Check if the chart fits on the current page, if not add a new page
      if (currentPageY + chartHeight > pageHeight - 20) {
        doc.addPage();
        currentPageY = 20; // Start at the top of the new page
      }
  
      // Add the chart image to the PDF below the table
      doc.addImage(imgData, "PNG", margin, currentPageY, chartWidth, chartHeight);
    }
  
    // Save the document as PDF
    doc.save("garbage_report.pdf");
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">SuwaMihikatha:Garbage Collection Entries</h1>
   
      {loading && <p>Loading data...</p>}
      {error && <p>{error}</p>}

      {!loading && entries.length > 0 && (
        <>
          {/* Bar Chart */}
          <div
            className="mb-4"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Bar id="chart" data={chartData} options={{ responsive: true }} />
          </div>

          <TableContainer
            component={Paper}
            sx={{ maxHeight: 400, overflowY: "auto", borderRadius: 2 }}
          >
            <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: 'saddlebrown', color: 'white' }}>Actions</TableCell>
                </TableRow>
                </TableHead>

              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.address}</TableCell>
                    <TableCell>{entry.quantity}</TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadPDF(entry)}
                        sx={{ fontSize: "0.875rem", textTransform: "none" }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            onClick={handleDownloadPDF}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Download as PDF
          </Button>
        </>
      )}
    </div>
  );
}

export default GarbageEntriesReport;
