import React from "react";

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function renderContent(content: string): React.ReactNode {
  if (!content.trim()) return null;
  const blocks = content.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-serif text-xl font-bold mt-8 mb-3 text-foreground first:mt-0">
              {block.slice(3).trim()}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="font-serif text-2xl font-bold mt-8 mb-3 text-foreground first:mt-0">
              {block.slice(2).trim()}
            </h2>
          );
        }
        const lines = block.split("\n");
        const isAllBullet = lines.every((l) => l.trim() === "" || l.startsWith("- "));
        if (isAllBullet && lines.some((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2 my-4 ml-1">
              {lines
                .filter((l) => l.startsWith("- "))
                .map((l, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary shrink-0 mt-0.5">•</span>
                    <span>{renderInline(l.slice(2).trim())}</span>
                  </li>
                ))}
            </ul>
          );
        }
        const isAllNumbered = lines.every((l) => l.trim() === "" || /^\d+\.\s/.test(l));
        if (isAllNumbered && lines.some((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i} className="space-y-2 my-4 ml-1 list-decimal list-inside">
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
