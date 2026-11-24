import { useState } from 'react';
import { Avatar, Button, Card, Input } from '../../components/ui/index.js';
import { MOCK_STUDENT_PROFILE } from '../../constants/mockStudentDashboard.js';
import useAuth from '../../hooks/useAuth.js';
import useLocalStorage from '../../hooks/useLocalStorage.js';

export function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useLocalStorage('student-profile', {
    ...MOCK_STUDENT_PROFILE,
    fullName: user?.fullName ?? user?.name ?? MOCK_STUDENT_PROFILE.fullName,
    email: user?.email ?? MOCK_STUDENT_PROFILE.email,
  });
  const [form, setForm] = useState(profile);
  const [notice, setNotice] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setNotice('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setProfile(form);
    setNotice('Profile changes saved in this browser.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My profile</h1>
        <p className="text-sm text-text-secondary mt-1">Keep your academic details up to date for internship applications.</p>
      </div>
      <Card padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={form.fullName} size="xl" />
          <div>
            <h2 className="font-semibold text-text-primary">{form.fullName}</h2>
            <p className="text-xs text-text-secondary">{form.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name" name="fullName" value={form.fullName ?? ''} onChange={handleChange} required />
          <Input label="Email address" name="email" type="email" value={form.email ?? ''} onChange={handleChange} required />
          <Input label="University / school" name="university" value={form.university ?? ''} onChange={handleChange} />
          <Input label="Degree" name="degree" value={form.degree ?? ''} onChange={handleChange} />
          <Input label="Graduation year" name="graduationYear" value={form.graduationYear ?? ''} onChange={handleChange} />
          <label className="sm:col-span-2 text-xs font-semibold text-text-secondary">
            Short bio
            <textarea name="bio" rows="4" value={form.bio ?? ''} onChange={handleChange} className="mt-1.5 w-full rounded-lg border border-border p-3 text-sm font-normal text-text-primary focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100" />
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-xs text-success-600">{notice}</p>
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      </Card>
      <p className="text-[11px] text-text-muted">Prototype mode: profile edits are saved in localStorage on this device. Connect a profile API for account-wide persistence.</p>
    </div>
  );
}

export default StudentProfilePage;
