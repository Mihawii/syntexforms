"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type QuestionPageProps = {
  question: string;
  children: ReactNode;
  progress: number;
  total: number;
};

const animationVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.3 } },
};

const QuestionPage = ({
  question,
  children,
  progress,
  total,
}: QuestionPageProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 gap-8"
      variants={animationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      tabIndex={0}
      aria-label="Question page"
    >
      <div className="w-full flex flex-col gap-4">
        <div className="text-xs text-gray-500 mb-2">Step {progress} of {total}</div>
        <h2 className="text-2xl font-semibold mb-4">{question}</h2>
        <div>{children}</div>
      </div>
    </motion.div>
  );
};

export default QuestionPage; 