import React from "react";
import { Story, Meta } from "@storybook/react";
import { within, userEvent, fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { TimelineChart, TimelineChartProps } from "../components/TimelineChart";

export default {
  title: "Example/TimelineChart",
  component: TimelineChart,
} as Meta;

const BASE_ARGS = {
  baseDimensions: {
    get width() {
      return 800;
    },
    get height() {
      return 500;
    },
    margins: {
      top: 10,
      right: 30,
      bottom: 75,
      left: 60,
    },
  },
  dateFormat: "%Y-%m-%dT%H:%M:%S.%LZ",
  labels: {
    xAxis: "Date",
    yAxis: "Price (USD)",
  },
  yAxisTicksCount: 10,
  xAccessorKey: "date",
  yAccessorKey: "close",
};

interface TemplateProps extends TimelineChartProps {
  isEmpty?: boolean;
  isSingleLine?: boolean;
}

const Template: Story<TemplateProps> = (
  { isEmpty, isSingleLine, ...args },
  { loaded }
) => {
  return (
    <TimelineChart
      {...args}
      data={
        isEmpty
          ? []
          : loaded
          ? isSingleLine
            ? [loaded.timelineChartData[0]]
            : loaded.timelineChartData
          : args.data
      }
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  ...BASE_ARGS,
  isSingleLine: true,
};

export const Empty = Template.bind({});
Empty.args = {
  ...BASE_ARGS,
  isEmpty: true,
};

const LEGEND_ARGS = {
  ...BASE_ARGS,
  categoryKey: "symbol",
  categoryColors: ["#754668", "#982649", "#9395d3", "red", "blue", "green"],
};

export const Legend = Template.bind({});
Legend.args = LEGEND_ARGS;
