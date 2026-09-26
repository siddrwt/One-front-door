from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel
import os
import json

app = FastAPI(title="Campus Assistant ML Service")

class ClassificationRequest(BaseModel):
    text: str

class ClassificationResponse(BaseModel):
    domains: list[str]
    confidences: list[float]

# Globals for the model
tokenizer = None
model = None
id2domain = {}

@app.on_event("startup")
def load_model():
    global tokenizer, model, id2domain
    
    model_dir = os.path.join(os.path.dirname(__file__), "..", "models", "domain_classifier_final")
    model_dir = os.path.abspath(model_dir)
    base_model_name = "distilbert-base-uncased"
    
    try:
        if os.path.exists(model_dir):
            # Load the label mapping that was saved alongside the model
            mapping_path = os.path.join(model_dir, "label_mapping.json")
            if os.path.exists(mapping_path):
                with open(mapping_path) as f:
                    mapping = json.load(f)
                id2domain = {int(k): v for k, v in mapping["id2domain"].items()}
                num_labels = mapping["num_labels"]
            else:
                # Fallback: derive from sorted unique domains in training data
                num_labels = 11
                domains = [
                    "Academics", "Career Services", "Disciplinary", "Facilities",
                    "Fees & Finance", "General", "Health & Wellness", "Housing",
                    "International", "Registration", "Student Life"
                ]
                id2domain = {i: d for i, d in enumerate(sorted(domains))}
            
            tokenizer = AutoTokenizer.from_pretrained(model_dir)
            
            # Load base model with correct num_labels, then apply LoRA adapter
            base_model = AutoModelForSequenceClassification.from_pretrained(
                base_model_name, num_labels=num_labels
            )
            model = PeftModel.from_pretrained(base_model, model_dir)
            model.eval()
            
            print(f"Model loaded successfully from {model_dir} with {num_labels} labels")
            print(f"Label mapping: {id2domain}")
        else:
            print(f"Warning: Trained model not found at {model_dir}. Running in mock mode.")
            tokenizer = AutoTokenizer.from_pretrained(base_model_name)
            
    except Exception as e:
        print(f"Error loading model: {e}")
        import traceback
        traceback.print_exc()

@app.post("/classify", response_model=ClassificationResponse)
def classify_text(request: ClassificationRequest):
    if model is None:
        # Mock behavior when model isn't loaded - return multiple domains if query has keywords
        q = request.text.lower()
        mock_domains = []
        if "fees" in q or "pay" in q or "finance" in q: mock_domains.append("Fees")
        if "housing" in q or "dorm" in q: mock_domains.append("Housing")
        if "career" in q or "job" in q: mock_domains.append("Career")
        if "academic" in q or "course" in q: mock_domains.append("Academics")
        if not mock_domains: mock_domains = ["General"]
        
        return ClassificationResponse(
            domains=mock_domains, 
            confidences=[0.9 - (i * 0.1) for i in range(len(mock_domains))]
        )
        
    inputs = tokenizer(request.text, return_tensors="pt", truncation=True, max_length=128)
    
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        # Use sigmoid for multi-label independent probabilities
        probs = torch.sigmoid(logits)[0] 
        
        # Extract multiple domains based on threshold
        threshold = 0.2
        above_threshold = (probs > threshold).nonzero(as_tuple=True)[0]
        
        domains = []
        confidences = []
        
        if len(above_threshold) > 0:
            # Sort by probability descending
            probs_above = probs[above_threshold]
            sorted_indices = torch.argsort(probs_above, descending=True)
            for idx in sorted_indices:
                class_idx = above_threshold[idx].item()
                domain_val = id2domain.get(class_idx, "General")
                if domain_val == "Fees & Finance": domain_val = "Fees"
                if domain_val == "Career Services": domain_val = "Career"
                
                domains.append(domain_val)
                confidences.append(round(probs_above[idx].item(), 4))
        else:
            # Fallback to the highest if none above threshold
            confidence, predicted_class = torch.max(probs, dim=-1)
            domain_val = id2domain.get(predicted_class.item(), "General")
            if domain_val == "Fees & Finance": domain_val = "Fees"
            if domain_val == "Career Services": domain_val = "Career"
            domains.append(domain_val)
            confidences.append(round(confidence.item(), 4))
        
    return ClassificationResponse(
        domains=domains,
        confidences=confidences
    )

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}
