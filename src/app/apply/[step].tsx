import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "@/context/FormContext";
import QuestionPage from "@/components/QuestionPage";
import { useMemo, useState } from "react";

const questions = [
  {
    key: "unityExperience",
    question: "Do you have experience coding in Unity and/or C#?",
    inputType: "radio",
    options: ["Yes", "No"],
  },
  {
    key: "openToLearning",
    question:
      "If not, are you open to learning and possibly starting as an intern or contributor?",
    inputType: "radio",
    options: ["Yes", "No"],
  },
  {
    key: "vrArExperience",
    question:
      "Have you worked on any VR, AR, or simulation-based projects before? If so, feel free to share links or details!",
    inputType: "textarea",
  },
  {
    key: "interestAreas",
    question:
      "What areas are you most interested in working on? (e.g. VR development, AI/ML, simulation design, backend, UX/UI, etc.)",
    inputType: "textarea",
  },
  {
    key: "safeAgreement",
    question:
      "Are you okay with a SAFE (Simple Agreement for Future Equity) agreement, as this is an equity-based position only at this stage?",
    inputType: "radio",
    options: ["Yes", "No"],
  },
  {
    key: "weeklyHours",
    question: "How many hours per week could you realistically dedicate to this?",
    inputType: "input",
    inputProps: { type: "number", min: 1, max: 80 },
  },
  {
    key: "vrHeadsetAccess",
    question:
      "Do you currently have access to a VR headset (Meta Quest, Apple Vision Pro, etc.)?",
    inputType: "radio",
    options: ["Yes", "No"],
  },
  {
    key: "excitement",
    question: "What excites you most about Syntex or this type of work?",
    inputType: "textarea",
  },
  {
    key: "involvement",
    question:
      "Are you more interested in short-term project experience, long-term involvement, or seeing where it goes?",
    inputType: "radio",
    options: [
      "Short-term project experience",
      "Long-term involvement",
      "Seeing where it goes",
    ],
  },
];

const ApplyStepPage = ({ params }: { params: { step: string } }) => {
  const router = useRouter();
  const { answers, setAnswer } = useFormContext();
  const stepIndex = useMemo(() => {
    const idx = parseInt(params.step, 10) - 1;
    return isNaN(idx) ? 0 : Math.max(0, Math.min(idx, questions.length - 1));
  }, [params.step]);
  const q = questions[stepIndex];
  const [touched, setTouched] = useState(false);
  const value = answers[q.key as keyof typeof answers] || "";
  const isLast = stepIndex === questions.length - 1;
  const isFirst = stepIndex === 0;

  const handleNext = () => {
    setTouched(true);
    if (!value) return;
    if (isLast) {
      router.push("/apply/complete");
    } else {
      router.push(`/apply/${stepIndex + 2}`);
    }
  };
  const handleBack = () => {
    if (!isFirst) router.push(`/apply/${stepIndex}`);
  };

  return (
    <QuestionPage
      question={q.question}
      onNext={handleNext}
      onBack={!isFirst ? handleBack : undefined}
      disableNext={!value}
      progress={stepIndex + 1}
      total={questions.length}
    >
      {q.inputType === "radio" && q.options && (
        <div className="flex flex-col gap-2 mt-2">
          {q.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={q.key}
                value={opt}
                checked={value === opt}
                onChange={() => setAnswer(q.key as any, opt)}
                className="accent-blue-600"
                tabIndex={0}
                aria-label={opt}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}
      {q.inputType === "textarea" && (
        <textarea
          className="w-full min-h-[80px] rounded border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => setAnswer(q.key as any, e.target.value)}
          tabIndex={0}
          aria-label={q.question}
        />
      )}
      {q.inputType === "input" && (
        <input
          className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => setAnswer(q.key as any, e.target.value)}
          tabIndex={0}
          aria-label={q.question}
          {...q.inputProps}
        />
      )}
      {touched && !value && (
        <div className="text-red-500 text-sm mt-2">This field is required.</div>
      )}
    </QuestionPage>
  );
};

export default ApplyStepPage;
