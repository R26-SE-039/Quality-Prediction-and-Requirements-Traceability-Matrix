import json

with open('test_quality_prediction.ipynb', 'r') as f:
    nb = json.load(f)

# Fix cell 2 (import cell)
nb['cells'][2]['source'] = [
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "from sklearn.neighbors import KNeighborsClassifier\n",
    "from sklearn.ensemble import RandomForestClassifier\n",
    "from sklearn.metrics import accuracy_score, classification_report, confusion_matrix\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "from sklearn.model_selection import train_test_split, cross_val_score\n",
    "import joblib\n",
    "import warnings\n",
    "warnings.filterwarnings('ignore')\n",
    "\n",
    "print('Libraries imported successfully!')"
]

with open('test_quality_prediction.ipynb', 'w') as f:
    json.dump(nb, f, indent=1)

print('Notebook fixed!')
