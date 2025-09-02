"use client";

import React, { useState } from "react";

import EmailSignup from "./components/EmailSignup";

import Image from "next/image";
import Link from "next/link";

import { AtSymbolIcon, EnvelopeIcon, PuzzlePieceIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-5 pb-8">     
      <main className="sm:mt-10 mt-2 flex flex-col row-start-2 items-center sm:items-start mb-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* "Header" */}
           <section id="header" className="flex flex-col sm:gap-4 gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              One Way Tix
            </h1>
            <p className="">
              A documentary feature film <span className="font-bold">10 years</span> in the making.
            </p>
            <p className="yellow-bg">
              <span className="">Anticipated Release{": "}</span>
              <span className="">Jan 22, 2026</span>
            </p>
          </section>
          {/* Synopsis */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 black-bg">SYNPOSIS</h2>
            <p className="leading-relaxed">
              A guy buys a one way ticket to Asia
              {" "}<span className="font-bold">determined to make a documentary</span>{" "}
              with no money, no experience, and no direction. He attempts to show that travel is accessible by
              {" "}<span className="font-bold"> working for food and shelter</span>{" "}
              but his obsession surfaces; being
              {" "}<span className="font-bold"> on the run from materialism.</span>{" "}
              The expedition ends near the Siberian border herding
              cattle. Is the documentary about Jenny? The Monks? Angela, the dead
              piglet? Obama, the unriddeable horse in Mongolia? The Actor? The
              Colorado Dropout? The Deadliest Catch boat? Mysterious characters
              appear and guide him along the way. Overwhelmed, he buries the project. 
              {" "}<span className="font-bold">Six years later</span>{" "}
              later he learns that
              {" "}<span className="font-bold">Asia was only the beginning</span>{" "}
              of becoming a documentary filmmaker.
            </p>
          </section>

          {/* Countries */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 black-bg">COUNTRIES</h2>
            <ul className="grid grid-cols-1 gap-0" style={{fontSize: 16}}>
              {[
                "FRANCE",
                "US",
                "INDONESIA",
                "MALAYSIA",
                "VIET NAM",
                "HONG KONG",
                "NEPAL",
                '"TIBET"',
                "CHINA",
                "MONGOLIA",
              ].map((c) => (
                <li 
                  key={c}
                  className="yellow-bg">
                    {c}
                </li>
              ))}
            </ul>
          </section>

          {/* Trailer */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 black-bg">TRAILER</h2>
            <div className="aspect-video w-full">
              <iframe
                src="https://player.vimeo.com/video/1083081464?title=0&byline=0&portrait=0&badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                title="ONE WAY TIX - Unofficial Trailer"
              ></iframe>
            </div>
          </section>

          {/* Themes */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 black-bg">THEMES</h2>
            <ul className="list-disc list-inside space-y-1">
              {[
                "Escaping Materialism",
                "Animal Consumption",
                "Self-Discovery",
                "Manifestation",
                "Friendship",
                "Adventure",
                "Death",
                "Self-Sabotage",
                "Mental Health",
              ].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Other Info */}
          <section className="mt-10 sm:gap-2 gap-4 sm:gap-0 flex flex-col">
            <p>
              <span className="font-semibold black-bg mr-2">STATUS</span> POST-PRODUCTION
            </p>
            <p className="tracking-wide">
              <span className="font-semibold black-bg mr-4">GENRE</span>This project can be described as <br className="block sm:hidden" /><br className="block sm:hidden" /> <span className="uppercase yellow-bg text-[55px] sm:text-[16px]">guerilla filmmaking</span>
            </p>
            <p className="mt-1 sm:mt-8">Filming began in November 2015, unknowingly.</p>
          </section>

          {/* Form */}
          <EmailSignup />
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center my-2 gap-4 sm:mt-12 sm:mb-0">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.tiktok.com/@onewaytix.documentary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AtSymbolIcon className="h-4 w-4" aria-hidden />
          TikTok
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.kickstarter.com/projects/itsjl/one-way-tickets"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PuzzlePieceIcon className="h-4 w-4" aria-hidden />
          The Kickstarter
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="mailto:jaredlamont90@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <EnvelopeIcon className="h-4 w-4" aria-hidden />
          Contact
        </a>
      </footer>
    </div>
  );
}
