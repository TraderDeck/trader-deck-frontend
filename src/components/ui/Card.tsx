import React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white shadow-lg p-4 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}