
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

def get_table_from_page(url):
    word = request.args.get("word")

    # Fetch the declension table
    url = f"https://en.wiktionary.org/wiki/{word}#Polish"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    table = soup.find("table", {"class": "inflection-table"})
    rows = table.find_all("tr")

    # Parse the declension table and return as JSON
    declension_table = []
    headers = []  # Initialize the headers list
    for row in rows:
        cells = row.find_all(["th", "td"])
        if cells:
            row_data = [cell.text.strip() for cell in cells]
            declension_table.append(row_data)
        else:
            break  # Stop parsing if no more data rows are found

    # Separate the first row as column headers
    column_headers = declension_table.pop(0) if declension_table else []

    # Separate the first column as row headers
    row_headers = [row.pop(0) for row in declension_table]

    return declension_table, column_headers, row_headers

@app.route("/get_declension_table")
def get_declension_table():
    word = request.args.get("word")

    # Fetch the declension table from the current page
    current_url = f"https://en.wiktionary.org/wiki/{word}#Polish"
    declension_table, column_headers, row_headers = get_table_from_page(current_url)

    # If no table on current page, follow the link for the related word
    if not current_table:
        related_word_url = f"https://en.wiktionary.org/wiki/{word}"
        response = requests.get(related_word_url)
        soup = BeautifulSoup(response.content, "html.parser")
        related_link = soup.find("a", {"title": f"{word}#Polish"})
        if related_link:
            related_url = "https://en.wiktionary.org" + related_link["href"]
            declension_table, column_headers, row_headers = get_table_from_page(related_url)

    result = {
        "column_headers": column_headers,
        "row_headers": row_headers,
        "table": declension_table
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run()