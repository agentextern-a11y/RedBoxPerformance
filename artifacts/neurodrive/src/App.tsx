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

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter text-gray-900 mb-6">Engineered to Perform</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-10">NeuronDrive is the AI brain behind Red Box Performance. Connect directly to your car via Web Bluetooth, read live OBD data, and use AI to diagnose faults, predict failures, and coach performance.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl">
        <div className="bg-card border border-border p-6 rounded-lg text-center shadow-sm">
          <div className="text-3xl font-bold text-primary font-display mb-1">+50-120</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Horsepower</div>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg text-center shadow-sm">
          <div className="text-3xl font-bold text-primary font-display mb-1">15+</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Parameters</div>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg text-center shadow-sm">
          <div className="text-3xl font-bold text-primary font-display mb-1">1000+</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicles Tuned</div>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg text-center shadow-sm">
          <div className="text-3xl font-bold text-primary font-display mb-1">98%</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</div>
        </div>
      </div>
    </div>
  );
}

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
