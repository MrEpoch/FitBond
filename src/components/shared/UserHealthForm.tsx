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
import { useToast } from "@/hooks/use-toast";
import { createUserHealth } from "@/lib/actions/UserHealthActions";
import { useRouter } from "next/navigation";

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
  weight: z.coerce.number().nonnegative(),
  weightPounds: z.coerce.boolean(),
  height: z.coerce.number().nonnegative(),
  heightInches: z.coerce.boolean(),
  age: z.coerce.number().nonnegative().max(120),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  calories: z.coerce.number().nonnegative(),
  fitnessGoal: z.enum(["lose_weight", "gain_muscle", "maintain_weight"]),
});

export function UserHealthForm() {
  const [caloriesCustom, setCaloriesCustom] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 0,
      height: 0,
      age: 0,
      gender: "male",
      activityLevel: "sedentary",
      heightInches: false,
      weightPounds: false,
      calories: 0,
      fitnessGoal: "maintain_weight",
    },
  });

  const router = useRouter();

  function calculateCalories() {
    const age = form.getValues("age");
    const height = form.getValues("height");
    const isHeightInches = form.getValues("heightInches");
    const weight = form.getValues("weight");
    const isWeightPounds = form.getValues("weightPounds");
    const gender = form.getValues("gender");
    const activityLevel = form.getValues("activityLevel");

    if (!height || height === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid height",
        variant: "destructive",
      });
      return;
    }
    if (!weight || weight === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }
    if (!age || age === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return;
    }

    if (!gender) {
      toast({
        title: "Error",
        description: "Please enter a valid gender",
        variant: "destructive",
      });
      return;
    }

    if (isHeightInches === undefined || isHeightInches === null) {
      toast({
        title: "Error",
        description: "Please enter valid height units",
        variant: "destructive",
      });
      return;
    }
    if (isWeightPounds === undefined || isWeightPounds === null) {
      toast({
        title: "Error",
        description: "Please enter valid weight units",
        variant: "destructive",
      });
      return;
    }

    const activityLevelMultiplier = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    if (!activityLevel) {
      toast({
        title: "Error",
        description: "Please enter a valid activity level",
        variant: "destructive",
      });
      return;
    }

    form.setValue(
      "calories",
      gender === "male"
        ? Math.floor(
            (10 * (isWeightPounds ? weight * 2.205 : weight) +
              6.25 * (isHeightInches ? height * 2.54 : height) -
              5 * age +
              5) *
              activityLevelMultiplier[activityLevel],
          )
        : Math.floor(
            (10 * (isWeightPounds ? weight * 2.205 : weight) +
              6.25 * (isHeightInches ? height * 2.54 : height) -
              5 * age -
              161) *
              activityLevelMultiplier[activityLevel],
          ),
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      if (values.calories === 0) {
        toast({
          title: "Error",
          description: "Please enter a valid calorie count",
          variant: "destructive",
        });
        return;
      }

      formData.append("weight", values.weight.toString());
      formData.append("height", values.height.toString());
      formData.append("age", values.age.toString());
      formData.append("gender", values.gender);
      formData.append("activityLevel", values.activityLevel);
      formData.append("calories", values.calories.toString());
      formData.append("weightPounds", values.weightPounds.toString());
      formData.append("heightInches", values.heightInches.toString());
      formData.append("fitnessGoal", values.fitnessGoal);
      const userHealth = await createUserHealth(formData);
      if (userHealth?.error) {
        console.log(userHealth?.error);
      } else {
        form.reset();
        router.push("/main/dashboard");
      }
    } catch (e) {
      console.log(e);
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
          name="activityLevel"
          formLabel={"Activity kind"}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select activity kind: " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked value="sedentary">
                  Sedentary
                </SelectItem>
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
          formLabel={"Current weight*"}
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
          formLabel={"Current height*"}
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
          formLabel={"Gender:*"}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select gender: " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked value="male">
                  Male
                </SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <CustomField
          control={form.control}
          name="age"
          className="w-full"
          formLabel={"Age*"}
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
          name="fitnessGoal"
          formLabel={"Fitness goal"}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="px-1 rounded bg-main-background-100 shadow border border-main-accent-100">
                <SelectValue placeholder="Select fitness goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked value="maintain_weight">
                  Maintain weight
                </SelectItem>
                <SelectItem value="gain_muscle">Gain muscle</SelectItem>
                <SelectItem value="lose_weight">Lose weight</SelectItem>
              </SelectContent>
            </Select>
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
          name="calories"
          className="w-full"
          formLabel={"Calories"}
          render={({ field }) => (
            <Input
              disabled={!caloriesCustom}
              type="number"
              className="bg-main-background-100 shadow border border-main-accent-100"
              value={field.value}
              {...field}
            />
          )}
        />
        <div className="flex gap-4 sm:flex-row flex-col">
          <Button
            onClick={calculateCalories}
            className="bg-main-background-300 px-10 font-medium border py-5 text-main-text-100 hover:bg-transparent hover:border-main-100 hover:border rounded-[--radius] text-md shadow"
            type="button"
          >
            Count calories
          </Button>
          <Button
            className={`bg-main-background-300 px-10 ${museoModerno.className} font-medium border py-5 text-main-text-100 hover:bg-transparent hover:border-main-100 hover:border rounded-[--radius] text-md shadow`}
            type="submit"
          >
            Write health
          </Button>
        </div>
      </form>
    </Form>
  );
}
