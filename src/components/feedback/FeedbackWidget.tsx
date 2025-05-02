
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { MessageSquarePlus, ThumbsUp, Check } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function FeedbackWidget() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit feedback",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: feedbackType,
          content: content.trim(),
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setContent("");
        setFeedbackType("suggestion");
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-8 right-8 shadow-md bg-white z-50 rounded-full p-3 h-auto"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquarePlus className="h-5 w-5" />
        <span className="sr-only">Open Feedback</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-8 right-8 w-80 shadow-lg z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquarePlus className="h-5 w-5" /> 
          Send Feedback
        </CardTitle>
        <CardDescription>Help us improve your experience</CardDescription>
      </CardHeader>
      
      {isSubmitted ? (
        <CardContent className="pt-4 flex flex-col items-center justify-center space-y-2">
          <div className="bg-green-100 rounded-full p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-center font-medium">Thank you for your feedback!</p>
        </CardContent>
      ) : (
        <>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Feedback type</label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Suggestion</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="praise">Praise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Your feedback</label>
              <Textarea 
                placeholder="Tell us what's on your mind..."
                className="min-h-[100px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
