'use client';

import { ImagingStudy } from '@/types';
import { Scan, FileText, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ImagingPanelProps {
  imaging: ImagingStudy[];
}

export function ImagingPanel({ imaging }: ImagingPanelProps) {
  if (imaging.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500">No imaging studies available.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Scheduled: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Completed: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    const icons = {
      Scheduled: Clock,
      'In Progress': Clock,
      Completed: CheckCircle,
      Cancelled: XCircle
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.Scheduled}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {imaging.map((study) => (
        <div key={study.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start">
              <Scan className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{study.studyType}</h3>
                <p className="text-sm text-gray-500">{study.studyCode}</p>
              </div>
            </div>
            {getStatusBadge(study.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-500 mr-1">Ordered:</span>
              <span className="text-gray-900">{new Date(study.orderedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-900">{study.orderedBy}</span>
            </div>
            {study.performedDate && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className="text-gray-500 mr-1">Performed:</span>
                <span className="text-gray-900">{new Date(study.performedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {study.performedBy && (
                  <>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-900">{study.performedBy}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {study.images && study.images.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Images ({study.images.length})</h4>
              <div className="flex flex-wrap gap-2">
                {study.images.map((image) => (
                  <div key={image.id} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                    <span className="text-gray-900 font-medium">{image.view}</span>
                    {image.description && (
                      <span className="text-gray-500 ml-2">- {image.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {study.report && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center mb-3">
                <FileText className="w-4 h-4 text-blue-600 mr-2" />
                <h4 className="text-sm font-semibold text-gray-900">Radiology Report</h4>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(study.report.date).toLocaleDateString('en-US')} by {study.report.author}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-medium text-gray-700 uppercase mb-1">Findings</h5>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{study.report.findings}</p>
                </div>
                
                <div>
                  <h5 className="text-xs font-medium text-gray-700 uppercase mb-1">Impression</h5>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{study.report.impression}</p>
                </div>
                
                {study.report.recommendations && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 uppercase mb-1">Recommendations</h5>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{study.report.recommendations}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

