import { IJupyterWidgetRegistry } from "@jupyter-widgets/base";
import {
  BarPlotModel,
  BarPlotView,
  HistogramPlotModel,
  HistogramPlotView,
  ImageModel,
  ImageView,
  InputModel,
  InputView,
  LinearPlotModel,
  LinearPlotView,
  MatrixLayoutModel,
  MatrixLayoutView,
  RangeSliderModel,
  RangeSliderView,
  RidgelinePlotModel,
  RidgelinePlotView,
  ScatterPlotModel,
  ScatterPlotView,
  TextAreaModel,
  TextAreaView,
  TextModel,
  TextView,
  VideoModel,
  VideoView,
  version,
} from "./index";

export const helloWidgetPlugin = {
  id: "d3vis_ipynb:plugin",
  requires: [IJupyterWidgetRegistry],
  activate: function (app, widgets) {
    widgets.registerWidget({
      name: "d3vis_ipynb",
      version: version,
      exports: {
        BarPlotModel,
        BarPlotView,
        HistogramPlotModel,
        HistogramPlotView,
        ImageModel,
        ImageView,
        InputModel,
        InputView,
        LinearPlotModel,
        LinearPlotView,
        MatrixLayoutModel,
        MatrixLayoutView,
        RangeSliderModel,
        RangeSliderView,
        RidgelinePlotModel,
        RidgelinePlotView,
        ScatterPlotModel,
        ScatterPlotView,
        TextAreaModel,
        TextAreaView,
        TextModel,
        TextView,
        VideoModel,
        VideoView,
      },
    });
  },
  autoStart: true,
};

export default helloWidgetPlugin;
