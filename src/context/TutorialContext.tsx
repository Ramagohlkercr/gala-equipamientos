import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TUTORIAL_STEPS } from '../data/tutorialSteps';
import { TutorialStep } from '../types/tutorial';

interface TutorialContextType {
  isOpen: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep;
  totalSteps: number;
  startTutorial: (stepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeTutorial: () => void;
  goToStep: (index: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = TUTORIAL_STEPS[currentStepIndex] || TUTORIAL_STEPS[0];
  const totalSteps = TUTORIAL_STEPS.length;

  // Navigate when step changes if needed
  const syncNavigationForStep = useCallback(
    (step: TutorialStep) => {
      const targetPath = step.route.split('?')[0];
      const targetSearch = step.route.includes('?') ? '?' + step.route.split('?')[1] : '';
      const currentPath = location.pathname;
      const currentSearch = location.search;

      if (currentPath !== targetPath || (targetSearch && currentSearch !== targetSearch)) {
        navigate(step.route);
      }
    },
    [location.pathname, location.search, navigate]
  );

  const startTutorial = useCallback(
    (stepIndex: number = 0) => {
      const idx = Math.max(0, Math.min(stepIndex, totalSteps - 1));
      setCurrentStepIndex(idx);
      setIsOpen(true);
      syncNavigationForStep(TUTORIAL_STEPS[idx]);
    },
    [syncNavigationForStep, totalSteps]
  );

  const closeTutorial = useCallback(() => {
    setIsOpen(false);
    // Remove highlight classes from any highlighted element
    document.querySelectorAll('.tour-highlight-active').forEach(el => {
      el.classList.remove('tour-highlight-active');
    });
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      syncNavigationForStep(TUTORIAL_STEPS[nextIdx]);
    } else {
      closeTutorial();
    }
  }, [closeTutorial, currentStepIndex, syncNavigationForStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      syncNavigationForStep(TUTORIAL_STEPS[prevIdx]);
    }
  }, [currentStepIndex, syncNavigationForStep]);

  const goToStep = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, totalSteps - 1));
      setCurrentStepIndex(validIndex);
      syncNavigationForStep(TUTORIAL_STEPS[validIndex]);
    },
    [syncNavigationForStep, totalSteps]
  );

  return (
    <TutorialContext.Provider
      value={{
        isOpen,
        currentStepIndex,
        currentStep,
        totalSteps,
        startTutorial,
        nextStep,
        prevStep,
        closeTutorial,
        goToStep,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = (): TutorialContextType => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
