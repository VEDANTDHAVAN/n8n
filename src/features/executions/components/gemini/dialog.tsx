"use client";

import { Dialog, DialogContent, DialogDescription,
    DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, 
  FormItem, FormLabel, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  variableName: z.string()
   .min(1, { message: "Variable name is required!!" }).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { 
     message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<GeminiFormValues>; 
};

export const GeminiDialog = ({
 open, onOpenChange, onSubmit, defaultValues = {},
}: Props) => {
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    variableName: defaultValues.variableName || "",
    systemPrompt:   defaultValues.systemPrompt || "",
    userPrompt:   defaultValues.userPrompt || "",
  },
 });

 // Reset form values when dialog opens with new defaults
 useEffect(() => {
  if(open) {
    form.reset({
      variableName: defaultValues.variableName || "",
      systemPrompt:   defaultValues.systemPrompt || "",
      userPrompt:   defaultValues.userPrompt || "",
    });
  }
 }, [open, defaultValues, form]);

 const watchVariableName = form.watch("variableName") || "myGemini";

 const handleSubmit = (values: z.infer<typeof formSchema>) => {
  onSubmit(values);
  onOpenChange(false);
 }

 return (
   <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>Gemini Configuration</DialogTitle>
      <DialogDescription>
        Configure the AI model and prompts for this node.
      </DialogDescription>
     </DialogHeader>  
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} 
       className="space-y-8 mt-4"
      >  
       <FormField control={form.control} name="variableName"
        render={({field}) => (
          <FormItem>
           <FormLabel>Variable Name</FormLabel> 
           <FormControl>
            <Input placeholder="myGemini" {...field} />
           </FormControl>
           <FormDescription>
            Use this name to reference the result in other nodes:{" "}
            {`{{${watchVariableName}.text}}`}
           </FormDescription>
          </FormItem>
        )}
       /> 
       <FormField control={form.control} name="systemPrompt" render={({field}) => (
          <FormItem>
           <FormLabel>System Prompt (optional)</FormLabel> 
           <FormControl>
            <Textarea placeholder="You are a helpful assistant." {...field}
              className="min-h-[120px] font-mono text-sm" />
           </FormControl>
           <FormDescription>
            Sets the behaviour of the Assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
           </FormDescription>
          </FormItem>
        )} />
        <FormField control={form.control} name="userPrompt" render={({field}) => (
          <FormItem>
           <FormLabel>User Prompt</FormLabel> 
           <FormControl>
            <Textarea placeholder="Summarize this text: {{json aiResponse.text}}" {...field}
              className="min-h-[120px] font-mono text-sm" />
           </FormControl>
           <FormDescription>
            The Prompt is sent to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
           </FormDescription>
          </FormItem>
        )} />
       <DialogFooter className="mt-4">
        <Button type="submit">Save</Button>
       </DialogFooter>
      </form>
     </Form> 
    </DialogContent>
   </Dialog> 
 )
}
