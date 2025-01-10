import os  # Pour vérifier les fichiers et manipuler les chemins
import json  # Pour charger les fichiers JSON
import psycopg2  # Pour interagir avec PostgreSQL

DB_CONFIG = {
    "dbname": "regionsFrance",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": 5432
}
INPUT_FILES_DIR = "C:\\Devs\\RegionsFrance\\Datas"

# Fonction pour charger un fichier JSON avec vérification
def load_file(filename):
    filepath = os.path.join(INPUT_FILES_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Le fichier {filename} est introuvable dans le répertoire {INPUT_FILES_DIR}. "
                                "Veuillez vérifier que le fichier existe.")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

# Fonction pour insérer les régions
def insert_regions(cursor, regions):
    for region in regions:
        cursor.execute(
            "INSERT INTO regions (code, nom) VALUES (%s, %s) ON CONFLICT (code) DO NOTHING",
            (region["code"], region["nom"])
        )

# Fonction pour insérer les départements
def insert_departements(cursor, departements):
    for departement in departements:
        cursor.execute(
            "INSERT INTO departements (code, nom, codeRegion) VALUES (%s, %s, %s) ON CONFLICT (code) DO NOTHING",
            (departement["code"], departement["nom"], departement["codeRegion"])
        )

# Fonction pour insérer les communes avec gestion des départements manquants
def insert_communes(cursor, communes):
    # Table de correspondance pour les noms des départements manquants et leurs codes
    departement_names = {
        "975": ("Saint-Pierre-et-Miquelon", "06"),  # Code région 06 pour Outre-mer
        "977": ("Saint-Barthélemy", "01"),         # Guadeloupe
        "978": ("Saint-Martin", "01"),             # Guadeloupe
        "984": ("Wallis-et-Futuna", "06"),         # Code région 06 pour Outre-mer
        "986": ("Nouvelle-Calédonie", "06"),       # Code région 06 pour Outre-mer
        "987": ("Polynésie française", "06"),      # Code région 06 pour Outre-mer
        "988": ("Wallis-et-Futuna", "06"),         # Code région 06 pour Outre-mer
        "989": ("Île de Clipperton", "06")         # Code région 06 pour Outre-mer
    }
    
    for commune in communes:
        latitude = commune["centre"]["coordinates"][1] if "centre" in commune else None
        longitude = commune["centre"]["coordinates"][0] if "centre" in commune else None

        # Vérifier si le codeDepartement existe déjà
        code_departement = commune["codeDepartement"]
        cursor.execute("SELECT 1 FROM departements WHERE code = %s", (code_departement,))
        if cursor.fetchone() is None:
            # Département manquant : ajout automatique
            print(f"Ajout automatique du département manquant : {code_departement}")
            
            # Utiliser le nom réel du département et le code de région associé
            nom_departement, code_region = departement_names.get(code_departement, (f"Département {code_departement}", "00"))
            
            cursor.execute(
                "INSERT INTO departements (code, nom, codeRegion) VALUES (%s, %s, %s) ON CONFLICT (code) DO NOTHING",
                (code_departement, nom_departement, code_region)
            )

        # Insérer la commune
        cursor.execute(
            "INSERT INTO communes (code, nom, codeDepartement, latitude, longitude) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (code) DO NOTHING",
            (commune["code"], commune["nom"], code_departement, latitude, longitude)
        )

# Fonction principale
def main():
    try:
        # Chargement des fichiers JSON
        regions = load_file("regions.json")
        departements = load_file("departements.json")
        communes = load_file("communes.json")
        print("Les fichiers JSON ont été chargés avec succès.")

        # Connexion à la base de données
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Connexion à la base de données réussie.")

        # Insérer les données dans les tables
        print("Insertion des régions...")
        insert_regions(cursor, regions)
        print("Insertion des départements...")
        insert_departements(cursor, departements)
        print("Insertion des communes...")
        insert_communes(cursor, communes)

        # Valider les transactions
        conn.commit()
        print("Données insérées avec succès.")

    except FileNotFoundError as e:
        print(e)

    except psycopg2.Error as db_err:
        print(f"Erreur lors de l'accès à la base de données : {db_err}")

    finally:
        # Fermeture de la connexion
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
        print("Connexion fermée.")

# Exécution
if __name__ == "__main__":
    main()