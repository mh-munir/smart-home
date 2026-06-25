"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, memo } from "react";

const CompareContext = createContext(null);

const MAX_COMPARE = 4;
const STORAGE_KEY = "smart-home-compare";

const EMPTY_COMPARE = {
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
  canAdd: true,
  count: 0,
  maxCompare: 4,
};

function getStoredCompare() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setCompareList(getStoredCompare());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
      } catch {
        // localStorage full or unavailable
      }
    }
  }, [compareList, initialized]);

  const addToCompare = useCallback((product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p._id === product._id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, {
        _id: product._id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        price: product.price,
        rating: product.rating,
        category: product.category,
        description: product.description,
        affiliateLinks: product.affiliateLinks,
        affiliateLink: product.affiliateLink,
      }];
    });
  }, []);

  const removeFromCompare = useCallback((productId) => {
    setCompareList((prev) => prev.filter((p) => p._id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  // Use a ref-based approach for isInCompare to avoid re-creating it on every list change.
  // Consumers that only call isInCompare should not re-render when compareList changes.
  const compareListRef = useRef(compareList);
  compareListRef.current = compareList;

  const isInCompare = useCallback((productId) => {
    return compareListRef.current.some((p) => p._id === productId);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAdd: compareList.length < MAX_COMPARE,
    count: compareList.length,
    maxCompare: MAX_COMPARE,
  }), [compareList, addToCompare, removeFromCompare, clearCompare, isInCompare]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

function useCompare() {
  const context = useContext(CompareContext);
  if (!context) return EMPTY_COMPARE;
  return context;
}

// Selective hook: only re-renders when the selected value changes
function useCompareSelector(selector) {
  const context = useContext(CompareContext);
  if (!context) return selector(EMPTY_COMPARE);
  return selector(context);
}

const MemoizedCompareProvider = memo(CompareProvider);

export { MemoizedCompareProvider as CompareProvider, useCompare, useCompareSelector };
