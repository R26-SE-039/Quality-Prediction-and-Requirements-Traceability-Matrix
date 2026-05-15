import json

with open('test_quality_prediction.ipynb', 'r') as f:
    nb = json.load(f)

# Fix cell 5 (dataset statistics)
nb['cells'][5]['source'] = [
    "# Display dataset statistics\n",
    "print('Dataset Statistics:')\n",
    "print(df.describe())\n",
    "\n",
    "print(f'Quality Distribution:')\n",
    "print(df['quality_category'].value_counts())"
]

with open('test_quality_prediction.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print('Cell 5 fixed!')
