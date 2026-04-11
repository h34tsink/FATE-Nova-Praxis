from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080

BG       = (255, 255, 255)
PANEL    = (244, 247, 251)
PANEL_DK = (228, 234, 241)
BORDER   = (192, 208, 222)
BORDER_DK= (148, 168, 184)
TEXT_PRI = (14,  18,  25)
TEXT_SEC = (68,  88, 108)
TEXT_MUT = (148, 162, 175)
TEAL     = (16,  65,  75)
BLUE_DK  = (22,  52, 112)
GREEN_DK = (20,  78,  48)
AMBER_DK = (98,  68,  12)
RULE     = (214, 223, 230)
CRPT_HI  = (38,  46,  60)
CRPT_MD  = (78,  90, 108)
CRPT_LO  = (148, 162, 178)

F = "C:/Windows/Fonts/"

def mf(name, size):
    try:
        return ImageFont.truetype(F + name, size)
    except:
        return ImageFont.load_default()

fonts = {
    "xs":    mf("consola.ttf",  11),
    "xs_b":  mf("consolab.ttf", 11),
    "sm":    mf("consola.ttf",  13),
    "sm_b":  mf("consolab.ttf", 13),
    "md":    mf("consola.ttf",  15),
    "md_b":  mf("consolab.ttf", 15),
    "lg_b":  mf("consolab.ttf", 20),
    "xl_b":  mf("consolab.ttf", 26),
    "xxl_b": mf("consolab.ttf", 28),
}

img  = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

def T(xy, s, color=TEXT_PRI, fk="md"):
    draw.text(xy, s, fill=color, font=fonts[fk])

def L(p1, p2, color=BORDER, w=1):
    draw.line([p1, p2], fill=color, width=w)

def R(box, fill=None, outline=None, ow=1):
    draw.rectangle(box, fill=fill, outline=outline, width=ow)

def TW(s, fk="md"):
    bb = draw.textbbox((0, 0), s, font=fonts[fk])
    return bb[2] - bb[0]

# ── TOP NAV BAR ──────────────────────────────────────────────────────────────
NAV_H = 30
R([(0, 0), (W, NAV_H)], fill=PANEL_DK)
L((0, NAV_H), (W, NAV_H), BORDER_DK)

crumbs = [("KR", False), ("KIMYRA R&D", False), ("CIRE", False),
          ("CR-7", False), ("SUBLEVEL ARCHIVE", False), ("ARCHIVE RETRIEVAL", True)]
cx = 12
for label, active in crumbs:
    fk = "sm_b" if active else "xs"
    col = TEXT_PRI if active else TEXT_SEC
    T((cx, 8), label, col, fk)
    cx += TW(label, fk) + 5
    if not active:
        T((cx, 8), ">", TEXT_MUT, "xs")
        cx += TW(">", "xs") + 5

right_items = [
    ("● ACTO INTDRILL", GREEN_DK), ("● RECORD FORGE", GREEN_DK),
    ("● PSYC LATENT",  AMBER_DK), ("● CREDS COPY",   GREEN_DK),
    ("RPG ORPHNY?",    TEXT_MUT), ("TERMINAL /—",     TEXT_MUT),
]
rx = W - 12
for label, col in reversed(right_items):
    w_ = TW(label, "xs")
    rx -= w_
    T((rx, 8), label, col, "xs")
    rx -= 20

# ── TAB BAR ──────────────────────────────────────────────────────────────────
TAB_Y = NAV_H
TAB_H = 34
R([(0, TAB_Y), (W, TAB_Y + TAB_H)], fill=BG)
L((0, TAB_Y + TAB_H), (W, TAB_Y + TAB_H), BORDER)

tabs = [("OVERVIEW", False), ("RECORDS  3", True), ("DEPLOYED IDS", False),
        ("SIGNAL ROUTING", False), ("CLASSIFIED  ——", False)]
tx = 192
for label, active in tabs:
    tw  = TW(label, "sm")
    pad = 16
    by  = TAB_Y
    if active:
        R([(tx - pad, by), (tx + tw + pad, by + TAB_H)], fill=BG, outline=BORDER)
        L((tx - pad + 1, by + TAB_H), (tx + tw + pad - 1, by + TAB_H), BG, 2)
        L((tx - pad, by), (tx + tw + pad, by), TEAL, 2)
        T((tx, by + 10), label, TEXT_PRI, "sm_b")
    else:
        T((tx, by + 11), label, TEXT_MUT, "xs")
    tx += tw + pad * 2 + 22

# ── SIDEBAR ──────────────────────────────────────────────────────────────────
SB_W = 185
SB_Y = TAB_Y + TAB_H
R([(0, SB_Y), (SB_W, H)], fill=PANEL)
L((SB_W, SB_Y), (SB_W, H), BORDER)

T((14, SB_Y + 16), "STANDARD",  BLUE_DK, "xxl_b")
T((14, SB_Y + 48), "DEVIATION", BLUE_DK, "xxl_b")
L((12, SB_Y + 88), (SB_W - 12, SB_Y + 88), BORDER_DK)

sy = SB_Y + 104
stat_rows = [
    ("PROTOCOL ENTRY",   None),
    ("TOTAL SURVEYED",   "200"),
    ("PRIMARY  CONTACT", "197"),
    ("SECONDARY",          "2"),
    ("LATE TRACKING",      "1"),
]
for label, val in stat_rows:
    if val is None:
        T((16, sy), label, TEXT_MUT, "xs_b")
    else:
        T((16, sy), label, TEXT_SEC, "xs")
        T((SB_W - 16 - TW(val, "xs_b"), sy), val, TEXT_PRI, "xs_b")
    sy += 20

sy += 8
L((16, sy), (SB_W - 16, sy), BORDER)
sy += 12

R([(16, sy), (SB_W - 16, sy + 28)], fill=PANEL_DK, outline=BORDER)
T((22, sy + 7), "CR-7-SJB", TEXT_SEC, "xs")
R([(SB_W - 32, sy + 8), (SB_W - 18, sy + 20)], fill=TEXT_PRI)
sy += 40
T((16, sy), "SD—7", TEXT_MUT, "sm")

py = H - 108
T((16, py), "14%", TEAL, "xl_b")
py += 42
bar_x1, bar_x2 = 16, SB_W - 16
R([(bar_x1, py), (bar_x2, py + 5)], fill=PANEL_DK)
fill_end = bar_x1 + int((bar_x2 - bar_x1) * 0.14)
R([(bar_x1, py), (fill_end, py + 5)], fill=TEAL)
L((bar_x1, py + 14), (bar_x2, py + 14), BORDER)

# ── CONTENT AREA ─────────────────────────────────────────────────────────────
MX = SB_W + 1
MW = W - MX

COL = {
    "idx":    MX + 16,
    "rec":    MX + 75,
    "name":   MX + 142,
    "status": MX + 375,
    "route":  MX + 548,
    "notes":  MX + 688,
    "xfer":   MX + 860,
}
COL_SEP = [MX + 68, MX + 370, MX + 542, MX + 682, MX + 854]

# Filter bar
FY  = SB_Y
FH  = 30
R([(MX, FY), (W, FY + FH)], fill=PANEL)
L((MX, FY + FH), (W, FY + FH), BORDER)

filter_cx = MX + MW // 2
T((filter_cx - TW("FILTER", "xs_b") // 2 - 45, FY + 9), "FILTER", TEXT_MUT, "xs_b")
cbx = filter_cx + 4
for bw, shade in [(20, CRPT_HI), (10, CRPT_MD), (26, CRPT_HI), (8, CRPT_LO),
                  (22, CRPT_MD), (6, CRPT_HI), (14, CRPT_LO)]:
    R([(cbx, FY + 10), (cbx + bw, FY + 22)], fill=shade)
    cbx += bw + 3

T((W - 380, FY + 9), "ARCHIVE 2 / FILTERED", TEXT_MUT, "xs")
T((W - 178, FY + 9), "197 OVERRIDES",        TEXT_MUT, "xs")

# Column headers
CHY = FY + FH
CHH = 28
R([(MX, CHY), (W, CHY + CHH)], fill=PANEL_DK)
L((MX, CHY + CHH), (W, CHY + CHH), BORDER_DK)
for sep in COL_SEP:
    L((sep, CHY), (sep, CHY + CHH), BORDER)
for key, label in [("idx","IDX"), ("rec","RECORD OR NUMBER"), ("status","STATUS PASS"),
                   ("route","ROUTE"), ("notes","NOTES"), ("xfer","TRANSFER")]:
    T((COL[key], CHY + 8), label, TEXT_SEC, "xs_b")

# ── Corrupted date block renderer ────────────────────────────────────────────
def crpt_date(x, y, h=12):
    segs = [
        (16, CRPT_HI), (12, CRPT_MD), (10, CRPT_HI), (14, CRPT_HI),
        (4,  BG),
        (14, CRPT_MD), (10, CRPT_HI),
        (4,  BG),
        (10, CRPT_HI), (12, CRPT_MD),
    ]
    bx = x
    for bw, shade in segs:
        if shade != BG:
            R([(bx, y), (bx + bw, y + h)], fill=shade)
        bx += bw + 2
    R([(x + 28, y + 2), (x + 34, y + h - 2)], fill=PANEL)
    R([(x + 76, y + 2), (x + 80, y + h - 2)], fill=PANEL)

# ── Record renderer ──────────────────────────────────────────────────────────
def draw_record(y0, idx, rec_id, subject, qa):
    ROW_H = 32
    R([(MX, y0), (W, y0 + ROW_H)], fill=BG)
    L((MX, y0 + ROW_H), (W, y0 + ROW_H), RULE)
    for sep in COL_SEP:
        L((sep, y0), (sep, y0 + ROW_H), RULE)

    T((COL["idx"],  y0 + 9), f"{idx:03d}", TEXT_MUT, "xs_b")
    T((COL["rec"],  y0 + 9), rec_id,       TEXT_SEC, "xs")
    T((COL["name"], y0 + 9), subject,      TEAL,     "md_b")
    crpt_date(COL["status"], y0 + 10)

    badge = "● PARTIAL READ"
    bx = COL["route"]
    R([(bx - 4, y0 + 8), (bx + TW(badge, "xs") + 5, y0 + 24)], outline=BORDER_DK)
    T((bx, y0 + 9), badge, AMBER_DK, "xs")

    qy = y0 + ROW_H + 12
    for kind, txt in qa:
        if kind == "q":
            T((COL["rec"],         qy), "Q:", TEXT_MUT, "sm")
            T((COL["rec"] + 26,    qy), f'"{txt}"', TEXT_SEC, "md")
            qy += 28
        elif kind == "a":
            T((COL["rec"] + 42,    qy), f'"{txt}"', TEAL, "md")
            qy += 28
        elif kind == "note":
            T((COL["rec"] + 26,    qy), txt, TEXT_MUT, "sm")
            qy += 22

    L((MX, qy + 10), (W, qy + 10), RULE)
    return qy + 26

# ── Records ──────────────────────────────────────────────────────────────────
records = [
    (7, "07—B", "ADRIAN CRUZ", [
        ("q",    "Under what circumstances would you accept cognitive augmentation?"),
        ("a",    "None."),
        ("q",    "Even to save your life?"),
        ("a",    "Especially then."),
    ]),
    (8, "09—F", "CALLUM VOSS", [
        ("q",    "If your memories were altered without your knowledge, how would you know?"),
        ("note", "[long pause]"),
        ("a",    "I wouldn't. That's the point, isn't it?"),
    ]),
    (9, "14—C", "SARAH DONNELLY", [
        ("q",    "How do you respond to environments where social hierarchy is unstable?"),
        ("a",    "I find the person everyone's watching and I stand next to them."),
    ]),
]

RY = CHY + CHH + 16
for idx, rec_id, subject, qa in records:
    RY = draw_record(RY, idx, rec_id, subject, qa)
    RY += 16

out = r"D:\ObsidianVaults\Nova Praxis\_Assets\terminal-sd-ui-landscape-print.png"
img.save(out)
print(f"Saved -> {out}")
