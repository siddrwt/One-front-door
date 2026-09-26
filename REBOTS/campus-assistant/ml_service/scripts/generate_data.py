import json
import random
import os

DOMAINS = [
    "Academics", "Admissions", "Fees & Finance", "Housing",
    "Health & Wellness", "Facilities", "Career Services",
    "Registration", "Disciplinary", "International", "Student Life", "General"
]

INTENTS = ["clarify", "get_info", "perform_action", "generic"]

TEMPLATES = {
    "Academics": [
        ("What is the syllabus for {course}?", "get_info"),
        ("How do I defer my semester?", "perform_action"),
        ("I want to know about my grades", "get_info"),
        ("Are there any extra classes for {course}?", "clarify"),
        ("Academic calendar for next year", "get_info")
    ],
    "Admissions": [
        ("What is my application status?", "get_info"),
        ("How do I apply for {program}?", "perform_action"),
        ("When is the deadline for admissions?", "get_info"),
        ("Can I upload my transcripts now?", "perform_action")
    ],
    "Fees & Finance": [
        ("How do I pay my tuition fee?", "perform_action"),
        ("What is the fee for next semester?", "get_info"),
        ("I have an issue with my invoice", "clarify"),
        ("Are there any scholarships available?", "get_info")
    ],
    "Housing": [
        ("I want to change my dorm room", "perform_action"),
        ("What are the hostel fees?", "get_info"),
        ("My AC in the room is not working", "perform_action"),
        ("How do I apply for campus housing?", "perform_action")
    ],
    "Health & Wellness": [
        ("Where is the medical center?", "get_info"),
        ("How do I book a counseling session?", "perform_action"),
        ("I need a doctor appointment", "perform_action")
    ],
    "Facilities": [
        ("The library wifi is down", "perform_action"),
        ("How do I book a study room?", "perform_action"),
        ("Where is the IT support desk?", "get_info")
    ],
    "Career Services": [
        ("When is the next career fair?", "get_info"),
        ("I need help with my resume", "perform_action"),
        ("Are there any internship opportunities?", "get_info")
    ],
    "Registration": [
        ("How do I register for {course}?", "perform_action"),
        ("When does enrollment start?", "get_info"),
        ("I can't add {course} to my schedule", "clarify")
    ],
    "Disciplinary": [
        ("What is the code of conduct?", "get_info"),
        ("How do I appeal a disciplinary action?", "perform_action")
    ],
    "International": [
        ("Do you help with visa applications?", "get_info"),
        ("I am an international student, what are the travel guidelines?", "get_info")
    ],
    "Student Life": [
        ("How do I join the coding club?", "perform_action"),
        ("When is the next campus event?", "get_info")
    ],
    "General": [
        ("Where is the cafeteria?", "get_info"),
        ("Campus map", "get_info"),
        ("What time does the main gate close?", "get_info"),
        ("Hello", "generic"),
        ("Thanks", "generic")
    ]
}

COURSES = ["CS101", "Math201", "Physics101", "History301", "Chemistry101"]
PROGRAMS = ["Undergrad", "Grad", "PhD", "MBA"]

def generate_single_query(domain):
    template, intent = random.choice(TEMPLATES[domain])
    query = template
    if "{course}" in query:
        query = query.replace("{course}", random.choice(COURSES))
    if "{program}" in query:
        query = query.replace("{program}", random.choice(PROGRAMS))
    return query, intent

def generate_samples(num_samples=2500):
    samples = []
    for _ in range(num_samples):
        # 30% chance to generate a compound query
        is_compound = random.random() < 0.3
        
        if is_compound:
            domain1, domain2 = random.sample(DOMAINS, 2)
            query1, intent1 = generate_single_query(domain1)
            query2, intent2 = generate_single_query(domain2)
            
            conjunction = random.choice([" and ", " also ", ". ", ", and "])
            query = f"{query1}{conjunction}{query2.lower()}"
            
            domains = [domain1, domain2]
            # simplified: take intent1
            intent = intent1 
        else:
            domain = random.choice(DOMAINS)
            query, intent = generate_single_query(domain)
            domains = [domain]
            
        # Add some noise
        if random.random() < 0.2:
            query = query.lower()
        if random.random() < 0.1:
            query = query.replace("?", "")
            
        samples.append({
            "text": query,
            "domains": domains,  # Changed to list
            "intent": intent
        })
    return samples

def save_jsonl(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')

if __name__ == "__main__":
    os.makedirs("../data", exist_ok=True)
    all_samples = generate_samples(3000)
    
    # Shuffle
    random.shuffle(all_samples)
    
    # Split: 70%, 15%, 15%
    n = len(all_samples)
    train_end = int(n * 0.7)
    val_end = int(n * 0.85)
    
    train_data = all_samples[:train_end]
    val_data = all_samples[train_end:val_end]
    test_data = all_samples[val_end:]
    
    save_jsonl(train_data, "../data/train.jsonl")
    save_jsonl(val_data, "../data/val.jsonl")
    save_jsonl(test_data, "../data/test.jsonl")
    
    print(f"Generated {len(train_data)} train, {len(val_data)} val, and {len(test_data)} test samples.")
    print("Saved to ../data/")
