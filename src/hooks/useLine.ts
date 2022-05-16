import { useMemo } from "react";
import { line } from "d3-shape";
import { DataRecord } from "../types";

export interface useLineParams {
  xAccessorFn: (d: DataRecord) => any;
  xScale: object;
  yAccessorFn: (d: DataRecord) => any;
  yScale: object;
}

const useLine = (params: useLineParams) => {
  return useMemo(() => {
    const { xScale, xAccessorFn, yScale, yAccessorFn } = params;

    return line()
      .x((d) => xScale(xAccessorFn(d)))
      .y((d) => yScale(yAccessorFn(d)));
  }, [params]);
};

export default useLine;
