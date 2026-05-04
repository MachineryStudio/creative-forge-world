const TOKENS: { name: string; var: string; kind: "color" | "shadow" | "gradient" }[] = [
  { name: "background", var: "--background", kind: "color" },
  { name: "foreground", var: "--foreground", kind: "color" },
  { name: "panel", var: "--panel", kind: "color" },
  { name: "card", var: "--card", kind: "color" },
  { name: "primary", var: "--primary", kind: "color" },
  { name: "primary-foreground", var: "--primary-foreground", kind: "color" },
  { name: "secondary", var: "--secondary", kind: "color" },
  { name: "muted", var: "--muted", kind: "color" },
  { name: "muted-foreground", var: "--muted-foreground", kind: "color" },
  { name: "accent", var: "--accent", kind: "color" },
  { name: "accent-foreground", var: "--accent-foreground", kind: "color" },
  { name: "destructive", var: "--destructive", kind: "color" },
  { name: "border", var: "--border", kind: "color" },
  { name: "input", var: "--input", kind: "color" },
  { name: "ring", var: "--ring", kind: "color" },
  { name: "neon", var: "--neon", kind: "color" },
  { name: "neon-pink", var: "--neon-pink", kind: "color" },
  { name: "neon-cyan", var: "--neon-cyan", kind: "color" },
  { name: "neon-amber", var: "--neon-amber", kind: "color" },
  { name: "gradient-neon", var: "--gradient-neon", kind: "gradient" },
  { name: "gradient-radial", var: "--gradient-radial", kind: "gradient" },
  { name: "shadow-neon", var: "--shadow-neon", kind: "shadow" },
  { name: "shadow-panel", var: "--shadow-panel", kind: "shadow" },
];

export function DesignTokensPanel() {
  return (
    <div className="panel scanlines relative p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-primary">Design Tokens</div>
        <div className="font-mono text-[10px] text-muted-foreground">{TOKENS.length} active</div>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {TOKENS.map((t) => {
          const value = `var(${t.var})`;
          const swatchStyle =
            t.kind === "shadow"
              ? { background: "var(--card)", boxShadow: value }
              : { background: value };
          return (
            <li
              key={t.var}
              className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-1.5"
              title={t.var}
            >
              <span
                className="h-7 w-7 shrink-0 rounded border border-border"
                style={swatchStyle}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[10px] uppercase tracking-wider text-foreground">
                  {t.name}
                </span>
                <span className="block truncate font-mono text-[9px] text-muted-foreground">
                  {t.var}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
