import re

raw_txt = '/Users/byron/.gemini/antigravity/brain/82aa8dee-7cbb-49c4-9c49-4a0c120872aa/.system_generated/steps/2472/output.txt'

with open(raw_txt, 'r', encoding='utf-8') as f:
    text = f.read()

categories = {
    "Dyads": [],
    "Triads": [],
    "Tetrads": [],
    "Hexanies": [],
    "Dekanies": []
}
current_cat = None

for line in text.split('\n'):
    line = line.strip()
    if '90 Dyads' in line:
        current_cat = "Dyads"
    elif '120 Harmonic and Subharmonic Triads' in line:
        current_cat = "Triads"
    elif '30 Tetrads' in line:
        current_cat = "Tetrads"
    elif '30 Hexanies' in line:
        current_cat = "Hexanies"
    elif '12 Dekanies' in line:
        current_cat = "Dekanies"
    
    if current_cat:
        matches = re.findall(r'\(([^)]+)\)', line)
        for m in matches:
            if '∙' not in m and not m.strip().isdigit():
                continue
            notes = [n.strip() for n in m.split(',')]
            if len(notes) >= 2:
                categories[current_cat].append(notes)

for k,v in categories.items():
    print(k, len(v))

