"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MuseoModerno } from "next/font/google";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { createActivity } from "@/lib/actions/ActivityActions";
import { useFormStatus } from "react-dom";
import { SelectTrigger } from "@radix-ui/react-select";

const museoModerno = MuseoModerno({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-museo-moderno",
});

interface customFieldType {
  control: Control<z.infer<typeof formSchema>> | undefined;
  name: keyof z.infer<typeof formSchema>;
  render: (props: { field: any }) => React.ReactNode;
  className?: string;
  formLabel?: string;
}

export default function CustomField({
  control,
  render,
  name,
  formLabel,
  className = "",
}: customFieldType) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
        </FormItem>
      )}
    />
  );
}

export const formSchema = z.object({
  breakfast: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  firstSnack: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  lunch: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  secondSnack: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  dinner: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  secondDinner: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  activity: z.array(z.string().length(36)),
});

export function ActivityForm({ hideModal }) {
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      breakfast: [],
      firstSnack: [],
      lunch: [],
      secondSnack: [],
      dinner: [],
      secondDinner: [],
      activity: [],
    },
  });

  async function submitLogic(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("breakfast", JSON.stringify(values.breakfast));
      formData.append("firstSnack", JSON.stringify(values.firstSnack));
      formData.append("lunch", JSON.stringify(values.lunch));
      formData.append("secondSnack", JSON.stringify(values.secondSnack));
      formData.append("dinner", JSON.stringify(values.dinner));
      formData.append("secondDinner", JSON.stringify(values.secondDinner));
      formData.append("activity", JSON.stringify(values.activity));
      const activity = await createActivity(formData);
      if (activity?.error) {
        console.log(activity?.error);
      } else {
        form.reset();
        hideModal();
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitLogic)}
        className="max-h-full w-full flex flex-col items-center p-6 space-y-8"
      >
        <CustomField
          control={form.control}
          className="w-full"
          name=""
          formLabel={"Weight used"}
          render={({ field }) => (
            <Input
              step={0.01}
              type="number"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        <Button
          disabled={pending}
          className={`bg-main-background-300 px-10 ${museoModerno.className} font-medium border py-5 text-main-text-100 hover:bg-transparent hover:text-black hover:border-main-100 hover:border rounded-[--radius] text-lg shadow`}
          type="submit"
        >
          Write activity
        </Button>
      </form>
    </Form>
  );
}
