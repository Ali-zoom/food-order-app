import React from "react";

const Footer = () => {
  return (
    <footer className="container">
      <div className=" border-t p-8 text-center text-accent ">
        © {new Date().getFullYear()} All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
