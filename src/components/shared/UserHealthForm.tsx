"use client";
import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "../ui/label";

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
  weight: z.number().nonnegative().optional(),
  weightPounds: z.boolean().optional(),
  height: z.number().nonnegative().optional(),
  heightInches: z.boolean().optional(),
  age: z.number().nonnegative().max(120).optional(),
  gender: z.enum(["male", "female"]).optional(),
  activityLevel: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  calories: z.number().nonnegative().optional(),
});

export function UserHealthForm() {
  const [caloriesCustom, setCaloriesCustom] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
      age: undefined,
      gender: undefined,
      activityLevel: undefined,
      calories: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-full w-full flex flex-col items-center p-6 space-y-8"
      >
        <CustomField
          control={form.control}
          className="w-full"
          name="activityLevel"
          formLabel={"Activity kind"}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select activity kind: " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="lightly_active">Lightly active</SelectItem>
                <SelectItem value="moderately_active">
                  Moderately active
                </SelectItem>
                <SelectItem value="very_active">Very active</SelectItem>
                <SelectItem value="extremely_active">
                  Extremely active
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <CustomField
          control={form.control}
          name="weightPounds"
          className="w-full"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <Label className="">Weight in Pounds:</Label>
              <Switch
                className="bg-main-background-100 shadow border border-main-accent-100"
                checked={field.value}
                onCheckedChange={field.onChange}
                {...field}
              />
            </div>
          )}
        />
        <CustomField
          control={form.control}
          name="weight"
          className="w-full"
          formLabel={"Current weight"}
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

        <CustomField
          control={form.control}
          name="heightInches"
          className="w-full"
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <Label className="">Height in inches:</Label>
              <Switch
                className="bg-main-background-100 shadow border border-main-accent-100"
                checked={field.value}
                onCheckedChange={field.onChange}
                {...field}
              />
            </div>
          )}
        />
        <CustomField
          control={form.control}
          name="height"
          className="w-full"
          formLabel={"Current height"}
          render={({ field }) => (
            <Input
              type="text"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />

        <CustomField
          control={form.control}
          name="gender"
          className="w-full"
          formLabel={"Gender:"}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select gender: " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="anonymous">Anonymous</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <CustomField
          control={form.control}
          name="age"
          className="w-full"
          formLabel={"Age"}
          render={({ field }) => (
            <Input
              type="number"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        <div className="flex items-center gap-4 justify-start w-full">
          <Label className="">Fill custom calories </Label>
          <Switch
            className="bg-main-background-100 shadow border border-main-accent-100"
            checked={caloriesCustom}
            onCheckedChange={() => setCaloriesCustom(!caloriesCustom)}
          />
        </div>
        <CustomField
          control={form.control}
          name="weight"
          className="w-full"
          formLabel={"Calories"}
          render={({ field }) => (
            <Input
              disabled={!caloriesCustom}
              type="text"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        <Button
          className={`bg-main-background-300 px-10 ${museoModerno.className} font-medium border py-5 text-main-text-100 hover:bg-transparent hover:text-black hover:border-main-100 hover:border rounded-[--radius] text-lg shadow`}
          type="submit"
        >
          Write activity
        </Button>
      </form>
    </Form>
  );
}
