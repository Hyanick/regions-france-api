import requests
import psycopg2
from psycopg2.extras import execute_values

# Configurations
GEOAPI_BASE_URL = "https://geo.api.gouv.fr"
DB_CONFIG = {
    "dbname": "regionsFrance",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432,
}

# Connexion à la base de données
def connect_db():
    return psycopg2.connect(**DB_CONFIG)

# Récupération des données GeoAPI
def fetch_geoapi_data(endpoint):
    response = requests.get(f"{GEOAPI_BASE_URL}/{endpoint}")
    response.raise_for_status()
    return response.json()

# Synchroniser les régions
def sync_regions():
    regions = fetch_geoapi_data("regions")
    with connect_db() as conn:
        with conn.cursor() as cur:
            for region in regions:
                cur.execute("""
                    INSERT INTO region (code, nom) 
                    VALUES (%s, %s)
                    ON CONFLICT (code) DO UPDATE SET nom = EXCLUDED.nom
                """, (region["code"], region["nom"]))

# Synchroniser les départements
def sync_departements():
    departements = fetch_geoapi_data("departements")
    with connect_db() as conn:
        with conn.cursor() as cur:
            for dep in departements:
                cur.execute("""
                    INSERT INTO departement (code, nom, "codeRegion") 
                    VALUES (%s, %s, %s)
                    ON CONFLICT (code) DO UPDATE SET nom = EXCLUDED.nom, "codeRegion" = EXCLUDED."codeRegion"
                """, (dep["code"], dep["nom"], dep["codeRegion"]))

# Synchroniser les communes
def sync_communes():
    communes = fetch_geoapi_data("communes?fields=code,nom,codeDepartement,centre&format=json&geometry=centre")
    with connect_db() as conn:
        with conn.cursor() as cur:
            data = [
                (
                    commune["code"],
                    commune["nom"],
                    commune["codeDepartement"],
                    commune["centre"]["coordinates"][1] if "centre" in commune and "coordinates" in commune["centre"] else None,
                    commune["centre"]["coordinates"][0] if "centre" in commune and "coordinates" in commune["centre"] else None,
                )
                for commune in communes
            ]
            execute_values(cur, """
                INSERT INTO commune (code, nom, "codeDepartement", latitude, longitude)
                VALUES %s
                ON CONFLICT (code) DO UPDATE SET 
                    nom = EXCLUDED.nom,
                    "codeDepartement" = EXCLUDED."codeDepartement",
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude
            """, data)

# Exécuter toutes les synchronisations
def sync_all():
    print("Synchronisation des régions...")
    sync_regions()
    print("Synchronisation des départements...")
    sync_departements()
    print("Synchronisation des communes...")
    sync_communes()
    print("Synchronisation terminée avec succès.")

if __name__ == "__main__":
    sync_all()
