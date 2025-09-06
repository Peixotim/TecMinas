"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full min-h-[600px] h-[600px]">
      <div>
        <picture className="absolute inset-0 -z-10 w-full h-full py-28 ">
          <source srcSet="/1940x600.png" media="(max-width: 1940px)" />
          <source srcSet="/1920x600.png" media="(max-width: 1920px)" />
          <source srcSet="/1024x600.png" media="(min-width: 1024px)" />
          <source srcSet="/768x690.png" media="(max-width: 768px)" />
          <Image
            src="/1920x600.png"
            alt="Hero Background"
            width={1920}
            height={1000}
          />
        </picture>
      </div>
      <div className="flex flex-col items-start justify-end h-full">
        <div
          className="
         items-center space-x-4 px-20 hidden md:block max-sm:hidden"
        >
          <Button
            asChild
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6"
          >
            <Link href="/#cursos">Comece agora</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-none hover:bg-transparent text-white hover:text-white  font-bold text-lg px-8 py-6"
          >
            <Link href="/#cursos">Cursos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
