import { Extra } from "@/app/generated/prisma/client";
import React from "react";
import AddExtrasOptions from "./AddExtrasOptions";
interface IExtras {
  extras: Partial<Extra>[];
  setExtras: React.Dispatch<React.SetStateAction<Partial<Extra>[]>>;
}

const Extras = ({ extras, setExtras }: IExtras) => {
  return (
    <div className="bg-gray-100 rounded-md p-4 w-full mb-4 border border-gray-200">
      <AddExtrasOptions extras={extras} setExtras={setExtras} />
    </div>
  );
};

export default Extras;
