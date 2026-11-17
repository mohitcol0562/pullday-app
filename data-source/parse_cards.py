import json
import re

COLUMNS = [
    "id", "game", "set_name", "card_name", "card_number", "year", "variety",
    "grader", "cert_number", "grade", "rarity", "price_cents", "population",
    "story", "image_url", "price_history",
]


def split_top_level(s):
    """Split a SQL values tuple's inner content on top-level commas,
    respecting single-quoted strings (with '' escaping) and not splitting
    inside them."""
    parts = []
    buf = []
    in_string = False
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if in_string:
            if c == "'":
                if i + 1 < n and s[i + 1] == "'":
                    buf.append("''")
                    i += 2
                    continue
                in_string = False
                buf.append(c)
                i += 1
                continue
            buf.append(c)
            i += 1
            continue
        else:
            if c == "'":
                in_string = True
                buf.append(c)
                i += 1
                continue
            if c == ",":
                parts.append("".join(buf))
                buf = []
                i += 1
                continue
            buf.append(c)
            i += 1
            continue
    parts.append("".join(buf))
    return parts


def parse_value(raw):
    raw = raw.strip()
    if raw == "null":
        return None
    if raw.endswith("::jsonb"):
        raw = raw[: -len("::jsonb")]
    raw = raw.strip()
    if raw.startswith("'") and raw.endswith("'"):
        inner = raw[1:-1]
        inner = inner.replace("''", "'")
        return inner
    try:
        if "." in raw:
            return float(raw)
        return int(raw)
    except ValueError:
        return raw


def main():
    with open("data.sql", "r", encoding="utf-8") as f:
        text = f.read()

    # The file has several separate `insert into cards (...) values ... ;`
    # statements, not one big one — split on each statement's own terminator.
    statements = re.findall(
        r"^insert into cards \([^)]*\) values\n(.*?);$",
        text,
        re.MULTILINE | re.DOTALL,
    )

    cards = []
    for body in statements:
        body = body.rstrip()
        for line in body.split("\n"):
            line = line.strip()
            if not line:
                continue
            line = line.rstrip(",")
            assert line.startswith("(") and line.endswith(")"), line[:50]
            inner = line[1:-1]
            values = split_top_level(inner)
            assert len(values) == len(COLUMNS), f"{len(values)} values: {line[:80]}"
            parsed = [parse_value(v) for v in values]
            row = dict(zip(COLUMNS, parsed))
            row["price_history"] = json.loads(row["price_history"])
            cards.append(row)

    print(f"parsed {len(cards)} cards")
    rarities = {}
    for c in cards:
        rarities[c["rarity"]] = rarities.get(c["rarity"], 0) + 1
    print("rarity distribution:", rarities)

    with open("cards.json", "w", encoding="utf-8") as f:
        json.dump(cards, f, ensure_ascii=False)

    print("wrote cards.json")


if __name__ == "__main__":
    main()
