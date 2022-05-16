import { json } from "d3-fetch";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const fetchTimelineChartData = async () => {
  try {
    return await Promise.all([
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/aapl-historical-data.json"
      ),
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/amzn-historical-data.json"
      ),
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/fb-historical-data.json"
      ),
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/googl-historical-data.json"
      ),
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/nflx-historical-data.json"
      ),
      json(
        "https://gist.githubusercontent.com/kenchandev/450515b3d41fb583cb016c67282d27e1/raw/0646a9c3deaad014070f3e1c83d8012e6679e361/tsla-historical-data.json"
      ),
    ]);
  } catch (err) {
    console.error(err);

    return [];
  }
};

export const loaders = [
  async () => ({
    timelineChartData: await fetchTimelineChartData(),
  }),
];
