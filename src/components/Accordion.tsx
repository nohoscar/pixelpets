import { useState } from "react";

interface Props {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export function Accordion({ title, icon, defaultOpen = false, badge, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass rounded-xl border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-secondary/30 transition-all"
      >
        <span className="text-sm">{icon}</span>
        <span className="font-display text-[9px] text-foreground flex-1 text-left">{title}</span>
        {badge && <span className="text-[7px] font-display text-neon bg-neon/10 px-1.5 py-0.5 rounded">{badge}</span>}
        <span className={`text-[10px] text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-border/20">
          {children}
        </div>
      )}
    </div>
  );
}
