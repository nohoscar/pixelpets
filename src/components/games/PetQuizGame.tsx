import { useState, useCallback, useRef } from "react";
import { playSound } from "@/lib/audio";

interface PetQuizGameProps {
  onComplete: (correct: number) => void;
  onCancel: () => void;
}

interface Question {
  question: string;
  options: string[];
  answer: number;
}

const QUESTIONS: Question[] = [
  { question: "Which pet says 'EXTERMINATE!'?", options: ["Xenomorph", "Dalek", "Robot", "Cthulhu"], answer: 1 },
  { question: "Which pet is from Pokémon?", options: ["Kirby", "Yoshi", "Pikachu", "Metroid"], answer: 2 },
  { question: "Which pet is from Studio Ghibli?", options: ["Totoro", "Doge", "Nyan Cat", "Owl"], answer: 0 },
  { question: "Which pet says 'sus'?", options: ["Ghost", "Among Us", "Creeper", "Slime"], answer: 1 },
  { question: "Which pet is from Half-Life?", options: ["Facehugger", "Metroid", "Headcrab", "Alien"], answer: 2 },
  { question: "Which pet has 'Chill vibes' style?", options: ["Slime", "Capybara", "Panda", "Turtle"], answer: 1 },
  { question: "Which pet is from Final Fantasy?", options: ["Yoshi", "Chocobo", "Mario", "Sonic"], answer: 1 },
  { question: "Which pet says 'Ph'nglui mglw'nafh...'?", options: ["Shoggoth", "Necronomicon", "Cthulhu", "Black Goat"], answer: 2 },
  { question: "Which pet is 'gotta go fast'?", options: ["Pikachu", "Nyan Cat", "Sonic", "Fox"], answer: 2 },
  { question: "Which pet says 'poyo poyo!'?", options: ["Jigglypuff", "Kirby", "Slime", "Tribble"], answer: 1 },
  { question: "Which pet is from Portal?", options: ["BB-8", "Robot", "Companion Cube", "Gravity Gun"], answer: 2 },
  { question: "Which pet says 'DON'T BLINK'?", options: ["Ghost", "Yurei", "Weeping Angel", "Boo Mario"], answer: 2 },
  { question: "Which pet is a 'Cursed tome'?", options: ["Necronomicon", "Slime Mage", "Cthulhu", "Black Goat"], answer: 0 },
  { question: "Which pet has rainbow trail?", options: ["Unicorn", "Nyan Cat", "Jigglypuff", "Phoenix"], answer: 1 },
  { question: "Which pet says 'it's-a me!'?", options: ["Sonic", "Yoshi", "Mario", "Luigi"], answer: 2 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PetQuizGame({ onComplete, onCancel }: PetQuizGameProps) {
  const [questions] = useState(() => shuffleArray(QUESTIONS).slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const correctRef = useRef(0);
  correctRef.current = correct;

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = idx === questions[current].answer;
    if (isCorrect) {
      playSound("happy");
      setCorrect((c) => c + 1);
    } else {
      playSound("sad");
    }

    setTimeout(() => {
      const next = current + 1;
      if (next >= questions.length) {
        setFinished(true);
      } else {
        setCurrent(next);
        setSelected(null);
      }
    }, 1200);
  }, [selected, current, questions]);

  if (finished) {
    const xp = Math.min(50, correctRef.current * 5);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative glass rounded-xl p-8 text-center max-w-xs">
          <p className="font-display text-[10px] text-neon-pink mb-2">// QUIZ_COMPLETE</p>
          <h2 className="font-display text-2xl text-neon mb-4">
            {correctRef.current}/10 correct 🧠
          </h2>
          <p className="text-sm text-muted-foreground mb-6">+{xp} XP</p>
          <button
            onClick={() => onComplete(correctRef.current)}
            className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-display text-[10px] hover:shadow-[0_0_24px_var(--primary)] transition-all"
          >
            ▸ COLLECT XP
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-4">
          <span className="font-display text-[10px] text-neon">Q{current + 1}/10</span>
          <span className="font-display text-[10px] text-muted-foreground">{correct} correct</span>
        </div>
        <button onClick={onCancel} className="glass rounded-lg px-3 py-2 font-display text-[10px] text-destructive hover:bg-destructive/20 transition-all">
          ✕ QUIT
        </button>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="glass rounded-xl p-6 max-w-md w-full text-center">
          <p className="font-display text-sm text-foreground">{q.question}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md w-full">
          {q.options.map((opt, idx) => {
            let style = "border-border bg-secondary/60 hover:border-accent/60";
            if (selected !== null) {
              if (idx === q.answer) style = "border-green-500 bg-green-500/20";
              else if (idx === selected) style = "border-red-500 bg-red-500/20";
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selected !== null}
                className={`px-4 py-3 rounded-lg border-2 font-display text-[10px] transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
