import json

# Pretty-encodes json
def jsonEncode(dictionary):
    return json.dumps(dictionary, sort_keys=True, indent=4)
