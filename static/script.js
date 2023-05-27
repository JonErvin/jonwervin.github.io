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
          displayResult(data);
        } else {
          console.error("Request failed. Status:", xhr.status);
        }
      };
      xhr.onerror = function () {
        console.error("Request failed. Check your network connection.");
      };
      xhr.send();
    }
    
    function displayResult(data) {
      const headers = data.headers.filter(header => header !== ""); // Exclude empty header
      const tableData = data.table;
    
      let tableHtml = "<table>";
    
      // Add column headers
      tableHtml += "<tr>";
      for (const header of headers) {
        tableHtml += `<th>${header}</th>`;
      }
      tableHtml += "</tr>";
    
      // Add table data
      for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];
        tableHtml += "<tr>";
    
        for (let j = 0; j < row.length; j++) {
          const cell = row[j];
          
          // Display the first cell as row header
          if (j === 0) {
            tableHtml += `<th>${cell}</th>`;
          } else {
            tableHtml += `<td>${cell}</td>`;
          }
        }
    
        tableHtml += "</tr>";
      }
    
      tableHtml += "</table>";
    
      resultTable.innerHTML = tableHtml;
    }
    