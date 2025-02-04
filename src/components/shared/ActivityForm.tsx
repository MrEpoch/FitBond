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
  activityKind: z.enum(["movement", "weight_based"]),
  weight: z.coerce.number().nonnegative().optional(),
  duration: z.coerce.number().nonnegative().optional(),
  repetitions: z.coerce.number().nonnegative().optional(),
  sets: z.coerce.number().nonnegative().optional(),
});

export function ActivityForm({ hideModal }) {
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityKind: "movement",
      weight: 0,
      sets: 0,
      repetitions: 0,
      duration: 0,
    },
  });

  async function submitLogic(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("activityKind", values.activityKind);
      formData.append("weight", values.weight?.toString() ?? "0");
      formData.append("sets", values.sets?.toString() ?? "0");
      formData.append("repetitions", values.repetitions?.toString() ?? "0");
      formData.append("duration", values.duration?.toString() ?? "0");
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

  const activityKind = form.watch("activityKind");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitLogic)}
        className="max-h-full w-full flex flex-col items-center p-6 space-y-8"
      >
        <CustomField
          control={form.control}
          className="w-full"
          name="activityKind"
          formLabel={"Select activity kind: "}
          render={({ field }) => (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select activity kind: " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movement">Movement</SelectItem>
                <SelectItem value="weight_based">Weight based</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {activityKind === "weight_based" ? (
          <>
            <CustomField
              control={form.control}
              className="w-full"
              name="weight"
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
            <div className="flex gap-2">
              <CustomField
                control={form.control}
                className="w-full"
                name="sets"
                formLabel={"Sets"}
                render={({ field }) => (
                  <Input
                    type="number"
                    className="bg-main-background-100 shadow border border-main-accent-100"
                    value={field.value}
                    {...field}
                  />
                )}
              />
              <CustomField
                control={form.control}
                className="w-full"
                name="repetitions"
                formLabel={"Repetitions"}
                render={({ field }) => (
                  <Input
                    type="number"
                    className="bg-main-background-100 shadow border border-main-accent-100"
                    value={field.value}
                    {...field}
                  />
                )}
              />
            </div>
          </>
        ) : (
          <CustomField
            control={form.control}
            name="duration"
            className="w-full"
            formLabel={"Activity duration"}
            render={({ field }) => (
              <Input
                type="number"
                step={0.01}
                className="bg-main-background-100 shadow border border-main-accent-100"
                value={field.value}
                {...field}
              />
            )}
          />
        )}
        <Button
          disabled={pending}
          className={`bg-main-background-200 px-8 ${museoModerno.className} font-medium py-4 text-main-text-100 hover:bg-main-background-300 rounded-[--radius] shadow`}
          type="submit"
        >
          Write activity
        </Button>
      </form>
    </Form>
  );
}
