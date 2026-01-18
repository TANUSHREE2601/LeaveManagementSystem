import React from 'react';
import Button from '../common/Button';
import { STATUS_COLORS } from '../../utils/constants';

const LeaveManagementTable = ({ leaves, loading, onApprove, onReject }) => {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-6 text-base font-medium text-gray-700">Loading leave requests...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leave requests found</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          There are no leave requests to display. Leaves will appear here once employees submit their applications.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Approved':
        return '✓';
      case 'Rejected':
        return '✗';
      default:
        return '';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="table min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave Type</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reason</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applied On</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leaves.map((leave) => (
            <tr key={leave._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {leave.employee?.name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {leave.employee?.email || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-900 capitalize">{leave.leaveType}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">{formatDate(leave.startDate)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">{formatDate(leave.endDate)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {leave.days || 'N/A'} {leave.days === 1 ? 'day' : 'days'}
                </span>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <p className="text-sm text-gray-700 truncate" title={leave.reason}>
                  {leave.reason}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_COLORS[leave.status]}`}>
                  <span className="mr-1.5">{getStatusIcon(leave.status)}</span>
                  {leave.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">{formatDate(leave.createdAt)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {leave.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onApprove(leave._id)}
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onReject(leave._id)}
                      className="shadow-sm hover:shadow-md transition-shadow"
                    >
                      ✗ Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No action available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagementTable;
