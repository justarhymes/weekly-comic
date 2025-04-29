import re

def slugify(value: str) -> str:
    value = re.sub(r'[^a-zA-Z0-9]+', '-', value.lower())
    return value.strip('-')
