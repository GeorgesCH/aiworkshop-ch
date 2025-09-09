import React, { useCallback, useId, useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Shuffle, X } from "lucide-react";

type CPoint = { x: number; y: number; c: "A" | "B" };

function mean(points: CPoint[], label: "A" | "B") {
  const f = points.filter((p) => p.c === label);
  if (f.length === 0) return { x: 0, y: 0 };
  return {
    x: f.reduce((s, p) => s + p.x, 0) / f.length,
    y: f.reduce((s, p) => s + p.y, 0) / f.length,
  };
}

export function ClassificationLab() {
  const [points, setPoints] = useState<CPoint[]>([]);
  const [current, setCurrent] = useState<"A" | "B">("A");
  const patternId = useId();

  const { m, w } = useMemo(() => {
    const muA = mean(points, "A");
    const muB = mean(points, "B");
    const w = { x: muA.x - muB.x, y: muA.y - muB.y };
    const m = { x: (muA.x + muB.x) / 2, y: (muA.y + muB.y) / 2 };
    return { m, w };
  }, [points]);

  const addPoint = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const left = 40, right = 40, top = 20, bottom = 20;
    const chartW = Math.max(10, rect.width - left - right);
    const chartH = Math.max(10, rect.height - top - bottom);
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = (px - left) / chartW * 10;
    const y = ((rect.height - bottom) - py) / chartH * 10;
    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) setPoints((ps) => [...ps, { x, y, c: current }]);
  }, [current]);

  const randomize = () => {
    const arr: CPoint[] = Array.from({ length: 24 }, (_, i) => {
      const isA = i % 2 === 0;
      const baseX = isA ? 2 + Math.random() * 2 : 7 + Math.random() * 2;
      const baseY = isA ? 2 + Math.random() * 2 : 7 + Math.random() * 2;
      return { x: baseX, y: baseY, c: isA ? "A" : "B" };
    });
    setPoints(arr);
  };

  const clear = () => setPoints([]);

  // Compute two far points on the boundary line using direction perpendicular to w
  const boundary = useMemo(() => {
    const eps = Math.hypot(w.x, w.y) || 1e-6;
    // direction vector perpendicular to w
    const dx = -w.y / eps;
    const dy = w.x / eps;
    const t1 = -100; // extend line
    const t2 = 100;
    return {
      x1: (m.x + t1 * dx) * 30 + 30,
      y1: 270 - (m.y + t1 * dy) * 30,
      x2: (m.x + t2 * dx) * 30 + 30,
      y2: 270 - (m.y + t2 * dy) * 30,
    };
  }, [m, w]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-muted/30 rounded-lg">
        <div>
          <h4 className="text-lg font-semibold mb-1">Interactive Classification Lab</h4>
          <p className="text-sm text-gray-600">Choose a class and click to add points. Watch the decision boundary appear!</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={current === "A" ? "default" : "outline"} onClick={() => setCurrent("A")} className="text-xs">
            <span className="w-2 h-2 rounded-full bg-[#dc143c] inline-block mr-1" /> Class A
          </Button>
          <Button size="sm" variant={current === "B" ? "default" : "outline"} onClick={() => setCurrent("B")} className="text-xs">
            <span className="w-2 h-2 rounded-full bg-[#007aff] inline-block mr-1" /> Class B
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
            <div className="relative w-full rounded-lg border overflow-hidden bg-gray-50" style={{ aspectRatio: "19 / 15", minHeight: 300 }}>
              <svg className="absolute inset-0 w-full h-full cursor-crosshair" onClick={addPoint}>
                {(() => {
                  const left = 40, right = 40, top = 20, bottom = 20;
                  const width = 380, height = 300;
                  const chartW = width - left - right;
                  const chartH = height - top - bottom;
                  const xPos = (v: number) => left + (v / 10) * chartW;
                  const yPos = (v: number) => height - bottom - (v / 10) * chartH;

                  const grid = Array.from({ length: 11 }).map((_, i) => (
                    <g key={i}>
                      <line x1={xPos(i)} y1={yPos(0)} x2={xPos(i)} y2={yPos(10)} stroke="#e5e5e5" strokeWidth={1} />
                      <line x1={xPos(0)} y1={yPos(i)} x2={xPos(10)} y2={yPos(i)} stroke="#e5e5e5" strokeWidth={1} />
                    </g>
                  ));

                  const ticks = Array.from({ length: 11 }).map((_, i) => (
                    <g key={i}>
                      <text x={xPos(i)} y={height - 5} textAnchor="middle" className="text-[10px] fill-gray-500">{i}</text>
                      <text x={left - 5} y={yPos(i)} textAnchor="end" className="text-[10px] fill-gray-500">{i}</text>
                    </g>
                  ));

                  const boundaryLine = points.length >= 4 ? (
                    <line x1={boundary.x1} y1={boundary.y1} x2={boundary.x2} y2={boundary.y2} stroke="#34c759" strokeWidth={3} />
                  ) : null;

                  const dots = points.map((p, i) => (
                    <g key={i}>
                      <circle cx={xPos(p.x)} cy={yPos(p.y)} r={7} fill={p.c === "A" ? "#dc143c" : "#007aff"} stroke="#fff" strokeWidth={2} />
                    </g>
                  ));

                  // axes
                  const axes = (
                    <g>
                      <line x1={xPos(0)} y1={yPos(0)} x2={xPos(10)} y2={yPos(0)} stroke="#666" strokeWidth={2} />
                      <line x1={xPos(0)} y1={yPos(0)} x2={xPos(0)} y2={yPos(10)} stroke="#666" strokeWidth={2} />
                    </g>
                  );

                  return (
                    <g>
                      {axes}
                      {grid}
                      {ticks}
                      {boundaryLine}
                      {dots}
                    </g>
                  );
                })()}
              </svg>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center p-3 bg-white/80 rounded">
              🎯 <strong>Tip:</strong> Click to add points. The green line shows the LDA decision boundary that separates the classes.
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-semibold text-sm text-gray-900 mb-3">Class Distribution</h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#dc143c]"></span>
                  <span className="text-sm font-medium">Class A</span>
                </div>
                <Badge variant="outline">{points.filter((p) => p.c === "A").length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#007aff]"></span>
                  <span className="text-sm font-medium">Class B</span>
                </div>
                <Badge variant="outline">{points.filter((p) => p.c === "B").length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded border border-primary/20">
                <span className="text-sm font-medium">Total Points</span>
                <Badge variant="default">{points.length}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ClassificationLab;
