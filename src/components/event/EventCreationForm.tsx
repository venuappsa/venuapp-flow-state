
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Trash2, Loader2 } from 'lucide-react';
import { dummyEvents } from '@/data/hostDummyData';

// Event categories
const eventCategories = [
  'Corporate',
  'Wedding',
  'Birthday',
  'Concert',
  'Conference',
  'Exhibition',
  'Festival',
  'Fundraiser',
  'Graduation',
  'Party',
  'Other'
];

// Dummy venues
const dummyVenues = [
  { id: 'venue-1', name: 'The Grand Ballroom', location: 'Johannesburg' },
  { id: 'venue-2', name: 'Riverside Gardens', location: 'Cape Town' },
  { id: 'venue-3', name: 'Tech Conference Center', location: 'Pretoria' }
];

interface EventFormValues {
  name: string;
  description: string;
  category: string;
  date: Date;
  endDate: Date;
  venueId: string;
  budget: number;
  capacity: number;
  status: string;
}

export default function EventCreationForm() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditMode = !!eventId;

  // Set up form with default values
  const form = useForm<EventFormValues>({
    defaultValues: {
      name: '',
      description: '',
      category: 'Corporate',
      date: new Date(),
      endDate: new Date(),
      venueId: '',
      budget: 0,
      capacity: 0,
      status: 'draft'
    }
  });

  // Load event data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // In a real app, you would fetch the event data from your API
      const eventData = dummyEvents.find(event => event.id === eventId);
      
      if (eventData) {
        form.reset({
          name: eventData.name,
          description: 'Event description would be loaded from API',
          category: 'Corporate', // This would come from the API
          date: new Date(eventData.date),
          endDate: new Date(eventData.endDate),
          venueId: eventData.venueId || '',
          budget: eventData.revenue, // Using revenue as budget for demo
          capacity: eventData.capacity,
          status: eventData.status
        });
      } else {
        toast({
          title: "Event not found",
          description: "The event you're trying to edit could not be found.",
          variant: "destructive"
        });
        navigate('/host/events');
      }
    }
  }, [eventId, isEditMode, navigate, form]);

  // Handle form submission
  const onSubmit = (values: EventFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form values:', values);
      
      if (isEditMode) {
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully."
        });
      } else {
        toast({
          title: "Event created",
          description: "Your new event has been created successfully."
        });
      }
      
      setIsSubmitting(false);
      navigate('/host/events');
    }, 1000);
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully."
      });
      
      setIsSubmitting(false);
      navigate('/host/events');
    }, 1000);
  };

  // Create a venue selection with correct options and validation
  const handleVenueChange = (value: string) => {
    form.setValue('venueId', value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="text-gray-500">{isEditMode ? 'Update your event details' : 'Plan a new event'}</p>
        </div>
        {isEditMode && (
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Event
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Event Details' : 'New Event'}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? 'Make changes to your event information below' 
              : 'Fill in the details for your new event'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Event name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your event a descriptive name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The type of event you're hosting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="live">Live</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When your event begins
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When your event ends
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="venueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue</FormLabel>
                      <Select onValueChange={handleVenueChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a venue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dummyVenues.map((venue) => (
                            <SelectItem key={venue.id} value={venue.id}>
                              {venue.name} - {venue.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose a venue for your event or leave blank to add later
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    rules={{ min: { value: 0, message: "Budget must be a positive number" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (R)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00"
                            min={0} 
                            step={1000} 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          Your total budget for this event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    rules={{ min: { value: 1, message: "Capacity must be at least 1" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1"
                            min={1} 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))} 
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of attendees
                        </FormDescription>
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
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter details about your event"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your event, include important details for vendors and attendees
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/host/events')}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEvent}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Event"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
