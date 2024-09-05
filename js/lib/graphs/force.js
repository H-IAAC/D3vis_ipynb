import * as d3 from "d3";
import { BasePlot } from "./baseplot";

const NEGATIVE_COLOR = "#33AFFF";
const POSITIVE_COLOR = "#FF335B";
const GRAPH_Y = 100;
const GRAPH_HEIGHT = 40;

function invertedSort(property) {
  if (property[0] === "-") {
    property = property.substr(1);
  }
  return function (a, b) {
    var result;
    if (a[property] < 0 && b[property] >= 0) {
      result = 1;
    } else if (a[property] >= 0 && b[property] < 0) {
      result = -1;
    } else {
      result =
        a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0;
    }

    return result;
  };
}

function findResultingValue(data, x_value, baseValue) {
  let value = baseValue;
  data.forEach((d) => (value += d[x_value]));
  return value;
}

function getDomain(data, x_value, baseValue) {
  let min = baseValue;
  let max = baseValue;

  data.forEach((d) => {
    const value = d[x_value];

    if (value < 0) min += value;
    if (value > 0) max += value;
  });

  return [min, max];
}

function getScaledPolygon(xStart, xEnd, xScale, transition) {
  const x = xScale(xStart);
  const y = GRAPH_Y;
  const lenght = Math.abs(xScale(xEnd) - xScale(0));
  let TRI_HEIGHT = 10;
  const HALF_HEIGHT = GRAPH_HEIGHT / 2;
  let polygon;
  if (lenght < 0) TRI_HEIGHT = -TRI_HEIGHT;

  if (transition) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght - TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
    ];
  } else if (xEnd > 0) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght + TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x + TRI_HEIGHT, y: y },
    ];
  } else {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght - TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x - TRI_HEIGHT, y: y },
    ];
  }

  return polygon;
}

function getPolygon(xStart, xEnd, lenght, xValue) {
  const x = xStart;
  const y = GRAPH_Y;
  let TRI_HEIGHT = 10;
  const HALF_HEIGHT = GRAPH_HEIGHT / 2;
  let polygon;
  if (lenght < 0) TRI_HEIGHT = -TRI_HEIGHT;

  if (xValue > 0) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght + TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x + TRI_HEIGHT, y: y },
    ];
  } else {
    polygon = [
      { x: xEnd - lenght, y: y + HALF_HEIGHT },
      { x: xEnd, y: y + HALF_HEIGHT },
      { x: xEnd - TRI_HEIGHT, y: y },
      { x: xEnd, y: y - HALF_HEIGHT },
      { x: xEnd - lenght, y: y - HALF_HEIGHT },
      { x: xEnd - lenght - TRI_HEIGHT, y: y },
    ];
  }

  return polygon;
}

function getColor(xStart, xEnd) {
  const lenght = xEnd - xStart;
  if (lenght >= 0) return POSITIVE_COLOR;
  return NEGATIVE_COLOR;
}

export class Force extends BasePlot {
  plot(data, x_value, y_value, baseValue, width, height, margin) {
    this.baseValue = baseValue;
    data.sort(invertedSort(x_value));
    this.init(width, height, margin);

    const GG = this.gGrid;

    const xDomain = getDomain(data, x_value, baseValue);
    const X = this.getXLinearScale(xDomain, width, margin);

    const xAxis = GG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (GRAPH_Y + GRAPH_HEIGHT) + ")")
      .call(d3.axisBottom(X));

    xAxis
      .append("text")
      .attr("class", "label")
      .attr("x", X.range()[1])
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(x_value);

    let startingPoint = xDomain[0];
    let lastValue = 0;
    let transition = false;
    GG.selectAll()
      .data(data)
      .enter()
      .append("polygon")
      .attr("points", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + Math.abs(d[x_value]);
        transition = lastValue >= 0 && d[x_value] < 0;
        lastValue = d[x_value];
        return [getScaledPolygon(xStart, d[x_value], X, transition)].map(
          function (d) {
            return d.map((d) => [d.x, d.y].join(",")).join(" ");
          }
        );
      })
      .attr("fill", (d) => getColor(0, d[x_value]));

    startingPoint = xDomain[0];
    GG.selectAll()
      .data(data)
      .enter()
      .append("polygon")
      .attr("points", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + Math.abs(d[x_value]);
        return [getPolygon(X(xStart), X(startingPoint), 3, d[x_value])].map(
          function (d) {
            return d.map((d) => [d.x, d.y].join(",")).join(" ");
          }
        );
      })
      .attr("fill", "white");

    GG.append("path")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "2,2")
      .attr(
        "d",
        d3.line()([
          [X(baseValue), GRAPH_Y - GRAPH_HEIGHT],
          [X(baseValue), GRAPH_Y + GRAPH_HEIGHT],
        ])
      );

    const baseValueText = GG.append("g")
      .attr("width", 80)
      .attr("height", 40)
      .attr(
        "transform",
        "translate(" +
          (X(baseValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT) +
          ")"
      );

    baseValueText
      .append("text")
      .attr("x", 40)
      .attr("y", 20)
      .attr("dy", 1)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", "grey")
      .text("base value");

    const resultValue = findResultingValue(data, x_value, baseValue);

    const resultValueText = GG.append("g")
      .attr("width", 80)
      .attr("height", 40)
      .attr(
        "transform",
        "translate(" +
          (X(resultValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT + 20) +
          ")"
      );

    resultValueText
      .append("text")
      .attr("x", 40)
      .attr("y", 20)
      .attr("dy", 1)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(Math.round(resultValue * 1000) / 1000);
  }

  replot(data, x_value, y_value, baseValue, width, height, margin, noAxes) {
    this.clear();
    this.plot(data, x_value, y_value, baseValue, width, height, margin, noAxes);
  }
}