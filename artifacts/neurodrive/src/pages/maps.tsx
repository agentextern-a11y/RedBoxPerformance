import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Database, Download, FileCode2, Plus, Search } from "lucide-react";
import { useListMaps, useCreateMap, getListMapsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Maps() {
  const { data: maps, isLoading } = useListMaps();
  const createMap = useCreateMap();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    calId: "",
    description: "",
    checksumHex: "",
    sizeBytes: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMap.mutate({
      data: {
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        calId: formData.calId,
        description: formData.description,
        checksumHex: formData.checksumHex,
        sizeBytes: Number(formData.sizeBytes)
      }
    }, {
      onSuccess: () => {
        toast({ title: "Map Uploaded", description: "Successfully added ECU map to vault." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListMapsQueryKey() });
        setFormData({
          vin: "", make: "", model: "", year: new Date().getFullYear(),
          calId: "", description: "", checksumHex: "", sizeBytes: 0
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to add map"
        });
      }
    });
  };

  const filteredMaps = maps?.filter(m => 
    m.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.calId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight">ECU Map Vault</h1>
          <p className="text-muted-foreground">Secure storage for stock and tuned ECU calibrations.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-map" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Map
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload ECU Calibration</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" required value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" required value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="calId">Calibration ID</Label>
                  <Input id="calId" required value={formData.calId} onChange={e => setFormData({...formData, calId: e.target.value})} className="font-mono uppercase" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vin">Associated VIN (Opt)</Label>
                <Input id="vin" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} className="font-mono uppercase" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="checksum">Checksum Hex</Label>
                  <Input id="checksum" value={formData.checksumHex} onChange={e => setFormData({...formData, checksumHex: e.target.value})} className="font-mono uppercase" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="size">Size (Bytes)</Label>
                  <Input id="size" type="number" value={formData.sizeBytes} onChange={e => setFormData({...formData, sizeBytes: Number(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={createMap.isPending}>
                {createMap.isPending ? "Uploading..." : "Save to Vault"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search maps by make, model, or Cal ID..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse border border-border"></div>
          ))}
        </div>
      ) : filteredMaps && filteredMaps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMaps.map(map => (
            <Card key={map.id} className="overflow-hidden border-border group hover:border-primary/40 transition-colors">
              <CardHeader className="bg-gray-50 border-b border-border pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-display">{map.year} {map.make} {map.model}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-xs text-primary font-semibold tracking-wider bg-primary/10 px-2 py-0.5 rounded inline-block">
                      CAL: {map.calId}
                    </CardDescription>
                  </div>
                  <FileCode2 className="h-6 w-6 text-muted-foreground opacity-50 group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                  {map.description || "Original factory calibration file."}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground mb-6">
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-sans">Checksum</span>
                    <span className="truncate block" title={map.checksumHex || 'N/A'}>{map.checksumHex || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-gray-400 font-sans">Size</span>
                    {map.sizeBytes ? formatBytes(map.sizeBytes) : 'N/A'}
                  </div>
                  <div className="col-span-2 mt-1">
                    <span className="block text-[10px] uppercase text-gray-400 font-sans">VIN</span>
                    {map.vin || 'N/A'}
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2 font-semibold">
                  <Download className="h-4 w-4" /> Download BIN
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No maps found</h3>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">No ECU calibrations match your search or the vault is empty.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
