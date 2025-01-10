import requests
import json
import os

BASE_URL = "https://geo.api.gouv.fr"
OUTPUT_DIR = "C:\\Devs\\RegionsFrance\\Datas"

# Créer un répertoire pour stocker les fichiers JSON
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_regions():
    url = f"{BASE_URL}/regions"
    response = requests.get(url)
    if response.status_code == 200:
        regions = response.json()
        with open(f"{OUTPUT_DIR}/regions.json", "w", encoding="utf-8") as f:
            json.dump(regions, f, ensure_ascii=False, indent=2)
        print(f"Regions downloaded: {len(regions)}")
    else:
        print(f"Failed to download regions: {response.status_code}")

def download_departements():
    url = f"{BASE_URL}/departements"
    response = requests.get(url)
    if response.status_code == 200:
        departements = response.json()
        with open(f"{OUTPUT_DIR}/departements.json", "w", encoding="utf-8") as f:
            json.dump(departements, f, ensure_ascii=False, indent=2)
        print(f"Departements downloaded: {len(departements)}")
    else:
        print(f"Failed to download departements: {response.status_code}")

def download_communes():
    url = f"{BASE_URL}/communes"
    params = {"fields": "nom,code,codeDepartement,codeRegion,centre"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        communes = response.json()
        with open(f"{OUTPUT_DIR}/communes.json", "w", encoding="utf-8") as f:
            json.dump(communes, f, ensure_ascii=False, indent=2)
        print(f"Communes downloaded: {len(communes)}")
    else:
        print(f"Failed to download communes: {response.status_code}")

if __name__ == "__main__":
    download_regions()
    download_departements()
    download_communes()
