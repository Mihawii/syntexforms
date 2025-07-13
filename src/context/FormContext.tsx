"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type FormAnswers = {
  fullName?: string;
  location?: string;
  contactInfo?: string;
  unityExperience?: string;
  openToLearning?: string;
  vrArExperience?: string;
  interestAreas?: string;
  safeAgreement?: string;
  weeklyHours?: string;
  vrHeadsetAccess?: string;
  excitement?: string;
  involvement?: string;
};

interface FormContextType {
  answers: FormAnswers;
  setAnswer: (key: keyof FormAnswers, value: string) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<FormAnswers>({});

  const setAnswer = (key: keyof FormAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setAnswers({});

  return (
    <FormContext.Provider value={{ answers, setAnswer, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}; 