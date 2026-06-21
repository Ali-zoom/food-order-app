import React from "react";

const About = () => {
  return (
    <section className="section-gap">
      <div className="text-center">
        <p className="text-accent font-bold py-3">Our Story</p>
        <h1 className="text-3xl font-semibold text-primary">About Us</h1>
      </div>

      <div className="mt-4 mx-auto max-w-1/3 flex flex-col items-center justify-center gap-4">
        <p>
          Welcome to our pizzeria, where we serve the finest pizzas made with
          the freshest ingredients. Every slice is a masterpiece, crafted with
          care to deliver the perfect balance of flavors. From classic favorites
          to unique creations, there&apos;s something for every pizza lover!
        </p>
        {/* <p>
          Our passion for pizza shines through every dish. We hand-pick the best
          local ingredients and bake them to perfection, ensuring that every
          bite is delicious and satisfying. Whether you&apos;re here for a quick
          meal or a relaxed dining experience, we’ve got you covered.
        </p> */}
      </div>
    </section>
  );
};

export default About;
