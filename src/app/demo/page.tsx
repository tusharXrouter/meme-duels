import { HealthStatus } from "@/components/health-status";
import { UIExample } from "@/components/ui-example";
import Link from "next/link";

export default function Demo() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Meme Duels</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to your Next.js app with TanStack Query and shadcn/ui!
          </p>
        </div>

        {/* shadcn/ui Components Demo */}
        <UIExample />

        {/* Demo Links */}
        <div className="mt-16 bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Component Demos</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/trade-buttons" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              🎮 Trade Buttons Demo
            </Link>
            <Link 
              href="/masked-components" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              🎭 Masked Components Demo
            </Link>
            <Link 
              href="/trading-view-demo" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              📈 TradingView Widget Demo
            </Link>
            <Link 
              href="/war" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              ⚔️ War Page with Charts
            </Link>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Project Structure</h2>
              <div className="space-y-2 text-sm">
                <p><strong>📁 src/api/</strong> - API routes and endpoints</p>
                <p><strong>📁 src/components/</strong> - Reusable UI components</p>
                <p><strong>📁 src/components/ui/</strong> - shadcn/ui components</p>
                <p><strong>📁 src/hooks/</strong> - Custom React hooks</p>
                <p><strong>📁 src/lib/</strong> - Library configurations</p>
                <p><strong>📁 src/types/</strong> - TypeScript type definitions</p>
                <p><strong>📁 src/utils/</strong> - Utility functions</p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">TanStack Query Setup</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The app is configured with TanStack Query for efficient data fetching and caching.
              </p>
              <HealthStatus />
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Available Utilities</h2>
            <div className="space-y-2 text-sm">
              <p><strong>🔧 API Utils:</strong> fetchApi, createApiUrl, error handling</p>
              <p><strong>📅 Format Utils:</strong> date formatting, text truncation, number formatting</p>
              <p><strong>✅ Validation Utils:</strong> email, URL, and text validation</p>
              <p><strong>🎣 Custom Hooks:</strong> useApiQuery, useApiMutation, useHealthCheck</p>
              <p><strong>🎨 shadcn/ui:</strong> Beautiful, accessible UI components</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}