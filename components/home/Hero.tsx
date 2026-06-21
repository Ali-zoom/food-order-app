import Image from "next/image";
import React from "react";
import PizzaImage from "@/public/assets/images/pizza.png";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="section-gap">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="py-12">
          <h1 className="font-semibold text-4xl">Slice Into Happeness</h1>
          <p className="text-accent mb-4">
            Craving pizza, got you with fresh ingradents and happpy cheese and
            live and fastes delivery ever by our company
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-start w-fit px-4 py-2  rounded-full bg-primary text-white uppercase space-x-2">
              <Link href={"/menu"}>order now</Link>
              <FiArrowRightCircle size={20} />
            </div>

            <div className="flex items-center justify-start w-fit space-x-1">
              <Link
                className="  font-semibold  text-black lowercase"
                href={"/menu"}
              >
                learn more
              </Link>
              <FiArrowRightCircle className="text-black" size={20} />
            </div>
          </div>
        </div>
        <div className="relative  hidden md:block">
          <Image
            className="object-contain"
            src={PizzaImage}
            alt="pizza"
            fill
            loading="eager"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
