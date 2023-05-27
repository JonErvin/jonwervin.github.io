
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)   

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_declension_table")
def get_declension_table():
    word = request.args.get("word")

    # Fetch the declension table
    url = f"https://en.wiktionary.org/wiki/{word}#Polish"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    table = soup.find("table", {"class": "inflection-table"})
    rows = table.find_all("tr")

    # Parse the declension table and return as JSON
    declension_table = []
    headers = []  # Initialize the row headers list
    for row in rows:
        cells = row.find_all("td")
        if cells:
            forms = [cell.text.strip() for cell in cells]
            declension_table.append(forms)
        else:
            header_cells = row.find_all("th")
            if header_cells:
                header_row = [cell.text.strip() for cell in header_cells]
                if not headers:  # Check if headers list is empty
                    headers = header_row
                else:
                    row_data = header_row[1:]  # Exclude the first cell as the row header
                    declension_table.append(row_data)

    # Create a dictionary with headers and values
    result = {
        "headers": headers,
        "table": declension_table
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run()