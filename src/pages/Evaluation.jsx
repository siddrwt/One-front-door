// src/pages/Evaluation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { EVALUATION_METRICS } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';



export default function Evaluation() {
  const { summary, domainBenchmarks, confusionMatrix, latencyDistribution } = EVALUATION_METRICS;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <Card className="bg-slate-900 text-white border-slate-800 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 gap-1.5 px-2.5 py-1 text-xs">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Evaluation & Benchmarking Dashboard</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Routing Metrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Evaluation suite measuring multi-domain classification precision, intent disambiguation, grounded knowledge adherence, and latency across institutional domains.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/chat">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs text-xs font-bold h-10 px-4">
                <Sparkles className="w-4 h-4" />
                <span>Launch Live Chat Test</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 2. Key Performance Indicators (5 Metrics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Routing Accuracy */}
        <Card className="border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-600">Routing Accuracy</span>
              <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 font-bold text-[10px] gap-0.5 px-1.5 py-0">
                <TrendingUp className="w-3 h-3" />
                {summary.routingAccuracy.trend}
              </Badge>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.routingAccuracy.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
              {summary.routingAccuracy.description}
            </p>
          </CardContent>
        </Card>

        {/* Clarification Accuracy */}
        <Card className="border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-600">Clarification Accuracy</span>
              <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 font-bold text-[10px] gap-0.5 px-1.5 py-0">
                <TrendingUp className="w-3 h-3" />
                {summary.clarificationAccuracy.trend}
              </Badge>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.clarificationAccuracy.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
              {summary.clarificationAccuracy.description}
            </p>
          </CardContent>
        </Card>

        {/* Grounded Answer Rate */}
        <Card className="border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-600">Grounded Answer Rate</span>
              <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 font-bold text-[10px] gap-0.5 px-1.5 py-0">
                <TrendingUp className="w-3 h-3" />
                {summary.groundedAnswerRate.trend}
              </Badge>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {summary.groundedAnswerRate.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
              {summary.groundedAnswerRate.description}
            </p>
          </CardContent>
        </Card>

        {/* End-to-End Resolution */}
        <Card className="border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold text-slate-600">End-to-End Resolution</span>
              <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 font-bold text-[10px] gap-0.5 px-1.5 py-0">
                <TrendingUp className="w-3 h-3" />
                {summary.endToEndResolution.trend}
              </Badge>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.endToEndResolution.value}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
              {summary.endToEndResolution.description}
            </p>
          </CardContent>
        </Card>

        {/* Wrong Confident Route Rate (Critical Safety KPI) */}
        <Card className="bg-rose-50/50 border-rose-200 shadow-2xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-rose-700 mb-1.5">
              <span className="font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Wrong Confident
              </span>
              <Badge variant="outline" className="text-emerald-700 bg-white border-rose-200 font-bold text-[10px] px-1.5 py-0">
                {summary.wrongConfidentRoute.trend}
              </Badge>
            </div>
            <div className="text-2xl font-black text-rose-700">
              {summary.wrongConfidentRoute.value}
            </div>
            <p className="text-[11px] text-rose-600/90 mt-1.5 leading-snug">
              Target &lt; 2.5%. {summary.wrongConfidentRoute.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Confusion Matrix Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Confusion Matrix Card (2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200/90 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Multi-Domain Routing Confusion Matrix (%)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Actual Ground Truth Intent (Rows) vs. Predicted Classification (Columns)
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-slate-600 text-[11px]">
              N = 1,656 test cases
            </Badge>
          </CardHeader>

          <CardContent className="pt-4 overflow-x-auto">
            <Table className="w-full text-center text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-slate-400 font-semibold uppercase text-[10px]">
                    Ground Truth ↓ \ Pred →
                  </TableHead>
                  {confusionMatrix.labels.map((lbl, idx) => (
                    <TableHead key={idx} className="font-bold text-center text-slate-700 text-[11px]">
                      {lbl}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {confusionMatrix.matrix.map((row, rIdx) => {
                  const actualLabel = confusionMatrix.labels[rIdx];
                  return (
                    <TableRow key={rIdx}>
                      <TableCell className="text-left font-bold text-slate-800 text-[11px]">
                        {actualLabel}
                      </TableCell>
                      {row.map((val, cIdx) => {
                        const isDiagonal = rIdx === cIdx;
                        let cellClass = 'bg-slate-50 text-slate-500';
                        if (isDiagonal) {
                          cellClass = 'bg-emerald-600 text-white font-bold shadow-2xs';
                        } else if (val > 2) {
                          cellClass = 'bg-amber-100 text-amber-800 font-medium';
                        }
                        return (
                          <TableCell key={cIdx} className="p-1.5 text-center">
                            <div className={`py-2 rounded text-xs transition-colors ${cellClass}`}>
                              {val}%
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Latency & Processing Profile */}
        <Card className="border-slate-200/90 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Latency Profile
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">End-to-end response distribution</CardDescription>
              </div>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
          </CardHeader>

          <CardContent className="py-4 space-y-3 flex-1">
            {latencyDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-600">{item.range}</span>
                  <span className="text-slate-900 font-bold">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2 bg-slate-100" />
              </div>
            ))}
          </CardContent>

          <div className="p-3 bg-blue-50/70 border-t border-blue-100 rounded-b-xl text-xs text-blue-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-700" />
              <span>Orchestrator Architecture</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Sub-second classification utilizing high-speed embeddings with dual-threshold margin routing.
            </p>
          </div>
        </Card>
      </div>

      {/* 4. Domain Breakdown Table */}
      <Card className="border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Domain-by-Domain Performance Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Granular testing results across all 4 production university domains
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 overflow-x-auto">
          <Table className="w-full text-xs">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-left font-bold text-slate-700">Domain</TableHead>
                <TableHead className="text-left font-bold text-slate-700">Test Volume</TableHead>
                <TableHead className="text-left font-bold text-slate-700">Accuracy</TableHead>
                <TableHead className="text-left font-bold text-slate-700">Avg Confidence</TableHead>
                <TableHead className="text-left font-bold text-slate-700">Avg Latency</TableHead>
                <TableHead className="text-right font-bold text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domainBenchmarks.map((bench, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-slate-900">
                    {bench.domain}
                  </TableCell>
                  <TableCell className="text-slate-600 font-mono">
                    {bench.totalQueries} queries
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-700">
                      {bench.accuracy}%
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-700 font-mono">
                    {(bench.avgConfidence * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-slate-600 font-mono">
                    {bench.avgLatency}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-semibold gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Passed SLA
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
