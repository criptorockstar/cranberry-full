"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Orders = {
  id: string
  price: number
  order_number: string
  status: string
}

export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "order_number",
    header: "Codigo de seguimiento",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
]
