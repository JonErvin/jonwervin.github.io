function fetchDeclensionTable() {
    var wordInput = document.getElementById("wordInput");
    var resultTable = document.getElementById("resultTable");

    // Clear previous result
    resultTable.innerHTML = "";

    // Get the word from the input
    var word = wordInput.value.trim();

    // Perform input validation
    if (word === "") {
        resultTable.innerHTML = "<p>Please enter a word.</p>";
        return;
    }

    // Make the API request to fetch the declension table
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_declension_table?word=" + encodeURIComponent(word), true);
    xhr.onload = function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          displayResult(data, word);
        } else {
          console.error("Request failed. Status:", xhr.status);
        }
      };
      xhr.onerror = function () {
        console.error("Request failed. Check your network connection.");
      };
      xhr.send();
  }
    
function displayResult(data, searchTerm) {
  const columnHeaders = data.column_headers;
  const rowHeaders = data.row_headers;
  const tableData = data.table;

  let tableHtml = "<table>";

  // Add column headers
  tableHtml += "<tr>";
  for (const header of columnHeaders) {
    tableHtml += `<th>${header}</th>`;
  }
  tableHtml += "</tr>";

  // Add row headers and table data
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    tableHtml += "<tr>";

    // Add row header
    tableHtml += `<th>${rowHeaders[i]}</th>`;

    // Add table data
    for (const cell of row) {
      const highlightedCell = cell.replace(new RegExp(searchTerm, "gi"), match => `<span class="highlight">${match}</span>`);
      tableHtml += `<td>${highlightedCell}</td>`;
    }

    tableHtml += "</tr>";
  }

  tableHtml += "</table>";

  resultTable.innerHTML = tableHtml;
}

