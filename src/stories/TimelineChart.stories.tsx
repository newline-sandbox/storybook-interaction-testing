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
}

const Template: Story<TemplateProps> = ({ isEmpty, ...args }, { loaded }) => {
  return (
    <TimelineChart
      {...args}
      data={isEmpty ? args.data : loaded ? loaded.timelineChartData : args.data}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  ...BASE_ARGS,
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

export const ToggledLines = Template.bind({});
ToggledLines.args = LEGEND_ARGS;
ToggledLines.play = async ({ canvasElement, args, loaded }) => {
  const canvas = within(canvasElement);

  loaded.timelineChartData.slice(1).forEach(async (arr) => {
    const legendKey = await canvas.getByTestId(
      `legend-key-${arr[0][args.categoryKey].toLowerCase()}`
    );
    await userEvent.click(legendKey);
  });

  await expect(
    canvas.getByTestId(
      `line-${loaded.timelineChartData[0][0][args.categoryKey].toLowerCase()}`
    )
  ).toBeInTheDocument();
};

export const SelectedLine = Template.bind({});
SelectedLine.args = LEGEND_ARGS;
SelectedLine.play = async ({ canvasElement, args, loaded }) => {
  const canvas = within(canvasElement);

  const line = await canvas.getByTestId(
    `line-${loaded.timelineChartData[0][0][args.categoryKey].toLowerCase()}`
  );

  await userEvent.click(line);

  const bisectorArea = await canvas.getByTestId("bisector-area");

  await fireEvent.mouseMove(bisectorArea, {
    clientX:
      (args.baseDimensions.width -
        args.baseDimensions.margins.left -
        args.baseDimensions.margins.right) /
        2 +
      args.baseDimensions.margins.left,
    clientY:
      (args.baseDimensions.height -
        args.baseDimensions.margins.top -
        args.baseDimensions.margins.bottom) /
        2 +
      args.baseDimensions.margins.top,
  });

  await expect(canvas.getByTestId("bisector-infobox")).toBeInTheDocument();
  await expect(canvas.getByTestId("bisector-cursor")).toBeInTheDocument();
};

export const ToggledLinesAndSelectedLine = Template.bind({});
ToggledLinesAndSelectedLine.storyName = "Toggled Lines + Selected Line";
ToggledLinesAndSelectedLine.args = LEGEND_ARGS;
ToggledLinesAndSelectedLine.play = async (context) => {
  await ToggledLines.play(context);
  await SelectedLine.play(context);
};
