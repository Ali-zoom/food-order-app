/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extra } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtraIngradiends } from "@/constants/enums";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

const extraList = [
  ExtraIngradiends.BICON,
  ExtraIngradiends.CHEESE,
  ExtraIngradiends.ONION,
  ExtraIngradiends.PEPPER,
  ExtraIngradiends.TOMATO,
];

interface IExtras {
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
}
function handelOptions(
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>,
) {
  const addOptions = () => {
    setExtras((prev: any) => {
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
    setExtras((prev: any) => {
      const newSizes = [...prev];
      newSizes[index][fieldName] = newValue;
      return newSizes;
    });
  };

  const removeOptions = (indexToRemove: number) => {
    setExtras((prev: any) => {
      return prev.filter((_: any, index: number) => index !== indexToRemove);
    });
  };

  return { addOptions, onChange, removeOptions };
}

const AddExtrasOptions = ({ extras, setExtras }: IExtras) => {
  const { addOptions, onChange, removeOptions } = handelOptions(setExtras);
  const isAvailableExtraOptionsToAdd = () => {
    return extraList.length > extras.length;
  };
  return (
    <>
      {extras.length > 0 && (
        <ul>
          {extras.map((item, index) => {
            return (
              <li key={index} className="flex gap-2 mb-2">
                <div className="space-y-1 basis-1/2">
                  <Label>name</Label>
                  <SelectExtras
                    item={item}
                    currentState={extras}
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
                    value={item?.price}
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

      {isAvailableExtraOptionsToAdd() && (
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

export default AddExtrasOptions;

const SelectExtras = ({
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
  item: Partial<Extra>;
  currentState: Partial<Extra>[];
}) => {
  const filterdExtrasList = extraList.filter(
    (extra) =>
      extra === item.name || // keep current selected value
      !currentState.some((s) => s.name === extra),
  );

  return (
    <Select
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
          {filterdExtrasList.map((element, index) => (
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
