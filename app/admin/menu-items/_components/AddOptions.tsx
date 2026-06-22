"use client";
import { Size } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtraIngradiends, productSizes } from "@/constants/enums";

interface Iprop {
  sizes: Partial<Size>[];
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
}

const sizesList = [productSizes.SMALL, productSizes.MEDIUM, productSizes.LARGE];

function handelOptions(
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>,
) {
  const addOptions = () => {
    setSizes((prev: any) => {
      return [
        ...prev,
        {
          name: "",
          price: 0,
        },
      ];
    });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    fieldName: string,
  ) => {
    const newValue = e.target.value;
    setSizes((prev: any) => {
      const newSizes = [...prev];
      newSizes[index][fieldName] = newValue;
      return newSizes;
    });
  };

  const removeOptions = (indexToRemove: number) => {
    setSizes((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove);
    });
  };

  return { addOptions, onChange, removeOptions };
}

const AddOptions = ({ sizes, setSizes }: Iprop) => {
  const { addOptions, onChange, removeOptions } = handelOptions(setSizes);

  const isAvailableOptionToAdd = () => {
    return sizesList.length > sizes.length;
  };
  return (
    <>
      {sizes.length > 0 && (
        <ul>
          {sizes.map((item, index) => {
            return (
              <li key={index} className="flex gap-2 mb-2">
                <div className="space-y-1 basis-1/2">
                  <Label>name</Label>
                  <SelectSizes
                    item={item}
                    currentState={sizes}
                    onChange={onChange}
                    index={index}
                  />
                </div>
                <div className="space-y-1 basis-1/2">
                  <Label>Extra Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    name="price"
                    value={item.price}
                    className="bg-white focus:ring-0!"
                    onChange={(e) => onChange(e, index, "price")}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeOptions(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {isAvailableOptionToAdd() && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addOptions}
        >
          <Plus />
          Add Options
        </Button>
      )}
    </>
  );
};

export default AddOptions;

const SelectSizes = ({
  onChange,
  index,
  item,
  currentState,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement, Element>,
    index: number,
    fieldName: string,
  ) => void;
  index: number;
  item: Partial<Size>;
  currentState: Partial<Size>[];
}) => {
  const filterdSizesList = sizesList.filter(
    (size) =>
      size === item.name || // keep current selected value
      !currentState.some((s) => s.name === size),
  );

  return (
    <Select
      value={item.name ?? ""}
      onValueChange={(value) => {
        onChange(
          { target: { value } } as React.ChangeEvent<HTMLInputElement>,
          index,
          "name",
        );
      }}
    >
      <SelectTrigger className="w-45">
        <SelectValue
          placeholder="select..."
          defaultValue={item.name ? item.name : "select..."}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filterdSizesList.map((element, index) => (
            <SelectItem
              className="text-red-500"
              key={index}
              value={element.toString()}
            >
              {element}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
