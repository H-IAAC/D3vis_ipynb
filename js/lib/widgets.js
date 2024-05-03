import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import "../css/widget.css";
import { barplot } from "./graphs/barplot";
import { histogramplot } from "./graphs/histogramplot";
import { linearhistplot } from "./graphs/linearhistplot";
import { rangeslider } from "./graphs/rangeslider";
import { scatterplot } from "./graphs/scatterplot";
const packageData = require("../package.json");

const WIDGET_HEIGHT = 400;
const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };
const RENDER_INTERVAL = 100;

function plotAfterInterval(that) {
  if (that.timeout) {
    clearTimeout(that.timeout);
  }
  that.timeout = setTimeout(() => {
    that.plot();
  }, RENDER_INTERVAL);
}

export class LinearHistPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: LinearHistPlotModel.model_name,
      _view_name: LinearHistPlotModel.view_name,
      _model_module: LinearHistPlotModel.model_module,
      _view_module: LinearHistPlotModel.view_module,
      _model_module_version: LinearHistPlotModel.model_module_version,
      _view_module_version: LinearHistPlotModel.view_module_version,

      linearData_x: [],
      linearData_y: [],
      histogramData: [],
      elementId: String,
      clickedValue: String,
    };
  }

  static model_name = "LinearHistPlotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "LinearHistPlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class LinearHistPlotView extends DOMWidgetView {
  timeout;

  render() {
    plotAfterInterval(this);

    this.model.on("change:linearData_x", () => plotAfterInterval(this), this);
    this.model.on("change:linearData_y", () => plotAfterInterval(this), this);
    this.model.on("change:histogramData", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    const linearData_x = this.model.get("linearData_x");
    const linearData_y = this.model.get("linearData_y");
    const histogramData = this.model.get("histogramData");
    const elementId = this.model.get("elementId");

    let height = WIDGET_HEIGHT;
    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      height = element.clientHeight;
    }
    let width = element.clientWidth;
    const margin = WIDGET_MARGIN;

    linearhistplot(
      linearData_x,
      linearData_y,
      histogramData,
      element,
      this.setValue.bind(this),
      width,
      height,
      margin
    );
  }

  setValue(text) {
    this.model.set({ clickedValue: text });
    this.model.save_changes();
  }
}

export class ScatterPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ScatterPlotModel.model_name,
      _view_name: ScatterPlotModel.view_name,
      _model_module: ScatterPlotModel.model_module,
      _view_module: ScatterPlotModel.view_module,
      _model_module_version: ScatterPlotModel.model_module_version,
      _view_module_version: ScatterPlotModel.view_module_version,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
      elementId: String,
      clickedValue: String,
      selectedValuesRecords: [],
    };
  }

  static model_name = "ScatterplotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "ScatterplotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class ScatterPlotView extends DOMWidgetView {
  timeout;

  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:y", () => plotAfterInterval(this), this);
    this.model.on("change:hue", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");
    const elementId = this.model.get("elementId");

    let height = WIDGET_HEIGHT;
    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      height = element.clientHeight;
    }
    let width = element.clientWidth;
    const margin = WIDGET_MARGIN;

    scatterplot(
      data,
      x,
      y,
      hue,
      element,
      this.setValue.bind(this),
      this.setSelectedValues.bind(this),
      width,
      height,
      margin
    );
  }

  setValue(text) {
    this.model.set({ clickedValue: text });
    this.model.save_changes();
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class BarPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: BarPlotModel.model_name,
      _view_name: BarPlotModel.view_name,
      _model_module: BarPlotModel.model_module,
      _view_module: BarPlotModel.view_module,
      _model_module_version: BarPlotModel.model_module_version,
      _view_module_version: BarPlotModel.view_module_version,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
      elementId: String,
    };
  }

  static model_name = "BarplotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "BarplotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class BarPlotView extends DOMWidgetView {
  timeout;

  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:y", () => plotAfterInterval(this), this);
    this.model.on("change:hue", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");
    const elementId = this.model.get("elementId");

    let height = WIDGET_HEIGHT;
    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      height = element.clientHeight;
    }
    let width = element.clientWidth;
    const margin = WIDGET_MARGIN;

    barplot(data, x, y, hue, element, width, height, margin);
  }
}

export class HistogramPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: HistogramPlotModel.model_name,
      _view_name: HistogramPlotModel.view_name,
      _model_module: HistogramPlotModel.model_module,
      _view_module: HistogramPlotModel.view_module,
      _model_module_version: HistogramPlotModel.model_module_version,
      _view_module_version: HistogramPlotModel.view_module_version,

      dataRecords: [],
      x: String,
      start: Number,
      end: Number,
      elementId: String,
    };
  }

  static model_name = "HistogramplotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "HistogramplotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class HistogramPlotView extends DOMWidgetView {
  timeout;

  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:start", () => plotAfterInterval(this), this);
    this.model.on("change:end", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const start = this.model.get("start");
    const end = this.model.get("end");
    const elementId = this.model.get("elementId");

    let height = WIDGET_HEIGHT;
    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
      height = element.clientHeight;
    }
    let width = element.clientWidth;
    const margin = WIDGET_MARGIN;

    histogramplot(data, x, start, end, element, width, height, margin);
  }
}

export class EmbeddingModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: EmbeddingModel.model_name,
      _view_name: EmbeddingModel.view_name,
      _model_module: EmbeddingModel.model_module,
      _view_module: EmbeddingModel.view_module,
      _model_module_version: EmbeddingModel.model_module_version,
      _view_module_version: EmbeddingModel.view_module_version,

      matrix: [],
      grid_areas: [],
      grid_template_areas: String,
      style: String,
    };
  }

  static model_name = "EmbeddingModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "EmbeddingView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class EmbeddingView extends DOMWidgetView {
  render() {
    this.value_changed();
  }

  value_changed() {
    const matrix = this.model.get("matrix");
    const grid_areas = this.model.get("grid_areas");
    const grid_template_areas = this.model.get("grid_template_areas");
    let style = this.model.get("style");

    if (!style) {
      style = "basic";
    }

    const node = document.createElement("div");

    node.classList.add(style);
    node.style.display = "grid";
    node.style.gridTemplateAreas = grid_template_areas;
    node.style.gridTemplateRows = "repeat(" + matrix.length + ", 180px)";
    node.style.gridTemplateColumns = "repeat(" + matrix[0].length + ", 1fr)";
    node.style.width = "100%";

    grid_areas.forEach((area) => {
      const grid_area = document.createElement("div");
      grid_area.setAttribute("id", area);
      grid_area.style.gridArea = area;
      grid_area.classList.add("dashboard-div");
      node.appendChild(grid_area);
    });

    this.el.appendChild(node);
  }
}

export class RangeSliderModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RangeSliderModel.model_name,
      _view_name: RangeSliderModel.view_name,
      _model_module: RangeSliderModel.model_module,
      _view_module: RangeSliderModel.view_module,
      _model_module_version: RangeSliderModel.model_module_version,
      _view_module_version: RangeSliderModel.view_module_version,

      dataRecords: [],
      variable: String,
      step: Number,
      description: String,
      minValue: Number,
      maxValue: Number,
      elementId: String,
    };
  }

  static model_name = "RangeSliderModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "RangeSliderView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class RangeSliderView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:variable", () => plotAfterInterval(this), this);
    this.model.on("change:step", () => plotAfterInterval(this), this);
    this.model.on("change:description", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const step = this.model.get("step");
    const description = this.model.get("description");
    const elementId = this.model.get("elementId");
    const minValue = this.model.get("minValue");
    const maxValue = this.model.get("maxValue");

    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
    }
    const margin = WIDGET_MARGIN;

    rangeslider(
      data,
      variable,
      step,
      description,
      minValue,
      maxValue,
      this.setValues.bind(this),
      element,
      margin
    );
  }

  setValues(min, max) {
    this.model.set({ minValue: min });
    this.model.set({ maxValue: max });
    this.model.save_changes();
  }
}
