import os
import json
import random
from datasets import load_dataset

# Mapping of some CLINC150 intents to our 12 Campus Domains
DOMAIN_MAPPING = {
    # Fees & Finance
    'bill_balance': 'Fees & Finance',
    'pay_bill': 'Fees & Finance',
    'taxes': 'Fees & Finance',
    'transfer': 'Fees & Finance',
    'credit_limit': 'Fees & Finance',
    'income': 'Fees & Finance',
    'routing': 'Fees & Finance',
    'direct_deposit': 'Fees & Finance',
    'transactions': 'Fees & Finance',
    
    # Health & Wellness
    'insurance': 'Health & Wellness',
    'medical_out_of_town': 'Health & Wellness',
    'vaccines': 'Health & Wellness',
    'schedule_meeting': 'Health & Wellness', # loosely mapping for doctor appts
    
    # Housing
    'smart_home': 'Housing',
    'home': 'Housing',
    
    # Career Services
    'income': 'Career Services',
    'schedule_meeting': 'Career Services',
    
    # Facilities
    'sync_device': 'Facilities',
    'lost_luggage': 'Facilities',
    'where_are_you_from': 'Facilities', # mapping to help desk
    
    # International / Travel
    'travel_suggestion': 'International',
    'flight_status': 'International',
    'book_flight': 'International',
    'travel_alert': 'International',
    'plug_type': 'International',
    'passport': 'International',
    'translate': 'International',
    
    # General
    'weather': 'General',
    'greeting': 'General',
    'goodbye': 'General',
    'time': 'General',
    'date': 'General',
    'calculator': 'General',
    'directions': 'General',
    
    # Student Life
    'restaurant_reviews': 'Student Life',
    'restaurant_reservation': 'Student Life',
    'book_hotel': 'Student Life',
    'shopping': 'Student Life',
    
    # Academics / Admissions / Registration / Disciplinary
    # CLINC lacks pure educational intents, so we will assign some generic ones
    'todo_list': 'Academics',
    'classes': 'Academics',
    'schedule_meeting': 'Registration',
    'report_fraud': 'Disciplinary',
    'cancel': 'Disciplinary',
}

def map_intent_to_domain(intent_name):
    # Default to General if no good mapping exists
    return DOMAIN_MAPPING.get(intent_name, 'General')

import urllib.request

def prep_datasets():
    print("Downloading CLINC150 dataset directly from GitHub...")
    url = "https://raw.githubusercontent.com/clinc/oos-eval/master/data/data_small.json"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        clinc = json.loads(response.read().decode())
    
    splits = {'train': 'train', 'validation': 'val', 'test': 'test'}
    
    data_dict = {'train': [], 'validation': [], 'test': []}
    
    print("Processing train/val/test splits...")
    for out_split, in_split in splits.items():
        for example in clinc[in_split]:
            text, intent_name = example[0], example[1]
            domain = map_intent_to_domain(intent_name)
            
            if 'book' in intent_name or 'pay' in intent_name or 'schedule' in intent_name:
                intent_class = 'perform_action'
            elif intent_name in ['greeting', 'goodbye']:
                intent_class = 'generic'
            else:
                intent_class = 'get_info'
                
            data_dict[out_split].append({
                "text": text,
                "domain": domain,
                "intent": intent_class
            })
            
    # Save the files
    os.makedirs("../data", exist_ok=True)
    
    for split in splits.keys():
        out_name = split if split != 'validation' else 'val'
        path = f"../data/{out_name}.jsonl"
        with open(path, 'w', encoding='utf-8') as f:
            for item in data_dict[split]:
                f.write(json.dumps(item) + '\n')
        
        print(f"Saved {len(data_dict[split])} samples to {path}")
        
    print("Dataset preparation complete.")

if __name__ == "__main__":
    prep_datasets()
