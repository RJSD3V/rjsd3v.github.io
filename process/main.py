"""Reusable PDF text-extraction utilities.

Usage:
    python main.py "path/to/file.pdf"
    python main.py "path/to/file.pdf" --output extracted.txt
"""

import argparse
from pathlib import Path

import pdfplumber


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract and concatenate the text of every page in a PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


def extract_pages(pdf_path: str) -> list[str]:
    """Extract text page-by-page, preserving page boundaries."""
    with pdfplumber.open(pdf_path) as pdf:
        return [page.extract_text() or "" for page in pdf.pages]


def extract_tables(pdf_path: str) -> list[list[list[str]]]:
    """Extract all tables found across every page of a PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        tables = []
        for page in pdf.pages:
            tables.extend(page.extract_tables())
        return tables


def save_text_to_file(text: str, output_path: str) -> None:
    """Write extracted text out to a file."""
    Path(output_path).write_text(text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract text from any PDF file.")
    parser.add_argument("pdf_path", help="Path to the PDF file to parse.")
    parser.add_argument("--output", help="Optional path to save the extracted text.")
    args = parser.parse_args()

    text = extract_text_from_pdf(args.pdf_path)

    if args.output:
        save_text_to_file(text, args.output)
        print(f"Saved extracted text to {args.output}")
    else:
        print(text)


if __name__ == "__main__":
    main()
