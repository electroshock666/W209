// https://observablehq.com/@pierreleripoll/vegasync@2664
import define1 from "./dde4715990f04109@246.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./a2e58f97fd5e8d7c@620.js";
import define4 from "./60ea978986bfd25e@1624.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# 10 minutes dashboard: vegaSync guide`
)});
  main.variable(observer("FULLSCREEN")).define("FULLSCREEN", ["fullscreen","html"], function(fullscreen,html){return(
fullscreen({
  breakLayoutAtCell: 7,
  hideAfter: 9,
  hideBefore: 1,
  left: 51,
  right: 46,
  button: html`<button style="background: steelblue; padding : 0.4em;border-radius: 0.2em; border-color: black;color: white; font-size: 16px; /*position:fixed;right:20px;top:0;*/">Fullscreen`
})
)});
  main.variable(observer("countOfSelected")).define("countOfSelected", ["html","facts","d3"], function(html,facts,d3)
{
  const id = "reset";
  const counter = html`<div>`;

  facts.dispatch.on("redraw.view" + id, redraw);

  d3.select(counter).on("click", () => {
    console.warn("reset all");
    facts.dispatch.call("reset");
    facts.dispatch.call("redraw");
  });

  function redraw() {
    const template = {
      some: `<strong>%filter-count</strong> selected out of <strong>%total-count</strong> items <small>| <a href=#>Reset All</a></small>`,
      all: `All items selected (<strong>%total-count</strong>) <small>| <span style="color: #ccc">Reset All</span></small>`
    };

    const totalCount = facts.all().length,
      filterCount = facts.allFiltered().length;

    d3.select(counter).html(
      (filterCount < totalCount ? template.some : template.all)
        .replace("%filter-count", filterCount)
        .replace("%total-count", totalCount)
    );
  }

  redraw();

  return counter;
}
);
  main.variable(observer("viewof sexView")).define("viewof sexView", ["facts","invalidation","radio"], function*(facts,invalidation,radio)
{
  let dimension = facts.dimension(d => d.sex);
  let countSex = dimension.group().reduceCount();

  const id = dimension.id();

  invalidation.then(() => {
    dimension.filterAll().dispose();
    facts.dispatch.on("redraw.view" + id, null);
    facts.dispatch.on("reset.view" + id, null);
    facts.dispatch.call('redraw');
  });

  let form = radio({
    title: "Sex of athletes",
    options: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },

      { value: "both", label: "Both" }
    ],
    value: "both"
  });

  const resetHTML = html => {
    html.value = 0;
    html.dispatchEvent(new CustomEvent("input"));
  };

  facts.dispatch.on("redraw.view" + id, () => {});

  facts.dispatch.on("reset.view" + id, () => {});

  form.addEventListener('change', e => {
    let vals = form.value === "both" ? ["male", "female"] : [form.value];
    dimension.filterAll().filter(d => vals.includes(d));
    facts.dispatch.call('redraw');
  });

  yield form;
}
);
  main.variable(observer("sexView")).define("sexView", ["Generators", "viewof sexView"], (G, _) => G.input(_));
  main.variable(observer("viewof dateView")).define("viewof dateView", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => {
    let birthdate = new Date(d.date_of_birth);
    let riodate = new Date(2016, 8, 5);
    let diff = new Date(riodate - birthdate);
    return [Math.abs(diff.getUTCFullYear() - 1970)];
  },
  interactivity: "brush",
  counts: true,
  normalized: true,
  spec: {
    title: "Age of athletes in 2016",
    width: w,

    layer: [
      {
        mark: "line",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "quantitative",
            title: "Age"
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Proportion of athletes"
          },
          color: {
            value: "#aaa"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        selection: {
          brush: {
            name: "brush",
            type: "interval",
            encodings: ['x']
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "quantitative"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "brush", value: colorVega },
            value: "#bbb"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("dateView")).define("dateView", ["Generators", "viewof dateView"], (G, _) => G.input(_));
  main.variable(observer("viewof nationality")).define("viewof nationality", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.nationality],
  interactivity: "selection",
  counts: true,
  normalized: true,
  spec: {
    title: "Top 20 countries with most athletes",
    width: w,
    data: {
      name: "counts"
    },
    transform: [
      {
        window: [
          {
            op: "rank",
            as: "rank"
          }
        ],
        sort: [{ field: "filtered", order: "descending" }]
      },
      {
        filter: "datum.rank <= 20 && datum.filtered > 0"
      }
    ],
    layer: [
      {
        mark: "bar",

        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: null,
            sort: "-filtered",
            axis: { labelAngle: 0 }
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Proportion of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",

        selection: {
          selection: {
            type: "multi",
            toggle: "!event.shiftKey",
            fields: ["key"]
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            sort: "-y"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "selection", value: colorVega },
            value: "#aaa"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("nationality")).define("nationality", ["Generators", "viewof nationality"], (G, _) => G.input(_));
  main.variable(observer("viewof medalsPieView")).define("viewof medalsPieView", ["vegaSync","facts","w","invalidation","visibility"], function(vegaSync,facts,w,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [Math.floor(d.gold + d.silver + d.bronze).toString()],
  counts: true,
  debug: true,
  interactivity: "selection",
  spec: {
    title: "Proportion of medals won",
    width: w,
    height: 200,

    data: {
      name: "counts"
    },
    view: { stroke: null },
    selection: {
      selection: {
        type: "multi",
        toggle: "!event.shiftKey",
        fields: ["key"]
      }
    },

    mark: { type: "arc", innerRadius: 200 / 10 },
    encoding: {
      theta: {
        field: "filtered",
        type: "quantitative"
      },
      color: {
        condition: {
          selection: "selection",
          field: "key",
          type: "ordinal",
          title: "Number of medals"
        },
        value: "#aaa"
      }
    }
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("medalsPieView")).define("medalsPieView", ["Generators", "viewof medalsPieView"], (G, _) => G.input(_));
  main.variable(observer("viewof weight")).define("viewof weight", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.weight],
  interactivity: "brush",
  counts: true,
  normalized: true,
  spec: {
    title: "Weight of athletes",
    width: w,
    data: {
      name: "counts"
    },
    transform: [{ filter: "datum.key > 0" }],
    layer: [
      {
        mark: 'bar',
        encoding: {
          x: {
            field: "key",
            type: "quantitative",
            title: "Weight in kilos"
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Proportion of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: 'bar',
        selection: {
          brush: {
            name: "brush",
            type: "interval",
            encodings: ['x']
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "quantitative"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "brush", value: colorVega },
            value: "#aaa"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("weight")).define("weight", ["Generators", "viewof weight"], (G, _) => G.input(_));
  main.variable(observer("viewof sport")).define("viewof sport", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  interactivity: "selection",
  counts: true,
  spec: {
    title: "Sports",
    width: w,

    layer: [
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: null,
            axis: { labelAngle: 45 }
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        selection: {
          selection: {
            type: "multi",
            toggle: "!event.shiftKey",
            fields: ["key"]
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "selection", value: colorVega },
            value: "#aaa"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("sport")).define("sport", ["Generators", "viewof sport"], (G, _) => G.input(_));
  main.variable(observer("viewof sankeyView")).define("viewof sankeyView", ["facts","d3","height_sankey","invalidation","debounce"], function(facts,d3,height_sankey,invalidation,debounce)
{
  const width = 600;
  const dim = facts.dimension(d => [d.sex, d.sport]), // dimCountries = facts.dimension(identifyCountries, MULTIVALUED),
    id = dim.id();

  const group = dim.group().reduceCount();

  var sankey = d3
    .sankey()
    .nodeId(d => d.name)
    .nodeSort((a, b) => a - b)
    .nodeWidth(1)
    .extent([[0, 5], [width, height_sankey - 5]]);

  const color = d3.scaleOrdinal(["male"], ["#b5ffc6"]).unknown("#ebcfff");

  var svg = d3.create("svg").attr("viewBox", [0, 0, width, height_sankey]);

  function render() {
    redraw();
  }

  function getGraph(group) {
    const links = group.all().map(d =>
      Object.assign({
        names: d.key,
        value: d.value,
        source: d.key[0],
        target: d.key[1]
      })
    );
    const nodes = [
      ...new Set(links.reduce((acc, val) => acc.concat(val.names), []))
    ].map(name => Object.assign({ name }));

    return { links, nodes };
  }

  function redraw(immediate) {
    if (!sankey) return;
    var graph = getGraph(group),
      nodes = graph.nodes,
      links = graph.links;
    // mutable debug = graph;
    svg.selectAll('g').remove();
    // mutable debug = graph;
    if (links.length === 0) return;

    sankey({ nodes, links });

    svg
      .append("g")
      .selectAll("rect")
      .data(nodes)
      .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .append("title")
      .text(d => `${d.name}\n${d.value.toLocaleString()}`);

    svg
      .append("g")
      .attr("fill", "none")
      .selectAll("g")
      .data(links)
      .join("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => color(d.names[0]))
      .attr("stroke-width", d => d.width)
      .style("mix-blend-mode", "multiply")
      .append("title")
      .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);

    svg
      .append("g")
      .style("font", "10px sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => (d.x0 < width / 2 ? "start" : "end"))
      .text(d => d.name)
      .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${d.value.toLocaleString()}`);
  }

  function reset() {
    redraw();
  }

  invalidation &&
    invalidation.then(() => {
      dim.filterAll().dispose();
      group.dispose();
      facts.dispatch.on("redraw.view" + id, null).on("reset.view" + id, null);
    });

  facts.dispatch
    .on("redraw.view" + id, debounce(redraw, 50))
    .on("reset.view" + id, reset);
  redraw();
  return svg.node();
}
);
  main.variable(observer("sankeyView")).define("sankeyView", ["Generators", "viewof sankeyView"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`# How to create it: the guide`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## The setup`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I have been reading some dashboarding tutorials recently, and they all start with the requirements: python version, pandas, streamlit... Here you won't need to install anything thanks to [Observable's way](https://observablehq.com/@observablehq/user-manual?collection=@observablehq/introduction). 

If you want to understand how that works, go check these notebooks—they explain it perfectly.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Import your data`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`I have this very cool dataset of [athletes participating in 2016 Olympics](https://github.com/flother/rio2016). It contains their birthdate, their name, their sport and also the number and type of medals they got. d3.autoType automatically detects integers and date objects so I have basically nothing to do to wrangle my data!`
)});
  main.variable(observer("csv")).define("csv", ["d3"], function(d3){return(
d3.csv(
  "https://raw.githubusercontent.com/flother/rio2016/master/athletes.csv",
  d3.autoType
)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Here is a small preview using [@observablehq/inputs#Table](https://observablehq.com/@observablehq/inputs#Table):`
)});
  main.variable(observer()).define(["Table","csv"], function(Table,csv){return(
Table(csv, { columns: Object.keys(csv[0]).filter(c => c !== "info") })
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
---


## Vega`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`First import Vega Embed, then you can basically parse a Vega-Lite spec and show it in a cell. If you have no inspiration you should go to the [Vega documentation](https://vega.github.io/vega-lite/examples/) there's plenty of examples for you to just copy-paste. 

I will use [this example](https://vega.github.io/vega-lite/examples/histogram.html) to demonstrate. Of course you already have [a lot](https://observablehq.com/@vega/hello-vega-embed) of Observable notebooks explaining this.`
)});
  main.variable(observer("vegalite")).define("vegalite", ["require"], function(require){return(
require("@observablehq/vega-lite@0.3")
)});
  main.variable(observer()).define(["vegaliteSport"], function(vegaliteSport){return(
vegaliteSport
)});
  main.variable(observer("viewof vegaliteSport")).define("viewof vegaliteSport", ["vegalite","csv","w"], function(vegalite,csv,w){return(
vegalite({
  data: {
    values: csv,
    name: "csv"
  },
  width: w,
  mark: "bar",
  encoding: {
    x: {
      field: "sport",
      type: "ordinal"
    },
    y: {
      aggregate: "count",
      type: "quantitative"
    }
  }
})
)});
  main.variable(observer("vegaliteSport")).define("vegaliteSport", ["Generators", "viewof vegaliteSport"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`We use *viewof* to make the Vega View API accessible in Observable, it's also explained [here](https://observablehq.com/@mbostock/reactive-vega-lite). Our solution is already updating the data inside Vega but you might want to change the width from within another cell for example:   `
)});
  main.variable(observer("viewof interactiveWidthVega")).define("viewof interactiveWidthVega", ["slider","w","vegaliteSport"], function(slider,w,vegaliteSport)
{
  const form = slider({
    min: 100,
    max: w,
    step: 10,
    title: "Interactive width "
  });

  form.addEventListener('input', e => {
    vegaliteSport.width(form.value);
    vegaliteSport.runAsync();
  });

  return form;
}
);
  main.variable(observer("interactiveWidthVega")).define("interactiveWidthVega", ["Generators", "viewof interactiveWidthVega"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Now we would like to interconnect these views, meaning interactivity on one view filters the whole dataset and other views get updated. Vega offers an integrated solution (vertical concatenation, layers). But what if we want to connect the Vega views with d3 charts? Or even standard html inputs?

We provide a solution using Crossfilter, d3.dispatch and a little wrapper inside a function called **vegaSync**. Here’s how to use it:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`~~~js
import {vegaSync} from "@pierreleripoll/vegasync"
~~~`
)});
  main.variable(observer("vegaSync")).define("vegaSync", ["vegalite","sampleArray","d3","w","RangedMultiDimensionalFilter","Promises"], function(vegalite,sampleArray,d3,w,RangedMultiDimensionalFilter,Promises){return(
async function vegaSync({
  facts = null,
  dims = [],
  multivalued = false,
  actions = false,
  renderer = "canvas",
  spec = {},
  sample = 1000,
  interactivity = false,
  filter = null,
  counts = false,
  debug = false,
  normalized = false,
  scrollbar = false,
  group = null,
  reduce = null,
  top = Infinity,
  invalidation,
  visibility
}) {
  if (!facts) return vegalite(spec);

  await visibility();

  const dimension =
    typeof dims === "function"
      ? dims
      : dims instanceof Array
      ? d => dims.map(key => d[key])
      : d => [dims].map(key => d[key]);

  if (reduce !== null || group !== null) counts = true;

  // our dimension, with filter
  const xy = facts.dimension(dimension, multivalued);
  // same dimension unfiltered
  const xyUnfiltered =
    counts && facts.unfiltered.dimension(dimension, multivalued);

  //groups filtered/unfiltered
  const groupUnfiltered =
    counts &&
    (group !== null ? xyUnfiltered.group(group) : xyUnfiltered.group());
  const groupFiltered =
    counts && (group !== null ? xy.group(group) : xy.group());

  //reduce options
  const reduceUnfiltered =
    counts &&
    (reduce !== null ? reduce(groupUnfiltered) : groupUnfiltered.reduceCount());
  const reduceFiltered =
    counts &&
    (reduce !== null ? reduce(groupFiltered) : groupFiltered.reduceCount());

  //counts function
  let getCounts = function() {
    const resultFiltered =
        top === Infinity ? reduceFiltered.all() : reduceFiltered.top(top),
      resultUnfiltered =
        top === Infinity ? reduceUnfiltered.all() : reduceUnfiltered.top(top);

    if (debug) console.log({ resultFiltered, resultUnfiltered });

    const getKey = d => (Array.isArray(d.key) ? d.key.join(',') : d.key);

    const lookup = new Map(resultFiltered.map(d => [getKey(d), d.value]));

    if (debug) console.log(lookup);

    const unfilteredSize = normalized ? facts.size() : 1,
      filteredSize = normalized
        ? resultFiltered.reduce((acc, d) => acc + d.value, 0)
        : 1;

    const result = resultUnfiltered.map(d => {
      let o = {
        key: getKey(d),
        value: normalized ? d.value / unfilteredSize : d.value,
        filtered: normalized
          ? lookup.get(getKey(d)) / filteredSize
          : lookup.get(getKey(d))
      };
      return o;
    });
    if (debug) console.log(result);
    return result;
  };

  // feed the spec with initials values
  if (!spec.datasets) spec.datasets = {};
  if (!counts && !spec.datasets.all)
    spec.datasets.all = sampleArray(facts.all(), sample);

  if (!counts && !spec.datasets.filtered)
    spec.datasets.filtered = sampleArray(facts.allFiltered([xy]), sample);
  if (counts && !spec.datasets.counts) spec.datasets.counts = getCounts();

  const view = await vegalite(spec, { actions, renderer }),
    e = view.value,
    resetButton = d3
      .select(view)
      .append("a")
      .attr("href", "#void")
      .attr("class", "reset")
      .style("font-size", "small")
      .style('font-align', 'middle')
      .style("top", "0.3em")
      .style('left', `${w}px`)
      .style("position", "absolute")
      .on("click", reset);

  //remove scroll bars
  if (!scrollbar) d3.select(view).attr('style', 'overflow : hidden');

  const id = xy.id();
  invalidation &&
    invalidation.then(() => {
      xy.filterAll().dispose();
      xyUnfiltered && xyUnfiltered.dispose();
      reduceUnfiltered && reduceUnfiltered.dispose();
      reduceFiltered && reduceFiltered.dispose();
      e.finalize();
      facts.dispatch.on("redraw.view" + id, null);
      facts.dispatch.on("reset.view" + id, null);
      facts.dispatch.call('redraw');
    });

  if (interactivity) {
    e.addSignalListener(interactivity, function(name, value) {
      let chartFilter = null;
      //default interactions behaviors
      if (debug) console.log({ name, value, interactivity });
      if (filter === null) {
        switch (interactivity) {
          case "brush":
            if (value && Object.values(value).length > 0)
              chartFilter = RangedMultiDimensionalFilter(Object.values(value));
            else chartFilter = null;
            break;

          case "selection":
            const f = "key" in value ? value.key : value[dims[0]];
            if (f && f.length > 0) chartFilter = d => f.includes(d[0]);
            else chartFilter = null;
            break;
        }
      } else chartFilter = filter(name, value);

      xy.filter(chartFilter);
      facts.dispatch.call("redraw", undefined, { sourceId: id });
      resetButton.html(chartFilter ? "Reset" : "");
    });
  }

  // redraw: add filtered data
  let drawn = 0;
  async function redraw(args = {}) {
    const selfCalled =
      args !== undefined && args.sourceId !== undefined && id === args.sourceId;

    if (selfCalled) return;

    if (drawn++) return;
    await (visibility ? visibility() : Promises.delay(800));

    if (debug) console.log(spec.title, args, selfCalled, id);

    const viewData = e._runtime.data;

    let run = false;

    // if dataset has changed update "all"
    if (!counts && args.updateAll && viewData.hasOwnProperty('data')) {
      e.data("all", sampleArray(facts.all(), sample));
      run = true;
    }

    if (!counts && viewData.hasOwnProperty('filtered')) {
      e.data("filtered", sampleArray(facts.allFiltered([xy]), sample));
      run = true;
    }

    if (counts && viewData.hasOwnProperty('counts')) {
      e.data("counts", getCounts());
      run = true;
    }

    run && (await e.runAsync());

    drawn = 0;
  }

  function reset() {
    const { signals } = e.getState();
    if (signals['brush_x']) e.signal('brush_x', []);
    if (signals['brush_y']) e.signal('brush_y', []);
    if (interactivity === "selection") e.signal('selection_tuple', []);
    e.runAsync();
  }

  // redraw when notified
  facts.dispatch.on("redraw.view" + id, redraw);
  facts.dispatch.on("reset.view" + id, reset);

  redraw();
  drawn = 0;

  return view;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Import Crossfilter library and use this function to create a Crossfilter object, I like to name it **facts**: `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`~~~js
import {createFacts} from "@pierreleripoll/vegasync"
crossfilter = require("crossfilter2")
~~~`
)});
  main.variable(observer("createFacts")).define("createFacts", ["crossfilter","d3"], function(crossfilter,d3){return(
function createFacts(csv) {
  let facts = Object.assign(
    crossfilter(), // A solution for https://github.com/dc-js/dc.js/issues/988
    { dispatch: d3.dispatch("redraw", "reset"), unfiltered: crossfilter() }
  );

  facts.onChange(eventType => {
    if (eventType === 'dataAdded') {
      facts.unfiltered.add(facts.all());
      facts.dispatch.call("redraw", undefined, { updateAll: true });
    }
    if (eventType === 'dataRemoved') {
      facts.unfiltered.remove(() => true);
      facts.dispatch.call("redraw", undefined, { updateAll: true });
    }
  });
  facts.add(csv);
  facts.dispatch.call("redraw");

  return facts;
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`And now feed vegaSync with **facts**, the **dimension** you're using and the Vega-Lite **spec** :
~~~js
viewof vegaSport = vegaSync({
  facts,
  dims: d => [d.sport],

  spec: {
  ...
  }
~~~
`
)});
  main.variable(observer("viewof vegaSimpleSport")).define("viewof vegaSimpleSport", ["vegaSync","facts","w","csv","invalidation","visibility"], function(vegaSync,facts,w,csv,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  spec: {
    width: w,
    mark: "bar",
    data: {
      values: csv
    },
    encoding: {
      x: {
        field: "sport",
        type: "ordinal",
        axis: { labelAngle: 45 }
      },
      y: {
        aggregate: "count",
        type: "quantitative"
      },
      color: {
        value: "#4C78A8"
      }
    }
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("vegaSimpleSport")).define("vegaSimpleSport", ["Generators", "viewof vegaSimpleSport"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Right now it does nothing different (even though we used a small label angle for better visibility), you need to specify the dimension you're using like *d => [d.sport]* for example.
You can now acces a new dataset called **filtered**. It represents all the values filtered by the other charts in your dashboard. Try it now: go back to [the top of this notebook](https://observablehq.com/@pierreleripoll/vegasync#dateView) and filter the dataset with any chart and come back to see what has changed!`
)});
  main.variable(observer("viewof vegaConnectedSport")).define("viewof vegaConnectedSport", ["vegaSync","facts","w","invalidation","visibility"], function(vegaSync,facts,w,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  spec: {
    width: w,
    mark: "bar",
    data: {
      name: "filtered"
    },
    encoding: {
      x: {
        field: "sport",
        type: "ordinal",
        axis: { labelAngle: 45 }
      },
      y: {
        aggregate: "count",
        type: "quantitative"
      },
      color: {
        value: "#4C78A8"
      }
    }
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("vegaConnectedSport")).define("vegaConnectedSport", ["Generators", "viewof vegaConnectedSport"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Now that we filtered our dataset we would like to see what was filtered. We include a specific dataset called **all**, it gives us the possibility to show a second layer (grey one) representing the unfiltered data. Now we can clearly see how does our filter impact the dataset. 
~~~js
{...
  spec : {
   layer: [
      {
        data: {
          name: "all"
        } ...
      },
      {
        data: {
          name: "filtered"
        } ...
    ]
...}~~~  `
)});
  main.variable(observer("viewof vegaGhostSport")).define("viewof vegaGhostSport", ["vegaSync","facts","w","invalidation","visibility"], function(vegaSync,facts,w,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  spec: {
    width: w,
    layer: [
      {
        mark: "bar",

        data: {
          name: "all"
        },
        encoding: {
          x: {
            field: "sport",
            type: "ordinal",
            axis: { labelAngle: 45 }
          },
          y: {
            aggregate: "count",
            type: "quantitative"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",

        data: {
          name: "filtered"
        },
        encoding: {
          x: {
            field: "sport",
            type: "ordinal"
          },
          y: {
            aggregate: "count",
            type: "quantitative"
          },
          color: {
            value: "#4C78A8"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("vegaGhostSport")).define("vegaGhostSport", ["Generators", "viewof vegaGhostSport"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Did you notice we often want to count the number of records in a dataset ? Vega does it (aggregate + count) but Crossfilter has this functionality with better performances and it can be critical with a large dataset. That's why you can select this option and use the brand new dataset **counts**:
~~~js
{...
  counts : true,
  spec : {...
    data : {
      name : "counts"
    }
  ...}
...}~~~ 

Values will be exposed with **key** and **value** fields.
`
)});
  main.variable(observer("viewof vegaCountsSport")).define("viewof vegaCountsSport", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  counts: true,
  spec: {
    width: w,
    layer: [
      {
        mark: "bar",
        data: {
          name: "counts"
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: "sport",
            axis: { labelAngle: 45 }
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        selection: {
          selection: {
            type: "multi",
            toggle: "!event.shiftKey",
            fields: ["key"]
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            value: colorVega
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("vegaCountsSport")).define("vegaCountsSport", ["Generators", "viewof vegaCountsSport"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Finally for a proper dashboard you need **interactivity**. Vega-Lite offers [selections / brushes](https://vega.github.io/vega-lite/docs/selection.html) and you can use vegaSync to use it to filter with Crossfilter. Add the interactivity to the vega spec first, then specify *"selection"* or *"brush"* (works for 1D/2D brushing) to vegaSync. 
~~~js
{...
  interactivity : "brush",
  spec : {...
      selection: {
          brush: {
            name: "brush",
            type: "interval",
            encodings: ['x']
          }
        }...
  ...}
...}~~~ 
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Try it now ! Select one of the many sports available below or filter the age of the athletes: `
)});
  main.variable(observer("viewof vegaInteractivitySport")).define("viewof vegaInteractivitySport", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.sport],
  interactivity: "selection",
  counts: true,
  spec: {
    title: "Sports",
    width: w,
    data: {
      name: "counts"
    },
    layer: [
      {
        mark: "bar",
        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: null,
            axis: { labelAngle: 45 }
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        selection: {
          selection: {
            type: "multi",
            toggle: "!event.shiftKey",
            fields: ["key"]
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "selection", value: colorVega },
            value: "#aaa"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("vegaInteractivitySport")).define("vegaInteractivitySport", ["Generators", "viewof vegaInteractivitySport"], (G, _) => G.input(_));
  main.variable(observer("viewof age2")).define("viewof age2", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => {
    let birthdate = new Date(d.date_of_birth);
    let riodate = new Date(2016, 8, 5);
    let diff = new Date(riodate - birthdate);
    return [Math.abs(diff.getUTCFullYear() - 1970)];
  },
  interactivity: "brush",
  counts: true,
  spec: {
    title: "Age of athletes in 2016",
    width: w,

    layer: [
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "quantitative",
            title: "Age"
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        selection: {
          brush: {
            name: "brush",
            type: "interval",
            encodings: ['x']
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "quantitative"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "brush", value: colorVega },
            value: "#aaa"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("age2")).define("age2", ["Generators", "viewof age2"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`Did you notice ? They are two different colors for the unfiltered values, a light grey #ddd for the original dataset and a darker grey #aaa for the values filtered by the chart itself. This way you can see the difference between what is filtered by the other synchronised views and by the current view.  `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Fullscreen`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We're almost done for the basic dashboard, the only thing left is the fullscreen option. This is very important for a dashboard because multiple views can be difficult to see at the same time (especially in Observable). Import the fullscreen option from this notebook (work was initially adapted from [@mootari's notebook](https://observablehq.com/@mootari/fullscreen-layout-demo) by [@severo in his notebook](https://observablehq.com/@severo/two-columns-layout-in-fullscreen-mode)) and specify how you would like the fullscreen to behave.  `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`~~~js
import {fullscreen} from "@pierreleripoll/vegasync"
~~~`
)});
  main.variable(observer("fullscreen")).define("fullscreen", ["html","require"], function(html,require){return(
function fullscreen({
  className = 'custom-fullscreen',
  style = null,
  breakLayoutAtCell = 2,
  hideAfter = 9999,
  hideBefore = 0,
  left = 66,
  right = 33,
  button
} = {}) {
  //WORK INITIALLY FROM @mootari/fullscreen-layout-demo
  //THEN ADAPTED IN @severo/two-columns-layout-in-fullscreen-mode

  function hide({ hideAfter = Infinity, hideBefore = 0, reset = false } = {}) {
    let cells = document.getElementsByClassName('observablehq');
    for (let i = 0; i < cells.length; i++) {
      if ((i < hideBefore || i > hideAfter) && !reset)
        cells[i].style.display = "none";
      else cells[i].style.display = "block";
    }
    // console.log("Hide", cells);
    return cells;
  }

  // Superfluous bling.
  const buttonStyle =
    style != null
      ? style
      : 'font-size:1rem;font-weight:bold;padding:8px;background:hsl(50,100%,90%);border:5px solid hsl(40,100%,50%); border-radius:4px;box-shadow:0 .5px 2px 1px rgba(0,0,0,.2);cursor: pointer';

  button = button || html`<button style="${buttonStyle}">Toggle fullscreen!`;

  // Vanilla version for standards compliant browsers.
  if (document.documentElement.requestFullscreen) {
    button.onclick = () => {
      if (document.location.host.match(/static.observableusercontent.com/))
        hide({ hideBefore, hideAfter });
      const parent = document.documentElement;
      const cleanup = () => {
        if (document.fullscreenElement) return;
        parent.classList.remove(className);
        if (document.location.host.match(/static.observableusercontent.com/))
          hide({ reset: true });
        document.removeEventListener('fullscreenchange', cleanup);
      };
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        parent.requestFullscreen().then(() => {
          parent.classList.add(className);
          // Can't use {once: true}, because event fires too late.
          document.addEventListener('fullscreenchange', cleanup);
        });
      }
    };
  }

  // Because Safari is the new IE.
  // Note: let as in https://observablehq.com/@mootari/fullscreen-layout-demo.
  //       The button will not toggle between states
  else {
    const screenfull = require('screenfull@4.2.0/dist/screenfull.js').catch(
      () => window['screenfull']
    );
    // We would need some debouncing, in case screenfull isn't loaded
    // yet and user clicks frantically. Then again, it's Safari.
    button.onclick = () => {
      screenfull.then(sf => {
        const parent = document.documentElement;
        sf.request(parent).then(() => {
          const cleanup = () => {
            if (sf.isFullscreen) return;
            parent.classList.remove(className);
            sf.off('change', cleanup);
          };
          parent.classList.add(className);
          sf.on('change', cleanup);
        });
      });
    };
  }

  // Styles don't rely on the :fullscreen selector to avoid interfering with
  // Observable's fullscreen mode. Instead a class is applied to html during
  // fullscreen.
  return html`
    ${button}
    <style>
main.mw8 { max-width: 100vw }

html.${className} body, html.${className} body > div:not(.observablehq) {
  overflow: auto;
  height: 100vh;
  width: 100%;
}
html.${className} body, html.${className} body > div:not(.observablehq)  {
  display: block;
  background: white;
  width: auto;
  overflow: auto;
  position: relative;
}
.observablehq::before {
  height: 0;
}
html.${className} .observablehq {
  margin-left: ${left}vw;
  width: ${right}vw;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  min-height: 0 !important;
  max-height: 75vh;
  overflow: auto;
  padding: .5rem;
  box-sizing: border-box;
}
html.${className} .observablehq:nth-of-type(-n+${breakLayoutAtCell}) {
  float: left;
  width: ${left}vw;
  margin-left: 0;
}

  `;
}
)});
  main.variable(observer("fullscreenExample")).define("fullscreenExample", ["fullscreen","html"], function(fullscreen,html){return(
fullscreen({
  breakLayoutAtCell: 7,
  hideAfter: 9,
  hideBefore: 1,
  left: 51,
  right: 46,
  button: html`<button style="background: steelblue; padding : 0.4em;border-radius: 0.2em; border-color: black;color: white; font-size: 16px; /*position:fixed;right:20px;top:0;*/">Example`
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For example you may want to hide title/import cells in Observable but also where do you want to split your cells since the document will be divided in two columns.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`There you go ! You're now capable of creating your own dashboard in 5 minutes. Go back to the top of this notebook to have a proper example of a full dashboard. 

But there's still things you might want to know, then keep reading this 😇.
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
---


## Let's go further`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`With Crossfilter we can use personalized group/reduce functions. We made it possible to use it with vegaSync. You need to be careful our **reduce** option takes a group as parameter, and this **group** is either the default group or the result of the group function you've written.

Once again the [documentation on Github](https://github.com/crossfilter/crossfilter/wiki/API-Reference) is very well written !  
~~~js
{...
  reduce: group => group.reduceSum(d => d.weight),
  group d => Math.round(d.weight/2)
...}~~~ 
`
)});
  main.variable(observer("viewof weight2")).define("viewof weight2", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => d.weight,
  group: d => Math.floor(d / 10) * 10,
  counts: true,
  spec: {
    title: "Number of athletes for each weight category: group example",
    width: w,
    data: {
      name: "counts"
    },

    layer: [
      {
        mark: "bar",

        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            axis: { labelAngle: 0 }
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: "Weight category"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            value: colorVega
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("weight2")).define("weight2", ["Generators", "viewof weight2"], (G, _) => G.input(_));
  main.variable(observer("viewof weight3")).define("viewof weight3", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.nationality],
  //you can actually use group.reduceSum(d => d.weight) but this shows you how to a complex reduce
  reduce: group =>
    group.reduce(
      (p, v, nf) => {
        ++p.count;
        p.weight += v.weight;
        return p;
      },
      (p, v, nf) => {
        --p.count;
        p.weight -= v.weight;
        return p;
      },
      () => ({ weight: 0, count: 0 })
    ),
  selection: "selection",
  top: 50,
  spec: {
    title: "Total weight of each country (top 50): reduce example",
    width: w,
    data: {
      name: "counts"
    },

    layer: [
      {
        mark: "bar",

        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: "Nationality"
          },
          y: {
            field: "value.weight",
            type: "quantitative",
            title: "Weight sum in kilos"
          },
          color: {
            value: "#aaa"
          }
        }
      },
      {
        mark: "bar",

        selection: {
          selection: {
            type: "multi",
            toggle: "!event.shiftKey",
            fields: ["key"]
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: "Nationality"
          },
          y: {
            field: "filtered.weight",
            type: "quantitative"
          },
          color: {
            condition: { selection: "selection", value: colorVega },
            value: "#bbb"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("weight3")).define("weight3", ["Generators", "viewof weight3"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`We implemented *"brush"* and *"selection"* for interactivity but the behaviour isn't always perfect depending on the data type (strings, numbers or dates), dates can sometimes be a nightmare for example 🙄. That's why we left a **filter** option, it is a function that will take *(**name**,**value**)* - from [vega.addSignalListener(**interactivity**)](https://vega.github.io/vega/docs/api/view/#view_addSignalListener) - as parameters and should return a [Crossfilter filter function](https://github.com/square/crossfilter/wiki/API-Reference#dimension_filter) to apply on your chart's dimension. 

You can also use our own RangedMultiDimensionalFilter from this notebook 😉

~~~js
{...
  interactivity : "brush",
  filter: (name, value) => {
    if (value && Object.values(value).length > 0)
      return RangedMultiDimensionalFilter(
        Object.values(value).map(a => a.map(v => new Date(v)))
      );
    else return null;
  },
...}~~~ 
`
)});
  main.variable(observer("viewof monthBirth")).define("viewof monthBirth", ["vegaSync","facts","RangedMultiDimensionalFilter","w","colorVega","invalidation","visibility"], function(vegaSync,facts,RangedMultiDimensionalFilter,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [new Date(2012, new Date(d.date_of_birth).getMonth())],
  interactivity: "brush",
  filter: (name, value) => {
    if (value && Object.values(value).length > 0)
      return RangedMultiDimensionalFilter(
        Object.values(value).map(a => a.map(v => new Date(v)))
      );
    else return null;
  },
  counts: true,
  spec: {
    title: "Birth month of athletes : filter example",
    width: w,

    layer: [
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "temporal",
            timeUnit: "month",
            title: "Month"
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#aaa"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        selection: {
          brush: {
            name: "brush",
            type: "interval",
            encodings: ['x']
          }
        },
        encoding: {
          x: {
            field: "key",
            type: "temporal",
            timeUnit: "month"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: {
            condition: { selection: "brush", value: colorVega },
            value: "#bbb"
          }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("monthBirth")).define("monthBirth", ["Generators", "viewof monthBirth"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`
---



## Complex visualization`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Data visualization is not only about bar or line charts... I would like to create a [Sankey diagram](https://en.wikipedia.org/wiki/Sankey_diagram) out of this. I found [this notebook](https://observablehq.com/@d3/parallel-sets) from Mike Bostock (as always...) and will try to import it here with a few tweaks, for example I create my graph with only 5 sports to make it more compact. I use the new [importCell](https://observablehq.com/@mbostock/dataflow) function to make the import compact.`
)});
  main.variable(observer("height")).define("height", function(){return(
400
)});
  main.variable(observer("keys")).define("keys", function(){return(
["sex", "sport"]
)});
  main.variable(observer("graph")).define("graph", ["csv","keys","d3"], function(csv,keys,d3)
{
  let index = -1;
  let sports = [...new Set(csv.map(d => d.sport))].slice(0, 5);
  let data = csv.filter(d => sports.includes(d.sport));
  const nodes = [];
  const nodeByKey = new Map();
  const indexByKey = new Map();
  const links = [];

  for (const k of keys) {
    const keyValues = d3.group(data, d => d[k]);
    for (const key of keyValues.keys()) {
      const keyString = JSON.stringify([k, key]);
      if (nodeByKey.has(keyString)) continue;
      const node = { name: key, value: keyValues.get(key).length };
      nodes.push(node);
      nodeByKey.set(keyString, node);
      indexByKey.set(keyString, ++index);
    }
  }

  for (let i = 1; i < keys.length; ++i) {
    const a = keys[i - 1];
    const b = keys[i];
    const prefix = keys.slice(0, i + 1);
    const linkByKey = new Map();
    for (const d of data) {
      const names = prefix.map(k => d[k]);
      const key = JSON.stringify(names);
      const value = d.value || 1;
      let link = linkByKey.get(key);
      if (link) {
        link.value += value;
        continue;
      }
      link = {
        source: indexByKey.get(JSON.stringify([a, d[a]])),
        target: indexByKey.get(JSON.stringify([b, d[b]])),
        names,
        value
      };
      links.push(link);
      linkByKey.set(key, link);
    }
  }

  return { nodes, links };
}
);
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleOrdinal(["male"], ["#b5ffc6"]).unknown("#ebcfff")
)});
  main.variable(observer("columnWidth")).define("columnWidth", function(){return(
600
)});
  const child1 = runtime.module(define1).derive(["height","keys","graph","color",{name: "columnWidth", alias: "width"}], main);
  main.import("chart", child1);
  main.variable(observer()).define(["chart"], function(chart){return(
chart
)});
  main.variable(observer()).define(["md"], function(md){return(
md`This is pretty but it's not integrated in our dashboard yet. I need to connect it to Crossfilter. [Here's](#sankeyView) how I did it !`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Finally you can add pretty much any kind of visualizations you want with this system, even [HTML inputs](#sexView) or [markdown text](#countOfSelected):`
)});
  main.variable(observer("viewof minimumGoldMedal")).define("viewof minimumGoldMedal", ["facts","invalidation","slider"], async function*(facts,invalidation,slider)
{
  let dimension = facts.dimension(d => d.gold);

  const id = dimension.id();
  invalidation &&
    invalidation.then(() => {
      dimension.filterAll().dispose();
      facts.dispatch.on("redraw.view" + id, null);
      facts.dispatch.on("reset.view" + id, null);
      facts.dispatch.call("redraw");
    });

  let form = await slider({
    title: "Minimum of gold medals",
    min: 0,
    max: dimension.top(1)[0].gold,
    step: 1,
    value: 0
  });

  const resetHTML = html => {
    html.value = 0;
    html.dispatchEvent(new CustomEvent("input"));
  };

  const filter = filter => {
    dimension.filterAll().filter(filter);
    facts.dispatch.call('redraw');
  };

  facts.dispatch.on("redraw.view" + id, () => {});

  facts.dispatch.on("reset.view" + id, () => {
    resetHTML(form[0]);
    resetHTML(form[1]);
    filter(null);
  });

  form.addEventListener('change', e => {
    filter(d => d >= form.value);
  });

  yield form;
}
);
  main.variable(observer("minimumGoldMedal")).define("minimumGoldMedal", ["Generators", "viewof minimumGoldMedal"], (G, _) => G.input(_));
  main.variable(observer("viewof numberOfMedals")).define("viewof numberOfMedals", ["vegaSync","facts","w","colorVega","invalidation","visibility"], function(vegaSync,facts,w,colorVega,invalidation,visibility){return(
vegaSync({
  facts,
  dims: d => [d.gold],
  counts: true,
  normalized: true,

  spec: {
    title: "Gold medal-winning athletes",
    width: w,

    layer: [
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "ordinal",
            title: "Number of medals won"
          },
          y: {
            field: "value",
            type: "quantitative",
            title: "Number of athletes"
          },
          color: {
            value: "#ddd"
          }
        }
      },
      {
        mark: "bar",
        data: {
          name: "counts"
        },

        encoding: {
          x: {
            field: "key",
            type: "ordinal"
          },
          y: {
            field: "filtered",
            type: "quantitative"
          },
          color: { value: colorVega }
        }
      }
    ]
  },
  // specifique observable
  invalidation,
  visibility
})
)});
  main.variable(observer("numberOfMedals")).define("numberOfMedals", ["Generators", "viewof numberOfMedals"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`
</br></br>


---

## But what is really Crossfilter ?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Crossfilter is a very powerful tool to index a dataset and run queries on its dimensions. You need first to require it and then create a *facts* object that will hold the data and the filters.`
)});
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require("crossfilter2@1.5.4")
)});
  main.variable(observer("factsExample")).define("factsExample", ["crossfilter","csv"], function(crossfilter,csv){return(
crossfilter(csv)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`You should be able to access your data:`
)});
  main.variable(observer()).define(["factsExample"], function(factsExample){return(
factsExample.all()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Now let's try create a filter on it! First we need to create a dimension by giving crossfilter an accessor:`
)});
  main.variable(observer("sportDim")).define("sportDim", ["factsExample"], function(factsExample){return(
factsExample.dimension(d => d.sport)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Then use *filter* and *allFiltered* to get all the filtered items. Crossfilter's API has many powerfull tools and is available [here](https://github.com/square/crossfilter/wiki/API-Reference).`
)});
  main.variable(observer("result_filter_crossfilter")).define("result_filter_crossfilter", ["sportDim","factsExample"], function(sportDim,factsExample)
{
  //you can try to add 'golf' in the list inside the filter
  sportDim.filter(sport => ['fencing'].includes(sport));
  return factsExample.allFiltered();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`---

## Credits

Developed for the [LIRIS M2i project](https://projet.liris.cnrs.fr/mi2/) by [Philippe Rivière](https://observablehq.com/@fil) and [Pierre Ripoll](https://observablehq.com/@pierreleripoll) with the help of [Romain Vuillemot](https://observablehq.com/@romsson) and [Julien Barnier](https://observablehq.com/@juba).

---
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
</br></br></br></br>

---
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Dashboard technical`
)});
  main.variable(observer("facts")).define("facts", ["createFacts","csv"], function(createFacts,csv){return(
createFacts(csv)
)});
  main.define("initial debug", function(){return(
true
)});
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer("height_sankey")).define("height_sankey", function(){return(
600 * 0.6
)});
  main.variable(observer()).define(["md"], function(md){return(
md`


## Imports`
)});
  main.variable(observer("debounce")).define("debounce", function(){return(
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
)});
  main.variable(observer("sampleArray")).define("sampleArray", function(){return(
function sampleArray(a, n, random) {
  return a.slice(0, n);
}
)});
  main.variable(observer("RangedMultiDimensionalFilter")).define("RangedMultiDimensionalFilter", function(){return(
function(f) {
  if (!f) return null;
  return value =>
    value.every((v, i) => !f[i] || (v - f[i][0]) * (v - f[i][1]) <= 0);
}
)});
  main.variable(observer()).define(["html"], function(html){return(
html`
<style>
  .table-2 .pager {
    max-width: none
  }
.table-2 table {
    max-width: none
  }
</style>
`
)});
  main.variable(observer("colorVega")).define("colorVega", function(){return(
"#4C78A8"
)});
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  main.import("slider", child2);
  const child3 = runtime.module(define3);
  main.import("Table", child3);
  main.variable(observer("W0")).define("W0", function(){return(
1200
)});
  main.variable(observer("w")).define("w", ["width","W0"], function(width,W0){return(
width >= W0 ? Math.floor(width * 0.4) : width * 0.75
)});
  const child4 = runtime.module(define4);
  main.import("table", child4);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-sankey@0.12", "d3-array@^2.2")
)});
  return main;
}
