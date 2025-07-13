"use client";
import { useFormContext } from "@/context/FormContext";
import QuestionPage from "@/components/QuestionPage";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ClickSpark from "@/components/ClickSpark";
import StarBorder from "@/components/StarBorder";

const LOGO_PATH = "/branding/logo.svg"; // Place your logo here

const questions = [
  {
    key: "fullName",
    question: "What is your full name?",
    inputType: "input",
    inputProps: { type: "text", placeholder: "Full Name" },
  },
  {
    key: "location",
    question: "Where are you located? (City, Country)",
    inputType: "input",
    inputProps: { type: "text", placeholder: "City, Country" },
  },
  {
    key: "contactInfo",
    question: "How can we contact you? (Email or Phone)",
    inputType: "input",
    inputProps: { type: "text", placeholder: "Email or Phone" },
  },
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
    inputProps: { type: "number", min: 1, max: 80, placeholder: "Hours per week" },
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

const cardBg = "bg-neutral-900/95";
const cardBorder = "border border-white";
const progressBarBg = "bg-white/30";
const progressBarFill = "bg-white";
const buttonPrimary = "bg-white text-black border border-white hover:bg-neutral-100 focus:ring-white";
const buttonSecondary = "bg-transparent text-white border border-white hover:bg-white hover:text-black focus:ring-white";

const ProgressBar = ({ progress, total }: { progress: number; total: number }) => (
  <div className="w-full mb-8">
    <div className={`h-3 ${progressBarBg} rounded-full overflow-hidden shadow-md border border-white`}>
      <motion.div
        className={`h-3 ${progressBarFill} rounded-full shadow-lg`}
        initial={{ width: 0 }}
        animate={{ width: `${(progress / total) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
    <div className="text-xs text-white mt-1 text-center font-semibold tracking-wide drop-shadow">
      Step {progress} of {total}
    </div>
  </div>
);

const ReviewPage = ({ onBack, onSubmit, answers, submitting }: any) => (
  <motion.div
    className={`flex flex-col items-center justify-center min-h-[60vh] w-full max-w-xl mx-auto ${cardBg} rounded-3xl shadow-2xl p-10 gap-8 backdrop-blur-md ${cardBorder}`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    <h2 className="text-3xl font-bold mb-4 text-white drop-shadow">Review your answers</h2>
    <ul className="w-full flex flex-col gap-4">
      {questions.map((q) => (
        <li key={q.key} className="flex flex-col">
          <span className="font-medium text-white drop-shadow">{q.question}</span>
          <span className="text-white/80 mt-1">{answers[q.key] || <span className="italic text-white/60">No answer</span>}</span>
        </li>
      ))}
    </ul>
    <div className="flex w-full justify-between mt-8">
      <motion.button
        type="button"
        onClick={onBack}
        className={`px-7 py-3 rounded-full ${buttonSecondary} focus:outline-none focus:ring-2 focus:ring-offset-2 text-base font-semibold shadow-md`}
        whileTap={{ scale: 0.95 }}
        tabIndex={0}
        aria-label="Go back to last question"
      >
        Back
      </motion.button>
      <motion.button
        type="button"
        onClick={onSubmit}
        className={`px-7 py-3 rounded-full ${buttonPrimary} focus:outline-none focus:ring-2 focus:ring-offset-2 text-base font-semibold shadow-lg disabled:opacity-60`}
        whileTap={{ scale: 0.97 }}
        disabled={submitting}
        tabIndex={0}
        aria-label="Submit application"
      >
        {submitting ? "Submitting..." : "Submit"}
      </motion.button>
    </div>
  </motion.div>
);

export default function Home() {
  const { answers, setAnswer, resetForm } = useFormContext();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const q = questions[step];
  const value = answers[q?.key as keyof typeof answers] || "";
  const isLast = step === questions.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (!value) return;
    setStep((s) => s + 1);
  };
  const handleBack = () => {
    if (!isFirst) setStep((s) => s - 1);
  };
  const handleSubmit = async () => {
    setSubmitting(true);
    await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    setSubmitting(false);
    setSubmitted(true);
    resetForm();
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto bg-neutral-900/95 rounded-3xl shadow-2xl p-16 gap-8 border border-white">
          <h2 className="text-4xl font-bold mb-4 text-white text-center">Thank you for applying!</h2>
          <p className="text-lg text-white/80 text-center max-w-lg">We appreciate your interest. We'll review your application and get back to you soon.</p>
        </div>
      </div>
    );
  }

  if (step === questions.length) {
    return <ReviewPage onBack={() => setStep(step - 1)} onSubmit={handleSubmit} answers={answers} submitting={submitting} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-8 animate-fade-in">
      <motion.div
        className={`w-full max-w-xl rounded-3xl shadow-2xl ${cardBg} p-10 backdrop-blur-md ${cardBorder} relative`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Logo at the top, transparent background, no border, not cropped */}
        <div className="flex justify-center mb-6">
          <Image
            src={(() => {
              try {
                require("../../public/branding/logo.png");
                return "/branding/logo.png";
              } catch {}
              try {
                require("../../public/branding/logo.jpg");
                return "/branding/logo.jpg";
              } catch {}
              try {
                require("../../public/branding/logo.jpeg");
                return "/branding/logo.jpeg";
              } catch {}
              return "/branding/logo.svg";
            })()}
            alt="Logo"
            width={96}
            height={96}
            className="object-contain"
            priority
            style={{ background: 'transparent', objectFit: 'contain', display: 'block' }}
          />
        </div>
        <ProgressBar progress={step + 1} total={questions.length + 1} />
        <AnimatePresence mode="wait" initial={false}>
          <QuestionPage
            key={q.key}
            question={q.question}
            onNext={isLast ? () => setStep(step + 1) : handleNext}
            onBack={!isFirst ? handleBack : undefined}
            disableNext={!value}
            progress={step + 1}
            total={questions.length + 1}
          >
            {q.inputType === "radio" && q.options && (
              <div className="flex flex-col gap-2 mt-2">
                {q.options.map((opt) => (
                  <motion.label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer rounded-full px-4 py-2 transition-colors bg-neutral-800/80 hover:bg-white/10 border border-white"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name={q.key}
                      value={opt}
                      checked={value === opt}
                      onChange={() => setAnswer(q.key as any, opt)}
                      className="accent-white rounded-full w-5 h-5 border border-white"
                      tabIndex={0}
                      aria-label={opt}
                    />
                    <span className="text-base font-medium text-white drop-shadow">{opt}</span>
                  </motion.label>
                ))}
              </div>
            )}
            {q.inputType === "textarea" && (
              <motion.textarea
                className="w-full min-h-[100px] rounded-2xl border border-white p-3 focus:outline-none focus:ring-2 focus:ring-white text-base shadow-sm bg-neutral-800/60 text-white placeholder:text-white/60"
                value={value}
                onChange={(e) => setAnswer(q.key as any, e.target.value)}
                tabIndex={0}
                aria-label={q.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            )}
            {q.inputType === "input" && (
              <motion.input
                className="w-full rounded-full border border-white p-3 focus:outline-none focus:ring-2 focus:ring-white text-base shadow-sm bg-neutral-800/60 text-white placeholder:text-white/60"
                value={value}
                onChange={(e) => setAnswer(q.key as any, e.target.value)}
                tabIndex={0}
                aria-label={q.question}
                {...q.inputProps}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            )}
            {/* Only show the bottom row of navigation buttons, styled as transparent with white border and text */}
            <div className="flex w-full justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirst}
                className="w-32 px-6 py-3 rounded-full border border-white text-white bg-transparent hover:bg-white/10 transition-colors duration-200 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-40"
                style={{ cursor: isFirst ? "not-allowed" : "pointer" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={isLast ? () => setStep(step + 1) : handleNext}
                disabled={!value}
                className="w-32 px-6 py-3 rounded-full border border-white text-white bg-transparent hover:bg-white/10 transition-colors duration-200 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-40"
                style={{ cursor: !value ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </QuestionPage>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
