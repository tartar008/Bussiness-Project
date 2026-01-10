"use client";
import React from "react";

export const Button = ({ children, onClick, variant = "default", type }: any) => (
    <button
        type={type}
        onClick={onClick}
        className={`px-3 py-1 rounded text-sm font-medium transition 
      ${variant === "default" ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
      ${variant === "ghost" ? "bg-gray-100 hover:bg-gray-200" : ""}`}
    >
        {children}
    </button>
);

export const Input = ({ value, onChange, placeholder }: any) => (
    <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
);

export const Label = ({ children }: any) => (
    <label className="block mb-1 font-medium">{children}</label>
);
