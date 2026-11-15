/**
 * @file components/company/InternshipFormModal.jsx
 * @description Accessible, reusable modal form for Creating and Editing company internships.
 * Features inline validation for all required fields, positive integer checks for positions,
 * date validation for application deadlines, and support for both Create and Edit modes.
 */

import { useState } from 'react';
import { Button } from '../ui/index.js';

const CATEGORIES = [
  'Software Engineering',
  'Product Design',
  'Product Management',
  'Data & AI',
  'DevOps & Cloud',
  'Marketing',
];

const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

const INTERNSHIP_TYPES = ['Summer 2025', 'Fall 2025', 'Full-time', 'Part-time', 'Co-op'];

const STATUSES = [
  { value: 'active', label: 'Active (Accepting Applications)' },
  { value: 'draft', label: 'Draft (Internal Review)' },
  { value: 'closed', label: 'Closed (Hiring Complete)' },
];

function buildInitialFormData(initialData) {
  if (!initialData) {
    return {
      title: '',
      category: 'Software Engineering',
      department: '',
      location: '',
      workMode: 'Hybrid',
      type: 'Summer 2025',
      duration: '12 weeks',
      compensation: '',
      deadline: '',
      positions: 1,
      status: 'active',
      skills: '',
      description: '',
      responsibilities: '',
    };
  }

  return {
    title: initialData.title || '',
    category: initialData.category || 'Software Engineering',
    department: initialData.department || '',
    location: initialData.location || '',
    workMode: initialData.workMode || 'Hybrid',
    type: initialData.type || 'Summer 2025',
    duration: initialData.duration || '12 weeks',
    compensation: initialData.compensation || '',
    deadline: initialData.deadline || '',
    positions: initialData.positions || 1,
    status: initialData.status || 'active',
    skills: Array.isArray(initialData.skills)
      ? initialData.skills.join(', ')
      : initialData.skills || '',
    description: initialData.description || '',
    responsibilities: initialData.responsibilities || '',
  };
}

function InternshipFormInner({ initialData, onClose, onSubmit }) {
  const isEditMode = Boolean(initialData && initialData.id);
  const [formData, setFormData] = useState(() => buildInitialFormData(initialData));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Internship title is required';
    }

    if (!formData.department.trim()) {
      nextErrors.department = 'Department / Team is required';
    }

    if (!formData.location.trim()) {
      nextErrors.location = 'Location is required (e.g. San Francisco, CA)';
    }

    if (!formData.compensation.trim()) {
      nextErrors.compensation = 'Compensation is required (e.g. $50/hr)';
    }

    if (!formData.duration.trim()) {
      nextErrors.duration = 'Duration is required (e.g. 12 weeks)';
    }

    if (!formData.deadline) {
      nextErrors.deadline = 'Application deadline is required';
    } else if (isNaN(new Date(formData.deadline).getTime())) {
      nextErrors.deadline = 'Please select a valid deadline date';
    }

    const posNum = Number(formData.positions);
    if (!formData.positions || isNaN(posNum) || posNum <= 0 || !Number.isInteger(posNum)) {
      nextErrors.positions = 'Number of positions must be a positive whole number';
    }

    if (!formData.skills.trim()) {
      nextErrors.skills = 'Please list at least one required skill';
    }

    if (!formData.description.trim()) {
      nextErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 20) {
      nextErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.responsibilities.trim()) {
      nextErrors.responsibilities = 'Key responsibilities are required';
    }

    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      positions: Number(formData.positions),
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-xl max-w-2xl w-full p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-150">
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <div>
          <h2 id="internship-form-title" className="text-xl font-bold text-text-primary tracking-tight">
            {isEditMode ? 'Edit Internship Posting' : 'Create New Internship'}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {isEditMode
              ? 'Update role specifications, requirements, and status.'
              : 'Publish a new opportunity for student applicants.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-secondary-100"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
        {/* Row 1: Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="form-title" className="font-semibold text-text-primary block mb-1">
              Internship Title <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-title"
              name="title"
              type="text"
              placeholder="e.g. Distributed Systems Intern"
              value={formData.title}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.title ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.title && <p className="text-[11px] text-danger-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="form-category" className="font-semibold text-text-primary block mb-1">
              Category <span className="text-danger-500">*</span>
            </label>
            <select
              id="form-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Department & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="form-department" className="font-semibold text-text-primary block mb-1">
              Department / Team <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-department"
              name="department"
              type="text"
              placeholder="e.g. Platform Infrastructure"
              value={formData.department}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.department ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.department && <p className="text-[11px] text-danger-500 mt-1">{errors.department}</p>}
          </div>

          <div>
            <label htmlFor="form-location" className="font-semibold text-text-primary block mb-1">
              Location <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-location"
              name="location"
              type="text"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.location ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.location && <p className="text-[11px] text-danger-500 mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Row 3: Work Mode, Type, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="form-workmode" className="font-semibold text-text-primary block mb-1">
              Work Mode <span className="text-danger-500">*</span>
            </label>
            <select
              id="form-workmode"
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="form-type" className="font-semibold text-text-primary block mb-1">
              Internship Type <span className="text-danger-500">*</span>
            </label>
            <select
              id="form-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {INTERNSHIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="form-duration" className="font-semibold text-text-primary block mb-1">
              Duration <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-duration"
              name="duration"
              type="text"
              placeholder="e.g. 12 weeks"
              value={formData.duration}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.duration ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.duration && <p className="text-[11px] text-danger-500 mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Row 4: Compensation, Deadline, Positions, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="form-compensation" className="font-semibold text-text-primary block mb-1">
              Compensation <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-compensation"
              name="compensation"
              type="text"
              placeholder="e.g. $52/hr"
              value={formData.compensation}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.compensation ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.compensation && <p className="text-[11px] text-danger-500 mt-1">{errors.compensation}</p>}
          </div>

          <div>
            <label htmlFor="form-deadline" className="font-semibold text-text-primary block mb-1">
              Deadline <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.deadline ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.deadline && <p className="text-[11px] text-danger-500 mt-1">{errors.deadline}</p>}
          </div>

          <div>
            <label htmlFor="form-positions" className="font-semibold text-text-primary block mb-1">
              Positions <span className="text-danger-500">*</span>
            </label>
            <input
              id="form-positions"
              name="positions"
              type="number"
              min="1"
              step="1"
              value={formData.positions}
              onChange={handleChange}
              className={[
                'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
                errors.positions ? 'border-danger-500' : 'border-border',
              ].join(' ')}
            />
            {errors.positions && <p className="text-[11px] text-danger-500 mt-1">{errors.positions}</p>}
          </div>

          <div>
            <label htmlFor="form-status" className="font-semibold text-text-primary block mb-1">
              Status <span className="text-danger-500">*</span>
            </label>
            <select
              id="form-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Required Skills */}
        <div>
          <label htmlFor="form-skills" className="font-semibold text-text-primary block mb-1">
            Required Skills (comma separated) <span className="text-danger-500">*</span>
          </label>
          <input
            id="form-skills"
            name="skills"
            type="text"
            placeholder="e.g. React, TypeScript, GraphQL, Docker"
            value={formData.skills}
            onChange={handleChange}
            className={[
              'w-full h-10 px-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none',
              errors.skills ? 'border-danger-500' : 'border-border',
            ].join(' ')}
          />
          {errors.skills && <p className="text-[11px] text-danger-500 mt-1">{errors.skills}</p>}
        </div>

        {/* Row 6: Description */}
        <div>
          <label htmlFor="form-description" className="font-semibold text-text-primary block mb-1">
            Job Description <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="form-description"
            name="description"
            rows={3}
            placeholder="Describe the opportunity, core projects, team culture, and objectives…"
            value={formData.description}
            onChange={handleChange}
            className={[
              'w-full p-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed',
              errors.description ? 'border-danger-500' : 'border-border',
            ].join(' ')}
          />
          {errors.description && <p className="text-[11px] text-danger-500 mt-1">{errors.description}</p>}
        </div>

        {/* Row 7: Responsibilities */}
        <div>
          <label htmlFor="form-responsibilities" className="font-semibold text-text-primary block mb-1">
            Key Responsibilities <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="form-responsibilities"
            name="responsibilities"
            rows={3}
            placeholder="Detail daily tasks, deliverables, and engineering expectations…"
            value={formData.responsibilities}
            onChange={handleChange}
            className={[
              'w-full p-3 rounded-lg border bg-white text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none leading-relaxed',
              errors.responsibilities ? 'border-danger-500' : 'border-border',
            ].join(' ')}
          />
          {errors.responsibilities && <p className="text-[11px] text-danger-500 mt-1">{errors.responsibilities}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {isEditMode ? 'Save Changes' : 'Publish Internship'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function InternshipFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="internship-form-title"
    >
      <InternshipFormInner
        key={initialData?.id || 'create-new'}
        initialData={initialData}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default InternshipFormModal;
