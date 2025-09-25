import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

// import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [realTimePrices, setRealTimePrices] = useState({});

  const fetchHoldings = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/allHoldings`);
      setAllHoldings(response.data);
      
      // Fetch real-time prices for all holdings
      if (response.data.length > 0) {
        const symbols = response.data.map(holding => `${holding.name}.NS`);
        const priceResponse = await axios.post(`${config.API_URL}/api/watchlist`, { symbols });
        
        const priceMap = {};
        priceResponse.data.forEach((stock, index) => {
          priceMap[response.data[index].name] = {
            price: stock.price,
            change: stock.change,
            percent: stock.percent
          };
        });
        
        setRealTimePrices(priceMap);
      }
    } catch (err) {
      console.error('Error fetching holdings:', err);
      setAllHoldings([]);
    }
  };

  useEffect(() => {
    fetchHoldings();
    
    // Set up auto-refresh every 5 seconds
    const interval = setInterval(fetchHoldings, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
          {allHoldings.map((stock, index) => {
            // Use real-time price if available, otherwise fallback to stored price
            const currentPrice = realTimePrices[stock.name]?.price || stock.price;
            const isDayLoss = realTimePrices[stock.name] ? realTimePrices[stock.name].change < 0 : stock.isLoss;
            
            const currValue = currentPrice * stock.qty;
            const isProfit = currValue - stock.avg * stock.qty > 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = isDayLoss ? "loss" : "profit";
            
            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                    <td className={realTimePrices[stock.name] ? "realtime-price" : ""}>
                      {currentPrice.toFixed(2)}
                    </td>
                <td>{currValue.toFixed(2)}</td>
                <td className={profClass}>{(currValue - stock.avg * stock.qty).toFixed(2)}</td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>
                  {realTimePrices[stock.name] ? 
                    `${realTimePrices[stock.name].change > 0 ? '+' : ''}${realTimePrices[stock.name].percent.toFixed(2)}%` : 
                    stock.day
                  }
                </td>
              </tr>
            )
          }
          )}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
