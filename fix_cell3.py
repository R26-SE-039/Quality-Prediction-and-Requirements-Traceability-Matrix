import json

with open('test_quality_prediction.ipynb', 'r') as f:
    nb = json.load(f)

# Fix cell 3 (load data cell)
nb['cells'][3]['source'] = [
    "# Load test quality dataset\n",
    "df = pd.read_csv('component-4-quality/datasets/test_quality_data.csv')\n",
    "\n",
    "print(f'Dataset shape: {df.shape}')\n",
    "print(f'Columns: {df.columns.tolist()}')\n",
    "print(f'First 5 rows:')\n",
    "df.head()"
]

with open('test_quality_prediction.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print('Cell 3 fixed!')
