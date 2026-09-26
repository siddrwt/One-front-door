import json

# Save the domain mapping so the ML inference API can use it
domains = [
    "Academics", "Career Services", "Disciplinary", "Facilities",
    "Fees & Finance", "General", "Health & Wellness", "Housing",
    "International", "Registration", "Student Life"
]
domains.sort()

mapping = {
    "domain2id": {d: i for i, d in enumerate(domains)},
    "id2domain": {i: d for i, d in enumerate(domains)},
    "num_labels": len(domains)
}

with open("../models/domain_classifier_final/label_mapping.json", "w") as f:
    json.dump(mapping, f, indent=2)

print(f"Saved label mapping with {len(domains)} domains:")
for i, d in enumerate(domains):
    print(f"  {i}: {d}")
