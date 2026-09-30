import os
import json
import urllib.request
import pandas as pd
from dotenv import load_dotenv

# Load env variables
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")

# Path to dataset
data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'extention of Z-Alizadeh sani dataset.xlsx')
df = pd.read_excel(data_path)

records = []
for idx, row in df.iterrows():
    record = {
        "patient_code": f"PT-{idx+1:03d}",
        "age": int(row["Age"]),
        "sex": str(row["Sex"]),
        "weight": int(row["Weight"]) if pd.notnull(row["Weight"]) else None,
        "length": int(row["Length"]) if pd.notnull(row["Length"]) else None,
        "bmi": float(row["BMI"]) if pd.notnull(row["BMI"]) else None,
        "bp": int(row["BP"]),
        "pr": int(row["PR"]),
        "dm": int(row["DM"]),
        "htn": int(row["HTN"]),
        "current_smoker": int(row["Current Smoker"]),
        "ex_smoker": int(row["EX-Smoker"]),
        "fh": int(row["FH"]),
        "obesity": str(row["Obesity"]),
        "crf": str(row["CRF"]),
        "cva": str(row["CVA"]),
        "airway_disease": str(row["Airway disease"]),
        "thyroid_disease": str(row["Thyroid Disease"]),
        "chf": str(row["CHF"]),
        "dlp": str(row["DLP"]),
        "edema": int(row["Edema"]),
        "weak_peripheral_pulse": str(row["Weak Peripheral Pulse"]),
        "lung_rales": str(row["Lung rales"]),
        "systolic_murmur": str(row["Systolic Murmur"]),
        "diastolic_murmur": str(row["Diastolic Murmur"]),
        "typical_chest_pain": int(row["Typical Chest Pain"]),
        "dyspnea": str(row["Dyspnea"]),
        "function_class": int(row["Function Class"]),
        "atypical": str(row["Atypical"]),
        "nonanginal": str(row["Nonanginal"]),
        "exertional_cp": str(row["Exertional CP"]),
        "lowth_ang": str(row["LowTH Ang"]),
        "q_wave": int(row["Q Wave"]),
        "st_elevation": int(row["St Elevation"]),
        "st_depression": int(row["St Depression"]),
        "tinversion": int(row["Tinversion"]),
        "lvh": str(row["LVH"]),
        "poor_r_progression": str(row["Poor R Progression"]),
        "bbb": str(row["BBB"]),
        "fbs": int(row["FBS"]),
        "cr": float(row["CR"]),
        "tg": int(row["TG"]),
        "ldl": int(row["LDL"]),
        "hdl": float(row["HDL"]),
        "bun": int(row["BUN"]),
        "esr": int(row["ESR"]),
        "hb": float(row["HB"]),
        "k": float(row["K"]),
        "na": int(row["Na"]),
        "wbc": int(row["WBC"]),
        "lymph": int(row["Lymph"]),
        "neut": int(row["Neut"]),
        "plt": int(row["PLT"]),
        "ef_tte": int(row["EF-TTE"]),
        "region_rwma": int(row["Region RWMA"]),
        "vhd": str(row["VHD"]),
        "cath": str(row["Cath"]),
        "lad_ground_truth": str(row["LAD"]),
        "lcx_ground_truth": str(row["LCX"]),
        "rca_ground_truth": str(row["RCA"])
    }
    records.append(record)

print(f"Prepared {len(records)} patient records for insertion.")

# Insert in chunks of 50 via REST API
url = f"{SUPABASE_URL}/rest/v1/patients"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

chunk_size = 50
inserted_count = 0

for i in range(0, len(records), chunk_size):
    chunk = records[i:i+chunk_size]
    data = json.dumps(chunk).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status in (200, 201):
                inserted_count += len(chunk)
                print(f"Inserted chunk {i//chunk_size + 1}: {len(chunk)} records (Total: {inserted_count})")
            else:
                print(f"Warning on chunk {i//chunk_size + 1}: status {resp.status}")
    except Exception as e:
        print(f"Error on chunk {i//chunk_size + 1}: {e}")
        break

print(f"Seeding finished. Successfully loaded {inserted_count} patients into Supabase!")
