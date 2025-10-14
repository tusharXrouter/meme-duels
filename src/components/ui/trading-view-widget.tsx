import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  chartHref: string;
  symbol?: string;
  theme?: 'light' | 'dark';
  interval?: string;
  height?: string;
  width?: string;
}

function TradingViewWidget({ 
  symbol = "BINANCE:TRUMPUSDT", 
  theme = "dark", 
  interval = "1",
  height = "100%",
  width = "100%"
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(
    () => {
      if (!container.current) return;

      const currentContainer = container.current;
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": true,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "${interval}",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "${symbol}",
          "theme": "${theme}",
          "timezone": "Etc/UTC",
          "backgroundColor": "#0F0F0F",
          "gridColor": "rgba(242, 242, 242, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
        }`;
      currentContainer.appendChild(script);

      return () => {
        if (currentContainer) {
          const scripts = currentContainer.querySelectorAll('script');
          scripts.forEach(script => script.remove());
        }
      };
    },
    [symbol, theme, interval]
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height, width }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

export default memo(TradingViewWidget);
