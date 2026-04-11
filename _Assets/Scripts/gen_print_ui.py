# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import random

random.seed(42)

# ── Scale & canvas ────────────────────────────────────────────────────────────
S = 2
W, H = 1920 * S, 1080 * S   # 3840 x 2160

# ── Palette (printer-safe dark on white) ─────────────────────────────────────
BG        = (255, 255, 255)
PANEL     = (244, 247, 251)
PANEL_DK  = (228, 234, 241)
PANEL_CR  = (250, 247, 244)   # warm off-white for corrupted rows
BORDER    = (192, 208, 222)
BORDER_DK = (148, 168, 184)
TEXT_PRI  = (14,  18,  25)
TEXT_SEC  = (68,  88, 108)
TEXT_MUT  = (148, 162, 175)
TEAL      = (16,  65,  75)
BLUE_DK   = (22,  52, 112)
GREEN_DK  = (20,  78,  48)
AMBER_DK  = (98,  68,  12)
RULE      = (214, 223, 230)
CRPT_HI   = (38,  46,  60)
CRPT_MD   = (78,  90, 108)
CRPT_LO   = (148, 162, 178)
CRPT_TXT  = (108, 120, 135)  # muted color for garbled text
ERR_RED   = (108, 24,  30)   # error badge

# ── Fonts ─────────────────────────────────────────────────────────────────────
F = "C:/Windows/Fonts/"

def mf(name, size):
    try:
        return ImageFont.truetype(F + name, size)
    except:
        return ImageFont.load_default()

fonts = {
    "xs":    mf("consola.ttf",  22),
    "xs_b":  mf("consolab.ttf", 22),
    "sm":    mf("consola.ttf",  26),
    "sm_b":  mf("consolab.ttf", 26),
    "md":    mf("consola.ttf",  30),
    "md_b":  mf("consolab.ttf", 30),
    "xl_b":  mf("consolab.ttf", 52),
    "xxl_b": mf("consolab.ttf", 56),
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

# ── TOP NAV BAR ───────────────────────────────────────────────────────────────
NAV_H = 60
R([(0, 0), (W, NAV_H)], fill=PANEL_DK)
L((0, NAV_H), (W, NAV_H), BORDER_DK)

crumbs = [("KR", False), ("KIMYRA R&D", False), ("CIRE", False),
          ("CR-7", False), ("SUBLEVEL ARCHIVE", False), ("ARCHIVE RETRIEVAL", True)]
cx = 24
for label, active in crumbs:
    fk  = "sm_b" if active else "xs"
    col = TEXT_PRI if active else TEXT_SEC
    T((cx, 16), label, col, fk)
    cx += TW(label, fk) + 10
    if not active:
        T((cx, 16), ">", TEXT_MUT, "xs")
        cx += TW(">", "xs") + 10

right_items = [
    ("\u25cf ACTO INTDRILL", GREEN_DK), ("\u25cf RECORD FORGE", GREEN_DK),
    ("\u25cf PSYC LATENT",  AMBER_DK), ("\u25cf CREDS COPY",   GREEN_DK),
    ("RPG ORPHNY?",         TEXT_MUT), ("TERMINAL /\u2014",     TEXT_MUT),
]
rx = W - 24
for label, col in reversed(right_items):
    w_ = TW(label, "xs")
    rx -= w_
    T((rx, 16), label, col, "xs")
    rx -= 40

# ── TAB BAR ───────────────────────────────────────────────────────────────────
TAB_Y = NAV_H
TAB_H = 68
R([(0, TAB_Y), (W, TAB_Y + TAB_H)], fill=BG)
L((0, TAB_Y + TAB_H), (W, TAB_Y + TAB_H), BORDER)

tabs = [("OVERVIEW", False), ("RECORDS  3", True), ("DEPLOYED IDS", False),
        ("SIGNAL ROUTING", False), ("CLASSIFIED  \u2014\u2014", False)]
tx = 384
for label, active in tabs:
    tw  = TW(label, "sm")
    pad = 32
    by  = TAB_Y
    if active:
        R([(tx - pad, by), (tx + tw + pad, by + TAB_H)], fill=BG, outline=BORDER)
        L((tx - pad + 2, by + TAB_H), (tx + tw + pad - 2, by + TAB_H), BG, 4)
        L((tx - pad, by), (tx + tw + pad, by), TEAL, 4)
        T((tx, by + 20), label, TEXT_PRI, "sm_b")
    else:
        T((tx, by + 22), label, TEXT_MUT, "xs")
    tx += tw + pad * 2 + 44

# ── SIDEBAR ───────────────────────────────────────────────────────────────────
SB_W = 370
SB_Y = TAB_Y + TAB_H
R([(0, SB_Y), (SB_W, H)], fill=PANEL)
L((SB_W, SB_Y), (SB_W, H), BORDER)

T((28, SB_Y + 32),  "STANDARD",  BLUE_DK, "xxl_b")
T((28, SB_Y + 96),  "DEVIATION", BLUE_DK, "xxl_b")
L((24, SB_Y + 176), (SB_W - 24, SB_Y + 176), BORDER_DK)

sy = SB_Y + 208
for label, val in [
    ("PROTOCOL ENTRY",   None),
    ("TOTAL SURVEYED",   "200"),
    ("PRIMARY  CONTACT", "197"),
    ("SECONDARY",          "2"),
    ("LATE TRACKING",      "1"),
]:
    if val is None:
        T((28, sy), label, TEXT_MUT, "xs_b")
    else:
        T((28, sy), label, TEXT_SEC, "xs")
        T((SB_W - 28 - TW(val, "xs_b"), sy), val, TEXT_PRI, "xs_b")
    sy += 40

sy += 16
L((28, sy), (SB_W - 28, sy), BORDER)
sy += 24
R([(28, sy), (SB_W - 28, sy + 56)], fill=PANEL_DK, outline=BORDER)
T((40, sy + 14), "CR-7-SJB", TEXT_SEC, "xs")
R([(SB_W - 64, sy + 16), (SB_W - 36, sy + 40)], fill=TEXT_PRI)
sy += 80
T((28, sy), "SD\u20147", TEXT_MUT, "sm")

py = H - 216
T((28, py), "14%", TEAL, "xl_b")
py += 84
bx1, bx2 = 28, SB_W - 28
R([(bx1, py), (bx2, py + 10)], fill=PANEL_DK)
R([(bx1, py), (bx1 + int((bx2 - bx1) * 0.14), py + 10)], fill=TEAL)
L((bx1, py + 28), (bx2, py + 28), BORDER)

# ── CONTENT AREA ─────────────────────────────────────────────────────────────
MX = SB_W + 2
MW = W - MX

COL = {
    "idx":    MX + 32,
    "rec":    MX + 150,
    "name":   MX + 290,
    "status": MX + 760,
    "route":  MX + 1110,
    "notes":  MX + 1390,
    "xfer":   MX + 1740,
}
COL_SEP = [MX + 140, MX + 750, MX + 1098, MX + 1378, MX + 1728]

# Filter bar
FY = SB_Y
FH = 60
R([(MX, FY), (W, FY + FH)], fill=PANEL)
L((MX, FY + FH), (W, FY + FH), BORDER)

filter_cx = MX + MW // 2
T((filter_cx - TW("FILTER", "xs_b") // 2 - 90, FY + 18), "FILTER", TEXT_MUT, "xs_b")
cbx = filter_cx + 8
for bw, shade in [(40, CRPT_HI), (20, CRPT_MD), (52, CRPT_HI), (16, CRPT_LO),
                  (44, CRPT_MD), (12, CRPT_HI), (28, CRPT_LO)]:
    R([(cbx, FY + 20), (cbx + bw, FY + 44)], fill=shade)
    cbx += bw + 6
T((W - 760, FY + 18), "ARCHIVE 2 / FILTERED", TEXT_MUT, "xs")
T((W - 356, FY + 18), "197 OVERRIDES",        TEXT_MUT, "xs")

# Column headers
CHY = FY + FH
CHH = 56
R([(MX, CHY), (W, CHY + CHH)], fill=PANEL_DK)
L((MX, CHY + CHH), (W, CHY + CHH), BORDER_DK)
for sep in COL_SEP:
    L((sep, CHY), (sep, CHY + CHH), BORDER)
for key, label in [("idx","IDX"), ("rec","RECORD OR NUMBER"), ("status","STATUS PASS"),
                   ("route","ROUTE"), ("notes","NOTES"), ("xfer","TRANSFER")]:
    T((COL[key], CHY + 16), label, TEXT_SEC, "xs_b")

# ── Corrupted date block ───────────────────────────────────────────────────────
def crpt_date(x, y, h=24, dense=False):
    segs = [
        (32, CRPT_HI), (24, CRPT_MD), (20, CRPT_HI), (28, CRPT_HI),
        (8,  BG),
        (28, CRPT_MD), (20, CRPT_HI),
        (8,  BG),
        (20, CRPT_HI), (24, CRPT_MD),
    ]
    if dense:
        segs = [(bw + 8 if shade != BG else bw, shade) for bw, shade in segs]
    bx = x
    for bw, shade in segs:
        if shade != BG:
            R([(bx, y), (bx + bw, y + h)], fill=shade)
        bx += bw + 4
    # digit-peek gaps
    bg = PANEL_CR if dense else PANEL
    R([(x + 56,  y + 4), (x + 70,  y + h - 4)], fill=bg)
    R([(x + 156, y + 4), (x + 164, y + h - 4)], fill=bg)

# ── Clean record ──────────────────────────────────────────────────────────────
def draw_record(y0, idx, rec_id, subject, qa):
    ROW_H = 64
    R([(MX, y0), (W, y0 + ROW_H)], fill=BG)
    L((MX, y0 + ROW_H), (W, y0 + ROW_H), RULE)
    for sep in COL_SEP:
        L((sep, y0), (sep, y0 + ROW_H), RULE)

    T((COL["idx"],  y0 + 18), f"{idx:03d}", TEXT_MUT, "xs_b")
    T((COL["rec"],  y0 + 18), rec_id,       TEXT_SEC, "xs")
    T((COL["name"], y0 + 18), subject,      TEAL,     "md_b")
    crpt_date(COL["status"], y0 + 20)

    badge = "\u25cf PARTIAL READ"
    bx = COL["route"]
    R([(bx - 8, y0 + 16), (bx + TW(badge, "xs") + 10, y0 + 48)], outline=BORDER_DK)
    T((bx, y0 + 18), badge, AMBER_DK, "xs")

    qy = y0 + ROW_H + 24
    for kind, txt in qa:
        if kind == "q":
            T((COL["rec"],       qy), "Q:", TEXT_MUT, "sm")
            T((COL["rec"] + 56,  qy), f'"{txt}"', TEXT_SEC, "md")
            qy += 58
        elif kind == "a":
            T((COL["rec"] + 88,  qy), f'"{txt}"', TEAL, "md")
            qy += 58
        elif kind == "note":
            T((COL["rec"] + 56,  qy), txt, TEXT_MUT, "sm")
            qy += 46

    L((MX, qy + 20), (W, qy + 20), RULE)
    return qy + 52

# ── Corrupted record ──────────────────────────────────────────────────────────
def draw_corrupt_record(y0, raw_idx, rec_id, subject, qa):
    ROW_H = 64
    R([(MX, y0), (W, y0 + ROW_H)], fill=PANEL_CR)
    L((MX, y0 + ROW_H), (W, y0 + ROW_H), RULE)
    for sep in COL_SEP:
        L((sep, y0), (sep, y0 + ROW_H), RULE)

    T((COL["idx"],  y0 + 18), raw_idx,  CRPT_MD,  "xs_b")
    T((COL["rec"],  y0 + 18), rec_id,   CRPT_MD,  "xs")
    T((COL["name"], y0 + 18), subject,  CRPT_TXT, "md_b")
    crpt_date(COL["status"], y0 + 20, dense=True)

    badge = "\u25a0 CORRUPTED"
    bx = COL["route"]
    R([(bx - 8, y0 + 16), (bx + TW(badge, "xs") + 10, y0 + 48)], fill=PANEL_CR, outline=BORDER_DK)
    T((bx, y0 + 18), badge, ERR_RED, "xs")

    qy = y0 + ROW_H + 24
    for kind, txt in qa:
        if kind == "qc":
            T((COL["rec"],       qy), "Q:", CRPT_LO,  "sm")
            T((COL["rec"] + 56,  qy), txt,  CRPT_TXT, "md")
            # overlay corruption blocks on random segments of this line
            bx2 = COL["rec"] + 56
            for offset, bw in [(random.randint(60, 180), random.randint(60, 140)),
                                (random.randint(320, 520), random.randint(40, 100))]:
                R([(bx2 + offset, qy + 4), (bx2 + offset + bw, qy + 36)], fill=CRPT_HI)
            qy += 58
        elif kind == "ac":
            T((COL["rec"] + 88,  qy), txt, CRPT_MD, "md")
            # single block overlay on answer
            bx2 = COL["rec"] + 88
            offset = random.randint(40, 120)
            bw = random.randint(50, 110)
            R([(bx2 + offset, qy + 4), (bx2 + offset + bw, qy + 36)], fill=CRPT_MD)
            qy += 58
        elif kind == "note":
            T((COL["rec"] + 56,  qy), txt, CRPT_LO, "sm")
            qy += 46

    L((MX, qy + 20), (W, qy + 20), RULE)
    return qy + 52

# ── Record data ───────────────────────────────────────────────────────────────
CLEAN = [
    (7, "07\u2014B", "ADRIAN CRUZ", [
        ("q",    "Under what circumstances would you accept cognitive augmentation?"),
        ("a",    "None."),
        ("q",    "Even to save your life?"),
        ("a",    "Especially then."),
    ]),
    (8, "09\u2014F", "CALLUM VOSS", [
        ("q",    "If your memories were altered without your knowledge, how would you know?"),
        ("note", "[long pause]"),
        ("a",    "I wouldn't. That's the point, isn't it?"),
    ]),
    (9, "14\u2014C", "SARAH DONNELLY", [
        ("q",    "How do you respond to environments where social hierarchy is unstable?"),
        ("a",    "I find the person everyone's watching and I stand next to them."),
    ]),
]

CORRUPT = [
    # Heavy corruption — echoes cognitive augmentation theme
    ("0\u2588\u2588", "??\u2014\u2588", "\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2588", [
        ("qc",   "?N!T!AT?R ?#T?\u2588\u2588\u2588\u2588 WH? PR?T?C\u2588 WH?N !T M#TT?R?D T\u2588 Y\u2588U"),
        ("ac",   "\u2588\u2588\u2588\u2588\u2588 N?T \u2588\u2588\u2588\u2588\u2588\u2588.  #V?R."),
    ]),
    # Medium corruption — echoes memory alteration theme
    ("0\u2588?", "0\u2588\u20148", "K#L?R\u2588 \u2588\u2588\u2588\u2588", [
        ("qc",   "H?W D? Y#U KN\u2588W WH?N Y\u2588UR ?WN M?M?R??S \u2588R? N\u2588T Y??R ?WN?"),
        ("note", "[signal dropout \u2014 4.2s]"),
        ("ac",   "TH?Y N\u2588V?R ?R?.  TH?T'S WH? !T M?TT?RS."),
    ]),
    # Mixed corruption — echoes social hierarchy / identity theme
    ("??\u2588", "??\u2014C", "???? S\u2588K?L\u2588", [
        ("qc",   "!F TH? P?RS\u2588N N?XT T? Y\u2588U W#S # C\u2588PY,  H?W W\u2588ULD Y?U R?SP\u2588ND?"),
        ("ac",   "! F?ND TH? \u2588N? WH? #LR??DY KN\u2588WS."),
    ]),
]

# Interleave: corrupted, clean, corrupted, clean, corrupted, clean
SEQUENCE = [
    ("C", CORRUPT[0]),
    ("R", CLEAN[0]),
    ("C", CORRUPT[1]),
    ("R", CLEAN[1]),
    ("C", CORRUPT[2]),
    ("R", CLEAN[2]),
]

RY = CHY + CHH + 32
for kind, rec in SEQUENCE:
    if kind == "R":
        idx, rec_id, subject, qa = rec
        RY = draw_record(RY, idx, rec_id, subject, qa)
    else:
        raw_idx, rec_id, subject, qa = rec
        RY = draw_corrupt_record(RY, raw_idx, rec_id, subject, qa)
    RY += 32

out = r"D:\ObsidianVaults\Nova Praxis\_Assets\terminal-sd-ui-landscape-print.png"
img.save(out, dpi=(300, 300))
print(f"Saved -> {out}  ({W}x{H})")
