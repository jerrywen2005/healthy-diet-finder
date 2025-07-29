import requests
import pdfplumber
import io
import json

PDF_URL = "https://www.panerabread.com/content/dam/panerabread/documents/nutrition/Panera-Nutrition.pdf"

def fetch_pdf_and_extract_tables(pdf_url):
    # Download PDF to memory
    print("Fetching PDF from the web...")
    response = requests.get(pdf_url)
    response.raise_for_status()  # fail if download error
    pdf_bytes = io.BytesIO(response.content)

    data = []
    with pdfplumber.open(pdf_bytes) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    # Example filter: skip header rows, empty, or non-food items
                    if row and "Calories" not in row[0]: # type: ignore
                        # Further filtering logic can be added here
                        data.append(row)
    return data

if __name__ == "__main__":
    table_data = fetch_pdf_and_extract_tables(PDF_URL)
    # Add more filtering to get only popular or relevant items
    with open("panera_items_raw.json", "w") as f:
        json.dump(table_data, f, indent=2)
    print(f"Extracted {len(table_data)} rows. See panera_items_raw.json.")
