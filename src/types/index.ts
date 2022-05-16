export interface DataRecord {
  id: string;
  [key: string]: string | number;
}

export interface Dimensions {
  height: number;
  boundedHeight?: number;
  width: number;
  boundedWidth?: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Labels {
  xAxis: string;
  yAxis: string;
}
