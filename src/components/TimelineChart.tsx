import React, { forwardRef, ComponentPropsWithoutRef } from "react";
import PropTypes from "prop-types";
import { timeFormat } from "d3-time-format";
import {
  AXIS_COLOR,
  DEFAULT_DATE_FORMAT,
  FONT_FAMILY,
  TICKS_COUNT,
} from "../enums";
import useBisector from "../hooks/useBisector";
import useColorScale from "../hooks/useColorScale";
import useDimensions from "../hooks/useDimensions";
import useFlatten from "../hooks/useFlatten";
import useLine from "../hooks/useLine";
import useScale from "../hooks/useScale";
import { Legend } from "./Legend";
import { XAxis } from "./XAxis";
import { YAxis } from "./YAxis";
import { DataRecord, Dimensions, Labels } from "../types";
import { dimensionsPropsType } from "../utils";
import useToggledLines from "../hooks/useToggledLines";

export interface TimelineChartProps extends ComponentPropsWithoutRef<"svg"> {
  /**
   * An object with the line chart's base dimensions (height, width and margins).
   */
  baseDimensions: Dimensions;
  /**
   * A key to access a record's category.
   */
  categoryColors?: string[];
  /**
   * A class name (or names, spaced out) to add to the root <svg /> element.
   */
  categoryKey?: string;
  /**
   * A list of colors to visually differentiate categories.
   */
  className?: string;
  /**
   * A list of records to draw lines on a line chart.
   */
  data: DataRecord[][];
  /**
   * A string that tells D3 how to format a date inside the bisector's infobox.
   */
  dataPointDateFormat?: string;
  /**
   * A string that tells D3 the format of the date. This allows D3 to parse the string into a Date object.
   */
  dateFormat: string;
  /**
   * A mapping of labels to axes.
   */
  labels: Labels;
  /**
   * A key to access data corresponding to the independent variable within a record.
   */
  xAccessorKey: string;
  /**
   * A key to access data corresponding to the dependent variable within a record.
   */
  yAccessorKey: string;
  /**
   * A number to determine how many ticks to mark along the x-axis.
   */
  xAxisTicksCount?: number;
  /**
   * A number to determine how many ticks to mark along the y-axis.
   */
  yAxisTicksCount?: number;
}

export const TimelineChart = forwardRef<SVGSVGElement, TimelineChartProps>(
  (
    {
      baseDimensions,
      categoryColors,
      categoryKey,
      className,
      data,
      dataPointDateFormat,
      dateFormat,
      labels,
      xAccessorKey,
      yAccessorKey,
      xAxisTicksCount,
      yAxisTicksCount,
    },
    ref
  ) => {
    const dimensions = useDimensions(baseDimensions);

    const flattenedData = useFlatten(data);

    const { scale: xScale, accessorFn: xAccessorFn } = useScale({
      data: flattenedData,
      dateFormat,
      accessorKey: xAccessorKey,
      range: [
        0,
        dimensions.width - dimensions.margins.left - dimensions.margins.right,
      ],
    });

    const { scale: yScale, accessorFn: yAccessorFn } = useScale({
      data: flattenedData,
      accessorKey: yAccessorKey,
      range: [
        dimensions.height - dimensions.margins.top - dimensions.margins.bottom,
        0,
      ],
    });

    const generateLine = useLine({
      xScale,
      xAccessorFn,
      yScale,
      yAccessorFn,
    });

    const { categories, colorScale } = useColorScale({
      data: flattenedData,
      key: categoryKey,
      colors: categoryColors,
    });

    const {
      handleBisectorOnClickLine,
      handleBisectorOnMouseMove,
      resetBisector,
      bisectorData,
      bisectorCoords,
      bisectorIdx,
    } = useBisector({
      data,
      dimensions,
      xAccessorFn,
      yAccessorFn,
      xScale,
      yScale,
    });

    const { displayedLines, handleOnToggleLine } = useToggledLines(data);

    const formatX = (date: Date) => {
      const formatTime = timeFormat(
        dataPointDateFormat ? dataPointDateFormat : DEFAULT_DATE_FORMAT
      );

      return date instanceof Date ? formatTime(date) : date;
    };

    return (
      <svg
        ref={ref}
        className={className}
        width={`${dimensions.width}px`}
        height={`${dimensions.height}px`}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        onClick={resetBisector}
      >
        <g
          transform={`translate(${dimensions.margins.left} ${dimensions.margins.top})`}
        >
          <rect
            onMouseMove={handleBisectorOnMouseMove}
            height={dimensions.boundedHeight}
            width={dimensions.boundedWidth}
            opacity="0"
          />
        </g>
        <g
          transform={`translate(${dimensions.margins.left} ${dimensions.margins.top})`}
        >
          {data.map((arr, i) =>
            displayedLines[i] ? (
              <path
                d={generateLine(arr)}
                fill="none"
                stroke={
                  categoryKey && colorScale
                    ? colorScale(arr[0][categoryKey])
                    : "black"
                }
                strokeWidth="1"
                onClick={(evt) => handleBisectorOnClickLine(evt, i)}
                opacity={bisectorIdx === null || bisectorIdx === i ? 1 : 0.2}
              />
            ) : null
          )}
        </g>
        <XAxis
          dimensions={dimensions}
          label={labels.xAxis}
          scale={xScale}
          ticksCount={xAxisTicksCount || TICKS_COUNT}
        />
        <YAxis
          dimensions={dimensions}
          label={labels.yAxis}
          scale={yScale}
          ticksCount={yAxisTicksCount || TICKS_COUNT}
        />
        {colorScale && (
          <Legend
            categories={categories}
            scale={colorScale}
            dimensions={dimensions}
            onToggle={handleOnToggleLine}
            displayedLines={displayedLines}
          />
        )}
        <g transform={`translate(${bisectorCoords[0]}, 0)`}>
          <path
            fill="none"
            stroke={AXIS_COLOR}
            strokeWidth="1.5"
            d={`M0,${dimensions.height - dimensions.margins.bottom} 0,${
              dimensions.margins.top
            }`}
            strokeDasharray="2"
            opacity={typeof bisectorIdx === "number" ? 1 : 0}
          ></path>
          {colorScale &&
            categoryKey &&
            typeof bisectorIdx === "number" &&
            bisectorData && (
              <circle
                cx="0"
                cy={bisectorCoords[1]}
                r="4"
                fill={colorScale(data[bisectorIdx][0][categoryKey])}
              />
            )}
          {bisectorData && (
            <g transform="translate(-100, 0)">
              <foreignObject width="200" height="100">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    background: "white",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    width: "90%",
                    margin: "0 auto",
                    borderRadius: "4px",
                    padding: "6px 8px",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  <strong style={{ marginBottom: "6px" }}>
                    {formatX(xAccessorFn(bisectorData))}
                  </strong>
                  <small>{yAccessorFn(bisectorData)}</small>
                </div>
              </foreignObject>
            </g>
          )}
        </g>
      </svg>
    );
  }
);

TimelineChart.displayName = "TimelineChart";

TimelineChart.propTypes = {
  baseDimensions: dimensionsPropsType,
  categoryColors: PropTypes.arrayOf(PropTypes.string.isRequired),
  categoryKey: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired
  ).isRequired,
  dataPointDateFormat: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  labels: PropTypes.exact({
    xAxis: PropTypes.string.isRequired,
    yAxis: PropTypes.string.isRequired,
  }).isRequired,
  xAccessorKey: PropTypes.string.isRequired,
  yAccessorKey: PropTypes.string.isRequired,
  xAxisTicksCount: PropTypes.number,
  yAxisTicksCount: PropTypes.number,
};

TimelineChart.defaultProps = {
  data: [],
};

export default TimelineChart;
