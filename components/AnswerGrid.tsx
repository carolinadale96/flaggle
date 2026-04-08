"use client";

import AnswerButton from "./AnswerButton";

interface AnswerGridProps {
  choices: string[];
  correctName: string;
  selected: string | null;
  onSelect: (choice: string) => void;
}

export default function AnswerGrid({ choices, correctName, selected, onSelect }: AnswerGridProps) {
  function getState(choice: string): "default" | "correct" | "wrong" | "disabled" {
    if (!selected) return "default";
    if (choice === correctName) return "correct";
    if (choice === selected) return "wrong";
    return "disabled";
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {choices.map((choice) => (
        <AnswerButton
          key={choice}
          label={choice}
          state={getState(choice)}
          onClick={() => onSelect(choice)}
        />
      ))}
    </div>
  );
}
