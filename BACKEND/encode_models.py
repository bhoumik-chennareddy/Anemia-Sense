import base64

files_to_encode = ["anemia_model.joblib", "model_feature_columns.joblib"]

for filename in files_to_encode:
    try:
        with open(filename, "rb") as f:
            encoded_string = base64.b64encode(f.read()).decode('utf-8')
            print(f"\n# --- Encoded string for: {filename} ---")
            print(f'"{encoded_string}"')
    except FileNotFoundError:
        print(f"\nError: Could not find file '{filename}'. Make sure it's in the same directory.")