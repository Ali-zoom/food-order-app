import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import AddOptions from "./AddOptions";
import { Size } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";

interface Iprop {
  sizes: Partial<Size>[];
  setSizes: React.Dispatch<React.SetStateAction<Partial<Size>[]>>;
}
const Sizes = ({ sizes, setSizes }: Iprop) => {
  return (
    <div className="bg-gray-100 rounded-md p-4 w-full mb-4 border border-gray-200">
      <AddOptions sizes={sizes} setSizes={setSizes} />
    </div>
  );
};

export default Sizes;
