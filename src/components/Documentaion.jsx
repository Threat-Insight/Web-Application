import React, { useState } from "react";
import Navbar from "./Navbar";
import "../css/components-css/Documentation.css";
import { IoIosArrowDown } from "react-icons/io";
import DocumentationLogo from "../img/documentations/documentation.png";

export default function Documentation() {
  const [selectedSubheading, setSelectedSubheading] = useState(
    "Introduction.Abstract"
  );
  const [openHeadings, setOpenHeadings] = useState({
    Introduction: true,
    "AI Model": true,
    "AI Model Diagram": true,
    Sitemapping: true,
  });

  const content = {
    Introduction: {
      Abstract: "Content about abstract...",
      "What's Phishing": "Content about phishing...",
      "Detection and Prevention": "Content about detection and prevention...",
      Motive: "Content about motive...",
    },
    "AI Model": {
      Benefits: "Content about benefits...",
      Features: "Content about all features...",
    },
    "AI Model Diagram": {
      Diagram: "Content about AI Model Diagram...",
    },
    Sitemapping: {
      Sitemap: "Content about Sitemap...",
    },
  };

  const handleHeadingClick = (heading) => {
    setOpenHeadings((prevOpenHeadings) => ({
      ...prevOpenHeadings,
      [heading]: !prevOpenHeadings[heading],
    }));
  };

  const handleSubheadingClick = (subheading) => {
    setSelectedSubheading(subheading);
  };

  const renderSubheadings = (heading) => {
    return Object.keys(content[heading]).map((subheading) => {
      const fullSubheading = `${heading}.${subheading}`;
      return (
        <div
          key={fullSubheading}
          className={`subheading ${
            selectedSubheading === fullSubheading ? "selected" : ""
          }`}
          onClick={() => handleSubheadingClick(fullSubheading)}
        >
          {subheading}
        </div>
      );
    });
  };
  const renderContent = () => {
    const [heading, subheading] = selectedSubheading.split(".");
    if (subheading in content[heading]) {
      return <p>{content[heading][subheading]}</p>;
    }
    return null;
  };
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
      <div className="flex">
        <div className="left-pane">
          <div className="logos">
            <img
              src={DocumentationLogo}
              alt="Docs Logo"
              className="docs-logo"
            />
            <h1 className="header-title">Docs</h1>
          </div>
          <div className="scrollable">
            {Object.keys(content).map((heading) => (
              <div key={heading}>
                <div
                  className={`heading ${openHeadings[heading] ? "active" : ""}`}
                  onClick={() => handleHeadingClick(heading)}
                >
                  {heading}
                  <IoIosArrowDown
                    className={`arrow ${openHeadings[heading] ? "open" : ""}`}
                  />
                </div>
                {openHeadings[heading] && renderSubheadings(heading)}
              </div>
            ))}
          </div>
        </div>
        <div className="right-pane">
          <div className="content">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
