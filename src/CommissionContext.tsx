// src/CommissionContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import {
  CommissionDecision,
  DecisionStatus,
  DecisionType,
  ReferralType,
} from "../types"; // <-- IMPORTANT: use the real type

// Define the shape of the context
export type CommissionContextProps = {
  commissionDecisions: CommissionDecision[];
  setCommissionDecisions: (d: CommissionDecision[]) => void;

  // Utility: add a new decision (optional but useful)
  addDecision: (d: CommissionDecision) => void;
};

export const CommissionContext = createContext<CommissionContextProps | null>(null);

// Provider
export function CommissionProvider({ children }: { children: ReactNode }) {
  const [commissionDecisions, setCommissionDecisions] = useState<CommissionDecision[]>([]);

  const addDecision = (d: CommissionDecision) => {
    setCommissionDecisions((prev) => [...prev, d]);
  };

  return (
    <CommissionContext.Provider
      value={{
        commissionDecisions,
        setCommissionDecisions,
        addDecision,
      }}
    >
      {children}
    </CommissionContext.Provider>
  );
}

// Custom hook (fixes your "useCommissionContext not found" error)
export function useCommissionContext() {
  const ctx = useContext(CommissionContext);
  if (!ctx) throw new Error("useCommissionContext must be used inside CommissionProvider");
  return ctx;
}


