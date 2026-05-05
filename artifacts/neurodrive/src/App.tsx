import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Link, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import logo from "@assets/849CDD77-50D6-4560-A5BC-E2C410A6B50C_1777942566176.png";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Diagnostics from "@/pages/diagnostics";
import Vehicles from "@/pages/vehicles";
import Predict from "@/pages/predict";
import Maps from "@/pages/maps";
import Pricing from "@/pages/pricing";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#DC2626",
    colorForeground: "#111827",
    colorMutedForeground: "#6b7280",
    colorDanger: "#DC2626",
    colorBackground: "#ffffff",
    colorInput: "#f9fafb",
    colorInputForeground: "#111827",
    colorNeutral: "#e5e7eb",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.375rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-xl w-[440px] max-w-full overflow-hidden shadow-lg border border-gray-200",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-gray-900 font-bold",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700 font-medium",
    formFieldLabel: "text-gray-700 font-medium text-sm",
    footerActionLink: "text-red-600 font-semibold hover:text-red-700",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-red-600",
    formFieldSuccessText: "text-green-600",
    alertText: "text-gray-700",
    logoBox: "mb-2",
    logoImage: "h-10 w-auto",
    socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50",
    formButtonPrimary: "bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide",
    formFieldInput: "border-gray-200 bg-gray-50 text-gray-900",
    footerAction: "bg-gray-50",
    dividerLine: "bg-gray-200",
    alert: "border-red-200 bg-red-50",
    otpCodeFieldInput: "border-gray-200",
    formFieldRow: "gap-4",
    main: "px-2",
  },
};

function NavUserSection() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  return (
    <Show
      when="signed-in"
      fallback={
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <Button variant="ghost" className="font-medium text-gray-700 hover:text-gray-900 text-sm">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="font-display font-semibold tracking-wide uppercase bg-red-600 hover:bg-red-700 text-white text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button className="font-display font-semibold tracking-wide uppercase bg-red-600 hover:bg-red-700 text-white text-sm">
            Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="avatar" className="h-8 w-8 rounded-full border border-gray-200" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
          </span>
        </div>
        <SignOutButton />
      </div>
    </Show>
  );
}

function SignOutButton() {
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  return (
    <Button
      variant="ghost"
      className="text-gray-500 hover:text-gray-700 text-sm"
      onClick={() => signOut().then(() => setLocation("/"))}
    >
      Sign Out
    </Button>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card sticky top-0 z-50">
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
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <NavUserSection />
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
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-xs text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <p className="text-xs text-muted-foreground">High-Performance Vehicle Intelligence</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/diagnostics">
        <ProtectedRoute><Diagnostics /></ProtectedRoute>
      </Route>
      <Route path="/vehicles">
        <ProtectedRoute><Vehicles /></ProtectedRoute>
      </Route>
      <Route path="/predict">
        <ProtectedRoute><Predict /></ProtectedRoute>
      </Route>
      <Route path="/maps">
        <ProtectedRoute><Maps /></ProtectedRoute>
      </Route>
      <Route>
        <div className="flex-1 flex items-center justify-center"><p>Page not found</p></div>
      </Route>
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your NeuronDrive account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Start monitoring your vehicle for free",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
