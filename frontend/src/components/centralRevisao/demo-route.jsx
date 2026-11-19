"use client";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("@/components/demo/paginaRevisoes"));
export default Demo;
