import json


def load_json(a_json_file_path):
    try:
        with open(a_json_file_path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

