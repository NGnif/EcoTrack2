'use client';

import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Car, Zap, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addActivity as addActivityClient } from '@/lib/firestore-service';
import { useAuth } from '@/lib/auth';
import { auth } from '@/lib/firebase';

// Schemas
const transportSchema = z.object({
  category: z.literal('transport'),
  mode: z.enum(['car', 'bus', 'train', 'bike', 'walk']),
  distance: z.coerce.number().min(0.1, 'Distance must be positive'),
});

const energySchema = z.object({
  category: z.literal('energy'),
  electricity: z.coerce.number().min(0, 'Value must be zero or positive'),
  naturalGas: z.coerce.number().min(0, 'Value must be zero or positive').optional(),
});

const dietSchema = z.object({
  category: z.literal('diet'),
  beef: z.coerce.number().min(0, 'Servings cannot be negative'),
  chicken: z.coerce.number().min(0, 'Servings cannot be negative'),
  vegetarian: z.coerce.number().min(0, 'Servings cannot be negative'),
});


type AnyForm = UseFormReturn<any>;

export function ActivityLogger() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { user } = useAuth();

    const createForm = (schema: z.AnyZodObject) => useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            category: schema.shape.category.value,
            ...getInitialValues(schema.shape.category.value)
        },
    });

    const transportForm = createForm(transportSchema);
    const energyForm = createForm(energySchema);
    const dietForm = createForm(dietSchema);
    
    const forms: Record<string, AnyForm> = {
        transport: transportForm,
        energy: energyForm,
        diet: dietForm,
    };

    const onSubmit = (form: AnyForm) => async (data: any) => {
        if (!auth.currentUser) {
             toast({
                variant: 'destructive',
                title: 'Uh oh! You are not logged in.',
                description: 'Please log in again to record your activity.',
            });
            return;
        }

        startTransition(async () => {
            try {
                await addActivityClient(auth.currentUser!.uid, data);
                toast({
                    title: 'Activity Logged!',
                    description: `Your ${data.category} activity has been successfully recorded.`,
                });
                form.reset({ category: data.category, ...getInitialValues(data.category) });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description: 'Failed to log activity.',
                });
            }
        });
    };

    const onTabChange = (value: string) => {
        const form = forms[value];
        if (form) {
            form.reset({ category: value, ...getInitialValues(value) });
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <Tabs defaultValue="transport" className="w-full" onValueChange={onTabChange}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="transport"><Car className="mr-2 h-4 w-4" />Transport</TabsTrigger>
                        <TabsTrigger value="energy"><Zap className="mr-2 h-4 w-4" />Energy</TabsTrigger>
                        <TabsTrigger value="diet"><Leaf className="mr-2 h-4 w-4" />Diet</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transport">
                        <ActivityForm form={transportForm} onSubmit={onSubmit(transportForm)} isPending={isPending}>
                            <TransportFields form={transportForm} />
                        </ActivityForm>
                    </TabsContent>
                    <TabsContent value="energy">
                         <ActivityForm form={energyForm} onSubmit={onSubmit(energyForm)} isPending={isPending}>
                            <EnergyFields form={energyForm} />
                        </ActivityForm>
                    </TabsContent>
                    <TabsContent value="diet">
                         <ActivityForm form={dietForm} onSubmit={onSubmit(dietForm)} isPending={isPending}>
                            <DietFields form={dietForm} />
                        </ActivityForm>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

function getInitialValues(category: string) {
    switch(category) {
        case 'transport': return { mode: 'car', distance: '' };
        case 'energy': return { electricity: '', naturalGas: '' };
        case 'diet': return { beef: '', chicken: '', vegetarian: '' };
        default: return {};
    }
}

function ActivityForm({ form, onSubmit, isPending, children }: { form: AnyForm, onSubmit: (data: any) => void, isPending: boolean, children: React.ReactNode }) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                {children}
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log Activity
                </Button>
            </form>
        </Form>
    )
}

function TransportFields({ form }: { form: UseFormReturn<z.infer<typeof transportSchema>> }) {
    return (
        <>
            <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mode of Transport</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a mode" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="car">Car</SelectItem>
                                <SelectItem value="bus">Bus</SelectItem>
                                <SelectItem value="train">Train</SelectItem>
                                <SelectItem value="bike">Bike</SelectItem>
                                <SelectItem value="walk">Walk</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Distance (km)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 15" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

function EnergyFields({ form }: { form: UseFormReturn<z.infer<typeof energySchema>> }) {
    return (
        <>
            <FormField
                control={form.control}
                name="electricity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Electricity Usage (kWh)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 12.5" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="naturalGas"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Natural Gas (m³) - Optional</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

function DietFields({ form }: { form: UseFormReturn<z.infer<typeof dietSchema>> }) {
    return (
        <div className="space-y-4">
            <p className="text-sm font-medium">Servings</p>
             <FormField
                control={form.control}
                name="beef"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Beef Servings</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="chicken"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Chicken Servings</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 2" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="vegetarian"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vegetarian Servings</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 3" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}