import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, AlertTriangle, ShieldCheck } from "lucide-react";
import { useListDiagnostics, useAnalyzeDtc } from "@workspace/api-client-react";
import { getListDiagnosticsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Diagnostics() {
  const [dtcCode, setDtcCode] = useState("");
  const { data: diagnostics, isLoading } = useListDiagnostics();
  const analyzeDtc = useAnalyzeDtc();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dtcCode.trim()) return;

    analyzeDtc.mutate({
      data: {
        dtcCode: dtcCode.toUpperCase()
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed code ${dtcCode.toUpperCase()}`,
        });
        setDtcCode("");
        queryClient.invalidateQueries({ queryKey: getListDiagnosticsQueryKey() });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Failed to analyze DTC code",
        });
      }
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'critical': return <Badge variant="destructive" className="font-bold">CRITICAL</Badge>;
      case 'high': return <Badge className="bg-orange-500 hover:bg-orange-600">HIGH</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 hover:bg-yellow-600">MEDIUM</Badge>;
      default: return <Badge variant="secondary">LOW</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display uppercase tracking-tight">AI Diagnostics</h1>
        <p className="text-muted-foreground">Analyze OBD fault codes (DTCs) with AI for root causes and repair steps.</p>
      </div>

      <Card className="mb-10 border-primary/20 shadow-md">
        <CardHeader className="bg-gray-50 border-b border-border">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Analyze Fault Code
          </CardTitle>
          <CardDescription>Enter a standard OBD-II DTC (e.g., P0300, P0171)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleAnalyze} className="flex gap-3 max-w-lg">
            <Input 
              placeholder="Enter DTC code (e.g. P0420)" 
              value={dtcCode}
              onChange={(e) => setDtcCode(e.target.value)}
              className="font-mono uppercase text-lg"
              data-testid="input-dtc-code"
            />
            <Button 
              type="submit" 
              disabled={analyzeDtc.isPending || !dtcCode.trim()} 
              data-testid="btn-analyze-dtc"
              className="w-32"
            >
              {analyzeDtc.isPending ? "Analyzing..." : "Analyze AI"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold font-display uppercase tracking-tight mb-6 flex items-center gap-2">
        <Wrench className="h-5 w-5 text-primary" />
        Diagnostic History
      </h2>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center border border-border rounded-lg bg-card">
          <span className="text-muted-foreground">Loading diagnostics...</span>
        </div>
      ) : diagnostics && diagnostics.length > 0 ? (
        <div className="space-y-6">
          {diagnostics.map(diag => (
            <Card key={diag.id} className="overflow-hidden border-border transition-shadow hover:shadow-md">
              <div className="bg-gray-50 px-6 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xl font-bold text-gray-900">{diag.dtcCode}</span>
                  {getSeverityBadge(diag.severity)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(diag.createdAt).toLocaleDateString()}
                </span>
              </div>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Description & Root Causes
                  </h4>
                  <p className="text-gray-900 font-medium mb-4">{diag.description}</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {diag.rootCauses.map((cause, i) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Recommended Repair Steps
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                    {diag.repairSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  {(diag.estimatedCostMin || diag.estimatedCostMax) && (
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Estimated Cost:</span>
                      <span className="font-bold text-primary">
                        ${diag.estimatedCostMin || 0} - ${diag.estimatedCostMax || 0}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No diagnostic history</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Analyze a DTC code above to see AI-generated repair steps and root cause analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
