import React from "react";
import Navbar from "../components/Navbar";
import "../css/global.css";
import Hero from "../components/Hero";
import CVE from "../components/News";
import Features from "../components/Feaures";

const Home = () => {
  const links = [
    {
      title: "Home",
      redirect: "/",
    },
    {
      title: "About",
      redirect: "/about",
    },
    {
      title: "Documentation",
      redirect: "/documentation",
    },
    {
      title: "Contribute",
      redirect: "https://github.com/syncattacker/ProjectSafeLink",
    },
    {
      title: "Team",
      redirect: "/meet-the-team",
    },
  ];

  return (
    <>
      <Navbar links={links} />
      <Hero />
      <CVE />
      <Features />
    </>
  );
};

export default Home;