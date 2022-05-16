import React from "react";
import PropTypes from "prop-types";
import { FONT_FAMILY, FONT_SIZE, FONT_COLOR } from "../enums";
import { Dimensions } from "../types";
import { dimensionsPropsType } from "../utils";

export interface LegendProps {
  categories: string[];
  dimensions: Dimensions;
  displayedLines: boolean[];
  onToggle: (i: number, value: boolean) => void;
  scale: (category: string) => string;
}

export const Legend = ({
  categories,
  dimensions,
  displayedLines,
  scale,
  onToggle,
}: LegendProps): JSX.Element => (
  <g transform={`translate(${dimensions.margins.left + 25}, 25)`}>
    {categories.map((category, i) => {
      const categoryKey = category.toLowerCase();

      return (
        <g key={categoryKey} transform={`translate(0, ${i * 20})`}>
          <foreignObject height="20" width="100">
            <input
              style={{
                height: "10px",
                width: "10px",
                margin: "0 4px 0 0",
                display: "inline-block",
              }}
              type="checkbox"
              id={categoryKey}
              name={categoryKey}
              checked={displayedLines[i]}
              onChange={(evt) => onToggle(i, evt.target.checked)}
            />
            <label
              htmlFor={categoryKey}
              data-testid={`legend-key-${categoryKey}`}
            >
              <span
                style={{
                  height: "10px",
                  width: "10px",
                  backgroundColor: scale(category),
                  margin: "0 4px 0 0",
                  display: "inline-block",
                }}
              ></span>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: FONT_SIZE,
                  color: FONT_COLOR,
                  verticalAlign: "middle",
                }}
              >
                {category}
              </span>
            </label>
          </foreignObject>
        </g>
      );
    })}
  </g>
);

Legend.displayName = "Legend";

Legend.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  dimensions: dimensionsPropsType,
  displayedLines: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
  scale: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

Legend.defaultProps = {};
