import requests
from bs4 import BeautifulSoup
from datetime import datetime

def fetch_nebula_creators():
    # URL of Nebula's official creators listing
    url = "https://talent.nebula.tv/creators/"

    try:
        # Send a GET request to fetch the page content
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract creator names from <h3> tags within the specified container
        creators = []
        for creator_div in soup.find_all("div", class_="grid-item youtube-creator"):
            name_element = creator_div.find("h3")
            if name_element:
                creators.append(name_element.get_text(strip=True))

        # Get the current date
        current_datetime = datetime.now().strftime("%B %d, %Y, at %H:%M:%S")

        # Save the creator names to a file with the current date as the first line
        with open("nebula_creators.txt", "w", encoding="utf-8") as file:
            file.write(f"This list of Nebula creators was last updated on {current_datetime}\n\n")
            for creator in creators:
                file.write(f"{creator}\n")

        print(f"Successfully fetched and saved {len(creators)} creators to nebula_creators.txt.")

    except requests.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Run the script
if __name__ == "__main__":
    fetch_nebula_creators()
