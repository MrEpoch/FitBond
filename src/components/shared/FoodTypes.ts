import { ColumnDef } from "@tanstack/react-table";

export type food = {
  id: string;
  foodName: string;
  calories100G: string;
  protein100G: string;
  fibers100G: string;
  carbohydrates100G: string;
  salt100G: string;
  sugar100G: string;
  fats100G: string;
  fatsSat100G: string;
  fatsMono100G: string;
  fatsPoly100G: string;
  fatsTran100G: string;
};

export const columns: ColumnDef<food>[] = [
  {
    accessorKey: "foodName",
    header: "Food Name",
  },
  {
    accessorKey: "calories100G",
    header: "Calories",
  },
  {
    accessorKey: "protein100G",
    header: "Protein",
  },
  {
    accessorKey: "fibers100G",
    header: "Fibers",
  },
  {
    accessorKey: "carbohydrates100G",
    header: "Carbohydrates",
  },
  {
    accessorKey: "salt100G",
    header: "Salt",
  },
  {
    accessorKey: "sugar100G",
    header: "Sugar",
  },
  {
    accessorKey: "fats100G",
    header: "Fats",
  },
  {
    accessorKey: "fatsSat100G",
    header: "Fats Sat",
  },
  {
    accessorKey: "fatsMono100G",
    header: "Fats Mono",
  },
  {
    accessorKey: "fatsPoly100G",
    header: "Fats Poly",
  },
  {
    accessorKey: "fatsTran100G",
    header: "Fats Tran",
  },
];
