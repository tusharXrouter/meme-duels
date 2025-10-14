import MaskedComponent from "@/components/ui/masked-component"

export function MaskedComponentDemo() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">Masked Component</h1>
          <p className="text-gray-400 text-lg">
            Modular component wrapper with various mask shapes and effects
          </p>
        </div>
        
        {/* Basic Shapes */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Basic Shapes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <MaskedComponent 
                shape="rounded" 
                borderWidth="3px" 
                borderColor="#3b82f6"
                backgroundColor="#1e40af"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Rounded
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Rounded</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="circle" 
                borderWidth="3px" 
                borderColor="#10b981"
                backgroundColor="#047857"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Circle
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Circle</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="octagon" 
                borderWidth="3px" 
                borderColor="#f59e0b"
                backgroundColor="#d97706"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Octagon
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Octagon</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="hexagon" 
                borderWidth="3px" 
                borderColor="#8b5cf6"
                backgroundColor="#7c3aed"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Hexagon
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Hexagon</p>
            </div>
          </div>
        </div>

        {/* Geometric Shapes */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Geometric Shapes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <MaskedComponent 
                shape="diamond" 
                borderWidth="3px" 
                borderColor="#ef4444"
                backgroundColor="#dc2626"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Diamond
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Diamond</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="triangle" 
                borderWidth="3px" 
                borderColor="#06b6d4"
                backgroundColor="#0891b2"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Triangle
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Triangle</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="star" 
                borderWidth="3px" 
                borderColor="#ec4899"
                backgroundColor="#db2777"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Star
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Star</p>
            </div>
          </div>
        </div>

        {/* Gradient Borders */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Gradient Borders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <MaskedComponent 
                shape="rounded" 
                borderWidth="4px" 
                gradientBorder={true}
                gradientColors={["#ff6b6b", "#4ecdc4", "#45b7d1"]}
                backgroundColor="#1f2937"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Rainbow
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Rainbow Gradient</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="octagon" 
                borderWidth="4px" 
                gradientBorder={true}
                gradientColors={["#667eea", "#764ba2"]}
                backgroundColor="#1f2937"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Purple
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Purple Gradient</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="hexagon" 
                borderWidth="4px" 
                gradientBorder={true}
                gradientColors={["#f093fb", "#f5576c"]}
                backgroundColor="#1f2937"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Pink
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Pink Gradient</p>
            </div>
          </div>
        </div>

        {/* Custom Shapes */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Custom Shapes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <MaskedComponent 
                shape="custom" 
                customClipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
                borderWidth="3px" 
                borderColor="#fbbf24"
                backgroundColor="#f59e0b"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Custom
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Custom Triangle</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="custom" 
                customClipPath="polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
                borderWidth="3px" 
                borderColor="#34d399"
                backgroundColor="#10b981"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Parallelogram
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Parallelogram</p>
            </div>

            <div className="text-center">
              <MaskedComponent 
                shape="custom" 
                customClipPath="polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
                borderWidth="3px" 
                borderColor="#a78bfa"
                backgroundColor="#8b5cf6"
                className="w-32 h-32 mx-auto"
              >
                <div className="flex items-center justify-center h-full text-white font-bold">
                  Trapezoid
                </div>
              </MaskedComponent>
              <p className="text-gray-400 text-sm mt-2">Trapezoid</p>
            </div>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Interactive Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Button with Mask</h3>
              <MaskedComponent 
                shape="rounded" 
                borderWidth="2px" 
                borderColor="#3b82f6"
                backgroundColor="#1e40af"
                hoverEffects={true}
                as="button"
                className="w-full h-16"
              >
                <div className="flex items-center justify-center h-full text-white font-bold text-lg">
                  Click Me!
                </div>
              </MaskedComponent>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Image with Mask</h3>
              <MaskedComponent 
                shape="octagon" 
                borderWidth="3px" 
                gradientBorder={true}
                gradientColors={["#ff6b6b", "#4ecdc4"]}
                className="w-32 h-32 mx-auto"
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold">Image</span>
                </div>
              </MaskedComponent>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-12">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Basic Usage</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Simple Rounded:</strong> &lt;MaskedComponent shape=&quot;rounded&quot;&gt;</p>
              <p><strong>With Border:</strong> borderWidth=&quot;3px&quot; borderColor=&quot;#3b82f6&quot;</p>
              <p><strong>Gradient Border:</strong> gradientBorder=&#123;true&#125;</p>
              <p><strong>Custom Shape:</strong> shape=&quot;custom&quot; customClipPath=&quot;...&quot;</p>
              <p><strong>Hover Effects:</strong> hoverEffects=&#123;true&#125;</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Available Shapes</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• rounded, circle, octagon</p>
              <p>• hexagon, diamond, triangle</p>
              <p>• star, custom</p>
              <p><strong>Border Widths:</strong> 0px to 8px</p>
              <p><strong>Corner Radius:</strong> 2px to 20px</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
