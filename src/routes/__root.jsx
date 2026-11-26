import { HeadContent, Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import SiteShell from "@/components/site/SiteShell";
import { PassportProvider } from "@/lib/passport";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div className="wrap py-24 text-center"><h1>Page not found</h1><Link className="btn btn-primary mt-6" to="/">Back home</Link></div>,
  errorComponent: ({ reset }) => <div className="wrap py-24 text-center"><h1>This view could not be opened.</h1><button className="btn btn-primary mt-6" onClick={reset}>Try again</button></div>,
});

function RootComponent() {
  return <PassportProvider>
    <HeadContent />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteShell><Outlet /></SiteShell>
    <Toaster richColors />
  </PassportProvider>;
}
