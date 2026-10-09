#!/usr/bin/env python3
"""Generate the site's printable resources and original social card.

Prerequisites: npm ci; Python packages reportlab and Pillow; Poppler pdftoppm.
Run: python3 scripts/generate-printables.py
Games only: python3 scripts/generate-printables.py --only games folklore
Override NODE or PDFTOPPM when these executables are not on PATH.
Calendar data comes from the same modules used by the website. Original party
game data is defined here. Generated files are checked in, so normal website
builds do not require Python or Poppler.
"""

from datetime import date
from pathlib import Path
import argparse
import json
import os
import random
import shutil
import subprocess
import tempfile

import reportlab
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/downloads"
ASSETS = ROOT / "public/assets"
BG = "#fff9f6"
INK = "#493b45"
MUTED = "#74616d"
ROSE = "#ad466b"
ROSE_BG = "#fbe8ef"
BLUE = "#3d6788"
BLUE_BG = "#eaf3fa"
LINE = "#d9c7ce"
WEBSITE = "chinesegenderpredictor.net"
RELEASE = "2026-10-09"
FONT_DIR = Path(reportlab.__file__).parent / "fonts"
pdfmetrics.registerFont(TTFont("Vera", str(FONT_DIR / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("VeraBold", str(FONT_DIR / "VeraBd.ttf")))

DATA = json.loads(subprocess.check_output([
    os.environ.get("NODE", "node"), "--input-type=module", "-e",
    "import {CHART,CHART_VERSION} from './src/chart.mjs'; "
    "import {calendarMonths} from './src/calendar.mjs'; "
    "console.log(JSON.stringify({chart:CHART,version:CHART_VERSION,"
    "years:{2026:calendarMonths(2026),2027:calendarMonths(2027)}}));"
], cwd=ROOT, text=True))


def color(value):
    return colors.HexColor(value)


def text(c, value, x, y, size=10, bold=False, fill=INK, align="left"):
    c.setFillColor(color(fill))
    c.setFont("VeraBold" if bold else "Vera", size)
    getattr(c, {"left": "drawString", "center": "drawCentredString", "right": "drawRightString"}[align])(x, y, value)


def paragraph(c, value, x, top, width, size=9, leading=13, fill=INK):
    p = Paragraph(value, ParagraphStyle("body", fontName="Vera", fontSize=size,
                                      leading=leading, textColor=color(fill)))
    _, height = p.wrap(width, 1000)
    p.drawOn(c, x, top - height)
    return top - height


def line(c, x, y, end, stroke=LINE):
    c.setStrokeColor(color(stroke))
    c.setLineWidth(.6)
    c.line(x, y, end, y)


def header(c, w, h, kicker, title, subtitle):
    text(c, kicker.upper(), 38, h - 38, 8, True, ROSE)
    text(c, title, 38, h - 69, 23, True)
    paragraph(c, subtitle, 38, h - 84, w - 76, 9, 13, MUTED)


def footer(c, w, page, total, label):
    line(c, 38, 37, w - 38)
    text(c, WEBSITE, 38, 23, 7.2, True, ROSE)
    text(c, f"{label}  |  {page}/{total}", w - 38, 23, 7.2, fill=MUTED, align="right")
    c.linkURL("https://" + WEBSITE + "/", (38, 18, 203, 33), relative=0)


def new_pdf(path, size, title):
    c = canvas.Canvas(str(path), pagesize=size, pageCompression=1, invariant=1)
    c.setTitle(title)
    c.setAuthor("Chinese Gender Predictor / BogerHou")
    c.setSubject("Entertainment-only traditional chart and printable resources")
    c.setCreator("Chinese Gender Predictor printable generator")
    return c


def chart_page(c, size, year, format_name):
    w, h = size
    header(c, w, h, "A little tradition, just for fun", f"Chinese gender calendar {year}",
           "Full traditional chart for lunar ages 18-45. Use lunar age and the lunar conception month, not Gregorian months.")
    top, left, width = h - 132, 38, w - 76
    age_w, cell_h, head_h = 66, 15.2, 25
    cell_w = (width - age_w) / 12
    c.setFillColor(color(INK))
    c.rect(left, top - head_h, width, head_h, fill=1, stroke=0)
    text(c, "LUNAR AGE", left + age_w / 2, top - 16, 7, True, "#ffffff", "center")
    for month in range(12):
        text(c, str(month + 1), left + age_w + (month + .5) * cell_w, top - 16, 9, True, "#ffffff", "center")
    for i, (age, row) in enumerate(DATA["chart"].items()):
        y = top - head_h - (i + 1) * cell_h
        c.setFillColor(color(BG if i % 2 == 0 else "#ffffff"))
        c.rect(left, y, age_w, cell_h, fill=1, stroke=0)
        text(c, age, left + age_w / 2, y + 4.5, 8.5, True, INK, "center")
        for m, code in enumerate(row):
            c.setFillColor(color(BLUE_BG if code == "B" else ROSE_BG))
            x = left + age_w + m * cell_w
            c.rect(x, y, cell_w, cell_h, fill=1, stroke=0)
            text(c, code, x + cell_w / 2, y + 4.4, 8.2, False, INK, "center")
        line(c, left, y, left + width, "#ffffff")
    bottom = top - head_h - 28 * cell_h
    text(c, "B = Boy     G = Girl", left, bottom - 19, 8.7, True)
    text(c, "Columns 1-12 = lunar conception month", left + width, bottom - 19, 8, fill=MUTED, align="right")
    y = bottom - 42
    text(c, "How to read this chart", left, y, 11, True)
    y = paragraph(c, "1. Find the mother's lunar age <b>at conception</b> with our lunar-age calculator.<br/>"
                  "2. Match the conception date to its lunar month on page 2.<br/>"
                  "3. Read where that age row and month column meet.", left, y - 10, width, 9, 14)
    y = paragraph(c, "<b>For entertainment only.</b> This folklore chart is not scientifically reliable and is no better than chance. "
                  "It cannot determine a baby's sex. Different circulating charts can disagree.", left, y - 12, width, 8.3, 12)
    if y < 50:
        raise ValueError("Chart instructions extend into footer")
    footer(c, w, 1, 2, format_name)
    c.showPage()


def fmt_date(value):
    return date.fromisoformat(value).strftime("%b %d").replace(" 0", " ")


def reference_page(c, size, year, format_name):
    w, h = size
    records = DATA["years"][str(year)]
    header(c, w, h, f"{year} date reference", "Find the lunar conception month", "Inclusive Gregorian date ranges within this calendar year. January 1 is not the start of the lunar year.")
    top, left, width = h - 126, 38, w - 76
    columns = [left + 12, left + 258, left + width - 20]
    head_h, row_h = 25, 17
    c.setFillColor(color(INK))
    c.rect(left, top - head_h, width, head_h, fill=1, stroke=0)
    for label, x, align in [(f"GREGORIAN DATES ({year})", columns[0], "left"), ("LUNAR YEAR", columns[1], "center"), ("MONTH", columns[2], "right")]:
        text(c, label, x, top - 16, 7.4, True, "#ffffff", align)
    for i, record in enumerate(records):
        y = top - head_h - (i + 1) * row_h
        c.setFillColor(color(BG if i % 2 == 0 else "#ffffff"))
        c.rect(left, y, width, row_h, fill=1, stroke=0)
        text(c, f"{fmt_date(record['start'])} - {fmt_date(record['end'])}", columns[0], y + 5, 8.4)
        text(c, str(record["year"]), columns[1], y + 5, 8.4, align="center")
        text(c, str(record["month"]) + (" (leap)" if record["leap"] else ""), columns[2], y + 5, 8.4, True, align="right")
    y = top - head_h - len(records) * row_h - 13
    y = paragraph(c, f"Only dates within {year} are listed. The first and last lunar months continue outside this calendar year. "
                  "There is no leap lunar month in the date ranges shown.", left, y, width, 8, 11)
    y -= 18
    text(c, "Before you choose a row", left, y, 11, True)
    y = paragraph(c, "<b>Lunar age:</b> conception lunar year minus birth lunar year plus one. It changes at Lunar New Year, "
                  "so simply adding one to your current age may be wrong.<br/>"
                  "<b>Due dates:</b> our calculator estimates conception as due date minus 266 days. That is an estimate; "
                  "dates near the start or end of a lunar month can change the chart result.<br/>"
                  "<b>Leap lunar months:</b> our calculator uses the same numbered month. Other charts may use another rule.",
                  left, y - 10, width, 8.3, 12)
    y -= 18
    text(c, "Calendar references", left, y, 10, True)
    y = paragraph(c, "Gregorian/lunar date reference: Hong Kong Observatory annual calendar.<br/>"
                  f"hko.gov.hk/en/gts/time/calendar/pdf/files/{year}e.pdf<br/>"
                  "Traditional chart source: github.com/bdp-raymon/chinese-gender-prediction.<br/>"
                  "Read more: chinesegenderpredictor.net/how-it-works/ and /accuracy/.", left, y - 10, width, 7.3, 10)
    y -= 15
    text(c, "Chart attribution and permission", left, y, 8, True)
    y = paragraph(c, "MIT License. Copyright (c) Ali Shabani. Permission is hereby granted, free of charge, to any person obtaining "
                  "a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, "
                  "including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the "
                  "Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: "
                  "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. "
                  "THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE "
                  "WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR "
                  "COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, "
                  "ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
                  left, y - 7, width, 6.2, 8.2, MUTED)
    if y < 47:
        raise ValueError(f"Calendar sources extend into footer: {year}, {format_name}, {y}")
    footer(c, w, 2, 2, format_name)
    c.showPage()


def checkbox(c, x, y, label):
    c.setStrokeColor(color(MUTED))
    c.setLineWidth(.8)
    c.circle(x + 4, y + 3.5, 4, fill=0, stroke=1)
    text(c, label, x + 13, y, 9)


def cards_page(c, size, format_name, page=1, total=1):
    w, h = size
    header(c, w, h, "Printable game 01 / 3-5 minutes", "A little guess, a little wish", "One card per guest. Choose Boy, Girl or Surprise, add your name and an optional message. Cut along the outlines.")
    left, gutter, card_top = 38, 16, h - 135
    card_w, card_h = (w - 76 - gutter) / 2, (h - 235) / 2
    for index in range(4):
        x = left + (index % 2) * (card_w + gutter)
        top = card_top - (index // 2) * (card_h + 16)
        c.setStrokeColor(color(LINE))
        c.setLineWidth(.8)
        c.setDash(3, 3)
        c.roundRect(x, top - card_h, card_w, card_h, 9, fill=0, stroke=1)
        c.setDash()
        c.setFillColor(color(ROSE_BG if index % 2 == 0 else BLUE_BG))
        c.circle(x + card_w - 35, top - 36, 12, stroke=0, fill=1)
        text(c, "MY LITTLE GUESS", x + 18, top - 28, 8, True, ROSE)
        text(c, "Hello, little one", x + 18, top - 53, 15, True)
        text(c, "My name", x + 18, top - 84, 8, fill=MUTED)
        line(c, x + 70, top - 87, x + card_w - 18)
        checkbox(c, x + 18, top - 115, "Boy")
        checkbox(c, x + 83, top - 115, "Girl")
        checkbox(c, x + 18, top - 142, "Surprise")
        text(c, "A wish for you (optional)", x + 18, top - 171, 8, fill=MUTED)
        for delta in (190, 212, 234):
            if delta < card_h - 13:
                line(c, x + 18, top - delta, x + card_w - 18)
        text(c, WEBSITE + " / just for fun", x + 18, top - card_h + 13, 5.7, fill=MUTED)
    paragraph(c, "These are party guesses, not a confirmed reveal. Save the cards as keepsakes, or share the guesses only if the family wants to.",
              38, 80, w - 76, 8.4, 12, MUTED)
    footer(c, w, page, total, f"{format_name} / personal, noncommercial events")
    c.showPage()


def votes_page(c, size, format_name, page=1, total=1):
    w, h = size
    header(c, w, h, "Printable game 02 / 5 minutes", "What is your little guess?", "Use one shared sheet. Each guest writes their name and marks one column. Count each guest once; Surprise votes count too.")
    left, width, top = 38, w - 76, h - 133
    name_w, head_h, row_h = width * .46, 32, 21
    option_w = (width - name_w) / 3
    c.setFillColor(color(BG))
    c.rect(left, top - head_h - row_h * 20, width, head_h + row_h * 20, fill=1, stroke=0)
    c.setFillColor(color(INK))
    c.rect(left, top - head_h, width, head_h, fill=1, stroke=0)
    text(c, "GUEST NAME", left + 13, top - 20, 8, True, "#ffffff")
    for j, label in enumerate(("BOY", "GIRL", "SURPRISE")):
        x = left + name_w + (j + .5) * option_w
        text(c, label, x, top - 20, 8, True, "#ffffff", "center")
    for i in range(20):
        y = top - head_h - (i + 1) * row_h
        line(c, left, y, left + width)
        text(c, f"{i+1:02}", left + 8, y + 7, 7, fill=MUTED)
        for j in range(3):
            c.setStrokeColor(color(MUTED))
            c.rect(left + name_w + (j + .5) * option_w - 4, y + 7, 8, 8, fill=0, stroke=1)
    for x in [left, left + name_w, left + name_w + option_w, left + name_w + 2 * option_w, left + width]:
        c.setStrokeColor(color(LINE))
        c.line(x, top - head_h, x, top - head_h - 20 * row_h)
    y = top - head_h - 20 * row_h - 34
    text(c, "TOTAL VOTES", left, y, 9, True)
    for j, label in enumerate(("Boy", "Girl", "Surprise")):
        x = left + name_w + j * option_w
        text(c, label, x + 6, y, 8)
        line(c, x + 6, y - 23, x + option_w - 6)
    paragraph(c, "The result is a guest poll, not a way to determine a baby's sex. There is no right or wrong choice before a confirmed reveal. "
              "For a larger party, print extra sheets and combine the totals.", 38, y - 43, width, 8.4, 12, MUTED)
    footer(c, w, page, total, f"{format_name} / personal, noncommercial events")
    c.showPage()


def names_page(c, size, format_name, page=1, total=1):
    w, h = size
    header(c, w, h, "Printable game 03 / 3 minutes", "The A-to-Z baby-name race", "One sheet per player. Write one baby name for each letter before time runs out. Any name is welcome; no boy/girl categories needed.")
    text(c, "Player", 38, h - 137, 9, True)
    line(c, 79, h - 140, w * .6)
    text(c, "Score", w - 143, h - 137, 9, True)
    line(c, w - 105, h - 140, w - 38)
    top, row_h, gutter = h - 181, 30, 34
    col_w = (w - 76 - gutter) / 2
    for i in range(26):
        x = 38 + (i // 13) * (col_w + gutter)
        y = top - (i % 13) * row_h
        text(c, chr(65 + i), x, y, 12, True, ROSE if i // 13 == 0 else BLUE)
        line(c, x + 28, y - 3, x + col_w)
    y = top - 12 * row_h - 52
    text(c, "Count your letters", 38, y, 12, True)
    y = paragraph(c, "Award 1 point for each filled letter, up to 26 points. The most points wins. Ties share the win. "
                  "Read out a favorite name if you like, and keep every suggestion kind.", 38, y - 12, w - 76, 9, 14)
    paragraph(c, "Print at 100% / Actual size. Original game sheets by Chinese Gender Predictor. "
              "You may print and share them at personal, noncommercial events. Please keep the website credit; do not resell these sheets.",
              38, y - 22, w - 76, 8, 11, MUTED)
    footer(c, w, page, total, f"{format_name} / personal, noncommercial events")
    c.showPage()


BINGO_MOMENTS = (
    'A guest says "tiny"', 'A guest wears pink', 'A guest wears blue',
    'Someone mentions naps', 'Someone brings a card', 'A family photo is taken',
    'Someone shares a name idea', 'Someone says "congrats"', 'A gift has a bow',
    'A guest asks for a photo', 'Someone offers to help', 'Two guests hug',
    'A toast is made', 'Someone laughs', 'A snack is shared',
    'Someone says "little one"', 'A guest takes a selfie', 'Someone spots balloons',
    'A guest refills a drink', 'Someone mentions a lullaby', 'A friend waves hello',
    'Someone shares a kind wish', 'A guest joins a game', 'Someone admires decor',
)
SCRAMBLE_WORDS = ("BABY", "PARTY", "BALLOON", "CRADLE", "FAMILY", "LULLABY",
                  "DIAPER", "STROLLER", "KEEPSAKE", "SURPRISE")
FOLKLORE_LABELS = ("Food cravings", "Bump shape", "Heart rate", "Morning sickness",
                   "Skin changes", "Hair changes", "Ring swing", "Chinese calendar")


def game_data():
    """Fixed original card arrangements; no prediction or private data involved."""
    rng = random.Random(20261009)
    boards = []
    for _ in range(8):
        shuffled = list(BINGO_MOMENTS)
        rng.shuffle(shuffled)
        shuffled.insert(12, "FREE SPACE")
        boards.append(tuple(shuffled))
    scrambled = []
    for answer in SCRAMBLE_WORDS:
        chars = list(answer)
        while True:
            rng.shuffle(chars)
            puzzle = "".join(chars)
            if puzzle != answer:
                break
        scrambled.append((puzzle, answer))
    if len(set(boards)) != 8:
        raise ValueError("Bingo cards must have eight different arrangements")
    for board in boards:
        if board[12] != "FREE SPACE" or set(board) - {"FREE SPACE"} != set(BINGO_MOMENTS):
            raise ValueError("Bingo card has missing or duplicate moments")
    for puzzle, answer in scrambled:
        if puzzle == answer or sorted(puzzle) != sorted(answer):
            raise ValueError("Scramble letters do not match the answer")
    return tuple(boards), tuple(scrambled)


BINGO_BOARDS, WORD_SCRAMBLES = game_data()


def bingo_page(c, size, format_name, card_offset, page=1, total=4):
    w, h = size
    header(c, w, h, "Printable game 04 / during the party", "Little moments bingo",
           "Give each player a different card. Mark moments you notice; the center is free. Five in a row, column or diagonal wins. Ties share the win.")
    left, width, gap = 38, w - 76, 16
    card_h = (h - 202) / 2
    for slot in range(2):
        index = card_offset + slot
        top = h - 130 - slot * (card_h + gap)
        bottom = top - card_h
        c.setStrokeColor(color(LINE))
        c.setLineWidth(.8)
        c.roundRect(left, bottom, width, card_h, 8, fill=0, stroke=1)
        text(c, f"CARD {index + 1:02}", left + 13, top - 20, 9, True, ROSE if slot == 0 else BLUE)
        text(c, "Player", left + 105, top - 20, 8, fill=MUTED)
        line(c, left + 144, top - 23, left + width - 13)
        grid_top = top - 59
        cell_w, cell_h = (width - 26) / 5, (card_h - 82) / 5
        for col, label in enumerate("BINGO"):
            text(c, label, left + 13 + (col + .5) * cell_w, top - 46, 9, True, INK, "center")
        for cell, label in enumerate(BINGO_BOARDS[index]):
            col, row = cell % 5, cell // 5
            x, y = left + 13 + col * cell_w, grid_top - (row + 1) * cell_h
            c.setFillColor(color(BLUE_BG if cell == 12 else (BG if (row + col) % 2 == 0 else "#ffffff")))
            c.setStrokeColor(color(LINE))
            c.setLineWidth(.5)
            c.rect(x, y, cell_w, cell_h, fill=1, stroke=1)
            style = ParagraphStyle("bingo", fontName="VeraBold" if cell == 12 else "Vera",
                                   fontSize=7.1, leading=9.2, textColor=color(BLUE if cell == 12 else INK), alignment=1)
            p = Paragraph(label, style)
            _, label_h = p.wrap(cell_w - 10, cell_h)
            if label_h > cell_h - 6:
                raise ValueError(f"Bingo cell overflow: {label}")
            p.drawOn(c, x + 5, y + (cell_h - label_h) / 2)
        text(c, "Party observations only. No baby-sex clues or confirmed results.", left + 13, bottom + 9, 6.1, fill=MUTED)
    footer(c, w, page, total, f"{format_name} / personal, noncommercial events")
    c.showPage()


def scramble_page(c, size, format_name, answers=False, page=1, total=2):
    w, h = size
    title = "Word scramble: host answer key" if answers else "Baby-party word scramble"
    subtitle = ("Keep this page with the host. Check spelling against the answers below; each completed word is worth one point."
                if answers else "One sheet per player. Unscramble these ten baby-party words in five minutes. The host keeps the answer page separate.")
    header(c, w, h, "Printable game 05 / 5 minutes", title, subtitle)
    if answers:
        text(c, "10 words / 10 possible points", 38, h - 137, 9, True, ROSE)
    else:
        text(c, "Player", 38, h - 137, 9, True)
        line(c, 79, h - 140, w * .6)
        text(c, "Score", w - 143, h - 137, 9, True)
        line(c, w - 105, h - 140, w - 38)
    left, width, top, row_h = 38, w - 76, h - 171, 41
    c.setFillColor(color(INK))
    c.rect(left, top - 26, width, 26, fill=1, stroke=0)
    text(c, "MIXED-UP WORD", left + 34, top - 17, 8, True, "#ffffff")
    text(c, "ANSWER" if answers else "YOUR WORD", left + width * .52, top - 17, 8, True, "#ffffff")
    for index, (puzzle, answer) in enumerate(WORD_SCRAMBLES):
        y = top - 26 - (index + 1) * row_h
        c.setFillColor(color(BG if index % 2 == 0 else "#ffffff"))
        c.rect(left, y, width, row_h, fill=1, stroke=0)
        text(c, f"{index + 1:02}", left + 9, y + 15, 7.5, fill=MUTED)
        text(c, puzzle, left + 34, y + 13, 12, True, ROSE if index % 2 == 0 else BLUE)
        if answers:
            text(c, answer, left + width * .52, y + 13, 12, True)
        else:
            line(c, left + width * .52, y + 10, left + width - 13)
    y = top - 26 - len(WORD_SCRAMBLES) * row_h - 26
    text(c, "How to score", left, y, 11, True)
    y = paragraph(c, "Award one point per correct word. The most points wins; tied players share the win. "
                  "For a relaxed game, work together and skip the timer.", left, y - 10, width, 9, 14)
    paragraph(c, "This is a word puzzle, not a way to determine a baby's sex. Print at 100% / Actual size. "
              "Original game sheets for personal, noncommercial events; please keep the website credit and do not resell.",
              left, y - 17, width, 8, 11, MUTED)
    footer(c, w, page, total, f"{format_name} / personal, noncommercial events")
    c.showPage()


def folklore_page(c, size, format_name):
    w, h = size
    header(c, w, h, "Optional folklore party game", "Old wives' tales: party guesses",
           "These observations do not establish a baby's sex. Skip any row. No dates, medical values or personal details are needed.")
    left, width, top, row_h = 38, w - 76, h - 136, 53
    label_w, observation_w, head_h = 130, (width - 130) * .62, 31
    c.setFillColor(color(INK))
    c.rect(left, top - head_h, width, head_h, fill=1, stroke=0)
    for label, x in (("FOLKLORE TOPIC", left + 11), ("OPTIONAL OBSERVATION", left + label_w + 11),
                     ("FOLK GUESS", left + label_w + observation_w + 11)):
        text(c, label, x, top - 19, 7, True, "#ffffff")
    for index, label in enumerate(FOLKLORE_LABELS):
        y = top - head_h - (index + 1) * row_h
        c.setFillColor(color(BG if index % 2 == 0 else "#ffffff"))
        c.rect(left, y, width, row_h, fill=1, stroke=0)
        text(c, label, left + 11, y + 21, 8.5, True)
        for x, end in ((left + label_w + 11, left + label_w + observation_w - 11),
                       (left + label_w + observation_w + 11, left + width - 11)):
            line(c, x, y + 17, end)
        line(c, left, y, left + width)
    for x in (left, left + label_w, left + label_w + observation_w, left + width):
        c.setStrokeColor(color(LINE))
        c.line(x, top - head_h, x, top - head_h - len(FOLKLORE_LABELS) * row_h)
    y = top - head_h - len(FOLKLORE_LABELS) * row_h - 29
    text(c, "Actual reveal (optional)", left, y, 9, True)
    line(c, left + 153, y - 3, left + width)
    y = paragraph(c, "<b>Just for fun, not evidence.</b> Leave every field blank if you prefer. This sheet does not provide "
                  "a medical prediction. Do not perform body tests or ask anyone to disclose health information. "
                  "For a ring-swing guess, use a prop on the table; do not suspend objects over a person.",
                  left, y - 17, width, 8.2, 12, MUTED)
    if y < 55:
        raise ValueError(f"Folklore instructions overlap footer: {format_name}, {y}")
    footer(c, w, 1, 1, f"{format_name} / personal, noncommercial events")
    c.showPage()


def social_card():
    scale = 2
    im = Image.new("RGB", (1200 * scale, 630 * scale), BG)
    draw = ImageDraw.Draw(im)
    def ellipse(box, fill):
        draw.ellipse(tuple(int(v * scale) for v in box), fill=fill)
    def write(label, x, y, size, bold=False, fill=INK):
        font = ImageFont.truetype(str(FONT_DIR / ("VeraBd.ttf" if bold else "Vera.ttf")), size * scale)
        draw.text((x * scale, y * scale), label, font=font, fill=fill)
    # Original vector composition: soft blocks, a crescent and two labeled guesses.
    ellipse((880, -195, 1420, 345), BLUE_BG)
    ellipse((938, 60, 1082, 204), "#ddbb8a")
    ellipse((975, 38, 1110, 173), BLUE_BG)
    draw.rounded_rectangle((60 * scale, 61 * scale, 445 * scale, 100 * scale), radius=19 * scale, fill=ROSE_BG)
    write("A LITTLE TRADITION, JUST FOR FUN", 77, 72, 14, True, ROSE)
    write("Chinese Gender", 60, 153, 63, True)
    write("Predictor", 60, 232, 63, True)
    write("Explore the lunar calendar.", 63, 350, 27)
    write("Make a little guess.", 63, 393, 27)
    draw.rounded_rectangle((872 * scale, 292 * scale, 1090 * scale, 390 * scale), radius=22 * scale, fill=ROSE_BG)
    draw.rounded_rectangle((818 * scale, 410 * scale, 1036 * scale, 508 * scale), radius=22 * scale, fill=BLUE_BG)
    write("Girl?", 922, 315, 36, True, ROSE)
    write("Boy?", 872, 433, 36, True, BLUE)
    draw.line((60 * scale, 532 * scale, 1140 * scale, 532 * scale), fill=LINE, width=2)
    write(WEBSITE, 62, 561, 18, True, ROSE)
    write("For entertainment only", 852, 563, 16, False, MUTED)
    im.resize((1200, 630), Image.Resampling.LANCZOS).save(ASSETS / "social-preview.png", optimize=True)


def previews(groups):
    binary = os.environ.get("PDFTOPPM") or shutil.which("pdftoppm")
    if not binary:
        raise RuntimeError("Set PDFTOPPM to your pdftoppm executable to generate the page previews.")
    temp_root = ROOT / "tmp/pdfs"
    temp_root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="printables-", dir=temp_root) as tmp:
        tmp = Path(tmp)
        items = []
        if "games" in groups:
            items += [("gender-reveal-games-a4", 1, "games-prediction-cards-preview"),
                      ("gender-reveal-games-a4", 2, "games-team-vote-preview"),
                      ("gender-reveal-games-a4", 3, "games-name-race-preview"),
                      ("gender-reveal-games-a4", 4, "games-bingo-preview"),
                      ("gender-reveal-games-a4", 8, "games-word-scramble-preview")]
        if "folklore" in groups:
            items += [("old-wives-tales-game-a4", 1, "games-old-wives-tales-preview")]
        for pdf, page, name in items:
            prefix = tmp / name
            subprocess.run([binary, "-f", str(page), "-l", str(page), "-singlefile", "-r", "85", "-png", str(OUT / (pdf + ".pdf")), str(prefix)], check=True)
            with Image.open(prefix.with_suffix(".png")) as im:
                im.thumbnail((540, 764), Image.Resampling.LANCZOS)
                im.save(ASSETS / (name + ".png"), optimize=True)
    try:
        temp_root.rmdir()
        temp_root.parent.rmdir()
    except OSError:
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", choices=("calendars", "games", "folklore", "social"), nargs="+",
                        help="Generate selected resource groups; omit to generate all.")
    args = parser.parse_args()
    groups = set(args.only or ("calendars", "games", "folklore", "social"))
    OUT.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    generated = 0
    for format_name, size in (("A4", A4), ("Letter", letter)):
        slug = format_name.lower()
        if "calendars" in groups:
            for year in (2026, 2027):
                path = OUT / f"chinese-gender-calendar-{year}-{slug}.pdf"
                c = new_pdf(path, size, f"Chinese Gender Calendar {year} - {format_name}")
                c.setAuthor("Chinese Gender Predictor")
                c.setCreator("Chinese Gender Predictor")
                chart_page(c, size, year, format_name)
                reference_page(c, size, year, format_name)
                c.save()
                generated += 1
        if "games" in groups:
            path = OUT / f"gender-reveal-games-{slug}.pdf"
            c = new_pdf(path, size, f"Five Printable Gender Reveal Games - {format_name}")
            cards_page(c, size, format_name, 1, 9)
            votes_page(c, size, format_name, 2, 9)
            names_page(c, size, format_name, 3, 9)
            for index in range(4):
                bingo_page(c, size, format_name, index * 2, index + 4, 9)
            scramble_page(c, size, format_name, False, 8, 9)
            scramble_page(c, size, format_name, True, 9, 9)
            c.save()
            generated += 1
            for name, title, render in (("prediction-cards", "Prediction Cards", cards_page),
                                        ("team-vote", "Team Vote", votes_page),
                                        ("name-race", "A-to-Z Name Race", names_page)):
                c = new_pdf(OUT / f"gender-reveal-{name}-{slug}.pdf", size, f"Gender Reveal {title} - {format_name}")
                render(c, size, format_name)
                c.save()
                generated += 1
            c = new_pdf(OUT / f"gender-reveal-bingo-{slug}.pdf", size, f"Eight Gender Reveal Party Bingo Cards - {format_name}")
            for index in range(4):
                bingo_page(c, size, format_name, index * 2, index + 1, 4)
            c.save()
            generated += 1
            c = new_pdf(OUT / f"gender-reveal-word-scramble-{slug}.pdf", size, f"Gender Reveal Word Scramble and Answer Key - {format_name}")
            scramble_page(c, size, format_name, False, 1, 2)
            scramble_page(c, size, format_name, True, 2, 2)
            c.save()
            generated += 1
        if "folklore" in groups:
            c = new_pdf(OUT / f"old-wives-tales-game-{slug}.pdf", size, f"Old Wives' Tales Party Guessing Sheet - {format_name}")
            folklore_page(c, size, format_name)
            c.save()
            generated += 1
    if "social" in groups:
        social_card()
    if groups & {"games", "folklore"}:
        previews(groups)
    preview_count = (5 if "games" in groups else 0) + (1 if "folklore" in groups else 0)
    print(f"Generated {generated} PDFs, {preview_count} page previews" +
          (" and a 1200x630 social image." if "social" in groups else "."))


if __name__ == "__main__":
    main()
