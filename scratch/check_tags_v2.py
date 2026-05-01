import sys
import re

def find_tags(content):
    # Regex to find <tag ...> or </tag>
    # Ignores self-closing tags <tag />
    tag_re = re.compile(r'<(/?)([a-zA-Z0-9]+)(?:\s+[^>]*[^/])?>')
    for match in tag_re.finditer(content):
        is_closing = match.group(1) == '/'
        tag_name = match.group(2)
        yield is_closing, tag_name, match.start()

def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    stack = []
    for is_closing, tag_name, pos in find_tags(content):
        # Ignore common JSX types/components that look like tags but might be different
        if tag_name in ['HTMLDivElement', 'CarouselApi', 'T']:
            continue
            
        if is_closing:
            if not stack:
                print(f"Extra closing tag </{tag_name}> at position {pos}")
            else:
                opening_tag, opening_pos = stack.pop()
                if opening_tag != tag_name:
                    print(f"Mismatched closing tag </{tag_name}> at {pos} (opened <{opening_tag}> at {opening_pos})")
                    # Put it back to try to recover
                    stack.append((opening_tag, opening_pos))
        else:
            stack.append((tag_name, pos))
    
    for tag_name, pos in stack:
        print(f"Unclosed tag <{tag_name}> at position {pos}")

if __name__ == "__main__":
    check_balance(sys.argv[1])
