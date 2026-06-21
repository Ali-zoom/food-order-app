"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { productWithRelation } from "@/types/products";
import { Extra, Size } from "@/app/generated/prisma/client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addItemToCart,
  deleteSingleItemFromCart,
  removeItemFromCart,
  selectCartItems,
} from "@/redux/features/cartSlice";
import { getSingleCartItemQuantity } from "@/lib/cart";
import { Button } from "../ui/button";

const AddToCard = ({ item }: { item: productWithRelation }) => {
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  const singleCartItemQuantity = getSingleCartItemQuantity(item.id, cart);

  const defaultSize =
    cart.find((element) => element.id === item.id)?.size ||
    item.sizes.find((size) => size.name === "SMALL");

  const [selectedSize, SetSelectedSize] = useState<Size>(defaultSize!);

  const defaultExtra =
    cart.find((element) => element.id === item.id)?.extras || [];

  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtra!);

  //calculate total price
  let totalPrice = item.basePrice;
  if (selectedSize) {
    totalPrice += selectedSize.price;
  }

  for (let i = 0; i <= selectedExtras.length - 1; i++) {
    totalPrice += selectedExtras[i].price;
  }

  const handelAddToCart = () => {
    dispatch(
      addItemToCart({
        id: item.id,
        name: item.name,
        image: item.image,
        basePrice: item.basePrice,
        // quantity?: number; will added from addItemToCart in slice
        size: selectedSize,
        extras: selectedExtras,
      }),
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-primary mt-4 rounded-full text-white ">
          Add To Card
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <DialogHeader></DialogHeader>
        <div className=" flex flex-col items-center gap-3 -mx-4 no-scrollbar  max-h-[70vh] overflow-y-auto px-4">
          <Image src={item.image} alt={item.name} width={200} height={200} />
          <h1 className="text-center mt-3 font-semibold text-lg">
            {item.name}
          </h1>
          <div className=" px-6 font-bold  mt-3 border-b-2 py-2 border-b-primary">
            {formatCurrency(item.basePrice)}
          </div>
          <DialogDescription className="text-center text-base">
            {item.description}
          </DialogDescription>
          <p className="font-bold">pick your size</p>
          <div className="w-full">
            <Sizes
              sizes={item.sizes}
              currentItem={item}
              selectedSize={selectedSize}
              SetSelectedSize={SetSelectedSize}
            />
          </div>
          <p className="font-bold text-md">any extras?</p>
          <div className="w-full">
            <Extras
              extras={item.extras}
              selectedExtras={selectedExtras}
              setSelectedExtras={setSelectedExtras}
            />
          </div>
          {singleCartItemQuantity === 0 ? (
            <button
              className="bg-primary w-full text-white py-2 rounded"
              type="submit"
              onClick={handelAddToCart}
            >
              Add To Cart
              <span className="px-2">{formatCurrency(totalPrice)}</span>
            </button>
          ) : (
            <ChooseQuantity
              quantity={singleCartItemQuantity}
              item={item}
              selectedExtras={selectedExtras}
              selectedSize={selectedSize}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCard;

const Sizes = ({
  sizes,
  currentItem,
  selectedSize,
  SetSelectedSize,
}: {
  sizes: Size[];
  currentItem: productWithRelation;
  selectedSize: Size;
  SetSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
}) => {
  return (
    <RadioGroup defaultValue="option-one">
      {sizes.map((size, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border border-gray-100 py-4 px-2 bg-slate-50 "
        >
          <RadioGroupItem
            value={selectedSize.name}
            checked={size.id === selectedSize.id}
            onClick={() => SetSelectedSize(size)}
            id={size.id}
          />
          <Label className="font-bold" htmlFor={size.id}>
            {size.name}

            <span className="px-0.5">
              {" "}
              {formatCurrency(size.price + currentItem.basePrice)}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

const Extras = ({
  extras,
  selectedExtras,
  setSelectedExtras,
}: {
  extras: Extra[];
  selectedExtras: Extra[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>>;
}) => {
  const handelExtra = (currentExtra: Extra) => {
    if (selectedExtras.find((el) => el.id === currentExtra.id)) {
      const filterdSelectedExtras = selectedExtras.filter(
        (e) => e.id !== currentExtra.id,
      );
      setSelectedExtras(filterdSelectedExtras);
    } else {
      setSelectedExtras((prev) => [...prev, currentExtra]);
    }
  };
  return (
    <div className="">
      {extras.map((item, index) => (
        // <FieldGroup key={index} className="mx-auto w-56 ">
        <div
          key={index}
          className="w-full flex items-center justify-start space-x-3 my-2 border border-gray-100 py-4 px-2 bg-slate-50"
        >
          <Checkbox
            id={item.id}
            name={item.name}
            checked={Boolean(
              selectedExtras.find((extra) => extra.id === item.id),
            )}
            onClick={() => handelExtra(item)}
          />
          <FieldLabel className="font-bold" htmlFor={item.id}>
            {item.name} {formatCurrency(item.price)}
          </FieldLabel>
        </div>
      ))}
    </div>
  );
};

const ChooseQuantity = ({
  quantity,
  item,
  selectedExtras,
  selectedSize,
}: {
  quantity: number;
  selectedExtras: Extra[];
  selectedSize: Size;
  item: productWithRelation;
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center flex-col gap-2 mt-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
        >
          -
        </Button>
        <div>
          <span className="text-black">{quantity} in cart</span>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            dispatch(
              addItemToCart({
                basePrice: item.basePrice,
                id: item.id,
                image: item.image,
                name: item.name,
                extras: selectedExtras,
                size: selectedSize,
              }),
            )
          }
        >
          +
        </Button>
      </div>
      <Button
        size="sm"
        onClick={() => dispatch(deleteSingleItemFromCart({ id: item.id }))}
      >
        Remove
      </Button>
    </div>
  );
};
