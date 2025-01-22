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
import { createFood } from "@/lib/actions/FoodActions";

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
  foodName: z
    .string()
    .min(1, { message: "Food name is required" })
    .max(50, { message: "Food name is too long" }),
  foodSize: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Food size is required" }),
  calories100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Calories is required" }),
  protein100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Protein is required" }),
  fibers100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Fibers is required" }),
  carbohydrates100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Carbohydrates is required" }),
  salt100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Salt is required" }),
  sugar100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Sugar is required" }),
  fats100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Fats is required" }),
});

export function FoodForm({ hideModal }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: "",
      foodSize: 0,
      calories100G: 0,
      protein100G: 0,
      fibers100G: 0,
      carbohydrates100G: 0,
      salt100G: 0,
      sugar100G: 0,
      fats100G: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("foodName", values.foodName);
    formData.append("foodSize", values.foodSize.toString());
    formData.append("calories100G", values.calories100G.toString());
    formData.append("protein100G", values.protein100G.toString());
    formData.append("fibers100G", values.fibers100G.toString());
    formData.append("carbohydrates100G", values.carbohydrates100G.toString());
    formData.append("salt100G", values.salt100G.toString());
    formData.append("sugar100G", values.sugar100G.toString());
    formData.append("fats100G", values.fats100G.toString());
    const food = await createFood(formData);
    if (food?.error) {
      console.log(food?.error);
    } else {
      form.reset();
      hideModal();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-full w-full flex flex-col items-center p-6 space-y-8"
      >
        <CustomField
          control={form.control}
          className="w-full"
          name="foodName"
          formLabel={"Food name"}
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
          className="w-full"
          name="foodSize"
          formLabel={"Food size"}
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
          className="w-full"
          name="calories100G"
          formLabel={"Calories per 100g"}
          render={({ field }) => (
            <Input
              type="number"
              className="bg-main-background-100 shadow border border-main-accent-100"
              step={0.01}
              value={field.value}
              {...field}
            />
          )}
        />
        <CustomField
          control={form.control}
          className="w-full"
          name="protein100G"
          formLabel={"Protein per 100g"}
          render={({ field }) => (
            <Input
              type="number"
              className="bg-main-background-100 shadow border border-main-accent-100"
              step={0.01}
              value={field.value}
              {...field}
            />
          )}
        />

        <CustomField
          control={form.control}
          className="w-full"
          name="sugar100G"
          formLabel={"Sugar per 100g"}
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
          className="w-full"
          name="fats100G"
          formLabel={"Fats per 100g"}
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
          className="w-full"
          name="fibers100G"
          formLabel={"Fibers per 100g"}
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
          className="w-full"
          name="carbohydrates100G"
          formLabel={"Carbohydrates per 100g"}
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

        <Button
          className={`bg-main-background-300 px-10 ${museoModerno.className} font-medium border py-5 number-main-number-100 text-black hover:bg-transparent hover:number-black hover:border-main-100 hover:border rounded-[--radius] number-lg shadow`}
          type="submit"
        >
          Write food
        </Button>
      </form>
    </Form>
  );
}
