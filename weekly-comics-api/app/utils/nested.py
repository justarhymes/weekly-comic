def nested_get(obj, *attrs, default=None):
    for attr in attrs:
        obj = getattr(obj, attr, None)
        if obj is None:
            return default
    return obj
