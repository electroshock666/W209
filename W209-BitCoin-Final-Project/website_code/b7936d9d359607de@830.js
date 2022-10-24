// https://observablehq.com/@jeffrey-adams-ucb/w209-final-project-cryptocurrency-trader-dashboard/2@830
import define1 from "./22237af2e5cc56fc@2664.js";
import define2 from "./e93997d5089d7165@2303.js";
import define3 from "./fe75266b576156b6@733.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["tickers_full.csv",new URL("./files/1f42aec1f9e49c24fc5a1b021782f7db6953e5158969bd9de3762ccaec6ce1fe153682c885ea7910db5dbc3e4eecffd056e6d7f010807ec0de0ce0ae09c66744",import.meta.url)],["events@2.csv",new URL("./files/6b520169f19cf6b165f0ccb3244fb78857563bd9574348b03c2ab1d6b648fb5afad1d8e4ea1594bc788dffadb03d7f6bc9db17f6059d8e99c25ef221678ae16f",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# W209 Final Project - Cryptocurrency Trader Dashboard
Team 1: Jeffrey Adams, Pow Chang, Sweta Bhattacharya, Matt White `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`

Here you can access the Cryptocurrency and Stock Dashboard, for the best experience please click the "Fullscreen" button`
)});
  main.variable(observer("FULLSCREEN")).define("FULLSCREEN", ["fullscreen","html"], function(fullscreen,html){return(
fullscreen({
  breakLayoutAtCell: 7,
  hideAfter: 13,
  hideBefore: 2,
  left: 51,
  right: 46,
  button: html`<button style="background: steelblue; padding : 0.4em;border-radius: 0.2em; border-color: black;color: white; font-size: 16px; /*position:fixed;right:20px;top:0;*/">Fullscreen`
})
)});
  main.variable(observer("viewof d1")).define("viewof d1", ["date"], function(date){return(
date({
  title: "Start Date", 
  min: "2015-01-01",
  max: "2021-04-31",
  value: "2015-01-01",
  description: "Choose start date for filters"
})
)});
  main.variable(observer("d1")).define("d1", ["Generators", "viewof d1"], (G, _) => G.input(_));
  main.variable(observer("viewof chart_returns")).define("viewof chart_returns", ["vl","local_ticker_check","filtered_data"], function(vl,local_ticker_check,filtered_data)
{
  const hover = vl.selectPoint('hover')
    .encodings('x') 
    .on('mouseover') 
    .toggle(false)   
    .nearest(true);  

  const isHovered = hover.empty(false);
  

  const line = vl.markLine()
  .title('Returns')
  .encode(
    vl.x().fieldT('Date'),
    vl.y().fieldQ('Returns').title('Returns (XXXXX Add the units here)'),
    vl.color().fieldN('Symbol').scale({ domain: local_ticker_check, scheme:'category10'}),
  );
  

  const base = line.transform(vl.filter(isHovered));

  const label = {align: 'left', dx: 5, dy: -5};
  const white = {align: 'left', dx: 5, dy: -5, stroke: 'white', strokeWidth: 2};

  return vl.data(filtered_data)
    .layer(
      line,
      vl.markRule({color: '#000'})
        .transform(vl.filter(isHovered))
        .encode(vl.x().fieldT('Date')),
      line.markCircle()
        .params(hover) 
        .encode(vl.opacity().if(isHovered, vl.value(1)).value(0)),
      base.markText(label, white).encode(vl.text().fieldQ('Returns').format('.000')),
      base.markText(label).encode(vl.text().fieldQ('Returns').format('.000')),
    )
    .width(700)
    .height(400)
    .render();
}
);
  main.variable(observer("chart_returns")).define("chart_returns", ["Generators", "viewof chart_returns"], (G, _) => G.input(_));
  main.variable(observer("chart_returns_atr")).define("chart_returns_atr", ["vl","local_ticker_check","filtered_data"], function(vl,local_ticker_check,filtered_data)
{
  
  // define our base line chart of stock prices
  const point = vl.markPoint()
  .title('ATR vs Returns')
  .select(
    vl.selectInterval().bind('scales')
  )
  .encode(
    vl.x().fieldQ('ATR').axis({ labelAngle: 45 }),
    vl.y().fieldQ('Returns').title('Returns (XXXXX Add the units here)'),
    vl.color().fieldN('Symbol').scale({ domain: local_ticker_check, scheme:'category10'}),
    //Need to figure out how to round tooltip
    vl.tooltip([
      {"field": "Date", "type": "temporal", "title": "Date"},
      {"field": "ATR", "type": "quantitative", "title": "ATR", "format": ".2f"},
      {"field": "Returns", "type": "quantitative", "title": "Returns", "format": ".3f"}
    ]),
        

  );

  return vl.data(filtered_data)
    .layer(
      point
    )
    .width(700)
    .height(400)
    .render();
}
);
  main.variable(observer("viewof local_ticker_check")).define("viewof local_ticker_check", ["checkbox","tickers"], function(checkbox,tickers){return(
checkbox({
  title: "Tickers",
  description: "Please select one or more stock tickers",
  options: tickers,
  value: ["BTC-USD", "ETH-USD"],
})
)});
  main.variable(observer("local_ticker_check")).define("local_ticker_check", ["Generators", "viewof local_ticker_check"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], function(html){return(
html `<br>`
)});
  main.variable(observer("viewof d2")).define("viewof d2", ["date"], function(date){return(
date({
  title: "End Date", 
  min: "2015-01-01",
  max: "2021-04-31",
  value: "2021-05-01",
  description: "Choose end date for filters"
})
)});
  main.variable(observer("d2")).define("d2", ["Generators", "viewof d2"], (G, _) => G.input(_));
  main.variable(observer()).define(["vl","filtered_data"], function(vl,filtered_data){return(
vl.data(filtered_data)
.title('Candle Stick')

  .encode(
    vl.x().type('temporal')
          //.timeUnit("day")
          .field('Date')
          .axis({
            title: "Time",
            format: "%m/%d/%y"
          }),
    vl.y().type('quantitative')
          .scale({ zero: false,type: 'symlog' })
          .axis({
            title: "Price ($)"
          }),
    vl.color()
      .condition({
        test: "datum.Open < datum.Close", 
        value: "#06982d"
      })
      .value("#ae1325"),
  vl.tooltip([
    {"field": "Date", "type": "temporal", "title": "Date"},
    {"field": "Symbol", "type": "nominal", "title": "Symbol"},
      {"field": "Open", "type": "quantitative", "title": "Open", "format": ".0f"},
      {"field": "Close", "type": "quantitative", "title": "Close", "format": ".0f"},
    {"field": "High", "type": "quantitative", "title": "High", "format": ".0f"},
    {"field": "Low", "type": "quantitative", "title": "Low", "format": ".0f"}
    ])
  )

  .layer(
    vl.markBar()
      .encode(
        vl.y().field('Open'),
        vl.y2().field('Close')
      ),
    vl.markRule()
      .encode(
        vl.y().field('Low'),
        vl.y2().field('High')
      )
  )
  .width(700)
  .height(400)
  .render()
)});
  main.variable(observer("viewof chart_events")).define("viewof chart_events", ["vl","local_event_check","filtered_data","local_ticker_check","filtered_event_data"], function(vl,local_event_check,filtered_data,local_ticker_check,filtered_event_data)
{
  // define our base line chart of stock prices
  const rect = vl.markRect()
  .title('Events')
  .encode(
    vl.x().fieldT('Date'),
    vl.x2().fieldT('End_date'),
    vl.color().fieldN('type').scale({ domain: local_event_check, scheme:'category10'}),
    vl.tooltip('event'),
  );

   const line = vl.markLine().data(filtered_data)
  .encode(
    vl.x().fieldT('Date').title('Date'),
    vl.y().fieldQ('Close').scale({domain: [0,70000],type: 'symlog'}),
    //vl.y().fieldQ('Close'),
    vl.color().fieldN('Symbol').scale({ domain: local_ticker_check, scheme:'category10'}),
      vl.tooltip([
    {"field": "Date", "type": "temporal", "title": "Date"},
    {"field": "Symbol", "type": "nominal", "title": "Symbol"},
      {"field": "Open", "type": "quantitative", "title": "Open", "format": ".0f"},
      {"field": "Close", "type": "quantitative", "title": "Close", "format": ".0f"},
    {"field": "High", "type": "quantitative", "title": "High", "format": ".0f"},
    {"field": "Low", "type": "quantitative", "title": "Low", "format": ".0f"}
    ])
  );
  
  return vl.data(filtered_event_data)
  
    .layer(
      line, rect
    )
    .width(700)
    .height(400)
    .render()
}
);
  main.variable(observer("chart_events")).define("chart_events", ["Generators", "viewof chart_events"], (G, _) => G.input(_));
  main.variable(observer("viewof local_event_check")).define("viewof local_event_check", ["checkbox","type"], function(checkbox,type){return(
checkbox({
  title: "Events",  
  description: "Please select events to display",
  options: type,
  value: ["BTC History"]
})
)});
  main.variable(observer("local_event_check")).define("local_event_check", ["Generators", "viewof local_event_check"], (G, _) => G.input(_));
  main.variable(observer()).define(["html"], function(html){return(
html `<img style="float: right;" src="https://electroshock666.static.observableusercontent.com/files/8430f0e7a92d9636683a981975ac0c886fd6b6b12906134fa7fba8b047f9c261d823ddbe51e9178396d411c1304f55cd082509093dac2fd886b4d375b6ff05d6?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27logo.png&Expires=1626436800000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=oCIFDZjSwZOEgnmwiDSmaw~S4qCVmOaJDdhHXvbIE99f6XWsetf2LFQitqOotI-PYL5018Hq9UEbQu29fAlg287OYunosrVtDOLpQ165hML4JxGUqZmroaKsAsKDvwoM6nBR2PGuo69oIUBc1vK6rq-RNWVdJN3CYK-JxMJL3NiKn1VLm5knnSPwaNReolR5Xeivi7EZSz8tnGuCZ1~N4Z4Useia--RkfMnDKywdRaXST~YKGN2RGky64BgLtDutiJT4G-VxTj07WdmeK~7MBDVhw2hpzKhLOLQaVPVeBtMQwhGglbjzmt4rcv9A7ZxmGPOZ86TgX5tYh0B-1zOQyw__">`
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
  main.variable(observer()).define(["md"], function(md){return(
md `## Global Configuration `
)});
  main.variable(observer("debug")).define("debug", function(){return(
true
)});
  main.variable(observer("W0")).define("W0", function(){return(
1200
)});
  main.variable(observer("w")).define("w", ["width","W0"], function(width,W0){return(
width >= W0 ? Math.floor(width * 0.4) : width * 0.75
)});
  main.variable(observer("height_sankey")).define("height_sankey", function(){return(
800 * 0.6
)});
  main.variable(observer("colorVega")).define("colorVega", function(){return(
"#4C78A8"
)});
  main.variable(observer("interval")).define("interval", function(){return(
'1d'
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Internal Functions`
)});
  main.variable(observer("brush")).define("brush", ["vl"], function(vl){return(
vl
    .selectInterval()
    .encodings('x')
    .name('brush')
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
  main.variable(observer("RangedMultiDimensionalFilter")).define("RangedMultiDimensionalFilter", function(){return(
function(f) {
  if (!f) return null;
  return value =>
    value.every((v, i) => !f[i] || (v - f[i][0]) * (v - f[i][1]) <= 0);
}
)});
  main.variable(observer("candlestick")).define("candlestick", ["vl","width"], function(vl,width){return(
function candlestick(candles, trades){
return vl
  .data(candles)
  .vconcat(
    {
      "width": "container",
      "encoding": {"x": {"field": "time", "type": "temporal", "title": null}},
      "layer": [
        {
          "mark": "bar",
          "encoding": {
            "y": {
              "field": "indicators.ohclv.volume",
              "type": "quantitative",
              "axis": {"title": "Volume"}
            },
            "opacity": {"value": 0.2}
          }
        },
        {
          "encoding": {
            "y": {
              "type": "quantitative",
              "scale": {"zero": false},
              "axis": {"title": "Price"}
            },
            "color": {
              "condition": {
                "test": "datum.indicators.ohclv.open < datum.indicators.ohclv.close",
                "value": "#06982d"
              },
              "value": "#ae1325"
            }
          },
          "layer": [
            {
              "mark": "bar",
              "encoding": {
                "y": {"field": "indicators.ohclv.open"},
                "y2": {"field": "indicators.ohclv.close"}
              }
            },
            {
              "mark": "rule",
              "encoding": {
                "y": {"field": "indicators.ohclv.low"},
                "y2": {"field": "indicators.ohclv.high"}
              }
            },
            {
              "data": {
                "values": trades
              },
              "layer": [
                {
                  "mark": {"type": "point", "xOffset": -11},
                  "encoding": {
                    "size": {"value": 400},
                    "stroke": {"value": "green"},
                    "fill": {"value": "limegreen"},
                    "x": {"field": "entryTime"},
                    "y": {"field": "entryPrice"},
                    "shape": {"value": "arrow"},
                    "angle": {"value": 90}
                  }
                },
                {
                  "mark": {"type": "point", "xOffset": 11},
                  "encoding": {
                    "size": {"value": 400},
                    "stroke": {"value": "red"},
                    "fill": {"value": "pink"},
                    "x": {"field": "exitTime"},
                    "y": {"field": "exitPrice"},
                    "shape": {"value": "arrow"},
                    "angle": {"value": -90}
                  }
                }
              ]
            },
            {
              "selection": {
                "label": {
                  "type": "single",
                  "nearest": true,
                  "on": "mouseover",
                  "encodings": ["x"],
                  "empty": "none"
                }
              },
              "mark": "point",
              "encoding": {
                "opacity": {
                  "condition": {"selection": "label", "value": 1},
                  "value": 0
                },
                "y": {"field": "indicators.ohclv.close"}
              }
            },
            {
              "transform": [{"filter": {"selection": "label"}}],
              "layer": [
                {
                  "mark": {"type": "rule", "color": "gray"},
                  "encoding": {"x": {"type": "temporal", "field": "time"}}
                },
                {
                  "encoding": {
                    "text": {
                      "type": "quantitative",
                      "field": "indicators.ohclv.close"
                    },
                    "x": {"type": "temporal", "field": "time"},
                    "y": {
                      "type": "quantitative",
                      "field": "indicators.ohclv.close"
                    }
                  },
                  "layer": [
                    {
                      "mark": {
                        "type": "text",
                        "stroke": "white",
                        "strokeWidth": 2,
                        "align": "left",
                        "dx": 5,
                        "dy": -5
                      }
                    },
                    {
                      "mark": {
                        "type": "text",
                        "align": "left",
                        "dx": 5,
                        "dy": -5
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "resolve": {"scale": {"y": "independent"}}
    },
    {
      "width": "container",
      "layer": [
        {
          "height": 120,
          "encoding": {
            "y": {
              "field": "indicators.rsi",
              "type": "quantitative",
              "scale": {"zero": false},
              "axis": {"title": "RSI"}
            },
            "x": {"field": "time", "type": "temporal", "axis": {"title": null}}
          },
          "layer": [
            {"mark": "line"},
            {
              "selection": {
                "label": {
                  "type": "single",
                  "nearest": true,
                  "on": "mouseover",
                  "encodings": ["x"],
                  "empty": "none"
                }
              },
              "mark": "point",
              "encoding": {
                "opacity": {
                  "condition": {"selection": "label", "value": 1},
                  "value": 0
                }
              }
            }
          ]
        },
        {
          "transform": [{"filter": {"selection": "label"}}],
          "layer": [
            {
              "mark": {"type": "rule", "color": "gray"},
              "encoding": {"x": {"type": "temporal", "field": "time"}}
            },
            {
              "encoding": {
                "text": {"type": "quantitative", "field": "indicators.rsi"},
                "x": {"type": "temporal", "field": "time"},
                "y": {"type": "quantitative", "field": "indicators.rsi"}
              },
              "layer": [
                {
                  "mark": {
                    "type": "text",
                    "stroke": "white",
                    "strokeWidth": 2,
                    "align": "left",
                    "dx": 5,
                    "dy": -5
                  }
                },
                {"mark": {"type": "text", "align": "left", "dx": 5, "dy": -5}}
              ]
            }
          ]
        },
        {
          "mark": "rule",
          "encoding": {"y": {"datum": 70}, "color": {"value": "orange"}}
        },
        {
          "mark": "rule",
          "encoding": {"y": {"datum": 30}, "color": {"value": "orange"}}
        }
      ]
    }
  )
  .config({ concat: { spacing: 0 }, width: width })
  .autosize({ type: "fit-x", contains: "padding" })
  .render()
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Data`
)});
  main.variable(observer("filtered_data")).define("filtered_data", ["temp_filter","d1","d2"], function(temp_filter,d1,d2){return(
temp_filter.filter(d => d.Date >= d1 && d.Date  <= d2)
)});
  main.variable(observer("tickers2")).define("tickers2", ["local_ticker_check"], function(local_ticker_check){return(
new Set(local_ticker_check)
)});
  main.variable(observer("temp_filter")).define("temp_filter", ["local_data","tickers2"], function(local_data,tickers2){return(
local_data.filter(d => tickers2.has(d.Symbol))
)});
  main.variable(observer("local_data")).define("local_data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("tickers_full.csv").csv()
)});
  main.variable(observer("filtered_event_data")).define("filtered_event_data", ["local_event_data","d1","d2"], function(local_event_data,d1,d2){return(
local_event_data.filter(d => d.Date >= d1 && d.Date  <= d2)
)});
  main.variable(observer("local_event_data")).define("local_event_data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("events@2.csv").csv()
)});
  main.variable(observer("symbol")).define("symbol", function(){return(
'BTCUSD_PERP'
)});
  main.variable(observer("candle_data")).define("candle_data", ["candles","symbol","interval"], function(candles,symbol,interval){return(
candles(symbol, interval)
)});
  main.variable(observer("facts")).define("facts", ["createFacts","local_data"], function(createFacts,local_data){return(
createFacts(local_data)
)});
  main.variable(observer("factsExample")).define("factsExample", ["crossfilter","local_data"], function(crossfilter,local_data){return(
crossfilter(local_data)
)});
  main.variable(observer("sportDim")).define("sportDim", ["factsExample"], function(factsExample){return(
factsExample.dimension(d => d.Close)
)});
  main.variable(observer("sampleArray")).define("sampleArray", function(){return(
function sampleArray(a, n, random) {
  return a.slice(0, n);
}
)});
  main.variable(observer("tickers")).define("tickers", function(){return(
['BTC-USD','ETH-USD', 'AAPL', 'TSLA', 'MSFT', 'NVDA', 'SQ', 'PYPL', 'MSTR', 'JPM', '^IXIC', '^DJI', '^GSPC', 'GC=F', "CL=F"]
)});
  main.variable(observer("type")).define("type", function(){return(
['BTC History', 'Global', 'Elon', 'Financial']
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Import Libraries `
)});
  main.variable(observer("vegalite")).define("vegalite", ["require"], function(require){return(
require("@observablehq/vega-lite@0.3")
)});
  const child1 = runtime.module(define1);
  main.import("vegaSync", child1);
  const child2 = runtime.module(define1);
  main.import("createFacts", child2);
  main.variable(observer("crossfilter")).define("crossfilter", ["require"], function(require){return(
require("crossfilter2@1.5.4")
)});
  const child3 = runtime.module(define1);
  main.import("fullscreen", child3);
  const child4 = runtime.module(define2);
  main.import("slider", child4);
  main.import("button", child4);
  main.import("select", child4);
  main.import("text", child4);
  main.import("radio", child4);
  main.import("checkbox", child4);
  main.import("number", child4);
  main.import("date", child4);
  const child5 = runtime.module(define3);
  main.import("candles", child5);
  main.import("forwardRate", child5);
  return main;
}
