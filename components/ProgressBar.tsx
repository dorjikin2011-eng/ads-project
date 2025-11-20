import React from 'react';
import CheckIcon from './icons/CheckIcon';
interface ProgressBarProps {
steps: string[];
currentStepIndex: number;
completedSteps: Set<string>;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStepIndex, completedSteps }) => {
return (
<div className="w-full px-4 sm:px-0 mb-8">
<div className="flex items-start">
{steps.map((step, index) => {
const isCompleted = completedSteps.has(step);
const isCurrent = index === currentStepIndex;
const isLast = index === steps.length - 1;
code
Code
return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                                transition-colors duration-300 z-10
                                ${isCompleted ? 'bg-primary text-white' : ''}
                                ${isCurrent ? 'border-4 border-accent bg-white text-accent' : ''}
                                ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                            `}>
                                {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
                            </div>
                            <p className={`
                                mt-2 text-center text-xs sm:text-sm font-medium w-24
                                transition-colors duration-300
                                ${isCurrent || isCompleted ? 'text-primary' : 'text-text-secondary'}
                            `}>{step}</p>
                        </div>
                        {!isLast && (
                            <div className="flex-auto mt-5">
                                <div className={`
                                    h-1
                                    transition-colors duration-300
                                    ${isCompleted || isCurrent ? 'bg-primary' : 'bg-gray-200'}
                                `}></div>
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);
};
export default ProgressBar;