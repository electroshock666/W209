from pytrends.request import TrendReq
import pandas as pd
import time
import matplotlib.pyplot as plt
import requests
import json 
import shrimpy
import plotly.graph_objects as go
import numpy as np

public_key = '4acf1779b2b34f67d3094de399a24f1180009a24d8518fb7b835e5cc0e480225'
secret_key = '06ac1405626e7acb2bf680a6d4fbf74dcab0b0c8783e09dfc9267d999803a0870fd3765c1d9355b2c5e819c5c924db4fd2aaed9caa6a0a2e3242434f12856aa9'
client = shrimpy.ShrimpyApiClient(public_key, secret_key)

candles = client.get_candles(
    'bittrex',   # exchange
    'ETH',      # base_trading_symbol
    'USDT',     # quote_trading_symbol
    '1m',       # interval
    '2015-05-19T00:00:00.000Z'
)

dates = []
open_data = []
high_data = []
low_data = []
close_data = []

for candle in candles:
    dates.append(candle['time'])
    open_data.append(candle['open'])
    high_data.append(candle['high'])
    low_data.append(candle['low'])
    close_data.append(candle['close'])


fig = go.Figure(data=[go.Candlestick(x=dates,
                       open=open_data, high=high_data,
                       low=low_data, close=close_data)])

fig.show()

d = {'dates': dates, 'close': close_data}
df1 = pd.DataFrame(np.column_stack([dates,close_data]), columns = ["date", "Price"])
df1['date']= pd.to_datetime(df1['date'])
df1['date']=df1['date'].dt.date
df1.set_index("date", inplace = True)

df1.to_csv('BTC_coinbase.csv')

