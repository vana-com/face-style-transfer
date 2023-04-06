import { useState } from "react";
import Image from "next/image";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function MonaLisaImageSelector() {
  const [number, setNumber] = useState(1);

  return (
    <div className="mt-2 mx-auto w-96">
      <div
        className="flex relative w-96 h-96"
        style={{
          boxShadow: "1px 1px 20px rgba(0,0,0,.3)",
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <Image
            src={`/images/vertumnus-dalle-${n}.png`}
            fill
            className={classNames(
              number === n ? "opacity-100" : "opacity-0",
              "transition duration-200 ease-in-out"
            )}
          />
        ))}

        {/* Back and forward buttons */}
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2
        bg-gray-100/50 backdrop-filter backdrop-blur-lg rounded-full p-2"
          onClick={() => {
            if (number === 1) return;
            setNumber(number - 1);
          }}
        >
          <span className="sr-only">Back</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2
        bg-gray-100/50 backdrop-filter backdrop-blur-lg rounded-full p-2"
          onClick={() => {
            if (number === 4) return;
            setNumber(number + 1);
          }}
        >
          <span className="sr-only">Forward</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <span className="font-light text-sm text-gray-500 text-right ml-auto block mt-2">
        You weren&apos;t expecting the real Vertumnus, were you?
      </span>
    </div>
  );
}
