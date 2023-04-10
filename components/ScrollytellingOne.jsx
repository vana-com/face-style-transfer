import StepContainer from "./StepContainer";
import StepContent from "./StepContent";
import StepTitle from "./StepTitle";
import IntersectionObserver from "./IntersectionObserver";
import ParagraphText from "./ParagraphText";

export default function ScrollytellingOne({ step, setStep }) {
  return (
    <div className="flex flex-col justify-center items-center px-0 lg:px-4 z-10 w-full">
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(0)}>
          <StepContent centered>
            <StepTitle>This is an image.</StepTitle>
            <ParagraphText>
              You may recognize it as "Vertumnus", an oil painting created by
              Giuseppe Arcimboldo in 1591.
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(1)}>
          <StepContent>
            <ParagraphText>
              For a human, recognizing this image is a simple task. But how does
              a computer recognize Vertumnus?
            </ParagraphText>
            <ParagraphText>
              Consider the overlayed, computer-generated text description, which
              was made by CLIP, a{" "}
              <a
                href="https://news.mit.edu/2017/explained-neural-networks-deep-learning-0414"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                neural network
              </a>{" "}
              that was trained to recognize images.
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(2)}>
          <StepContent>
            <ParagraphText>
              There are some things that the computer can recognize, like the
              fact that the painting's subject has fruits and vegetables on his
              head, and that the portrait was painted by Giuseppe Arcimboldo.
            </ParagraphText>
            <ParagraphText>
              But there are some things the model{" "}
              <span className="font-bold text-red-700">gets wrong</span>, like
              its guess that Arcimboldo's subject was Breaking Bad's Walter
              White.
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <StepContainer>
        <IntersectionObserver onIntersect={() => setStep(2)}>
          <StepContent>
            <ParagraphText>
              Regardless of its quirks, this text output tells us a lot about{" "}
              <span className="font-bold">how a computer thinks.</span> We can
              notice common phrases, and the elements that a computer thinks are
              important.
            </ParagraphText>
            <ParagraphText>
              Learning the language of computers is a good first step to a new
              and growing field of work:{" "}
              <span className="font-bold">prompt engineering.</span>
            </ParagraphText>
          </StepContent>
        </IntersectionObserver>
      </StepContainer>
      <div className="h-40 w-full bg-transparent" />
    </div>
  );
}
