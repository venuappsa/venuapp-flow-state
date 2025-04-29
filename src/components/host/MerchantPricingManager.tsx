
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit, Plus, Check, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingPlan {
  id?: string;
  name: string;
  price: number;
  price_unit: string;
  description: string | null;
  is_highlighted: boolean;
  plan_type: string;
  features: PricingFeature[];
}

export default function MerchantPricingManager({
  defaultType = "venue",
  onPlanChange
}: {
  defaultType?: string;
  onPlanChange?: (plans: PricingPlan[]) => void;
}) {
  const [pricingType, setPricingType] = useState<'venue' | 'event'>(defaultType as 'venue' | 'event');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [features, setFeatures] = useState<PricingFeature[]>([
    { name: 'Stall Space', included: true },
    { name: 'Access to Power', included: true },
    { name: 'Table & Chair', included: true },
    { name: 'Signage', included: true },
    { name: 'Wi-Fi Access', included: false },
  ]);
  const [newFeature, setNewFeature] = useState("");
  const { user } = useUser();

  const form = useForm<PricingPlan>({
    defaultValues: {
      name: '',
      price: 0,
      price_unit: 'per day',
      description: '',
      is_highlighted: false,
      plan_type: pricingType,
      features: []
    }
  });

  const loadPricingPlans = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_pricing_plans')
        .select('*')
        .eq('plan_type', pricingType)
        .order('price', { ascending: true });

      if (error) throw error;
      
      const plans = data.map(plan => ({
        ...plan,
        features: plan.features as unknown as PricingFeature[] // Type assertion to address the type error
      }));
      
      setPricingPlans(plans);
      if (onPlanChange) onPlanChange(plans);
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      toast({
        title: "Error",
        description: "Failed to load pricing plans. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPricingPlans();
  }, [user?.id, pricingType]);

  const handleTypeChange = (value: string) => {
    setPricingType(value as 'venue' | 'event');
  };

  const openEditDialog = (plan: PricingPlan | null = null) => {
    if (plan) {
      form.reset({
        name: plan.name,
        price: plan.price,
        price_unit: plan.price_unit,
        description: plan.description || '',
        is_highlighted: plan.is_highlighted,
        plan_type: plan.plan_type,
        features: plan.features
      });
      setFeatures(plan.features);
      setCurrentPlan(plan);
    } else {
      form.reset({
        name: '',
        price: 0,
        price_unit: 'per day',
        description: '',
        is_highlighted: false,
        plan_type: pricingType,
        features: []
      });
      setFeatures([
        { name: 'Stall Space', included: true },
        { name: 'Access to Power', included: true },
        { name: 'Table & Chair', included: true },
        { name: 'Signage', included: true },
        { name: 'Wi-Fi Access', included: false },
      ]);
      setCurrentPlan(null);
    }
    setOpenDialog(true);
  };

  const onSubmit = async (data: PricingPlan) => {
    if (!user?.id) return;

    try {
      const planData = {
        ...data,
        host_id: user.id,
        features: features as unknown as any // Convert to any to satisfy Supabase JSON type
      };
      
      let result;
      if (currentPlan?.id) {
        // Update existing plan
        result = await supabase
          .from('merchant_pricing_plans')
          .update(planData)
          .eq('id', currentPlan.id);
      } else {
        // Create new plan
        result = await supabase
          .from('merchant_pricing_plans')
          .insert(planData);
      }

      if (result.error) throw result.error;
      
      toast({
        title: currentPlan ? "Plan Updated" : "Plan Created",
        description: `The pricing plan has been ${currentPlan ? 'updated' : 'created'} successfully.`
      });
      
      setOpenDialog(false);
      loadPricingPlans();
    } catch (error) {
      console.error('Error saving pricing plan:', error);
      toast({
        title: "Error",
        description: "Failed to save pricing plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;
    
    try {
      const { error } = await supabase
        .from('merchant_pricing_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
      
      toast({
        title: "Plan Deleted",
        description: "The pricing plan has been deleted successfully."
      });
      
      loadPricingPlans();
    } catch (error) {
      console.error('Error deleting pricing plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleFeature = (index: number) => {
    setFeatures(prevFeatures => 
      prevFeatures.map((feature, i) => 
        i === index ? { ...feature, included: !feature.included } : feature
      )
    );
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    
    setFeatures(prev => [...prev, { name: newFeature.trim(), included: false }]);
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">Merchant Pricing Plans</h2>
          <p className="text-gray-500">Manage your stall pricing for merchants</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <Select value={pricingType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select plan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venue">Venue Pricing</SelectItem>
              <SelectItem value="event">Event Pricing</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => openEditDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading pricing plans...</p>
        </div>
      ) : pricingPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={plan.is_highlighted ? "border-venu-orange shadow-lg" : ""}>
              <CardHeader className="relative">
                <div className="absolute right-4 top-4 flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEditDialog(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-red-500" 
                    onClick={() => plan.id && handleDeletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">R{plan.price}</span>
                  <span className="text-sm text-gray-500"> {plan.price_unit}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      <TableHead className="text-right">Included</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell className="text-right">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 ml-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-300 ml-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No pricing plans yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first pricing plan for merchants by clicking the "Add Plan" button.
          </p>
          <Button onClick={() => openEditDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Plan
          </Button>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPlan ? 'Edit' : 'Create'} Pricing Plan</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Basic Stall" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (R)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="500" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="price_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="per day">Per Day</SelectItem>
                          <SelectItem value="per week">Per Week</SelectItem>
                          <SelectItem value="per month">Per Month</SelectItem>
                          <SelectItem value="flat fee">Flat Fee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="plan_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="venue">Venue</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Essential stall for small merchants with basic needs"
                        className="h-20"
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_highlighted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Highlight this plan</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Marks this plan as your recommended option
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Plan Features</h3>
                <div className="border rounded-md p-4 space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${index}`}
                          checked={feature.included}
                          onCheckedChange={() => toggleFeature(index)}
                        />
                        <label
                          htmlFor={`feature-${index}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {feature.name}
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 pt-2 border-t">
                    <Input
                      placeholder="Add new feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {currentPlan ? 'Update' : 'Create'} Plan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
