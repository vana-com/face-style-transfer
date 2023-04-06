import { useEffect } from "react";
import Image from "next/image";
import RightWord from "./RightWord";
import WrongWord from "./WrongWord";
import { AnimatePresence, motion, useSpring } from "framer-motion";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export default function FixedImage({ step, src, alt }) {
  const imageTranslateY = useSpring(0, {
    stiffness: 60,
    damping: 10,
    mass: 0.5,
    ease: "easeOut",
  });

  const imageOpacity = useSpring(1, {
    stiffness: 60,
    damping: 10,
    mass: 0.5,
    ease: "easeOut",
  });

  useEffect(() => {
    if (step === 0) {
      //   imageTranslateY.set(0);
      imageOpacity.set(1);
    }
    if (step === 1) {
      //   imageTranslateY.set(-20);
      imageOpacity.set(1);
    }

    if (step === 2) {
      imageOpacity.set(1);
    }

    if (step === 3) {
      imageOpacity.set(1);
    }

    if (step === 4) {
      imageOpacity.set(0);
    }

    if (step === 5) {
      imageOpacity.set(0);
    }

    if (step === 6) {
      imageOpacity.set(1);
    }
  }, [step]);

  return (
    <div className="sticky top-0 z-1 h-screen w-full flex flex-col justify-center items-center">
      <motion.div style={{ y: imageTranslateY, opacity: imageOpacity }} layout>
        <div
          className="rounded-md overflow-hidden"
          style={{ boxShadow: "1px 1px 20px black" }}
        >
          {/* https://www.instagram.com/p/CoJ35DXBB48/ */}
          {/* <Image src="/images/rozy.jpg" alt="Rozy" width={500} height={500} /> */}
          <Image src={src} alt={alt} width={500} height={500} />
        </div>
      </motion.div>
      <p
        className={classNames(
          "absolute top-[36.5%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-max bg-black/50 backdrop-filter backdrop-blur-lg p-4 text-white font-light text-md max-w-[500px] text-left leading-snug transition duration-500 ease-in-out w-full",
          step >= 5 && step < 6 ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-lg font-bold">
          a portrait of <span className="font-serif">Nicolas Cage</span> in the
          style of...
        </span>
      </p>
      <p
        className={classNames(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-max bg-black/50 backdrop-filter backdrop-blur-lg p-4 text-white font-light text-md max-w-[500px] text-left leading-snug transition duration-500 ease-in-out w-full",
          step >= 1 && step < 6 ? "opacity-100" : "opacity-0"
        )}
      >
        <RightWord step={step}>
          a painting of a person with fruit and vegetables on their head, by
          Giuseppe Arcimboldo, arcimboldo giuseppe, giuseppe arcimboldo
        </RightWord>{" "}
        <WrongWord step={step}>walter white</WrongWord>,{" "}
        <RightWord step={step}>
          inspired by Giuseppe Arcimboldo, by Arcimboldo, inspired by
          Arcimboldo, by Lucas Cranach the Younger, by Lucas Cranach the Elder
        </RightWord>
      </p>
    </div>
  );
}
