import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Car, Plus, Settings2, Trash2 } from "lucide-react";
import { useListVehicles, useCreateVehicle, useDeleteVehicle, getListVehiclesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Vehicles() {
  const { data: vehicles, isLoading } = useListVehicles();
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vin: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    engineCode: "",
    mileageKm: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicle.mutate({
      data: {
        vin: formData.vin,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        engineCode: formData.engineCode,
        mileageKm: Number(formData.mileageKm)
      }
    }, {
      onSuccess: () => {
        toast({ title: "Vehicle Added", description: "Successfully registered vehicle." });
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        setFormData({ vin: "", make: "", model: "", year: new Date().getFullYear(), engineCode: "", mileageKm: 0 });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add vehicle"
        });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    deleteVehicle.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Vehicle Deleted" });
        queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display uppercase tracking-tight">Garage</h1>
          <p className="text-muted-foreground">Manage your registered vehicles and view health scores.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-vehicle" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" required value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} className="font-mono uppercase" />
              </div>
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
                  <Label htmlFor="engineCode">Engine Code (Opt)</Label>
                  <Input id="engineCode" value={formData.engineCode} onChange={e => setFormData({...formData, engineCode: e.target.value})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mileageKm">Mileage (km)</Label>
                <Input id="mileageKm" type="number" required value={formData.mileageKm} onChange={e => setFormData({...formData, mileageKm: Number(e.target.value)})} />
              </div>
              <Button type="submit" className="w-full" disabled={createVehicle.isPending}>
                {createVehicle.isPending ? "Saving..." : "Save Vehicle"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id} className="overflow-hidden hover:border-primary/50 transition-colors group relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.preventDefault(); handleDelete(vehicle.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Link href={`/predict?vehicleId=${vehicle.id}`}>
                <div className="block cursor-pointer">
                  <div className="h-2 bg-gray-100">
                    <div 
                      className={`h-full ${vehicle.healthScore > 80 ? 'bg-green-500' : vehicle.healthScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${vehicle.healthScore}%` }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl font-display leading-tight">{vehicle.year} {vehicle.make}</h3>
                        <p className="text-gray-900 font-medium">{vehicle.model}</p>
                        <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded inline-flex w-fit">{vehicle.vin}</span>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1"><Settings2 className="h-3.5 w-3.5" /> {vehicle.engineCode || 'Stock'}</span>
                            <span>{vehicle.mileageKm.toLocaleString()} km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Car className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Garage is empty</h3>
            <p className="text-muted-foreground mt-1 mb-6 max-w-sm">Add your first vehicle to start tracking health scores and predictive maintenance.</p>
            <Button onClick={() => setIsOpen(true)}>Add Vehicle</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
