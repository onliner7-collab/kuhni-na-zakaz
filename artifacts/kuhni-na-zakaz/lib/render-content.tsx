import React from "react";
import Link from "@/components/navigation/Link";

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith("/")) {
        return (
          <Link
            key={i}
            href={href}
            className="text-primary font-medium hover:underline"
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          className="text-primary font-medium hover:underline"
          rel="noreferrer"
          target="_blank"
        >
          {label}
        </a>
      );
    }
    return part;
  });
}

function isTableBlock(block: string): boolean {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    lines.length >= 3 &&
    lines.every((line) => line.startsWith("|") && line.endsWith("|")) &&
    /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|$/.test(lines[1])
  );
}

function renderTable(block: string, key: number): React.ReactNode {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const rows = lines.map((line) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim()),
  );
  const [head, , ...body] = rows;

  return (
    <div
      key={key}
      className="my-6 overflow-x-auto rounded-lg border border-border"
    >
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/50">
          <tr>
            {head.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {body.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 align-top text-muted-foreground"
                >
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseImageBlock(block: string) {
  const image = block.trim().match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)$/);
  if (!image) return null;

  const [, alt, src, caption] = image;
  if (!src.startsWith("/") && !src.startsWith("https://")) return null;

  return { alt: alt.trim(), src, caption: caption?.trim() };
}

export function renderContent(content: string): React.ReactNode {
  if (!content.trim()) return null;
  const blocks = content.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const image = parseImageBlock(block);
        if (image) {
          return (
            <figure key={i} className="my-7 overflow-hidden rounded-xl border border-border bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
              {image.caption ? (
                <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                  {renderInline(image.caption)}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        if (isTableBlock(block)) {
          return renderTable(block, i);
        }
        if (block.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="font-serif text-lg font-bold mt-6 mb-2 text-foreground first:mt-0"
            >
              {block.slice(4).trim()}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-serif text-xl font-bold mt-8 mb-3 text-foreground first:mt-0"
            >
              {block.slice(3).trim()}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2
              key={i}
              className="font-serif text-2xl font-bold mt-8 mb-3 text-foreground first:mt-0"
            >
              {block.slice(2).trim()}
            </h2>
          );
        }
        const lines = block.split("\n");
        const isAllBullet = lines.every(
          (l) => l.trim() === "" || l.startsWith("- "),
        );
        if (isAllBullet && lines.some((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2 my-4 ml-1">
              {lines
                .filter((l) => l.startsWith("- "))
                .map((l, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary shrink-0 mt-0.5">•</span>
                    <span>{renderInline(l.slice(2).trim())}</span>
                  </li>
                ))}
            </ul>
          );
        }
        const isAllNumbered = lines.every(
          (l) => l.trim() === "" || /^\d+\.\s/.test(l),
        );
        if (isAllNumbered && lines.some((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol
              key={i}
              className="space-y-2 my-4 ml-1 list-decimal list-inside"
            >
              {lines
                .filter((l) => /^\d+\.\s/.test(l))
                .map((l, j) => (
                  <li key={j} className="text-sm text-muted-foreground">
                    {renderInline(l.replace(/^\d+\.\s/, "").trim())}
                  </li>
                ))}
            </ol>
          );
        }
        if (!block.trim()) return null;
        return (
          <p key={i} className="text-muted-foreground leading-relaxed text-sm">
            {renderInline(block.trim())}
          </p>
        );
      })}
    </>
  );
}
