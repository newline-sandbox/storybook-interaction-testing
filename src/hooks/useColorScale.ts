import { useMemo } from "react";
import { scaleOrdinal } from "d3-scale";
import useScale from "./useScale";
import { DataRecord } from "../types";

export interface useColorScale {
  data: DataRecord[];
  key?: string;
  colors?: string[];
}

const useColorScale = ({ data, key, colors = [] }: useColorScale) => {
  if (!key || colors.length === 0) {
    return { categories: null, colorScale: null };
  }

  const categories = useMemo(
    () => (key && colors ? Array.from(new Set(data.map((d) => d[key]))) : []),
    [data, key, colors]
  );

  const { scale: colorScale } = useScale(
    key && colors
      ? {
          data,
          domain: categories,
          range: colors,
          scaleFn: scaleOrdinal,
        }
      : null
  );

  return { categories, colorScale };
};

export default useColorScale;
