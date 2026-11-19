"use client";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("../paginaEvento"));
export default Demo;
