import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useListPredictions, useListVehicles } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Predict() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const urlVehicleId = searchParams.get("vehicleId");
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | undefined>(
    urlVehicleId ? Number(urlVehicleId) : undefined
  );

  const { data: vehicles } = useListVehicles();
  
  // Set default vehicle if none selected and vehicles load
  useEffect(() => {
    if (!selectedVehicleId && vehicles && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const { data: predictions, isLoading } = useListPredictions(
    { vehicleId: selectedVehicleId as number },
    { query: { enabled: !!selectedVehicleId, queryKey: ["listPredictions", selectedVehicleId] } }
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'watch': return <Info className="h-5 w-5 text-yellow-500" />;
      case 'good': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return "bg-red-500";
      case 'warning': return "bg-orange-500";
      case 'watch': return "bg-yellow-500";
      case 'good': return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical': return <Badge variant="destructive" className="uppercase font-bold">Critical</Badge>;
      case 'warning': return <Badge className="bg-orange-500 hover:bg-orange-600 uppercase font-bold">Warning</Badge>;
      case 'watch': return <Badge className="bg-yellow-500 hover:bg-yellow-600 uppercase font-bold">Watch</Badge>;
      case 'good': return <Badge className="bg-green-500 hover:bg-green-600 uppercase font-bold">Good</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight">Predictive Maintenance</h1>
          <p className="text-muted-foreground">AI-driven component health predictions based on driving patterns.</p>
        </div>
        
        {vehicles && vehicles.length > 0 && (
          <div className="w-full md:w-64">
            <Select 
              value={selectedVehicleId?.toString()} 
              onValueChange={(val) => setSelectedVehicleId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(v => (
                  <SelectItem key={v.id} value={v.id.toString()}>
                    {v.year} {v.make} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedVehicleId ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Select a vehicle</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Choose a vehicle from your garage to view predictive maintenance timelines.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse border border-border"></div>
          ))}
        </div>
      ) : predictions && predictions.length > 0 ? (
        <div className="space-y-4">
          {predictions.map(pred => {
            // Calculate a fake max lifecycle for the progress bar based on km left
            const maxKm = pred.kmUntilService > 50000 ? 100000 : pred.kmUntilService > 10000 ? 50000 : 15000;
            const percentageLeft = Math.min(100, Math.max(0, (pred.kmUntilService / maxKm) * 100));
            // Invert for visual progression (100% full = needs service)
            const percentageUsed = 100 - percentageLeft;

            return (
              <Card key={pred.id} className="overflow-hidden border-border transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center p-6 gap-6">
                    <div className="flex items-center gap-4 min-w-[240px]">
                      {getStatusIcon(pred.status)}
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{pred.component}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(pred.status)}
                          <span className="text-xs text-muted-foreground font-medium">{pred.confidence}% Confidence</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center px-4 md:border-l border-border md:pl-8 py-2">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-gray-600">Estimated remaining life</span>
                        <span className="font-display font-bold text-xl text-gray-900">{pred.kmUntilService.toLocaleString()} km</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(pred.status)}`}
                          style={{ width: `${percentageUsed}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 opacity-50 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">All systems go</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">No predictive maintenance warnings for this vehicle right now.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
