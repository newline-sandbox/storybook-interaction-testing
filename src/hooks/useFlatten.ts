import { useMemo } from "react";
import { DataRecord } from "../types";

const useFlatten = (data: DataRecord[][]) => {
  return useMemo(() => {
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return ([] as DataRecord[]).concat(...data);
    }

    return [];
  }, [data]);
};

export default useFlatten;
