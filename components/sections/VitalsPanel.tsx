'use client';

import { VitalSign } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VitalsPanelProps {
  vitals: VitalSign[];
}

export function VitalsPanel({ vitals }: VitalsPanelProps) {
  if (vitals.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">No vital signs recorded.</p>
      </div>
    );
  }

  // Sort vitals by date (oldest first for charts)
  const sortedVitals = [...vitals].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Prepare chart data
  const chartData = sortedVitals.map(vital => ({
    date: new Date(vital.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(vital.timestamp).toLocaleDateString('en-US'),
    time: new Date(vital.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    bpSystolic: vital.bloodPressureSystolic,
    bpDiastolic: vital.bloodPressureDiastolic,
    heartRate: vital.heartRate,
    temperature: vital.temperature,
    oxygenSaturation: vital.oxygenSaturation,
    weight: vital.weight,
    respiratoryRate: vital.respiratoryRate,
    bmi: vital.bmi,
  }));

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Combined Graph */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs Trends</h4>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'BP/HR/RR', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '11px' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: '#6b7280' }}
              label={{ value: 'Temp/O2 Sat', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '11px' } }}
            />
            <Tooltip content={customTooltip} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="bpSystolic" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="BP Systolic (mmHg)"
              unit=" mmHg"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="bpDiastolic" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="BP Diastolic (mmHg)"
              unit=" mmHg"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="heartRate" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Heart Rate (bpm)"
              unit=" bpm"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="respiratoryRate" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Respiratory Rate (breaths/min)"
              unit=" breaths/min"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="temperature" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Temperature (°F)"
              unit=" °F"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="oxygenSaturation" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="O2 Saturation (%)"
              unit="%"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RR</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O2 Sat</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitals.map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-xs text-gray-900">
                      {new Date(vital.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(vital.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.heartRate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.temperature}°F</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.respiratoryRate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.oxygenSaturation}%</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.weight} lbs</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{vital.bmi.toFixed(1)}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{vital.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
