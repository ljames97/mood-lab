"use client";

export default function Modal({ children }) {

  return (
    <div className="fixed inset-0 z-[9999] bg-primary-darkest">
      {children}
    </div>
  );
}
