import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BarChart, Eye, Shuffle, X } from "lucide-react";

type Point = { x: number; y: number; predicted?: number };

function fitLinear(points: Point[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, mse: 0 };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const meanY = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  const mse = ssRes / n;
  return { slope, intercept, r2, mse };
}

export function RegressionLab() {
  const [points, setPoints] = useState<Point[]>([
    { x: 1, y: 2.5 },
    { x: 2, y: 3.8 },
    { x: 3, y: 4.2 },
    { x: 4, y: 6.1 },
    { x: 5, y: 7.3 },
    { x: 6, y: 8.1 },
  ]);
  const [showResiduals, setShowResiduals] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);
  const patternId = useId();

  const { slope, intercept, r2, mse } = useMemo(() => fitLinear(points), [points]);

  const addPoint = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const left = 40, right = 40, top = 20, bottom = 20;
    const chartW = Math.max(10, rect.width - left - right);
    const chartH = Math.max(10, rect.height - top - bottom);
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = (px - left) / chartW * 10;
    const y = ((rect.height - bottom) - py) / chartH * 10;
    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) setPoints((p) => [...p, { x, y }]);
  }, []);

  const randomize = () => {
    const np = Array.from({ length: 14 }, (_, i) => {
      const x = (i + 1) * 0.6;
      const baseY = 1.2 + x * 1.1;
      const noise = (Math.random() - 0.5) * 1.2;
      return { x, y: baseY + noise };
    });
    setPoints(np);
  };

  const clear = () => setPoints([]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-muted/30 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold mb-1">Interactive Regression Lab</h4>
          <p className="text-sm text-gray-600">Click to add data points and watch the algorithm fit a line through them</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowResiduals((v) => !v)} className="text-xs">
            <BarChart className="w-3 h-3 mr-1" /> {showResiduals ? "Hide" : "Show"} Residuals
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowPredictions((v) => !v)} className="text-xs">
            <Eye className="w-3 h-3 mr-1" /> {showPredictions ? "Hide" : "Show"} Predictions
          </Button>
          <Button variant="outline" size="sm" onClick={randomize} className="text-xs">
            <Shuffle className="w-3 h-3 mr-1" /> Random
          </Button>
          <Button variant="outline" size="sm" onClick={clear} className="text-xs">
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="relative w-full rounded-lg border overflow-hidden bg-gray-50/50" style={{ aspectRatio: "19 / 15", minHeight: 350 }}>
              <svg className="absolute inset-0 w-full h-full cursor-crosshair" onClick={addPoint}>
                {(() => {
                  // Draw responsive grid/axes using the actual svg size via viewBox-less approach
                  const left = 40, right = 40, top = 20, bottom = 20;
                  const width = 380; // logical units to keep numbers tidy
                  const height = 300;
                  const chartW = width - left - right;
                  const chartH = height - top - bottom;
                  const xPos = (v: number) => left + (v / 10) * chartW;
                  const yPos = (v: number) => height - bottom - (v / 10) * chartH;

                  const grid = Array.from({ length: 11 }).map((_, i) => (
                    <g key={i}>
                      {/* vertical */}
                      <line x1={xPos(i)} y1={yPos(0)} x2={xPos(i)} y2={yPos(10)} stroke="#e5e5e5" strokeWidth={1} />
                      {/* horizontal */}
                      <line x1={xPos(0)} y1={yPos(i)} x2={xPos(10)} y2={yPos(i)} stroke="#e5e5e5" strokeWidth={1} />
                    </g>
                  ));

                  const ticks = Array.from({ length: 11 }).map((_, i) => (
                    <g key={i}>
                      <text x={xPos(i)} y={height - 5} textAnchor="middle" className="text-[10px] fill-gray-500">{i}</text>
                      <text x={left - 5} y={yPos(i)} textAnchor="end" className="text-[10px] fill-gray-500">{i}</text>
                    </g>
                  ));

                  const regressionLine = points.length > 1 ? (
                    <line x1={xPos(0)} y1={yPos(slope * 0 + intercept)} x2={xPos(10)} y2={yPos(slope * 10 + intercept)} stroke="#dc143c" strokeWidth={3} />
                  ) : null;

                  const dots = points.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={xPos(p.x)} cy={yPos(p.y)} r={6} fill="#007aff" stroke="#fff" strokeWidth={2} />
                      {showResiduals && (
                        <line x1={xPos(p.x)} y1={yPos(p.y)} x2={xPos(p.x)} y2={yPos(slope * p.x + intercept)} stroke="#ff9500" strokeWidth={2} strokeDasharray="4,3" />
                      )}
                    </g>
                  ));

                  return (
                    <g>
                      {/* axes */}
                      <line x1={xPos(0)} y1={yPos(0)} x2={xPos(10)} y2={yPos(0)} stroke="#666" strokeWidth={2} />
                      <line x1={xPos(0)} y1={yPos(0)} x2={xPos(0)} y2={yPos(10)} stroke="#666" strokeWidth={2} />
                      {grid}
                      {ticks}
                      {regressionLine}
                      {dots}
                    </g>
                  );
                })()}
              </svg>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center p-3 bg-white/80 rounded">
              💡 <strong>Tip:</strong> Click inside the grid to add data points and see how the regression line adapts
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-sm text-gray-900 mb-3">Model Statistics</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <span className="text-sm font-medium">Data Points</span>
                <Badge variant="secondary">{points.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <span className="text-sm font-medium">Slope (m)</span>
                <Badge variant="outline">{slope.toFixed(3)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <span className="text-sm font-medium">Intercept (b)</span>
                <Badge variant="outline">{intercept.toFixed(3)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <span className="text-sm font-medium">R² Score</span>
                <Badge variant="default">{r2.toFixed(3)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <span className="text-sm font-medium">Mean Squared Error</span>
                <Badge variant="outline">{mse.toFixed(3)}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default RegressionLab;
