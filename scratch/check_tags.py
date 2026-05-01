import sys

def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    tags = []
    i = 0
    while i < len(content):
        if content[i:i+1] == '<':
            if content[i:i+2] == '</':
                end = content.find('>', i)
                tag = content[i+2:end].split()[0]
                if tags and tags[-1] == tag:
                    tags.pop()
                else:
                    print(f"Mismatched closing tag </{tag}> at index {i}")
                    # return
                i = end + 1
            elif content[i:i+4] == '<!--':
                i = content.find('-->', i) + 3
            else:
                end = content.find('>', i)
                if content[end-1] == '/': # self-closing
                    i = end + 1
                    continue
                tag = content[i+1:end].split()[0]
                if not tag.startswith('!') and not tag.startswith('?'):
                    tags.append(tag)
                i = end + 1
        else:
            i += 1
    
    if tags:
        print(f"Unclosed tags: {tags}")
    else:
        print("All tags balanced (ignoring JSX specifics)")

if __name__ == "__main__":
    check_balance(sys.argv[1])
