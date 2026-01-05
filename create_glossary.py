import os
import re

# Input and output directories
input_file = r"C:\TEMP\list.md"
output_folder = r"C:\TEMP\Split List"

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Function to sanitize filenames
def sanitize_filename(name):
    return re.sub(r'[<>:"/\\|?*]', '_', name)

try:
    # Read the input file
    with open(input_file, "r", encoding="utf-8") as file:
        content = file.read()
except FileNotFoundError:
    print(f"Input file not found: {input_file}")
    exit(1)

# Split content by ## headings
sections = re.split(r'(?m)^## (.+)$', content)

if len(sections) < 3:
    print("No valid ## headers found in the input file.")
    exit(1)

# Process each section
for i in range(1, len(sections), 2):  # Skip content outside headings
    heading = sections[i].strip()
    body = sections[i + 1].strip()

    # Extract main title and alias from parentheses if present
    match = re.match(r'(.+?)\s*\((.+?)\)', heading)
    if match:
        main_title = match.group(1).strip()
        alias = match.group(2).strip()
        aliases_block = f"---\naliases:\n  - {alias}\n---\n\n"
    else:
        main_title = heading
        aliases_block = ""

    # Sanitize filename
    filename = sanitize_filename(main_title) + ".md"
    filepath = os.path.join(output_folder, filename)

    try:
        # Write to the new file
        with open(filepath, "w", encoding="utf-8") as new_file:
            new_file.write(aliases_block + body)
        print(f"File created: {filepath}")
    except Exception as e:
        print(f"Error writing file {filepath}: {e}")

print(f"Markdown files created in: {output_folder}")