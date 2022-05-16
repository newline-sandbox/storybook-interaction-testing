import { useState } from "react";
import { DataRecord } from "../types";

const useToggledLines = (data: DataRecord[][]) => {
  const [displayedLines, setDisplayedLines] = useState<boolean[]>(
    Array(data.length).fill(true)
  );

  const handleOnToggleLine = (i: number, value: boolean) => {
    setDisplayedLines([
      ...displayedLines.slice(0, i),
      value,
      ...displayedLines.slice(i + 1),
    ]);
  };

  return { displayedLines, handleOnToggleLine };
};

export default useToggledLines;
