"use client";

import { memo } from "react";
import { useCompare } from "./CompareProvider";

function CompareButton({ product }) {
  const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
  const inCompare = isInCompare(product?._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product?._id);
    } else if (canAdd) {
      addToCompare(product);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inCompare && !canAdd}
      className={`absolute top-2 left-2 z-10 p-1.5 rounded-full transition-all duration-200 ${
        inCompare
          ? "bg-teal-500 text-white shadow-md"
          : "bg-white/80 text-gray-500 hover:bg-teal-50 hover:text-teal-600"
      } ${!inCompare && !canAdd ? "opacity-40 cursor-not-allowed" : ""}`}
      aria-label={inCompare ? "Remove from comparison" : "Add to comparison"}
      title={inCompare ? "Remove from comparison" : canAdd ? "Add to comparison" : "Max 4 items"}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  );
}

export default memo(CompareButton);