import React, { useState } from 'react';
import { leaveService } from '../../services/leaveService';
import { formatErrorMessage, handleApiError } from '../../services/errorHandler';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { LEAVE_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ApplyLeaveForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after or equal to start date';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await leaveService.applyLeave(formData);
      toast.success('Leave application submitted successfully!');
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      onSuccess();
    } catch (error) {
      const handledError = error.handledError || handleApiError(error);
      toast.error(handledError.message || 'Failed to submit leave application');
      
      // Handle validation errors from API
      if (handledError.errors && Array.isArray(handledError.errors)) {
        const apiErrors = {};
        handledError.errors.forEach(err => {
          const field = err.field || err.path || err.param;
          if (field) {
            apiErrors[field] = err.message || err.msg;
          }
        });
        if (Object.keys(apiErrors).length > 0) {
          setErrors(apiErrors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Apply for Leave</h3>
        <p className="mt-1 text-sm text-gray-600">Fill in the details below to submit your leave application</p>
      </div>
      
      <Select
        label="Leave Type"
        name="leaveType"
        value={formData.leaveType}
        onChange={handleChange}
        options={LEAVE_TYPES}
        error={errors.leaveType}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />

        <Input
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          required
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
          Reason <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={5}
          className={`input resize-none ${errors.reason ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
          placeholder="Enter a detailed reason for your leave request (minimum 10 characters)..."
          required
        />
        {errors.reason && (
          <div className="mt-2 flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-1.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{errors.reason}</p>
          </div>
        )}
        {!errors.reason && formData.reason && (
          <p className="mt-2 text-xs text-gray-500">
            {formData.reason.trim().length}/10 minimum characters
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ApplyLeaveForm;
