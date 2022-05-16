import { useMemo } from "react";
import { extent } from "d3-array";
import { scaleLinear, scaleTime } from "d3-scale";
import { timeParse } from "d3-time-format";

interface useScaleParams {
  accessorKey: string;
  data: object[];
  dateFormat?: string;
  domain?: [number, number];
  range?: [number, number];
  isRangeRound?: boolean;
  padding?: number;
  scaleFn?: () => object;
}

const useScale = (params: useScaleParams) => {
  return useMemo(() => {
    const {
      accessorKey,
      data,
      dateFormat,
      domain,
      range,
      scaleFn = scaleLinear,
      isRangeRound,
      padding,
    } = params;

    let scaleChain = null;
    let accessorFn = (d) => d[accessorKey];

    if (dateFormat) {
      const parseDate = timeParse(dateFormat);

      accessorFn = (d) => parseDate(d[accessorKey]);

      scaleChain = scaleTime().domain(extent(data, accessorFn));
    } else {
      scaleChain = scaleFn().domain(domain ? domain : extent(data, accessorFn));
    }

    if (isRangeRound) {
      // Apply spacing between bars in bar chart.
      scaleChain = scaleChain.rangeRound(range).padding(padding ? padding : 0);
    } else {
      scaleChain = scaleChain.range(range);
    }

    return { scale: scaleChain, accessorFn };
  }, [params]);
};

export default useScale;
