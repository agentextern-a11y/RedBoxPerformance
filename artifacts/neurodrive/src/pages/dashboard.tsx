import { useState, useEffect } from "react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bluetooth, Activity, AlertCircle, Gauge, Save } from "lucide-react";
import { useGetSessionsSummary, useCreateSession } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { connected, connect, sendCommand, readResponse } = useBluetooth();
  const [rpm, setRpm] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [coolant, setCoolant] = useState(0);
  const [intake, setIntake] = useState(0);
  const [throttle, setThrottle] = useState(0);
  
  const { data: summary, isLoading: isLoadingSummary } = useGetSessionsSummary();
  const createSession = useCreateSession();
  const { toast } = useToast();

  useEffect(() => {
    if (!connected) return;
    
    // In a real app, we would poll OBD PIDs here
    const interval = setInterval(() => {
      // Mocking OBD data for demo purposes since we can't connect to a real car
      setRpm(prev => {
        const target = Math.random() * 4000 + 1000;
        return Math.round(prev + (target - prev) * 0.1);
      });
      setSpeed(prev => {
        const target = Math.random() * 120 + 20;
        return Math.round(prev + (target - prev) * 0.1);
      });
      setCoolant(Math.round(Math.random() * 10 + 85));
      setIntake(Math.round(Math.random() * 5 + 30));
      setThrottle(Math.round(Math.random() * 100));
    }, 250);

    return () => clearInterval(interval);
  }, [connected]);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Connected",
        description: "Successfully connected to VLinker BM+",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Bluetooth device",
      });
    }
  };

  const handleSaveSession = () => {
    createSession.mutate({
      data: {
        vehicleId: 1, // Mock vehicle ID
        maxRpm: rpm,
        maxSpeedKmh: speed,
        anomalyDetected: false,
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Session Saved",
          description: "Your live session data has been saved.",
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight">Live Cockpit</h1>
          <p className="text-muted-foreground">Monitor real-time OBD telemetry data.</p>
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <Button onClick={handleSaveSession} disabled={createSession.isPending} data-testid="btn-save-session" variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Session
            </Button>
          ) : null}
          <Button 
            onClick={handleConnect} 
            disabled={connected} 
            data-testid="btn-connect-bluetooth"
            className={`gap-2 ${connected ? 'bg-green-600 hover:bg-green-700' : 'bg-primary'}`}
          >
            <Bluetooth className="h-4 w-4" />
            {connected ? "Connected" : "Connect VLinker BM+"}
          </Button>
        </div>
      </div>

      {!connected && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold">Bluetooth Permission Required</h3>
            <p className="text-sm opacity-90">Click "Connect VLinker BM+" above and allow access in the browser prompt to start receiving live OBD data.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              Engine Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{connected ? rpm : "---"}</div>
            <div className="text-xs text-muted-foreground">RPM</div>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Vehicle Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{connected ? speed : "---"}</div>
            <div className="text-xs text-muted-foreground">KM/H</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Coolant Temp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{connected ? coolant : "---"}</div>
            <div className="text-xs text-muted-foreground">°C</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Intake Temp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{connected ? intake : "---"}</div>
            <div className="text-xs text-muted-foreground">°C</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Throttle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold">{connected ? throttle : "---"}</div>
            <div className="text-xs text-muted-foreground">%</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-4">Session Summary</h2>
      
      {isLoadingSummary ? (
        <div className="h-32 flex items-center justify-center border border-border rounded-lg bg-card">
          <span className="text-muted-foreground">Loading summary...</span>
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Health Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{summary.avgHealthScore.toFixed(1)}/100</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Distance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalDistanceKm} km</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Anomalies Detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.anomalyCount}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center border border-border rounded-lg bg-card">
          <span className="text-muted-foreground">No session data available.</span>
        </div>
      )}
    </div>
  );
}
