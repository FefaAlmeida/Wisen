"use client";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("../artigo"));
export default Demo;
