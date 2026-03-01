"""
Clean up PDF text extraction of Machinations: The Nova Praxis GM's Companion.

Fixes:
- Removes --- PAGE N --- markers and repeating page headers
- Removes TOC section and standalone page numbers
- Removes legal/OGL boilerplate (preserves credits)
- Rejoins lines broken mid-sentence by PDF column layout
- Collapses excessive blank lines
- Preserves chapter/section headers
"""

import re

INPUT = r"x:\My Drive\Obsidian Vaults\FATE - Nova Praxis\machinations_raw_extract.txt"
OUTPUT = r"x:\My Drive\Obsidian Vaults\FATE - Nova Praxis\machinations_full_extract.txt"

# Repeating page headers from the PDF layout
PAGE_HEADERS = {
    "A LOOK AT",
    "NOVA PRAXIS",
    "HIDDEN",
    "AGENDAS",
    "GM'S TOOLBOX",
    "GM\u2019S TOOLBOX",
    "GHOSTS",
    "IN DARKNESS",
    "GHOSTS IN DARKNESS",
}

# Lines that are just a section page number label like "CREDITS1" or "LEGAL 2"
HEADER_PAGE_NUM = re.compile(r'^(CREDITS|LEGAL|CONTENTS)\s*\d*$')


def is_page_marker(line):
    """Detect --- PAGE N --- markers."""
    return bool(re.match(r'^---\s*PAGE\s+\d+\s*---$', line.strip()))


def is_page_header(line):
    """Detect repeating page header/footer text."""
    stripped = line.strip()
    if stripped in PAGE_HEADERS:
        return True
    if HEADER_PAGE_NUM.match(stripped):
        return True
    # Standalone page numbers (1-3 digits)
    if re.match(r'^\d{1,3}$', stripped):
        return True
    return False


def is_toc_line(line):
    """Detect TOC entry lines."""
    stripped = line.strip()
    # Chapter/section with page number at end
    if re.match(r'^(CHAPTER\s+\d|Arc\s+#|THE\s|HIDDEN|EXPERIENCE|REQUISITIONS|SEQUENCES|CAMPAIGN|GHOSTS|ANTAGONISTS|INDEX)', stripped) and re.search(r'\d{1,3}\s*$', stripped):
        return True
    # Indented subsection with page number
    if re.search(r'\s{2,}\d{1,3}\s*$', stripped) and len(stripped) < 60:
        return True
    # Line that's just a title + page number
    if re.match(r'^[A-Za-z][A-Za-z\s\-–—&,;:\'\"()#/0-9]+\d{1,3}\s*$', stripped) and len(stripped) < 60:
        return True
    return False


def is_chapter_header(line):
    """Detect chapter/section headers."""
    stripped = line.strip()
    if not stripped:
        return False
    if re.match(r'^CHAPTER\s+\d+', stripped):
        return True
    # ALL CAPS lines that are meaningful headers (not page headers)
    if stripped in PAGE_HEADERS:
        return False
    if len(stripped) >= 3 and re.match(r'^[A-Z][A-Z\s\-–—&,;:\'\"()#/0-9]+$', stripped):
        if len(stripped.split()) >= 2 or len(stripped) >= 6:
            return True
    return False


def is_section_header(line):
    """Detect mixed-case section headers."""
    stripped = line.strip()
    if not stripped:
        return False
    if stripped in PAGE_HEADERS:
        return False
    if (len(stripped) < 60 and
        stripped[0].isupper() and
        not stripped.endswith(',') and
        not stripped.endswith('-') and
        not re.search(r'\.\s*$', stripped)):
        words = stripped.split()
        if len(words) <= 8:
            cap_words = sum(1 for w in words if w[0].isupper() or w in ('a', 'an', 'the', 'of', 'for', 'and', 'in', 'on', 'to', 'or', 'vs.', 'vs'))
            if cap_words >= len(words) * 0.6:
                return True
    return False


def should_join_lines(current, next_line):
    """Determine if two lines should be joined (line was broken mid-sentence)."""
    current = current.rstrip()
    next_stripped = next_line.strip()

    if not current or not next_stripped:
        return False

    # Don't join if next line is a header
    if is_chapter_header(next_stripped) or is_section_header(next_stripped):
        return False

    # Don't join if current line is a header
    if is_chapter_header(current) or is_section_header(current):
        return False

    # Don't join bullet points or list items
    if next_stripped.startswith('•') or next_stripped.startswith('…') or next_stripped.startswith('ª'):
        return False
    if re.match(r'^(Step\s+#?\d|Note:|Upgrades|Continued)', next_stripped):
        return False

    # Don't join stat block lines
    if re.match(r'^(Aspects?:|Skills?:|Stunts?:|Stress:|Consequences?:|Extras?:|Description:)', next_stripped):
        return False

    # Don't join lines starting with em-dash (dialogue/list)
    if next_stripped.startswith('—') or next_stripped.startswith('–'):
        return False

    # Join if current line ends mid-word (lowercase letter or comma)
    if re.search(r'[a-z,;]$', current):
        return True

    # Join if current line ends with hyphen (word hyphenation)
    if current.endswith('-'):
        return True

    # Join if next line starts with lowercase
    if next_stripped and next_stripped[0].islower():
        return True

    # Join if current line ends with common continuation words
    if re.search(r'\b(the|a|an|of|for|and|in|on|to|or|is|are|was|were|that|this|with|from|by|as|at|but|not|its|his|her|their|your|our|can|may|will|shall|has|have|had|do|does|did)\s*$', current, re.IGNORECASE):
        return True

    return False


def clean_text(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Phase 1: Strip page markers, page headers, TOC, and legal boilerplate
    cleaned = []
    in_toc = False
    in_legal = False
    skip_until_content = False

    for line in lines:
        stripped = line.strip()

        # Skip page markers
        if is_page_marker(stripped):
            continue

        # Skip repeating page headers and standalone page numbers
        if is_page_header(stripped):
            continue

        # Detect and skip TOC section
        if stripped == 'CONTENTS':
            in_toc = True
            continue
        if in_toc:
            # TOC ends when we hit actual chapter content
            if stripped.startswith('A LOOK AT') or (stripped and not is_toc_line(stripped) and not re.match(r'^[A-Z].*\d{1,3}$', stripped) and len(stripped) > 30):
                in_toc = False
            else:
                continue

        # Skip legal/OGL section (pages 2-3)
        if stripped.startswith('Open Gaming License') or stripped.startswith('OPEN GAME LICENSE'):
            in_legal = True
            continue
        if in_legal:
            if stripped.startswith('First Printing'):
                in_legal = False
                continue
            continue

        if not stripped:
            cleaned.append('')
            continue

        cleaned.append(stripped)

    # Phase 2: Rejoin broken lines
    joined = []
    i = 0
    while i < len(cleaned):
        line = cleaned[i]

        if not line:
            joined.append('')
            i += 1
            continue

        # Accumulate continuation lines
        while i + 1 < len(cleaned) and cleaned[i + 1] and should_join_lines(line, cleaned[i + 1]):
            next_line = cleaned[i + 1].strip()
            # Dehyphenate if line ends with hyphen and next starts lowercase
            if line.endswith('-') and next_line[0].islower():
                line = line[:-1] + next_line
            else:
                line = line + ' ' + next_line
            i += 1

        joined.append(line)
        i += 1

    # Phase 3: Normalize whitespace
    result = []
    for line in joined:
        line = re.sub(r'  +', ' ', line)
        result.append(line)

    # Phase 4: Collapse excessive blank lines (max 1 consecutive)
    final = []
    blank_count = 0
    for line in result:
        if not line.strip():
            blank_count += 1
            if blank_count <= 1:
                final.append('')
        else:
            blank_count = 0
            final.append(line)

    # Phase 5: Add spacing around chapter headers
    spaced = []
    for i, line in enumerate(final):
        if is_chapter_header(line) and i > 0 and final[i-1].strip():
            spaced.append('')
            spaced.append('')
        spaced.append(line)

    # Strip leading blank lines
    while spaced and not spaced[0].strip():
        spaced.pop(0)

    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(spaced))

    print(f"Cleaned {len(lines)} lines -> {len(spaced)} lines")
    print(f"Output: {output_path}")


if __name__ == '__main__':
    clean_text(INPUT, OUTPUT)
