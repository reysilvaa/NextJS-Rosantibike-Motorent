'use client';

import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-between w-full mb-6 px-2">
      {[...Array(totalSteps)].map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center z-10
                ${
                  currentStep > index + 1
                    ? 'bg-primary text-white'
                    : currentStep === index + 1
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                }`}
            >
              {currentStep > index + 1 ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${currentStep === index + 1 ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {index === 0 ? 'Data Diri' : index === 1 ? 'Detail Sewa' : 'Konfirmasi'}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`h-1 flex-1 mx-2 rounded ${currentStep > index + 1 ? 'bg-primary' : 'bg-muted'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
