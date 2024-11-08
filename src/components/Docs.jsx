import React, { useState, useRef, useEffect } from "react";
import "../css/global.css";
import "../css/components-css/SidePanel.css";
import Documentation from "../img/documentation/documentation.png";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import AbstractContent from "../content/AbstractContent";
import WhatsPhishingContent from "../content/WhatsPhishingContent";
import DetectionAndPreventionContent from "../content/DetectionAndPreventionContent";
import MotiveContent from "../content/MotiveContent";
import BenifitsContent from "../content/BenifitsContent";
import FeaturesContent from "../content/FeaturesContent";
import DiagramContent from "../content/DiagramContent";
import SitemapContent from "../content/SitemapContent";
import Abstract from "../img/documentation/phishing-content.png";
import WhatContent from "../img/documentation/what-content.png";
import Detection from "../img/documentation/detection-content.png";
import Motive from "../img/documentation/motive-content.png";
import benifit from "../img/documentation/benifit.png";
import Features from "../img/documentation/Features.png";
import Diagram from "../img/documentation/Diagram.png";
import Sitemap from "../img/documentation/Sitemap.png";

export default function Docs() {
  const [selectedSection, setSelectedSection] = useState("Introduction");
  const [selectedSubtopic, setSelectedSubtopic] = useState("Abstract");
  const [expandedSections, setExpandedSections] = useState({
    Introduction: true,
  });

  const headers = [
    {
      text: "Introduction",
      subtopics: [
        {
          image: Abstract,
          name: "Abstract",
          content: AbstractContent,
        },
        {
          image: WhatContent,
          name: "What's Phishing ?",
          content: WhatsPhishingContent,
        },
        {
          image: Detection,
          name: "Detect & Prevent",
          content: DetectionAndPreventionContent,
        },
        {
          image: Motive,
          name: "Motive",
          content: MotiveContent,
        },
      ],
    },
    {
      text: "Model",
      subtopics: [
        { image: benifit, name: "Benefits", content: BenifitsContent },
        { image: Features, name: "Features", content: FeaturesContent },
      ],
    },
    {
      text: "Model Diagram",
      subtopics: [{ image: Diagram, name: "Diagram", content: DiagramContent }],
    },
    {
      text: "Site Mapping",
      subtopics: [
        { image: Sitemap, name: "Site Map", content: SitemapContent },
      ],
    },
  ];

  const subtopicRefs = useRef({});
  headers.forEach((header) => {
    header.subtopics.forEach((subtopic) => {
      if (!subtopicRefs.current[subtopic.name]) {
        subtopicRefs.current[subtopic.name] = React.createRef();
      }
    });
  });

  useEffect(() => {
    if (subtopicRefs.current[selectedSubtopic]) {
      subtopicRefs.current[selectedSubtopic].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSubtopic]);

  const handleSectionClick = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubtopicClick = (section, subtopic) => {
    setSelectedSection(section);
    setSelectedSubtopic(subtopic);
  };

  return (
    <div className="side-container">
      <div className="side-panel">
        <div className="docs">
          <img
            src={Documentation}
            alt="Documentation Of Next Gen AI For Phishing Detection"
            className="docs-image"
          />
          <div className="info">
            <h1 className="docs-text-heading">docs</h1>
            <p className="version">
              <span className="release">Release</span> 1.0
            </p>
          </div>
        </div>
        <div className="panel">
          {headers.map((header, index) => (
            <div key={index}>
              <div
                className={`panel-header ${
                  expandedSections[header.text] ? "expanded" : ""
                }`}
                onClick={() => handleSectionClick(header.text)}
              >
                <div className="arrow">
                  {expandedSections[header.text] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronUp />
                  )}
                </div>
                <h2 className="panel-headings">{header.text}</h2>
              </div>
              <ul
                className={`subtopics ${
                  expandedSections[header.text] ? "show" : ""
                }`}
              >
                {header.subtopics.map((subtopic, idx) => (
                  <li
                    key={idx}
                    onClick={() =>
                      handleSubtopicClick(header.text, subtopic.name)
                    }
                    className={
                      selectedSubtopic === subtopic.name &&
                      selectedSection === header.text
                        ? "list-hover selected"
                        : "list-hover"
                    }
                  >
                    {subtopic.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="content">
        {headers.map((header) =>
          header.subtopics.map((subtopic) => (
            <div
              key={subtopic.name}
              ref={subtopicRefs.current[subtopic.name]}
              className="main-content"
            >
              <div className="style-docs">
                <div>
                  <p className="subtopics-name">{subtopic.name}</p>
                </div>
                <div>
                  <img
                    src={subtopic.image}
                    alt="Phishing Example"
                    className="docs-content-image"
                  />
                </div>
              </div>
              <div className="main-para">{subtopic.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
