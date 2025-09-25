import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

import { Tooltip, Grow } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { watchlist as staticWatchlist } from "../data/data";
import GeneralContext from "./GeneralContext";
import config from "../config/config";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert static watchlist symbols to Yahoo Finance format
  const getYahooSymbols = useCallback(() => {
    return staticWatchlist.map(stock => `${stock.name}.NS`); // .NS for NSE
  }, []);

  const fetchRealTimeData = useCallback(async () => {
    try {
      setLoading(true);
      const symbols = getYahooSymbols();
      console.log('Fetching real-time data for symbols:', symbols);
      
      const response = await axios.post(`${config.API_URL}/api/watchlist`, { symbols });
      console.log('Received real-time data:', response.data);
      
      // Map the real-time data back to our watchlist format
      const realTimeWatchlist = response.data.map((stock, index) => ({
        name: staticWatchlist[index].name,
        price: stock.price,
        percent: `${stock.percent > 0 ? '+' : ''}${stock.percent.toFixed(2)}%`,
        isDown: stock.change < 0,
        change: stock.change
      }));
      
      setWatchlist(realTimeWatchlist);
      setError(null);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      if (err.code === 'ECONNREFUSED') {
        setError('Backend server not running');
      } else if (err.response?.status === 429) {
        setError('API rate limit exceeded');
      } else {
        setError('Failed to fetch real-time data');
      }
      // Fallback to static data
      setWatchlist(staticWatchlist);
    } finally {
      setLoading(false);
    }
  }, [getYahooSymbols]);

  useEffect(() => {
    fetchRealTimeData();
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchRealTimeData, 5000);
    
    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
        {error && <span className="error-indicator" title={error}>⚠️</span>}
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => {
          return (
            <WatchListItem stock={stock} key={index} />
          )
        })}
      </ul>
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  }

  const handleMouseLeave = (e) => {
    setHover(false);
  }

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item" >
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <ArrowDropDownIcon className="down" />) : (
            <ArrowDropUpIcon className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {hover && (
        <WatchListActions uid={stock.name} />
      )}
    </li>
  )
}

const WatchListActions = ({ uid }) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);
  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" arrow placement="top" TransitionComponent={Grow} >
          <button className="buy" onClick={() => openBuyWindow(uid)}>Buy</button>
        </Tooltip>
        <Tooltip title="Sell (S)" arrow placement="top" TransitionComponent={Grow} >
          <button className="sell" onClick={() => openSellWindow(uid)}>Sell</button>
        </Tooltip>
        <Tooltip title="Analytics (A)" arrow placement="top" TransitionComponent={Grow} >
          <button className="chart"><BarChartIcon className="icon" /></button>
        </Tooltip>
        <Tooltip title="More" arrow placement="top" TransitionComponent={Grow} >
          <button className="action"><MoreHorizIcon className="icon" /></button>
        </Tooltip>
      </span>
    </span>
  )
}