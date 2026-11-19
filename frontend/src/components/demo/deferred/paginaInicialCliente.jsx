"use client";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("../paginaInicialCliente"));
export default Demo;
