# -*- coding: utf-8 -*-
"""
Created on Tue Jun 15 18:44:24 2021

@author: jeffadams
"""
import yfinance as yf  
import matplotlib.pyplot as plt
# Get the data for the SPY ETF by specifying the stock ticker, start date, and end date
tickers = ['BTC-USD','ETH-USD', 'AAPL', 'TSLA', 'MSFT', '^IXIC', '^DJI', '^GSPC']
data = yf.download(tickers,'2015-01-01','2021-05-01')
# Plot the close prices
data["Adj Close"].plot()
plt.show()