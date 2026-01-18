import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaveService } from '../services/leaveService';
import { formatErrorMessage } from '../services/errorHandler';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { STATUS_COLORS } from '../utils/constants';
import toast from 'react-hot-toast';
import LeaveManagementTable from '../components/employer/LeaveManagementTable';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await leaveService.getAllLeaves(params);
      setLeaves(response.data.leaves || []);
    } catch (error) {
      const message = formatErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      await leaveService.approveLeave(leaveId);
      toast.success('Leave approved successfully');
      fetchLeaves();
    } catch (error) {
      const message = formatErrorMessage(error);
      toast.error(message);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      await leaveService.rejectLeave(leaveId);
      toast.success('Leave rejected successfully');
      fetchLeaves();
    } catch (error) {
      const message = formatErrorMessage(error);
      toast.error(message);
    }
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'Pending').length,
    approved: leaves.filter(l => l.status === 'Approved').length,
    rejected: leaves.filter(l => l.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Employer Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Manage employee leave requests and approvals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Leaves</div>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-l-4 border-yellow-500">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</div>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.approved}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Approved</div>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow duration-200 border-l-4 border-red-500">
            <div className="text-4xl font-bold text-red-600 mb-2">{stats.rejected}</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Rejected</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={filterStatus === '' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('')}
            className="text-sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'Pending' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('Pending')}
            className="text-sm"
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'Approved' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('Approved')}
            className="text-sm"
          >
            Approved
          </Button>
          <Button
            variant={filterStatus === 'Rejected' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('Rejected')}
            className="text-sm"
          >
            Rejected
          </Button>
        </div>

        {/* Leaves Table */}
        <Card>
          <LeaveManagementTable
            leaves={leaves}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
