/**
 * @file pages/student/StudentInternshipsPage.jsx
 * @description Student Internship Discovery and Search listing.
 * Features comprehensive search, multi-factor filtering (category, location, work mode, type),
 * sorting by newest/compensation, clear filters, interactive saved internships, and empty state.
 */

import { useMemo, useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage.js';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Button, Card } from '../../components/ui/index.js';
import {
  INTERNSHIP_CATEGORIES,
  INTERNSHIP_TYPES,
  MOCK_INTERNSHIPS,
  POPULAR_LOCATIONS,
  WORK_MODES,
} from '../../constants/mockInternships.js';

/* ── Inline SVG Icons ── */
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-600">
        <path d="M5 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14l-5-2.5L5 18V4Z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4 text-text-muted hover:text-primary-600 transition-colors">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function AdjustmentsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM11.5 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      <path fillRule="evenodd" d="M2 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm0 5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9.5Zm0 5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V15Z" clipRule="evenodd" />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
    </svg>
  );
}

function BanknotesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4Zm12 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 6h14a1 1 0 0 0 1-1v-2.07A4.982 4.982 0 0 1 15 11a4.982 4.982 0 0 1-4 1.93A4.982 4.982 0 0 1 7 11c0 .77-.18 1.498-.5 2.145V13a1 1 0 0 0-1 1H4a1 1 0 0 0-1 1v-.07A1.002 1.002 0 0 0 4 14Z" clipRule="evenodd" />
    </svg>
  );
}

export function StudentInternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'compensation'
  const [savedInternshipIds, setSavedInternshipIds] = useLocalStorage('saved-internships', ['int-01']);
  const [saveToast, setSaveToast] = useState('');

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedWorkMode !== 'All' ? 1 : 0) +
    (selectedLocation !== 'All' ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedWorkMode('All');
    setSelectedLocation('All');
    setSelectedType('All');
    setSortBy('newest');
  };

  const handleToggleSave = (id, title) => {
    const isCurrentlySaved = savedInternshipIds.includes(id);
    setSavedInternshipIds((previous) => (
      isCurrentlySaved ? previous.filter((savedId) => savedId !== id) : [...previous, id]
    ));
    setSaveToast(isCurrentlySaved
      ? `Removed "${title}" from saved internships.`
      : `Saved "${title}" to your bookmarks!`);
    setTimeout(() => setSaveToast(''), 2500);
  };

  // Filtered and sorted listings
  const filteredInternships = useMemo(() => {
    return MOCK_INTERNSHIPS.filter((item) => {
      // Search by title or company name
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCompany = item.company.toLowerCase().includes(query);
        const matchesSkills = item.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // Filter by category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Filter by work mode
      if (selectedWorkMode !== 'All' && item.workMode !== selectedWorkMode) {
        return false;
      }

      // Filter by location
      if (selectedLocation !== 'All') {
        if (selectedLocation === 'Remote') {
          if (item.workMode !== 'Remote' && !item.location.includes('Remote')) return false;
        } else if (!item.location.includes(selectedLocation)) {
          return false;
        }
      }

      // Filter by type
      if (selectedType !== 'All' && !item.type.includes(selectedType)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.postedDate) - new Date(a.postedDate);
      }
      if (sortBy === 'compensation') {
        const numA = parseInt(a.compensation.replace(/[^0-9]/g, ''), 10) || 0;
        const numB = parseInt(b.compensation.replace(/[^0-9]/g, ''), 10) || 0;
        return numB - numA;
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, selectedWorkMode, selectedLocation, selectedType, sortBy]);

  const getWorkModeBadgeVariant = (mode) => {
    switch (mode) {
      case 'Remote':
        return 'success';
      case 'Hybrid':
        return 'primary';
      case 'On-site':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Explore Internships
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Discover verified internship opportunities tailored for students and early-career talent.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {filteredInternships.length} Available {filteredInternships.length === 1 ? 'Role' : 'Roles'}
          </Badge>
        </div>
      </div>

      {/* ── Toast Notification for Save Interaction ── */}
      {saveToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ── Search & Filter Controls Panel ── */}
      <Card variant="bordered" padding="md" className="space-y-4 bg-surface shadow-xs">
        {/* Search Input Bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by job title, company name, or technology skill (e.g. React, Python)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-secondary-50/70 text-sm text-text-primary placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1"
              aria-label="Clear search"
            >
              <XMarkIcon />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Category */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-category" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-white text-xs text-text-primary font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {INTERNSHIP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-workmode" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Work Mode
            </label>
            <select
              id="filter-workmode"
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-white text-xs text-text-primary font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {WORK_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode === 'All' ? 'All Work Modes' : mode}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-location" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Location
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-white text-xs text-text-primary font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-type" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Internship Type
            </label>
            <select
              id="filter-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-white text-xs text-text-primary font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {INTERNSHIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
            <label htmlFor="filter-sort" className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Sort Order
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-border bg-white text-xs text-text-primary font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="compensation">Highest Compensation</option>
            </select>
          </div>
        </div>

        {/* Filter Meta Bar (Active counts + Clear button) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border text-xs">
          <div className="flex items-center gap-2 text-text-secondary">
            <span>
              Showing <strong>{filteredInternships.length}</strong> {filteredInternships.length === 1 ? 'internship' : 'internships'}
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold text-[11px]">
                {activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1.5 font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <XMarkIcon />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </Card>

      {/* ── Internship Listings Grid / Empty State ── */}
      {filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map((internship) => {
            const isSaved = savedInternshipIds.includes(internship.id);

            return (
              <Card
                key={internship.id}
                variant="bordered"
                padding="md"
                hoverable
                className="flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Company, Role, Bookmark button */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={internship.company} size="md" />
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          {internship.company}
                        </p>
                        <h2 className="font-bold text-base text-text-primary group-hover:text-primary-600 transition-colors line-clamp-1">
                          {internship.title}
                        </h2>
                      </div>
                    </div>

                    {/* Interactive Save Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSave(internship.id, internship.title)}
                      className="p-1.5 rounded-lg hover:bg-secondary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      aria-label={isSaved ? 'Remove from saved' : 'Save internship'}
                      title={isSaved ? 'Saved to bookmarks' : 'Save internship'}
                    >
                      <BookmarkIcon filled={isSaved} />
                    </button>
                  </div>

                  {/* Location & Work Mode Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={getWorkModeBadgeVariant(internship.workMode)} size="sm" dot>
                      {internship.workMode}
                    </Badge>
                    <span className="text-xs text-text-secondary">
                      📍 {internship.location}
                    </span>
                  </div>

                  {/* Duration, Type, Compensation */}
                  <div className="flex items-center gap-4 text-xs text-text-secondary mb-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-1">
                      <CalendarIcon />
                      <span>{internship.duration} ({internship.type})</span>
                    </div>
                    {internship.compensation && (
                      <div className="flex items-center gap-1 font-semibold text-primary-700">
                        <BanknotesIcon />
                        <span>{internship.compensation}</span>
                      </div>
                    )}
                  </div>

                  {/* Required Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {internship.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {internship.skills.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-secondary-50 text-text-muted text-[11px]">
                        +{internship.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Deadline & View Details Button */}
                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-text-muted">
                    Deadline: {internship.deadline}
                  </span>
                  <Link to={`/student/internships/${internship.id}`}>
                    <Button variant="primary" size="sm" className="group-hover:shadow-xs">
                      <span>View Details</span>
                      <ArrowRightIcon />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <Card variant="bordered" padding="lg" className="text-center py-12 max-w-lg mx-auto bg-surface">
          <div className="w-14 h-14 rounded-2xl bg-secondary-100 text-text-muted flex items-center justify-center mx-auto mb-4">
            <AdjustmentsIcon />
          </div>
          <h2 className="text-lg font-bold text-text-primary">
            No internships match your filters
          </h2>
          <p className="text-xs text-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any roles matching your current search criteria. Try broadening your keywords, switching categories, or clearing active filters.
          </p>
          <div className="mt-5">
            <Button variant="primary" size="md" onClick={clearAllFilters}>
              Reset All Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default StudentInternshipsPage;
