import React, { useState, useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp, ColorType, LineSeries } from 'lightweight-charts';
import { usePriceStore, selectDuelPrices } from '@/stores/price.store';
import { useWarStore } from '@/stores/war.store';

interface TokenChartProps {
  duelId: string;
  tokenAName: string;
  tokenBName: string;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenAColor?: string;
  tokenBColor?: string;
}

interface DataPoint {
  time: UTCTimestamp;
  value: number;
}

const RealtimeTokenChart: React.FC<TokenChartProps> = ({
  duelId,
  tokenAName,
  tokenBName,
  tokenAColor = '#22c55e', // emerald-500
  tokenBColor = '#d946ef', // fuchsia-500
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const lastTickRef = useRef<number>(0);
  const priceSelector = selectDuelPrices(duelId);
  const duelPrices = usePriceStore(priceSelector);
  const basePrices = useWarStore(state => state.basePrices);
  
  // Chart refs
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const tokenASeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const tokenBSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const initialBaseARef = useRef<number | undefined>(undefined);
  const initialBaseBRef = useRef<number | undefined>(undefined);
  const currentPriceARef = useRef<number | undefined>(undefined);
  const currentPriceBRef = useRef<number | undefined>(undefined);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: '#fff',
        background: { type: ColorType.Solid, color: '#0A0A0A' },
      },
      rightPriceScale: {
        visible: true,
        borderColor: tokenBColor,
        textColor: '#fff',
        autoScale: true,
        scaleMargins: { top: 0.1, bottom: 0.1 },
        // Will show Token B percentage changes
      },
      leftPriceScale: {
        visible: true,
        borderColor: tokenAColor, 
        textColor: '#fff',
        autoScale: true,
        scaleMargins: { top: 0.1, bottom: 0.1 },
        // Will show Token A percentage changes
      },
      timeScale: {
        borderColor: '#333',
        timeVisible: true,
        secondsVisible: true,
      },
      crosshair: {
        mode: 0, // CrosshairMode.Normal
        vertLine: {
          color: '#666',
          width: 1,
          style: 3, // LineStyle.Dashed
        },
        horzLine: {
          color: '#666',
          width: 1,
          style: 3, // LineStyle.Dashed
        },
      },
      grid: {
        vertLines: {
          color: '#333',
          style: 3, // LineStyle.Dashed
        },
        horzLines: {
          color: '#333',
          style: 3, // LineStyle.Dashed
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: false, // Disable panning
        horzTouchDrag: false,    // Disable horizontal touch panning
        vertTouchDrag: false,    // Disable vertical touch panning
      },
      handleScale: {
        axisPressedMouseMove: {
          time: false,  // Disable time axis panning
          price: false, // Disable price axis panning
        },
        axisDoubleClickReset: {
          time: true,
          price: true,
        },
        mouseWheel: true,  // Keep zoom with mouse wheel
        pinch: true,       // Keep pinch zoom for mobile
      },
    });

    // create a minMove variable that changes based on the current screen width
    let minMove: number;
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) {
      minMove = 0.01;
    } else if (screenWidth < 1200) {
      minMove = 0.0001;
    } else {
      minMove = 0.0000001;
    }

    // Create series for both tokens with dual price scales
    const tokenASeries = chart.addSeries(LineSeries, {
      color: tokenAColor,
      lineWidth: 2,
      priceScaleId: 'left',
      priceFormat: {
        minMove,
        type: 'price'
      }
    });

    const tokenBSeries = chart.addSeries(LineSeries, {
      color: tokenBColor,
      lineWidth: 2,
      priceScaleId: 'right',
      priceFormat: {
        minMove,
        type: 'price'
      }
    });

    chartRef.current = chart;
    tokenASeriesRef.current = tokenASeries;
    tokenBSeriesRef.current = tokenBSeries;

    // Configure price scales to show percentage values
    chart.priceScale('left').applyOptions({
      borderColor: tokenAColor,
    });

    chart.priceScale('right').applyOptions({
      borderColor: tokenBColor,
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        tokenASeriesRef.current = null;
        tokenBSeriesRef.current = null;
      }
    };
  }, [tokenAColor, tokenBColor, tokenAName, tokenBName]);

  // Reset series when base price/epoch changes (new baseline)
  useEffect(() => {
    initialBaseARef.current = undefined;
    initialBaseBRef.current = undefined;
    currentPriceARef.current = undefined;
    currentPriceBRef.current = undefined;
    
    // Clear existing series data
    if (tokenASeriesRef.current && tokenBSeriesRef.current) {
      tokenASeriesRef.current.setData([]);
      tokenBSeriesRef.current.setData([]);
    }
  }, [basePrices?.epochNumber, basePrices?.tokenAStart, basePrices?.tokenBStart]);

  // When new price arrives, update series with normalized values
  useEffect(() => {
    if (!duelPrices || !tokenASeriesRef.current || !tokenBSeriesRef.current) return;
    
    const now = Math.floor((duelPrices.lastUpdate || Date.now()) / 1000) as UTCTimestamp;
    const a = Number(duelPrices.tokenA?.price);
    const b = Number(duelPrices.tokenB?.price);
    if (!a || !b) return;

    // Track initial prices for reference
    if (initialBaseARef.current === undefined) {
      initialBaseARef.current = a;
    }
    if (initialBaseBRef.current === undefined) {
      initialBaseBRef.current = b;
    }

    // Update current prices for formatter
    currentPriceARef.current = a;
    currentPriceBRef.current = b;

    setIsRunning(true);
    lastTickRef.current = now * 1000; // Convert back to milliseconds for status check

    // Use actual prices as chart data so y-axis shows real USD values
    const dataPointA: DataPoint = { time: now, value: Number(a ?? 0) };
    const dataPointB: DataPoint = { time: now, value: Number(b ?? 0) };

    tokenASeriesRef.current.update(dataPointA);
    tokenBSeriesRef.current.update(dataPointB);
  }, [duelPrices]);

  // Show live status based on last tick age
  useEffect(() => {
    const timer = setInterval(() => {
      const age = Date.now() - (lastTickRef.current || 0);
      setIsRunning(age < 2500); // live if we saw a tick in the last 2.5s
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Handle responsive chart sizing
  useEffect(() => {
    if (!chartRef.current || !chartContainerRef.current) return;

    const updateChartSize = () => {
      const container = chartContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const chartHeight = isMobile ? 300 : 400;
      
      chartRef.current?.applyOptions({
        width: rect.width,
        height: chartHeight,
      });
    };

    // Initial size
    updateChartSize();

    // Handle window resize
    const handleResize = () => {
      updateChartSize();
    };

    // Handle responsive breakpoints
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      updateChartSize();
      // Adjust chart options for mobile
      if (e.matches) {
        chartRef.current?.applyOptions({
          timeScale: {
            visible: true,
            timeVisible: false,
            secondsVisible: false,
          },
        });
      } else {
        chartRef.current?.applyOptions({
          timeScale: {
            visible: true,
            timeVisible: true,
            secondsVisible: true,
          },
        });
      }
    };

    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener('change', handleMediaChange);
    handleMediaChange({ matches: mediaQuery.matches } as MediaQueryListEvent);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);
  
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="bg-[#111111] rounded-lg shadow-xl p-4 md:p-6 h-auto">
        {/* Header with token info and status */}
        <div className="flex gap-4 md:gap-6 mb-4 md:mb-6 flex-col sm:flex-row relative">
          <div className="flex items-center gap-2 flex-wrap">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tokenAColor }}></div>
            <span className="text-white font-medium text-sm md:text-base">{tokenAName}</span>
            <span className="text-gray-400 text-xs md:text-sm">
              ${Number(duelPrices?.tokenA?.price).toPrecision(4) || '0.000000'}
            </span>
            {initialBaseARef.current && duelPrices?.tokenA?.price && (
              <span className={`text-xs md:text-sm font-medium ${
                duelPrices.tokenA.price >= initialBaseARef.current ? 'text-green-400' : 'text-red-400'
              }`}>
                {duelPrices.tokenA.price >= initialBaseARef.current ? '+' : ''}
                {(((duelPrices.tokenA.price - initialBaseARef.current) / initialBaseARef.current) * 100).toFixed(2)}%
              </span>
            )}
        </div>
          <div className="flex items-center gap-2 flex-wrap">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tokenBColor }}></div>
            <span className="text-white font-medium text-sm md:text-base">{tokenBName}</span>
            <span className="text-gray-400 text-xs md:text-sm">
              ${Number(duelPrices?.tokenB?.price).toPrecision(4) || '0.000000'}
            </span>
            {initialBaseBRef.current && duelPrices?.tokenB?.price && (
              <span className={`text-xs md:text-sm font-medium ${
                duelPrices.tokenB.price >= initialBaseBRef.current ? 'text-green-400' : 'text-red-400'
              }`}>
                {duelPrices.tokenB.price >= initialBaseBRef.current ? '+' : ''}
                {(((duelPrices.tokenB.price - initialBaseBRef.current) / initialBaseBRef.current) * 100).toFixed(2)}%
              </span>
            )}
        </div>
      </div>
        
        {/* Chart title */}
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-white text-xs md:text-lg font-semibold">Real-time Token Performance</h3>

          <div className="flex items-center gap-2 sm:right-0 sm:top-0">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-400 text-xs md:text-sm">
            {isRunning ? 'Live' : 'Stopped'}
          </span>
        </div>
        </div>
        
        {/* TradingView Chart Container */}
        <div 
          ref={chartContainerRef} 
          className="w-full"
          style={{ height: '400px', minHeight: '300px' }}
        />
      </div>
    </div>
  );
};

export default RealtimeTokenChart;