"use client";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("../paginaBiblioteca"));
export default Demo;
