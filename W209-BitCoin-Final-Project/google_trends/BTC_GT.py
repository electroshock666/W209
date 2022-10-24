from pytrends.request import TrendReq
import pandas as pd
import time
import matplotlib.pyplot as plt
import requests
import json 
import shrimpy
import plotly.graph_objects as go
import numpy as np

# public_key = '4acf1779b2b34f67d3094de399a24f1180009a24d8518fb7b835e5cc0e480225'
# secret_key = '06ac1405626e7acb2bf680a6d4fbf74dcab0b0c8783e09dfc9267d999803a0870fd3765c1d9355b2c5e819c5c924db4fd2aaed9caa6a0a2e3242434f12856aa9'
# client = shrimpy.ShrimpyApiClient(public_key, secret_key)

# candles = client.get_candles(
#     'bittrex',   # exchange
#     'BTC',      # base_trading_symbol
#     'USDT',     # quote_trading_symbol
#     '1d',       # interval
#     '2015-05-19T00:00:00.000Z'
# )

# dates = []
# open_data = []
# high_data = []
# low_data = []
# close_data = []

# for candle in candles:
#     dates.append(candle['time'])
#     open_data.append(candle['open'])
#     high_data.append(candle['high'])
#     low_data.append(candle['low'])
#     close_data.append(candle['close'])


# fig = go.Figure(data=[go.Candlestick(x=dates,
#                        open=open_data, high=high_data,
#                        low=low_data, close=close_data)])

# fig.show()

# d = {'dates': dates, 'close': close_data}
# df1 = pd.DataFrame(np.column_stack([dates,close_data]), columns = ["date", "Price"])
# df1['date']= pd.to_datetime(df1['date'])
# df1['date']=df1['date'].dt.date
# df1.set_index("date", inplace = True)




# Get google trends data
startTime = time.time()
pytrend = TrendReq(hl='en-GB', tz=360)

colnames = ["keywords"]
df = pd.read_csv("BTC_keywords.csv", names=colnames)
df2 = df["keywords"].values.tolist()
df2.remove("Keywords")

dataset = []

for x in range(0,len(df2)):
     keywords = [df2[x]]
     pytrend.build_payload(
     kw_list=keywords,
     cat=0,
     #timeframe='2017-04-01 2020-12-21',
     timeframe='today 5-y'
     )
     data = pytrend.interest_over_time()
     if not data.empty:
          data = data.drop(labels=['isPartial'],axis='columns')
          dataset.append(data)

result = pd.concat(dataset, axis=1)
result.to_csv('search_trends.csv')

executionTime = (time.time() - startTime)
print('Execution time in sec.: ' + str(executionTime))

result["Google Trends"] = result.sum(axis = 1)



# Graph All Operators
fig, ax = plt.subplots(1,1)
result["Google Trends"].plot(kind="line", figsize=(7, 5), color = 'g', ax=ax)
#ax1 = ax.twinx()
#final["Price"].plot(kind="line", figsize=(7, 5), color = 'r', ax=ax1)
# ax.set_xlabel('Operator', fontsize=sizefont)
ax.set_ylabel('BTC Google Trends')
#ax.set_ylabel('BTC Price')

# #plt.xticks(fontsize=7)
# lines_1, labels_1 = ax.get_legend_handles_labels()
# lines_2, labels_2 = ax.get_legend_handles_labels()

# lines = lines_1 + lines_2
# labels = labels_1 + labels_2

ax.legend()
plt.tight_layout()
# fig.savefig('Top 25 Operators.png', dpi=dpivar)