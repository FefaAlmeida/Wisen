"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
};

const Hero33 = () => {
  return (
    <section className="dark relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videoFundo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-1 bg-linear-to-t from-black/80 via-black/30 to-black/50" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-28 pb-10 lg:px-8 lg:pb-16 xl:px-16">
        <motion.div
          {...fadeIn}
          className="flex w-full flex-col gap-4 lg:gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="flex flex-col gap-4 max-w-137">
            <Badge
              variant="outline"
              className="h-7 w-fit rounded-full px-3 py-1 text-sm font-normal border-foreground"
            >
              Comunidade Culinária
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
              Descobre receitas incríveis e partilha a tua opinião com quem ama cozinhar.
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-8 max-w-122.5 lg:shrink-0">
            <p className="text-base sm:text-lg text-foreground">
              Encontra inspiração para o teu dia a dia, aprende truques de preparação e consulta as
              avaliações da nossa comunidade antes de colocar as mãos na massa.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="group h-10 w-full rounded-full px-5 font-medium text-foreground bg-background hover:bg-background/80 sm:w-fit">
                Explorar Receitas
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button className="group h-10 w-full rounded-full px-5 font-medium hover:bg-primary/90 sm:w-fit">
                Partilhar Receita
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero33;
