import { useState } from "react";
import FixedImage from "./FixedImage";
import ScrollytellingOne from "./ScrollytellingOne";
import ScrollytellingTwo from "./ScrollytellingTwo";
import MainProse from "./MainProse";

export default function Scrollytelling() {
  const [step, setStep] = useState(0);

  return (
    <>
      {/* <h1 className="fixed top-0">Current step: {step}</h1> */}
      <div className="flex flex-col-reverse lg:flex-row">
        <ScrollytellingOne step={step} setStep={setStep} />
        <FixedImage
          step={step}
          src={
            step >= 5
              ? "/images/vertumnus-nick-cage.png"
              : "/images/vertumnus-square.jpg"
          }
          alt={"Vertumnus"}
        />
      </div>
      <MainProse />
      <div className="flex flex-col-reverse lg:flex-row">
        <ScrollytellingTwo step={step} setStep={setStep} />
        <FixedImage
          step={step}
          src={
            step >= 5
              ? "/images/vertumnus-nick-cage.png"
              : "/images/vertumnus-square.jpg"
          }
          alt={"Vertumnus"}
        />
      </div>
    </>
  );
}
