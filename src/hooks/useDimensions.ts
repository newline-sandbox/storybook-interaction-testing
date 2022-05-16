import { Dimensions } from "../types";

const useBoundedDimensions = (baseDimensions: Dimensions) => {
  if (baseDimensions.boundedWidth && baseDimensions.boundedHeight) {
    return baseDimensions;
  }

  return {
    ...baseDimensions,
    boundedWidth:
      baseDimensions.width -
      baseDimensions.margins.left -
      baseDimensions.margins.right,
    boundedHeight:
      baseDimensions.height -
      baseDimensions.margins.top -
      baseDimensions.margins.bottom,
  };
};

export default useBoundedDimensions;
