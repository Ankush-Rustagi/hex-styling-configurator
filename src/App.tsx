import { ArrowLeft, Palette, Sliders, Layers, Grid3x3 } from "lucide-react"

const SCOPE = [
  {
    icon: Palette,
    title: "Brand color palette",
    desc: "All five Verkada product-line palettes (20 colors each) with swatch previews and hex values.",
  },
  {
    icon: Sliders,
    title: "Theme configurator",
    desc: "Interactive controls to map product colors to Command UI tokens: primary, accent, surface, status.",
  },
  {
    icon: Grid3x3,
    title: "Component preview",
    desc: "Live preview of buttons, badges, charts, and cards rendered with the configured theme.",
  },
  {
    icon: Layers,
    title: "Token export",
    desc: "One-click export of the configured token map as a CSS variables file or design-token JSON.",
  },
]

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] -z-10 opacity-50"
        style={{
          background:
            "conic-gradient(from 200deg at 35% 50%, oklch(0.65 0.22 200 / 0.7), oklch(0.6 0.22 280 / 0.6), oklch(0.65 0.2 340 / 0.5), oklch(0.7 0.18 60 / 0.45), oklch(0.68 0.2 140 / 0.55), oklch(0.65 0.22 200 / 0.7))",
        }}
      />

      <main className="relative mx-auto max-w-3xl px-6 py-16 md:py-24">
        <a
          href="https://ankush-rustagi.github.io/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          Back to index
        </a>

        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium uppercase tracking-wider mb-6">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Work in progress
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] mb-6">
            Verkada HEX
            <br />
            <span className="text-muted-foreground">Styling Configurator.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-prose leading-relaxed">
            An interactive configurator for mapping Verkada's brand color system
            to Command UI tokens. Built to answer:{" "}
            <em className="text-foreground/80 not-italic">
              what does each product line actually look like when it ships?
            </em>
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
            What's coming
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCOPE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <item.icon className="size-5 text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-dashed border-border bg-card/30 p-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">
            Status
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-1">
            Source canvas built in Cursor:{" "}
            <span className="text-foreground/80 font-mono text-xs">2026-04-27</span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Porting interactive swatch grids and theme preview to standalone web app.
          </p>
        </section>

        <footer className="mt-24 pt-6 border-t border-border text-xs text-muted-foreground">
          <p>Ankush Rustagi · Verkada Product</p>
        </footer>
      </main>
    </div>
  )
}

export default App
