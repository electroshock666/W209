// https://observablehq.com/@pandawhisperer/binance-futures-with-forward-rate@733
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Binance Futures with Forward Rate`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Computes the forward rate and graphs it along with the price of two Binance futures pairs for a given asset.`
)});
  main.variable(observer()).define(["html"], function(html){return(
html`<div id='container' style="height:480px;position:relative;"></div>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Inputs`
)});
  main.variable(observer("viewof symbol")).define("viewof symbol", ["select"], function(select){return(
select({
  title: "Asset Symbol",
  description: "Underlying asset symbol",
  options: ["BTC", "ETH"],
  value: "ETH"
})
)});
  main.variable(observer("symbol")).define("symbol", ["Generators", "viewof symbol"], (G, _) => G.input(_));
  main.variable(observer("viewof expDate")).define("viewof expDate", ["select"], function(select){return(
select({
  title: "Expiration Date",
  options: ["09/25/2020", "12/25/2020"],
  value: "12/25/2020"
})
)});
  main.variable(observer("expDate")).define("expDate", ["Generators", "viewof expDate"], (G, _) => G.input(_));
  main.variable(observer("viewof interval")).define("viewof interval", ["select"], function(select){return(
select({
  title: 'Time interval',
  options: ["1h", "2h", "4h", "1d"],
  value: "4h"
})
)});
  main.variable(observer("interval")).define("interval", ["Generators", "viewof interval"], (G, _) => G.input(_));
  main.variable(observer("symbols")).define("symbols", ["expDate","symbol","format"], function(expDate,symbol,format)
{
  const date = new Date(expDate);
  return [`${symbol}USD_PERP`, `${symbol}USD_${format(expDate, 'yymmdd')}`]
}
);
  main.variable(observer("colors")).define("colors", function(){return(
{
    Spot: 'steelblue',
    Future: 'slategray',
    ForwardRate: 'orange'
  }
)});
  main.variable(observer("chart")).define("chart", ["picasso","data","colors","line"], function(picasso,data,colors,line)
{
  picasso.chart({
    element: document.querySelector('#container'),
    data: { type: 'matrix', data },
    settings: {
      collections: [{
        key: 'lines',
        data: {
          extract: {
            field: 'Date',
            props: {
              s: { field: 'Spot' },
              f: { field: 'Future' },
              m: { field: 'Forward Rate' }
            }
          }
        }
      }],
      scales: {
        price: {
          data: { field: 'Future' },
          invert: true,
          expand: 0.2
        },
        rate: {
          data: { field: 'Forward Rate' },
          invert: true,
          expand: 0.2
        },
        time: {
          data: { extract: { field: 'Date' } } 
        }
      },
      components: [{
        type: 'legend-cat',
        dock: 'top',
        scale: {
          type: 'categorical-color',
          data: ['Spot', 'Future', 'Foward Rate'],
          range: [colors.Spot, colors.Future, colors.ForwardRate]
        }
      }, {
        type: 'axis',
        dock: 'left',
        scale: 'price',
        formatter: {
          type: 'd3-number',
          format: '$,.5r'
        },
        settings: {
          labels: {
              fill: colors.Future
          }
        },
      }, {
        type: 'axis',
        dock: 'right',
        scale: 'rate',
        settings: {
          labels: {
              fill: colors.ForwardRate
          }
        },
        formatter: {
          type: 'd3-number',
          format: '.0%'
        }
      }, {
        type: 'axis',
        dock: 'bottom',
        scale: 'time',
        formatter: {
          type: 'd3-time',
          format: '%Y-%m-%d'
        }
      }, line('price', 's', colors.Spot),
         line('price', 'f', colors.Future),
         line('rate', 'm', colors.ForwardRate)
      ]
    }
  })
}
);
  main.variable(observer("box")).define("box", function(){return(
function(scale, ref) {
  return {
    type: 'box',
    data: {
      extract: {
        field: 'stick',
        props: {
          min:   { field: 'low' },
          start: { field: 'open-close-low' },
          open:  { field: 'open' },
          close: { field: 'close' },
          end:   { field: 'open-close-high' },
          max:   { field: 'high' }
        }
      }
    },
    settings: {
      major: { scale: 'time' },
      minor: { scale, ref },
      box: {
        fill: function(d) {
          return d.datum.open.value > d.datum.close.value ? 'green' : 'red';
        }
      }
    }
  }
}
)});
  main.variable(observer("line")).define("line", function(){return(
function(scale, ref, stroke, dash) {
  return {
    type: 'line',
    data: {
      collection: 'lines'
    },
    settings: {
      coordinates: {
        major: { scale: 'time' },
        minor: { scale, ref }
      },
      layers: {
        curve: 'monotone',
        line: {
          stroke,
          strokeDasharray: dash
        }
      }
    }
  };
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Chart Data
Retrieve candlestick data for two symbols and compute the forward rate.`
)});
  main.variable(observer("data")).define("data", ["symbols","candles","interval","_","forwardRate","expDate"], async function(symbols,candles,interval,_,forwardRate,expDate)
{
  const data    = await Promise.all(symbols.map(s => candles(s, interval)));
  const length  = Math.min(...data.map(d => d.length));
  const rows    = _.zip.apply(null, symbols.map((s, i) => data[i].slice(-length)));
  return [
    ['Date', 'Spot', 'Future', 'Forward Rate'],
    ...rows.map((r, i) => [r[0].date, r[0].close, r[1].close, 
                           forwardRate(r[0].close, r[1].close, r[0].date, new Date(expDate))])
  ]
}
);
  main.variable(observer()).define(["md","tex"], function(md,tex){return(
md`### Forward Rate

Computes the forward rate given a spot price, a futures price, the current date, and the expiration date.

For a given asset with spot price ${tex`S_{t}`}, the price of a corresponding futures contract with expiration ${tex`T`} is given by ${tex`F_{t}^{T} = S_{t} e^{r(T-t)}`}. Solving for ${tex`r`}, we obtain the formula ${tex`r = \frac{\log(F_{t}^{T}/S_{t})}{T-t}`} to compute the *implicit rate of return*, or forward rate.

In order to obtain an annualized rate (APR), we compute the time to expiration as a fraction of one year.`
)});
  main.variable(observer("forwardRate")).define("forwardRate", function(){return(
function forwardRate(spot, future, date, expDate) {
  return Math.log(future / spot) * (365*24*60*60*1000) / (expDate.valueOf() - date.valueOf())
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Candlestick data

Fetch candlestick data from Binance Futures API, given a symbol and an interval.`
)});
  main.variable(observer("candles")).define("candles", function(){return(
async function candles(symbol, interval) {
  const endpoint = 'https://dapi.binance.com/dapi/v1/klines'
  const response = await fetch(`${endpoint}?symbol=${symbol}&interval=${interval}`)
  const data     = await response.json()
  return data.map(d => ({
    date:  d[0],
    open: +d[1],
    high: +d[2],
    low:  +d[3],
    close:+d[4]
  }))
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Libraries`
)});
  main.variable(observer("_")).define("_", ["require"], function(require){return(
require('underscore')
)});
  main.variable(observer("format")).define("format", ["require"], function(require){return(
require('dateformat')
)});
  main.variable(observer("picasso")).define("picasso", ["require"], function(require){return(
require("picasso.js")
)});
  const child1 = runtime.module(define1);
  main.import("select", child1);
  return main;
}
