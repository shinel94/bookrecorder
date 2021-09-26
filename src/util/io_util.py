import json


def load_json(a_json_file_path):
    try:
        with open(a_json_file_path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_json(file_path, a_json: dict):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(a_json, f, indent=2)



