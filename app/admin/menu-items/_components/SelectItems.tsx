"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/app/generated/prisma/client";
import { Label } from "@/components/ui/label";
import { FieldLabel } from "@/components/ui/field";

interface ISelectProps {
  categories: Category[];
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: string;
}
const SelectItems = ({
  categories,
  selectedValue,
  setSelectedValue,
}: ISelectProps) => {
  return (
    <>
      <FieldLabel htmlFor="select">Category</FieldLabel>
      <Select
        defaultValue={selectedValue}
        onValueChange={(value) => setSelectedValue(value)}
      >
        <SelectTrigger
          id="select"
          className="w-48 h-10 bg-gray-100 border-none mb-4 focus:ring-0 flex-row"
        >
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent className=" border-none z-50 bg-gray-100">
          <SelectGroup className="bg-background text-accent z-50">
            {categories.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                className="hover:bg-primary! hover:text-white! text-accent! bg-transparent!"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectItems;
