import { useState } from "react"
import { ArrowLeft, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── VDS Color Tokens ────────────────────────────────────────────────────────

const NEUTRAL_SHADES = [
  { hex: "#FFFFFF", label: "00" }, { hex: "#F7F9FB", label: "50" },
  { hex: "#EFF3F7", label: "10" }, { hex: "#EAEFF3", label: "25" },
  { hex: "#E6EAEE", label: "50" }, { hex: "#DCE0E4", label: "100" },
  { hex: "#B0B6BE", label: "200" }, { hex: "#8C929A", label: "300" },
  { hex: "#6B717A", label: "400" }, { hex: "#4F555E", label: "500" },
  { hex: "#3A404A", label: "600" }, { hex: "#2C3540", label: "700" },
  { hex: "#1F2832", label: "800" }, { hex: "#0E1720", label: "900" },
  { hex: "#030E16", label: "blk" },
]

const CYAN_SHADES = [
  { hex: "#E6F5FB", label: "10" }, { hex: "#CFEFFB", label: "50" },
  { hex: "#B6E3F6", label: "100" }, { hex: "#8BD3F0", label: "200" },
  { hex: "#4FBBE5", label: "300" }, { hex: "#19A0D5", label: "400" },
  { hex: "#0285C8", label: "500" }, { hex: "#007FAF", label: "600" },
  { hex: "#006F9A", label: "700" }, { hex: "#005B7F", label: "800" },
  { hex: "#004764", label: "900" },
]

const STATUS_COLORS = {
  Green: [{ hex: "#E2F7EC", label: "50" }, { hex: "#B8EECC", label: "100" }, { hex: "#4FD19B", label: "300" }, { hex: "#14BA74", label: "500" }, { hex: "#0E9E61", label: "600" }, { hex: "#0A8450", label: "700" }],
  Yellow: [{ hex: "#FFF8E0", label: "50" }, { hex: "#FFEFA8", label: "100" }, { hex: "#FFE27A", label: "300" }, { hex: "#FFD959", label: "500" }, { hex: "#F2B81A", label: "600" }, { hex: "#B8860B", label: "700" }],
  Red: [{ hex: "#FBECEC", label: "50" }, { hex: "#F4C5C5", label: "100" }, { hex: "#E58888", label: "300" }, { hex: "#DA5959", label: "500" }, { hex: "#C53D3D", label: "600" }, { hex: "#A52929", label: "700" }],
}

const PRODUCT_COLORS = [
  { product: "Video Security (Cameras)", token: "cyan-500", hex: "#0285C8", rationale: "Brand hero, unchanged" },
  { product: "Access Control", token: "orange-500", hex: "#FF8A3D", rationale: "Moved to orange: max warm/cool contrast vs cameras" },
  { product: "Alarms", token: "red-500", hex: "#DA5959", rationale: "Red = alert/alarm semantic fit" },
  { product: "Intercom", token: "yellow-600", hex: "#F2B81A", rationale: "Yellow-gold: warm, distinct from purple and orange" },
  { product: "Environmental Sensors", token: "green-500", hex: "#14BA74", rationale: "Green confirmed, natural semantic fit" },
  { product: "Guest / Workplace", token: "turquoise-500", hex: "#0FC0B5", rationale: "Turquoise/teal: distinct from green, cyan, and violet" },
  { product: "Viewing Station", token: "cyan-600", hex: "#007FAF", rationale: "Cyan-600: same family as cameras (subproduct)" },
  { product: "Command Platform", token: "violet-500", hex: "#8A38F5", rationale: "Violet: fully distinct from all blues/cyans" },
  { product: "Warning / Attention", token: "yellow-500", hex: "#FFD959", rationale: "Status color (not product line)" },
  { product: "Error / Critical", token: "red-600", hex: "#C53D3D", rationale: "Status color (not product line)" },
]

const EXTENDED = [
  { hex: "#8A38F5", label: "violet" }, { hex: "#5B4BD6", label: "purple" },
  { hex: "#2064D6", label: "blue" }, { hex: "#0FC0B5", label: "turq." },
  { hex: "#FF8A3D", label: "orange" },
]

// ─── Palettes ────────────────────────────────────────────────────────────────

const PALETTES: Record<string, { name: string; desc: string; colors: string[] }> = {
  "product-first": {
    name: "Product Line First",
    desc: "Leads with all 8 product-line colors in order, then extends with lighter/darker variants and neutrals. Best for charts comparing data across product families.",
    colors: ["#0285C8","#FF8A3D","#DA5959","#F2B81A","#14BA74","#0FC0B5","#007FAF","#8A38F5","#5B4BD6","#4FBBE5","#FFD959","#4FD19B","#E58888","#B8860B","#0E9E61","#19A0D5","#C53D3D","#2064D6","#B0B6BE","#6B717A"],
  },
  "cyan-accent": {
    name: "Cyan Accent Ramp",
    desc: "Brand-forward: starts with cyan family, then fans out to the full product spectrum. Best for dashboards where cameras/video is the primary metric.",
    colors: ["#0285C8","#19A0D5","#4FBBE5","#007FAF","#005B7F","#FF8A3D","#14BA74","#DA5959","#F2B81A","#0FC0B5","#8A38F5","#5B4BD6","#4FD19B","#FFD959","#E58888","#B8860B","#0E9E61","#C53D3D","#B0B6BE","#6B717A"],
  },
  "divergent": {
    name: "Divergent Hue Spread",
    desc: "Maximizes perceptual separation between adjacent colors. Every neighbor is a different hue family. Best for charts with many series needing instant identification.",
    colors: ["#0285C8","#FF8A3D","#14BA74","#DA5959","#8A38F5","#F2B81A","#0FC0B5","#5B4BD6","#007FAF","#FFD959","#0E9E61","#E58888","#19A0D5","#B8860B","#4FD19B","#C53D3D","#4FBBE5","#2064D6","#B0B6BE","#6B717A"],
  },
  "warm-cool": {
    name: "Warm-Cool Alternating",
    desc: "Strictly alternates warm (orange, red, yellow) and cool (cyan, green, teal, violet) tones. Best for bar charts and side-by-side grouped comparisons.",
    colors: ["#0285C8","#FF8A3D","#14BA74","#DA5959","#8A38F5","#F2B81A","#0FC0B5","#5B4BD6","#007FAF","#FFD959","#0E9E61","#E58888","#19A0D5","#B8860B","#4FD19B","#C53D3D","#4FBBE5","#2064D6","#B0B6BE","#6B717A"],
  },
  "subtle-professional": {
    name: "Subtle Professional",
    desc: "Uses the deeper 600–700 range of each product hue for a muted, boardroom-ready look. Best for executive dashboards and investor presentations.",
    colors: ["#007FAF","#B8860B","#0A8450","#A52929","#8A38F5","#0FC0B5","#006F9A","#C53D3D","#0E9E61","#5B4BD6","#005B7F","#FF8A3D","#DA5959","#F2B81A","#2064D6","#4F555E","#3A404A","#6B717A","#8C929A","#B0B6BE"],
  },
}

const THEMES = [
  { name: "Verkada Light (Default)", font: "Open Sans", fontUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap", bg: "#F7F9FB", accent: "#0285C8", desc: "Clean light canvas with Verkada cyan accent. Matches the Command UI light mode." },
  { name: "Verkada Dark", font: "Open Sans", fontUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap", bg: "#030E16", accent: "#19A0D5", desc: "Dark mode using Verkada off-black background with lighter cyan accent. Matches Command dark mode." },
  { name: "Verkada Brand Display", font: "Nunito Sans", fontUrl: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap", bg: "#FFFFFF", accent: "#0285C8", desc: "Pure white background with a rounder Google Fonts alternative to TT Norms Pro. Good for presentations." },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ColorSwatch({ hex, label, size = 28 }: { hex: string; label?: string; size?: number }) {
  const isLight = ["#ffffff", "#f7f9fb", "#eff3f7", "#eaeff3", "#e6eaee"].includes(hex.toLowerCase())
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="rounded"
        style={{ width: size, height: size, background: hex, border: isLight ? "1px solid rgba(0,0,0,0.15)" : undefined }}
        title={hex}
      />
      {label && <span className="text-[9px] text-muted-foreground font-mono">{label}</span>}
    </div>
  )
}

function SwatchRow({ shades }: { shades: { hex: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {shades.map(s => <ColorSwatch key={s.hex} hex={s.hex} label={s.label} size={28} />)}
    </div>
  )
}

function PalettePreview({ colors }: { colors: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c, i) => (
        <div key={`${c}-${i}`} className="flex flex-col items-center gap-1">
          <div className="rounded-md" style={{ width: 40, height: 40, background: c }} title={c} />
          <span className="text-[9px] text-muted-foreground font-mono">{c}</span>
        </div>
      ))}
    </div>
  )
}

function ThemePreviewCard({ theme: t }: { theme: typeof THEMES[0] }) {
  const isDark = t.bg === "#030E16"
  const textColor = isDark ? "#F7F9FB" : "#030E16"
  const subColor = isDark ? "#B0B6BE" : "#4F555E"
  return (
    <div className="rounded-xl border p-5" style={{ background: t.bg, borderColor: isDark ? "#3A404A" : "#DCE0E4" }}>
      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: textColor, marginBottom: 6 }}>{t.name}</div>
      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: subColor, marginBottom: 12 }}>{t.desc}</div>
      <div className="flex items-center gap-3">
        <div style={{ background: t.accent, color: "#fff", borderRadius: 4, padding: "4px 14px", fontSize: 12, fontWeight: 600 }}>Accent Button</div>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#8C929A" : "#6B717A" }}>bg: {t.bg} | accent: {t.accent}</span>
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: isDark ? "#4F555E" : "#B0B6BE", marginTop: 8 }}>
        Font: {t.font} (Google Fonts, system sans in this preview)
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
      {copied ? "Copied!" : "Copy hex codes"}
    </button>
  )
}

type TabId = "overview" | "colors" | "palettes" | "themes" | "config"

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "HEX Options" },
  { id: "colors", label: "VDS Colors" },
  { id: "palettes", label: "Chart Palettes" },
  { id: "themes", label: "App Themes" },
  { id: "config", label: "Final Config" },
]

export default function App() {
  const [tab, setTab] = useState<TabId>("overview")
  const [selectedPalette, setSelectedPalette] = useState("product-first")
  const [selectedTheme, setSelectedTheme] = useState("Verkada Light (Default)")

  const palette = PALETTES[selectedPalette]
  const theme = THEMES.find(t => t.name === selectedTheme) ?? THEMES[0]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-64 -z-10 opacity-30 pointer-events-none"
        style={{ background: "conic-gradient(from 200deg at 40% 0%, oklch(0.65 0.22 200 / 0.5), oklch(0.6 0.22 280 / 0.4), oklch(0.65 0.2 340 / 0.3), transparent)" }}
      />
      <main className="mx-auto max-w-5xl px-4 md:px-6 py-10">
        <a href="https://ankush-rustagi.github.io/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="size-4" />Back to index
        </a>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-2">
            Verkada HEX Styling Configurator
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Map Verkada Design System (VDS) colors to Hex.tech customization controls. Review each palette and theme option, then select your preferred configuration for production use.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                tab === t.id ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">HEX Customization Controls</h2>
              <p className="text-sm text-muted-foreground mb-4">Every configurable property in Hex.tech that accepts visual styling, and what we can set from Verkada's design system.</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-border bg-card p-4"><div className="text-2xl font-bold">20</div><div className="text-xs text-muted-foreground mt-1">Max Chart Palette Colors</div></div>
                <div className="rounded-xl border border-border bg-card p-4"><div className="text-2xl font-bold">5</div><div className="text-xs text-muted-foreground mt-1">Max Themes (Enterprise)</div></div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-3">Workspace-Level Settings (Admin)</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/40"><th className="p-3 text-left font-medium text-muted-foreground">Control</th><th className="p-3 text-left font-medium text-muted-foreground">Format</th><th className="p-3 text-left font-medium text-muted-foreground">Scope</th><th className="p-3 text-left font-medium text-muted-foreground">Our Recommendation</th></tr></thead>
                  <tbody>
                    {[
                      ["Chart Color Palette", "Up to 20 hex codes, CSS names, or color picker", "All Chart cells workspace-wide", "Set from VDS product-line + status colors"],
                      ["App Theme: Font", "Google Fonts URL or preset", "Per published app", "Open Sans (VDS body face)"],
                      ["App Theme: Background", "Hex code or CSS name", "Per published app", "#F7F9FB (VDS canvas bg) or #030E16 (dark)"],
                      ["App Theme: Accent", "Hex code or CSS name", "Per published app", "#0285C8 (VDS cyan-500 accent)"],
                      ["App Theme: Chart Palette", "Select from saved palettes", "Per published app", "Link to our custom palette"],
                      ["Custom Logo", "PNG upload", "Published apps only", "Upload Verkada wordmark"],
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border/50 last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                        {row.map((cell, j) => <td key={j} className="p-3 text-xs">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-3">Per-Chart Overrides</h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/40"><th className="p-3 text-left font-medium text-muted-foreground">Control</th><th className="p-3 text-left font-medium text-muted-foreground">Format</th><th className="p-3 text-left font-medium text-muted-foreground">Notes</th></tr></thead>
                  <tbody>
                    {[
                      ["Per-series colors", "Swatch, picker, or hex", "Overrides workspace palette for one chart"],
                      ["Axis style", "Tick count, min/max, labels", "Labels default to column names"],
                      ["Data labels", "Toggle total / per-color", "Available on stacked charts"],
                      ["Color-by column", "Select data column", "Auto-assigns palette colors to column values"],
                      ["Map fill", "Single color or data-based gradient", "Opacity adjustable (default 80%)"],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                        {row.map((cell, j) => <td key={j} className="p-3 text-xs">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-300">
              <span className="font-semibold">Note: </span>HEX does not support arbitrary CSS overrides on published apps. All styling is controlled through the theme and palette settings above.
            </div>
          </div>
        )}

        {/* ── VDS Colors ── */}
        {tab === "colors" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Verkada Design System Colors</h2>
              <p className="text-sm text-muted-foreground">Complete color token inventory from VDS. These are the source-of-truth values we draw from for HEX configuration.</p>
            </div>

            <div>
              <h3 className="text-base font-medium mb-3">Signature Neutrals (Cool Gray)</h3>
              <SwatchRow shades={NEUTRAL_SHADES} />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-medium mb-3">Core Cyan (Brand Accent)</h3>
              <SwatchRow shades={CYAN_SHADES} />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-medium mb-3">Status Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(STATUS_COLORS).map(([name, shades]) => (
                  <div key={name}>
                    <div className="text-sm font-medium mb-2">{name}</div>
                    <SwatchRow shades={shades} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-medium mb-3">Sub-Brand / Extended Hues</h3>
              <SwatchRow shades={EXTENDED} />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-medium mb-3">Product Line Color Assignments</h3>
              <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-300 mb-4">
                <span className="font-semibold">Changes from v1: </span>Every product line occupies a distinct hue family: cyan, orange, red, gold, green, teal, dark-cyan (camera sub), and violet. No two product lines share a hue band.
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-muted/40">{["Product Line", "Token", "Hex Code", "Swatch", "Rationale"].map(h => <th key={h} className="p-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr></thead>
                  <tbody>
                    {PRODUCT_COLORS.map((p, i) => (
                      <tr key={p.product} className={`border-b border-border/50 last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="p-3 text-xs font-medium">{p.product}</td>
                        <td className="p-3 text-xs font-mono text-muted-foreground">{p.token}</td>
                        <td className="p-3 text-xs font-mono text-muted-foreground">{p.hex}</td>
                        <td className="p-3"><div className="size-5 rounded" style={{ background: p.hex }} /></td>
                        <td className="p-3 text-xs text-muted-foreground">{p.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Chart Palettes ── */}
        {tab === "palettes" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Chart Color Palette Options</h2>
              <p className="text-sm text-muted-foreground">Each palette uses 20 colors from the VDS token set, ordered for different use cases. Select one to use in the final config tab.</p>
            </div>
            {Object.entries(PALETTES).map(([key, p]) => (
              <div key={key} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <span className="font-medium">{p.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPalette(key)}
                    className={cn(
                      "ml-4 shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selectedPalette === key ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "border-border text-muted-foreground hover:border-foreground/50",
                    )}
                  >
                    {selectedPalette === key ? "✓ Selected" : "Select"}
                  </button>
                </div>
                <div className="p-4">
                  <PalettePreview colors={p.colors} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── App Themes ── */}
        {tab === "themes" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">App Theme Options</h2>
              <p className="text-sm text-muted-foreground">Three recommended theme configurations for HEX published apps. Each uses VDS-aligned colors and a Google Fonts typeface.</p>
            </div>

            {THEMES.map(t => (
              <div key={t.name} className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedTheme(t.name)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      selectedTheme === t.name ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "border-border text-muted-foreground hover:border-foreground/50",
                    )}
                  >
                    {selectedTheme === t.name ? "✓ Selected" : "Select"}
                  </button>
                  <span className="font-medium">{t.name}</span>
                </div>
                <ThemePreviewCard theme={t} />
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="p-3 text-left font-medium text-muted-foreground">Property</th><th className="p-3 text-left font-medium text-muted-foreground">Value</th></tr></thead>
                    <tbody>
                      {[["Font Family", t.font], ["Google Fonts URL", t.fontUrl], ["Background Color", t.bg], ["Accent Color", t.accent]].map(([k, v]) => (
                        <tr key={k} className="border-b border-border/50 last:border-0">
                          <td className="p-3 text-xs text-muted-foreground">{k}</td>
                          <td className="p-3 text-xs font-mono">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
              <span className="font-semibold">TT Norms Pro is not on Google Fonts. </span>Verkada's display typeface is a commercial font not available through Google Fonts. Open Sans (VDS body face) and Nunito Sans (similar geometric sans) are the closest alternatives.
            </div>
          </div>
        )}

        {/* ── Final Config ── */}
        {tab === "config" && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold">Your Selected Configuration</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Chart Palette</div>
                <div className="font-semibold">{palette.name}</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">App Theme</div>
                <div className="font-semibold">{selectedTheme}</div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-3">Selected Palette</h3>
              <PalettePreview colors={palette.colors} />
              <div className="mt-3">
                <CopyButton text={palette.colors.join(", ")} />
              </div>
              <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3 font-mono text-xs text-muted-foreground break-all">
                {palette.colors.join(", ")}
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-3">Selected Theme</h3>
              <ThemePreviewCard theme={theme} />
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="font-medium mb-4">Ready-to-Paste Configuration</div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">App Theme Settings</div>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/40"><th className="p-3 text-left font-medium text-muted-foreground">Property</th><th className="p-3 text-left font-medium text-muted-foreground">Value</th></tr></thead>
                    <tbody>
                      {[["Font", `${theme.font} (Google Fonts)`], ["Font URL", theme.fontUrl], ["Background", theme.bg], ["Accent", theme.accent], ["Chart Palette", palette.name]].map(([k, v]) => (
                        <tr key={k} className="border-b border-border/50 last:border-0">
                          <td className="p-3 text-xs text-muted-foreground">{k}</td>
                          <td className="p-3 text-xs font-mono">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-sky-300">
              <div className="font-semibold mb-2">How to apply in HEX</div>
              <ol className="space-y-1">
                {[
                  "Go to Settings → Styling in your HEX workspace (requires Admin).",
                  "Create a new Chart Color Palette and paste the comma-separated hex codes above.",
                  "Create a new App Theme with the font URL, background, and accent values.",
                  "Link the chart palette to the theme.",
                  "In each published app, select this theme under App Settings.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-2"><span className="shrink-0 font-bold">{i + 1}.</span>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <footer className="mt-20 pt-6 border-t border-border text-xs text-muted-foreground">
          Ankush Rustagi · Verkada Product · Canvas built 2026-05-10
        </footer>
      </main>
    </div>
  )
}
