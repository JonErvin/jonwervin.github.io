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
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Parse the response and display the result
            var tableData = JSON.parse(xhr.responseText);
            if (tableData.length > 0) {
                var tableHtml = "<table>";
                for (var i = 0; i < tableData.length; i++) {
                    tableHtml += "<tr>";
                    for (var j = 0; j < tableData[i].length; j++) {
                        tableHtml += "<td>" + tableData[i][j] + "</td>";
                    }
                    tableHtml += "</tr>";
                }
                tableHtml += "</table>";
                resultTable.innerHTML = tableHtml;
            } else {
                resultTable.innerHTML = "<p>No declension table found for the word.</p>";
            }
        }
    };
    xhr.send();
}
