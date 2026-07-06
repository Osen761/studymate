from pathlib import Path


def main() -> None:
    path = Path(__file__).resolve().parents[1] / ".env"
    lines = path.read_text().splitlines()
    output: list[str] = []
    index = 0
    begin = "-----BEGIN PRIVATE KEY-----"
    end = "-----END PRIVATE KEY-----"
    escaped_newline = chr(92) + "n"

    while index < len(lines):
        line = lines[index]
        if not line.startswith("FIREBASE_PRIVATE_KEY="):
            output.append(line)
            index += 1
            continue

        fragments = [line.split("=", 1)[1]]
        index += 1
        while index < len(lines) and not lines[index].startswith("FIRESTORE_DATABASE_ID="):
            fragments.append(lines[index])
            index += 1

        raw = "\n".join(fragments).strip().strip('"').strip("'").strip()
        if begin in raw and end in raw:
            _, _, rest = raw.partition(begin)
            body, _, _ = rest.partition(end)
            body = "".join(body.split())
            normalized = f"{begin}{escaped_newline}{body}{escaped_newline}{end}{escaped_newline}"
        else:
            normalized = raw.replace("\n", escaped_newline)

        output.append(f'FIREBASE_PRIVATE_KEY="{normalized}"')

    path.write_text("\n".join(output) + "\n")
    print("FIREBASE_PRIVATE_KEY normalized")


if __name__ == "__main__":
    main()
