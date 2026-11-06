import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTutorial } from '../../context/TutorialContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Compass,
  CheckCircle2,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

export const InteractiveTutorialModal: React.FC = () => {
  const {
    isOpen,
    currentStepIndex,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    closeTutorial,
    goToStep,
  } = useTutorial();

  const navigate = useNavigate();
  const highlightedElRef = useRef<Element | null>(null);

  // Manage highlight on target selector
  useEffect(() => {
    if (!isOpen) {
      if (highlightedElRef.current) {
        highlightedElRef.current.classList.remove('tour-highlight-active');
        highlightedElRef.current = null;
      }
      return;
    }

    // Clear previous
    if (highlightedElRef.current) {
      highlightedElRef.current.classList.remove('tour-highlight-active');
      highlightedElRef.current = null;
    }

    const timer = setTimeout(() => {
      if (currentStep.targetSelector) {
        const el = document.querySelector(currentStep.targetSelector);
        if (el) {
          el.classList.add('tour-highlight-active');
          highlightedElRef.current = el;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (highlightedElRef.current) {
        highlightedElRef.current.classList.remove('tour-highlight-active');
      }
    };
  }, [isOpen, currentStep, currentStepIndex]);

  if (!isOpen) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end sm:justify-end sm:items-end p-3 sm:p-6">
      {/* Semi-transparent non-blocking backdrop that allows user viewing */}
      <div
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs transition-opacity pointer-events-auto"
        onClick={closeTutorial}
        aria-hidden="true"
      />

      {/* Floating Tutorial Card */}
      <div
        className="relative z-50 pointer-events-auto w-full sm:max-w-md bg-gala-surface rounded-2xl border border-gala-border shadow-float overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        {/* Top Progress Bar */}
        <div className="w-full bg-stone-200 h-1.5 overflow-hidden">
          <div
            className="bg-gala-accent h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header */}
        <div className="p-4 sm:p-5 border-b border-gala-border/80 flex items-center justify-between gap-3 bg-white/70">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-gala-accent/20 text-gala-accent-dark">
              <Compass size={16} />
            </span>
            <div>
              <span className="text-[10px] font-bold text-gala-accent-dark tracking-wider uppercase">
                {currentStep.badge || 'Recorrido Interactivo'}
              </span>
              <div className="text-[11px] text-gala-gray font-medium">
                Paso {currentStepIndex + 1} de {totalSteps} ({progressPercent}%)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                closeTutorial();
                navigate('/ayuda');
              }}
              className="text-stone-500 hover:text-gala-black p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-xs flex items-center gap-1"
              title="Abrir centro de ayuda completo"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline text-[11px]">Manual</span>
            </button>
            <button
              onClick={closeTutorial}
              className="text-stone-400 hover:text-gala-black p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Cerrar tutorial"
              title="Cerrar recorrido"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <span className="text-[10px] font-semibold text-gala-gray tracking-wide block uppercase">
              {currentStep.subtitle}
            </span>
            <h3
              id="tutorial-title"
              className="font-serif text-base sm:text-lg font-semibold text-gala-black mt-0.5 leading-snug"
            >
              {currentStep.title}
            </h3>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed font-normal">
            {currentStep.description}
          </p>

          {/* Useful Tip Box */}
          {currentStep.tip && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-stone-800 flex items-start gap-2.5">
              <Lightbulb size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="leading-snug">{currentStep.tip}</p>
            </div>
          )}

          {/* Step Pill Navigation */}
          <div className="pt-1 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar py-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-5 bg-gala-black'
                    : i < currentStepIndex
                    ? 'w-2 bg-gala-accent'
                    : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Ir al paso ${i + 1}`}
                aria-label={`Paso ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gala-border/80 bg-stone-50/80 flex items-center justify-between gap-3">
          <button
            onClick={prevStep}
            disabled={isFirst}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isFirst
                ? 'opacity-30 pointer-events-none border-transparent text-stone-400'
                : 'bg-white border-gala-border text-gala-black hover:bg-stone-100 shadow-xs'
            }`}
          >
            <ChevronLeft size={14} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeTutorial}
              className="px-2.5 py-2 text-[11px] font-medium text-stone-500 hover:text-stone-800 hover:underline"
            >
              Cerrar
            </button>

            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gala-black text-gala-white hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={14} className="text-gala-accent" />
                  <span>Finalizar</span>
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
