"""
Clean up PDF text extraction of Nova Praxis rulebook.

Fixes:
- Removes dotted TOC lines and TOC remnant fragments
- Removes standalone page numbers
- Rejoins lines broken mid-sentence/mid-word
- Collapses excessive blank lines
- Preserves chapter/section headers
- Fixes mid-word spaces from PDF extraction artifacts
- Fixes words merged across line breaks (e.g. "anumber" -> "a number")
"""

import re
import sys

INPUT = r"x:\My Drive\Obsidian Vaults\FATE - Nova Praxis\pdf_full_extract.txt"
OUTPUT = r"x:\My Drive\Obsidian Vaults\FATE - Nova Praxis\Nova Praxis Rulebook (Cleaned).txt"


def is_toc_line(line):
    """Detect TOC lines with dots/periods used as leaders."""
    return bool(re.search(r'\.{4,}', line))


def is_toc_remnant(line):
    """Detect partial TOC lines that lost their dots but are clearly TOC entries.
    e.g. 'Utopian Prison/Dystopian Freedom ... 12' or just page references."""
    stripped = line.strip()
    # Line ending with a page number after spaces/dots
    if re.search(r'\.\.\.\s*\d{1,3}\s*$', stripped):
        return True
    # Lines that are just "Points)" or "Aspects" with trailing page numbers - TOC fragments
    if re.match(r'^(Points?|Aspects?|Guns?|Digital|Rating|State|Reputation|Reloading)\)?\.{0,}\s*\d{0,3}\s*$', stripped):
        return True
    return False


def is_standalone_page_number(line):
    """Detect lines that are just a page number."""
    stripped = line.strip()
    return bool(re.match(r'^\d{1,3}$', stripped))


def is_chapter_header(line):
    """Detect chapter/section headers (ALL CAPS lines with meaningful content)."""
    stripped = line.strip()
    if not stripped:
        return False
    if re.match(r'^CHAPTER\s+\d+', stripped):
        return True
    if len(stripped) >= 3 and re.match(r'^[A-Z][A-Z\s\-–—&,;:\'\"()#/0-9]+$', stripped):
        if len(stripped.split()) >= 2 or len(stripped) >= 6:
            return True
    return False


def is_section_header(line):
    """Detect mixed-case section headers like 'Savants' or 'The Jump Ring Network'."""
    stripped = line.strip()
    if not stripped:
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


def fix_midword_spaces(text):
    """Fix spaces inserted mid-word by PDF extraction."""
    # Specific known broken words from the extract
    known_fixes = {
        'jo urney': 'journey',
        'technol ogical': 'technological',
        'A potheosis': 'Apotheosis',
        'S ynthesis': 'Synthesis',
        'po tation': 'potation',
        'Augmentatio n': 'Augmentation',
        'roughl y': 'roughly',
        'infl uential': 'influential',
        'g overnment': 'government',
        'a ctions': 'actions',
        'e nsure': 'ensure',
        'soc ial': 'social',
        'int o': 'into',
        'syntheti c': 'synthetic',
        'p urist': 'purist',
        'love ly': 'lovely',
        'Savan ts': 'Savants',
        'comp ilers': 'compilers',
        'w ith': 'with',
        'p hysical': 'physical',
        'saf ety': 'safety',
        'gravi tic': 'gravitic',
        'exi sts': 'exists',
        'networ k': 'network',
        'volcan ic': 'volcanic',
        'smalle r': 'smaller',
        'large r': 'larger',
        'I nteraction': 'Interaction',
        'Am ericans': 'Americans',
        ' ha ve': ' have',
        'requ ired': 'required',
        'attentionduring': 'attention during',
        'carbondioxide': 'carbon dioxide',
        'Pr oduct': 'Product',
        'f rom': 'from',
        's pecifically': 'specifically',
        'ter ms': 'terms',
        'o f': 'of',
        'N otice': 'Notice',
        ' t he ': ' the ',
        'succee d': 'succeed',
        'a ware': 'aware',
        'COPYRI GHT': 'COPYRIGHT',
        't ransform': 'transform',
        'I f ': 'If ',
        'M ost ': 'Most ',
        'T he ': 'The ',
        'B ecause': 'Because',
        ' b ut ': ' but ',
        'bi ology': 'biology',
        'regu late': 'regulate',
        'k eep': 'keep',
        'destr oying': 'destroying',
        're mnant': 'remnant',
        'solidif ication': 'solidification',
        'man ufacturer': 'manufacturer',
        'busi nesses': 'businesses',
        'th ewealth': 'the wealth',
        'a cquire': 'acquire',
        'Hi ske': 'Hiske',
        'a ble': 'able',
        'ma terials': 'materials',
        'cl aiming': 'claiming',
        'ef forts': 'efforts',
        'F ederation': 'Federation',
        'M illions': 'Millions',
        'I ncluded': 'Included',
        'A nd ': 'And ',
        'H ouses': 'Houses',
        'D epending': 'Depending',
        'U nlike': 'Unlike',
        'I nteraction': 'Interaction',
        'Sofar': 'So far',
        'a nopportunity': 'an opportunity',
        'nopportunity': 'n opportunity',
        't ocharter': 'to charter',
        'whofell': 'who fell',
        'toofar': 'too far',
        'H ouses': 'Houses',
        ' h as ': ' has ',
        'sstructure': 's structure',
        'you rdevices': 'your devices',
        'an dapostates': 'and apostates',
        'material sinto': 'materials into',
        'th ewealth': 'the wealth',
    }
    for broken, fixed in known_fixes.items():
        text = text.replace(broken, fixed)

    return text


def fix_merged_words(text):
    """Fix words that got merged when line breaks were removed."""

    # Fix missing space after 's contractions/possessives
    # Handle both ASCII apostrophe (') and smart quotes (U+2018, U+2019)
    text = re.sub(r"['\u2018\u2019]s([a-z])", lambda m: m.group(0)[0] + "s " + m.group(1), text)

    # Fix missing space after 't contractions (don't, can't, won't, etc.)
    text = re.sub(r"['\u2018\u2019]t([a-z])", lambda m: m.group(0)[0] + "t " + m.group(1), text)

    # Fix "to" + word merges (common at line breaks)
    text = re.sub(r'\bto(fight|form|fulfill|charter|keep|function|flee)\b', r'to \1', text)

    # Fix "also" + word merges
    text = re.sub(r'\balso(function|include)\b', r'also \1', text)

    # "a " + word merges — be careful not to break "an" words
    # Only fix specific known cases where "a" got merged with next word
    text = re.sub(r'\ba(number|nearby|normal|nutshell)\b', r'a \1', text)

    # "an" + word merges
    text = re.sub(r'\ban(opportunity|influential)\b', r'an \1', text)

    # Other specific merges from PDF line breaks
    text = text.replace('pointof', 'point of')
    text = text.replace('informationdirectly', 'information directly')
    text = text.replace('beendetected', 'been detected')
    text = text.replace('oftendisplayed', 'often displayed')
    text = text.replace('candispense', 'can dispense')
    text = text.replace('remaindisguised', 'remain disguised')
    text = text.replace('indoubt', 'in doubt')
    text = text.replace(' sinto ', 's into ')
    text = text.replace('yourdevices', 'your devices')
    text = text.replace('alsofunction', 'also function')
    text = text.replace('carbondioxide', 'carbon dioxide')
    text = text.replace('attentionduring', 'attention during')
    text = text.replace('indistracting', 'in distracting')

    return text


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
    if next_stripped.startswith('•') or next_stripped.startswith('…'):
        return False
    if re.match(r'^(Step\s+#?\d|Note:|Upgrades|Continued)', next_stripped):
        return False

    # Don't join lines that look like stat blocks or data rows
    if re.match(r'^(Gravity:|Length of Day:|Estimated Population:|Notable Settlements|Cost|Policy|Alpha|Beta|Gamma|Delta|Epsilon)', next_stripped):
        return False

    # Join if current line ends mid-word (ends with a lowercase letter or comma)
    if re.search(r'[a-z,]$', current):
        return True

    # Join if current line ends with a hyphen (word hyphenation)
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

    # Phase 1: Strip and filter lines
    cleaned = []
    in_toc = True  # We start in the TOC zone

    for line in lines:
        stripped = line.strip()

        # Skip TOC lines (dotted leaders)
        if is_toc_line(stripped):
            continue

        # Skip TOC remnant fragments
        if is_toc_remnant(stripped):
            continue

        # Skip standalone page numbers
        if is_standalone_page_number(stripped):
            continue

        # Detect end of TOC zone - first real content after credits section
        if in_toc:
            # TOC zone ends when we hit the credits or the first chapter content
            if stripped.startswith('Nova Praxis Augmented PDF'):
                in_toc = False
            elif stripped.startswith('CHAPTER') and not is_toc_line(stripped):
                # Chapter headers in TOC zone are just TOC entries - skip them
                continue
            else:
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
            # If current line ends with hyphen and next starts lowercase, dehyphenate
            if line.endswith('-') and next_line[0].islower():
                line = line[:-1] + next_line
            else:
                line = line + ' ' + next_line
            i += 1

        joined.append(line)
        i += 1

    # Phase 3: Fix mid-word spaces and merged words
    result = []
    for line in joined:
        line = fix_midword_spaces(line)
        line = fix_merged_words(line)
        # Normalize multiple spaces to single
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

    # Phase 5: Add proper spacing around chapter headers
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
