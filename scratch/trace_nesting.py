import sys
import re

def find_tags(content):
    tag_re = re.compile(r'<(/?)([a-zA-Z0-9]+)(?:\s+[^>]*[^/])?>')
    for match in tag_re.finditer(content):
        is_closing = match.group(1) == '/'
        tag_name = match.group(2)
        line_num = content.count('\n', 0, match.start()) + 1
        yield is_closing, tag_name, line_num

def trace_nesting(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    stack = []
    for is_closing, tag_name, line in find_tags(content):
        if tag_name in ['HTMLDivElement', 'CarouselApi', 'T', 'h1', 'p', 'small', 'Image', 'Link', 'LogoIcon', 'BaseIcons', 'SectionHeader', 'Carousel', 'CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext', 'ListingCardSkeleton', 'FeaturedListingCard', 'CategoryCard', 'BusinessCategoryIcons', 'NumberFlow', 'BusinessSearch', 'SponsoredAdsCard', 'AnimatedStat', 'CLientsLandingFAQs', 'ThisWeeksTrends', 'LogoLoadingIcon', 'EmptyState', 'EmptyChatMedia']:
            continue
            
        if is_closing:
            if not stack:
                print(f"L{line}: Extra closing tag </{tag_name}>")
            else:
                opening_tag, opening_line = stack.pop()
                if opening_tag != tag_name:
                    print(f"L{line}: Mismatched </{tag_name}> (opened <{opening_tag}> at L{opening_line})")
                    stack.append((opening_tag, opening_line))
                else:
                    print(f"L{line}: Closed </{tag_name}> (level {len(stack)})")
        else:
            stack.append((tag_name, line))
            print(f"L{line}: Opened <{tag_name}> (level {len(stack)-1})")
    
    for tag_name, line in stack:
        print(f"L{line}: Unclosed tag <{tag_name}>")

if __name__ == "__main__":
    trace_nesting(sys.argv[1])
