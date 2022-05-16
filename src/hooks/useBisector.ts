import { SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { bisector } from "d3-array";
import { DataRecord, Dimensions } from "../types";

export interface useBisectorParams {
  data: DataRecord[][];
  dimensions: Dimensions;
  xAccessorFn: (d: DataRecord) => any;
  yAccessorFn: (d: DataRecord) => any;
  xScale: object;
  yScale: object;
}

const useBisector = ({
  data,
  dimensions,
  xAccessorFn,
  yAccessorFn,
  xScale,
  yScale,
}: useBisectorParams) => {
  const [bisectorCoords, setBisectorCoords] = useState<[number, number]>([
    0, 0,
  ]);
  const [bisectorIdx, setBisectorIdx] = useState<number | null>(null);
  const [bisectorData, setBisectorData] = useState<DataRecord | null>(null);

  const sortedData = useRef<DataRecord[][]>([]);

  const bisect = useMemo(
    () => bisector((d: DataRecord) => xAccessorFn(d)).center,
    [xAccessorFn]
  );

  useEffect(() => {
    if (Array.isArray(data) && Array.isArray(data[0])) {
      sortedData.current = data.map((d) =>
        d.sort(
          (a: DataRecord, b: DataRecord) => xAccessorFn(a) - xAccessorFn(b)
        )
      );
    }
  }, [data, xAccessorFn]);

  const handleBisectorOnClickLine = (evt: SyntheticEvent, i: number) => {
    setBisectorIdx(i);
    changeBisector(evt, i);
  };

  const handleBisectorOnMouseMove = (evt: SyntheticEvent) => {
    if (typeof bisectorIdx === "number") {
      changeBisector(evt);
    }
  };

  const resetBisector = () => {
    if (typeof bisectorIdx === "number") {
      setBisectorIdx(null);
      setBisectorData(null);
    }
  };

  const changeBisector = (evt: SyntheticEvent, i?: number) => {
    const lineIndex = typeof i === "number" ? i : bisectorIdx;

    if (typeof lineIndex === "number") {
      const { offsetX } = evt.nativeEvent;

      const idx = bisect(
        sortedData.current[lineIndex],
        xScale.invert(offsetX - dimensions.margins.left)
      );

      setBisectorCoords([
        offsetX,
        yScale(yAccessorFn(sortedData.current[lineIndex][idx])) +
          dimensions.margins.top,
      ]);

      setBisectorData(sortedData.current[lineIndex][idx]);
    }
  };

  return {
    handleBisectorOnClickLine,
    handleBisectorOnMouseMove,
    resetBisector,
    bisectorIdx,
    bisectorData,
    bisectorCoords,
  };
};

export default useBisector;
