import re
import json

raw_txt = '/Users/byron/.gemini/antigravity/brain/82aa8dee-7cbb-49c4-9c49-4a0c120872aa/.system_generated/steps/2472/output.txt'
js_out = '/Users/byron/Documents/tecladosXen/wilson-t41-hex-keyboard-main/hexgrid-workspace/eikosany-data.js'

with open(raw_txt, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix literal escaped newlines if it's JSON-like
text = text.replace('\\n', '\n')

categories = {
    "Dyads": [],
    "Triads": [],
    "Tetrads": [],
    "Hexanies": [],
    "Dekanies": []
}

current_cat = None
current_subcat = "General"

lines = text.split('\n')
for line in lines:
    line = line.strip()
    
    # Check category changes
    if '90 Dyads' in line:
        current_cat = "Dyads"
        current_subcat = "General"
    elif '120 Harmonic and Subharmonic Triads' in line:
        current_cat = "Triads"
        current_subcat = "General"
    elif '30 Tetrads' in line:
        current_cat = "Tetrads"
        current_subcat = "General"
    elif '30 Hexanies' in line:
        current_cat = "Hexanies"
        current_subcat = "General"
    elif '12 Dekanies' in line:
        current_cat = "Dekanies"
        current_subcat = "General"
    
    # Check subcategory changes
    # Dyads: "**Type {1, 3} (Based on complement pairs {5, 7, 9, 11})**"
    # Triads: "**Partition {1, 3, 5} and {7, 9, 11}**"
    # Tetrads: "**Harmonic Tetrads (Sharing 2 factors):**"
    # Dekanies: "**Pair based on omitted factor 11:**"
    if line.startswith('**') and not line.startswith('***'):
        # Extract title without asterisks
        subcat_match = re.search(r'\*\*([^*]+)\*\*', line)
        if subcat_match:
            current_subcat = subcat_match.group(1).strip().replace(':', '')

    # Check sub-subcategories (bullet points)
    bullet_prefix = ""
    if line.startswith('* '):
        bullet_match = re.search(r'\*\*([^*]+)\*\*', line)
        if bullet_match:
            current_subcat = bullet_match.group(1).strip().replace(':', '')
        elif ":" in line:
            prefix = line.split(':')[0].replace('*', '').strip()
            bullet_prefix = prefix + " - "
            
    if current_cat:
        parts = line.split('|')
        for idx, part in enumerate(parts):
            inline_label = ""
            if ':' in part and '(' in part:
                splits = part.split('(')[0].split(':')
                if len(splits) > 1:
                    label_candidate = splits[-2].replace('*', '').strip()
                    if len(label_candidate) < 40:
                         inline_label = label_candidate + " - "
                         
            matches = re.findall(r'\(([^)]+)\)', part)
            for m in matches:
                if not re.match(r'^[0-9∙,\s]+$', m):
                    continue
                    
                notes = [n.strip() for n in m.split(',')]
                if len(notes) >= 2:
                    
                    final_prefix = bullet_prefix
                    if inline_label and inline_label.strip('- ') not in final_prefix:
                        final_prefix += inline_label
                        
                    categories[current_cat].append({
                        "subcat": current_subcat,
                        "name_prefix": final_prefix,
                        "notes": notes
                    })

ratio_to_wilson = {
    "∅": 0, "3∙7∙9∙11": 0, "3∙11": 1, "3∙5∙9": 2, "5∙7": 4, "9": 5, "3∙5∙7∙11": 5,
    "3∙9∙11": 6, "7∙11": 8, "5∙7∙9": 9, "5": 10, "3∙5∙7∙9∙11": 10, "3∙5∙11": 11,
    "3∙7": 12, "7∙9∙11": 13, "11": 14, "5∙9": 15, "3∙5∙9∙11": 16, "3∙7∙9": 17,
    "3": 18, "5∙7∙11": 18, "9∙11": 19, "3∙5∙7": 22, "3∙9": 23, "5∙7∙9∙11": 23,
    "5∙11": 24, "7": 25, "3∙7∙11": 26, "3∙5∙7∙9": 27, "3∙5": 28, "5∙9∙11": 29, "7∙9": 30
}

def clean_note(note):
    parts = note.split('∙')
    parts = [p for p in parts if p != '1']
    parts.sort(key=int)
    if not parts:
        return "∅"
    return '∙'.join(parts)

js_obj = {
    "Dyads": [], "Triads": [], "Tetrads": [], "Hexanies": [], "Dekanies": []
}

for cat, sets in categories.items():
    for i, s in enumerate(sets):
        cleaned_notes = [clean_note(n) for n in s["notes"]]
        wilsons = []
        for cn in cleaned_notes:
            if cn in ratio_to_wilson:
                wilsons.append(ratio_to_wilson[cn])
        
        wilsons = sorted(list(set(wilsons)))
        
        prefix = s['name_prefix'].strip()
        if prefix.endswith('-'):
            prefix = prefix[:-1].strip()
            
        if prefix:
            name = f"{prefix}: {', '.join(cleaned_notes)}"
        else:
            name = f"{cat[:-1]} {i+1}: {', '.join(cleaned_notes)}"
            
        js_obj[cat].append({
            "name": name.strip(),
            "group": s["subcat"],
            "degrees": wilsons
        })

with open(js_out, 'w', encoding='utf-8') as f:
    f.write("export const EIKOSANY_DATA = " + json.dumps(js_obj, indent=2) + ";\n")

print("Dyads count:", len(categories["Dyads"]))
print("Triads count:", len(categories["Triads"]))
print("Tetrads count:", len(categories["Tetrads"]))
print("Hexanies count:", len(categories["Hexanies"]))
print("Dekanies count:", len(categories["Dekanies"]))
