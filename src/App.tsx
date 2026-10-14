/**
 * Slice 1 placeholder shell.
 *
 * This exists only so the dev server and the test runner have something to
 * render. The routed application shell arrives in a later slice; the tooling,
 * domain types, storage layer, and catalog seed are the real deliverables here.
 */
function App() {
  return (
    <main className="min-h-dvh bg-slate-50 p-6 text-slate-900">
      <h1 className="text-2xl font-bold tracking-tight">SMART SHOPINT</h1>
      <p className="mt-2 text-sm text-slate-600">
        Foundations ready: tooling, mock domain types, storage layer, and catalog
        seed.
      </p>
    </main>
  )
}

export default App
