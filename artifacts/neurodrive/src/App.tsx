import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import logo from "@assets/849CDD77-50D6-4560-A5BC-E2C410A6B50C_1777942566176.png";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={logo} alt="Red Box Performance" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-primary">NeuronDrive</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/diagnostics" className="text-sm font-medium hover:text-primary transition-colors">Diagnostics</Link>
            <Link href="/vehicles" className="text-sm font-medium hover:text-primary transition-colors">Vehicles</Link>
            <Link href="/predict" className="text-sm font-medium hover:text-primary transition-colors">Predictions</Link>
            <Link href="/maps" className="text-sm font-medium hover:text-primary transition-colors">Map Vault</Link>
          </nav>
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button data-testid="btn-get-started" className="font-display font-semibold tracking-wide uppercase bg-primary hover:bg-primary/90 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border bg-card py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Red Box Performance" className="h-6 w-auto opacity-50" />
            <span className="text-sm text-muted-foreground font-display font-semibold">NeuronDrive by Red Box Performance</span>
          </div>
          <p className="text-xs text-muted-foreground">High-Performance Vehicle Intelligence</p>
        </div>
      </footer>
    </div>
  );
}

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Diagnostics from "@/pages/diagnostics";
import Vehicles from "@/pages/vehicles";
import Predict from "@/pages/predict";
import Maps from "@/pages/maps";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/diagnostics" component={Diagnostics} />
      <Route path="/vehicles" component={Vehicles} />
      <Route path="/predict" component={Predict} />
      <Route path="/maps" component={Maps} />
      <Route>
        <div className="flex-1 flex items-center justify-center"><p>Page not found</p></div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
