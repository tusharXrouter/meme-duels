import { TradeButton } from "@/components/ui/trade-button"

export function TradeButtonDemo() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">Trade Buttons</h1>
          <p className="text-gray-400 text-lg">
            Futuristic angular design buttons for trading interfaces
          </p>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <TradeButton 
            side="right"
            color="#00ff99"
            label="BUY"
          />
          <TradeButton 
            side="left"
            color="#ff4d4d"
            label="SELL"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">BUY Button</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Color:</strong> #00ff99 (Neon Green)</p>
              <p><strong>Background:</strong> rgba(0,255,153,0.1)</p>
              <p><strong>Side:</strong> Left angular cuts</p>
              <p><strong>Clip Path:</strong> polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">SELL Button</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Color:</strong> #ff4d4d (Orange Red)</p>
              <p><strong>Background:</strong> rgba(255,77,77,0.1)</p>
              <p><strong>Side:</strong> Right angular cuts</p>
              <p><strong>Clip Path:</strong> polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-gray-400 text-sm">
          <p>Hover over the buttons to see the interactive effects</p>
        </div>
      </div>
    </div>
  )
}
