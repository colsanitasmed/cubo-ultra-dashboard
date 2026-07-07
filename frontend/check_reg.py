import json, re

with open('data.js', encoding='utf-8') as f:
    txt = f.read()

m = re.search(r'window\.DANE_TO_REGIONAL\s*=\s*({.*?});', txt, re.DOTALL)
if m:
    d = json.loads(m.group(1))
    print("Unique Regionals:", sorted(list(set(d.values()))))
else:
    print("Not found")
