import os
import torch
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    DataCollatorWithPadding
)
from peft import get_peft_model, LoraConfig, TaskType
import numpy as np
import evaluate

def compute_metrics(eval_pred):
    # Simple multi-label metric: count how many predictions match the threshold
    logits, labels = eval_pred
    probs = 1.0 / (1.0 + np.exp(-logits)) # sigmoid
    predictions = (probs > 0.5).astype(int)
    
    # Exact match accuracy
    exact_match = (predictions == labels).all(axis=1).mean()
    return {"exact_match_accuracy": exact_match}

def train_model():
    model_name = "distilbert-base-uncased"
    data_files = {
        "train": "../data/train.jsonl",
        "validation": "../data/val.jsonl",
        "test": "../data/test.jsonl"
    }
    
    dataset = load_dataset("json", data_files=data_files)
    
    # Collect all unique domains
    all_domains = set()
    for row in dataset["train"]:
        for d in row["domains"]:
            all_domains.add(d)
    domains = list(all_domains)
    domains.sort()
    
    domain2id = {d: i for i, d in enumerate(domains)}
    id2domain = {i: d for d, i in domain2id.items()}
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    def preprocess_function(examples):
        inputs = tokenizer(examples["text"], truncation=True, max_length=128)
        
        # Create one-hot encoded labels
        batch_labels = []
        for d_list in examples["domains"]:
            label = [0.0] * len(domains)
            for d in d_list:
                label[domain2id[d]] = 1.0
            batch_labels.append(label)
            
        inputs["labels"] = batch_labels
        return inputs

    tokenized_datasets = dataset.map(preprocess_function, batched=True)
    data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

    # Use multi_label_classification
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=len(domains),
        id2label=id2domain,
        label2id=domain2id,
        problem_type="multi_label_classification"
    )

    peft_config = LoraConfig(
        task_type=TaskType.SEQ_CLS,
        inference_mode=False,
        r=8, 
        lora_alpha=16,
        lora_dropout=0.1,
        target_modules=["q_lin", "v_lin"]
    )
    
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
    
    training_args = TrainingArguments(
        output_dir="../models/domain_classifier",
        learning_rate=2e-4,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["validation"],
        processing_class=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )
    
    print("Starting training...")
    trainer.train()
    
    print("Evaluating on test set...")
    test_results = trainer.evaluate(tokenized_datasets["test"])
    print(test_results)
    
    print("Saving model...")
    model.save_pretrained("../models/domain_classifier_final")
    tokenizer.save_pretrained("../models/domain_classifier_final")
    
    import json
    with open("../models/domain_classifier_final/label_mapping.json", "w") as f:
        json.dump({"id2domain": id2domain, "num_labels": len(domains)}, f)

if __name__ == "__main__":
    train_model()
