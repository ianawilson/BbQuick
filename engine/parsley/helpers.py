import json
from BeautifulSoup import BeautifulSoup, NavigableString

# Pretty-encodes json
def jsonEncode(dictionary):
    return json.dumps(dictionary, sort_keys=True, indent=4)


def drillDown(item):
    if type(item) == NavigableString:
        if item.strip():
            return item
        else:
            return None
    
    # search from end
    contents = item.contents
    contents.reverse()
    for content in contents:
        result = drillDown(content)
        if result:
            return result
    
    return None
