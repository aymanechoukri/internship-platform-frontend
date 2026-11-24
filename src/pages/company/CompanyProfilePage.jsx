import { useState } from 'react';
import { Avatar, Button, Card, Input } from '../../components/ui/index.js';
import { MOCK_COMPANY_PROFILE } from '../../constants/mockCompanyDashboard.js';
import useAuth from '../../hooks/useAuth.js';
import useLocalStorage from '../../hooks/useLocalStorage.js';

export function CompanyProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useLocalStorage('company-profile', {
    ...MOCK_COMPANY_PROFILE,
    companyName: user?.companyName ?? user?.company?.name ?? MOCK_COMPANY_PROFILE.companyName,
    recruiterName: user?.fullName ?? user?.name ?? MOCK_COMPANY_PROFILE.recruiterName,
    email: user?.email ?? '',
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
    setNotice('Company profile saved in this browser.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Company profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage the company information shown to internship candidates.</p>
      </div>
      <Card padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={form.companyName} size="xl" />
          <div>
            <h2 className="font-semibold text-text-primary">{form.companyName}</h2>
            <p className="text-xs text-text-secondary">{form.industry}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Company name" name="companyName" value={form.companyName ?? ''} onChange={handleChange} required />
          <Input label="Recruiter name" name="recruiterName" value={form.recruiterName ?? ''} onChange={handleChange} required />
          <Input label="Recruiter email" name="email" type="email" value={form.email ?? ''} onChange={handleChange} />
          <Input label="Industry" name="industry" value={form.industry ?? ''} onChange={handleChange} />
          <Input label="Headquarters" name="headquarters" value={form.headquarters ?? ''} onChange={handleChange} />
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-xs text-success-600">{notice}</p>
            <Button type="submit">Save company profile</Button>
          </div>
        </form>
      </Card>
      <p className="text-[11px] text-text-muted">Prototype mode: profile edits are saved in localStorage on this device. Connect a company profile API for shared data.</p>
    </div>
  );
}

export default CompanyProfilePage;
