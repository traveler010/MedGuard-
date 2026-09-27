'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Patient, RiskLevel } from '@/data/mockPatients';
import { RiskBadge } from '@/components/RiskBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Stethoscope,
  ChevronRight,
  User,
  Pill,
  Clock,
  AlertTriangle,
  RotateCcw,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import { PatientMedicationsModal } from '@/components/dashboard/PatientMedicationsModal';

interface RecentPatientsTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onStartConsultationForPatient: (patient: Patient) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

type SortField = 'risk' | 'name' | 'age' | 'recent';

export function RecentPatientsTable({
  patients,
  onSelectPatient,
  onStartConsultationForPatient,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}: RecentPatientsTableProps) {
  const router = useRouter();
  const [internalSearch, setInternalSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPatientForMeds, setSelectedPatientForMeds] = useState<Patient | null>(null);
  
  // States: loading, error simulation
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const query = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const setQuery = externalOnSearchChange || setInternalSearch;

  // Filter logic
  const filteredPatients = patients.filter((patient) => {
    // Search query matching
    const matchesSearch =
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(query.toLowerCase()) ||
      patient.diagnoses.some((d) => d.toLowerCase().includes(query.toLowerCase())) ||
      patient.medications.some((m) => m.name.toLowerCase().includes(query.toLowerCase()));

    if (!matchesSearch) return false;

    // Risk filter
    if (riskFilter !== 'ALL' && patient.riskLevel !== riskFilter) return false;

    return true;
  });

  // Sort logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortField === 'risk') {
      return sortAsc
        ? a.polypharmacyScore - b.polypharmacyScore
        : b.polypharmacyScore - a.polypharmacyScore;
    }
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortField === 'age') {
      return sortAsc ? a.age - b.age : b.age - a.age;
    }
    if (sortField === 'recent') {
      return sortAsc
        ? (a.lastConsultation || '').localeCompare(b.lastConsultation || '')
        : (b.lastConsultation || '').localeCompare(a.lastConsultation || '');
    }
    return 0;
  });

  const handleSimulateReload = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleClearFilters = () => {
    setQuery('');
    setRiskFilter('ALL');
    setSortField('risk');
    setSortAsc(false);
    setHasError(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden mb-8 transition-colors">
      
      {/* Table Header & Controls Bar */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recent Patients & Regimen Audits</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPatients.length} Active Records
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Polypharmacy risk stratification and clinical review status across your patient panel.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Risk Level Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setRiskFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                riskFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRiskFilter('HIGH')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                riskFilter === 'HIGH'
                  ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High
            </button>
            <button
              onClick={() => setRiskFilter('MODERATE')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                riskFilter === 'MODERATE'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Mod
            </button>
            <button
              onClick={() => setRiskFilter('LOW')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                riskFilter === 'LOW'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Low
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="risk" className="dark:bg-slate-900">Risk Score</option>
              <option value="recent" className="dark:bg-slate-900">Last Consult</option>
              <option value="name" className="dark:bg-slate-900">Patient Name</option>
              <option value="age" className="dark:bg-slate-900">Age</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-mono px-1 cursor-pointer"
              title="Toggle Ascending/Descending"
            >
              {sortAsc ? '▲' : '▼'}
            </button>
          </div>

          {/* Reload / Refresh state simulator */}
          <button
            onClick={handleSimulateReload}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            title="Refresh Table Data"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600 dark:text-teal-400' : ''}`} />
          </button>

        </div>
      </div>

      {/* ERROR STATE */}
      {hasError ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Unable to load patient records
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            A temporary connection timeout occurred while synchronizing clinical records.
          </p>
          <button
            onClick={handleSimulateReload}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : isLoading ? (
        /* LOADING STATE (Skeleton Rows) */
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 py-4">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
            <span>Synchronizing patient panel and calculating risk matrices...</span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 animate-pulse border border-slate-100 dark:border-slate-800"
            />
          ))}
        </div>
      ) : sortedPatients.length === 0 ? (
        /* EMPTY STATE */
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No matching patient records found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No patients match your search term <strong className="text-slate-800 dark:text-slate-200">"{query}"</strong> or active risk filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* TABLE / CARD LIST */
        <div className="overflow-x-auto table-responsive-container">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Patient</th>
                <th className="py-3.5 px-3">Age</th>
                <th className="py-3.5 px-3">Conditions</th>
                <th className="py-3.5 px-3">Medications</th>
                <th className="py-3.5 px-3 text-center">Risk</th>
                <th className="py-3.5 px-3">Last Consultation</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedPatients.map((patient) => {
                const isHigh = patient.riskLevel === 'HIGH';

                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                  >
                    {/* Patient Name & MRN */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs ${
                            isHigh
                              ? 'bg-gradient-to-tr from-slate-900 to-rose-900'
                              : 'bg-gradient-to-tr from-slate-800 to-slate-700'
                          }`}
                        >
                          {patient.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                            {patient.name}
                            {isHigh && (
                              <span
                                className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                                title="Action Required"
                              />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            MRN: {patient.mrn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td className="py-4 px-3 font-semibold text-slate-700 dark:text-slate-300">
                      <div>{patient.age} yrs</div>
                      <div className="text-[10px] text-slate-400 font-normal">{patient.gender}</div>
                    </td>

                    {/* Conditions */}
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {patient.diagnoses.slice(0, 2).map((diag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/60 dark:border-slate-700/60 truncate"
                          >
                            {diag}
                          </span>
                        ))}
                        {patient.diagnoses.length > 2 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{patient.diagnoses.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Medications */}
                    <td className="py-4.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedPatientForMeds(patient)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200/80 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer group/btn"
                        title="View concise medication list"
                      >
                        <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{patient.medications.length} Meds</span>
                        <span className="text-[10px] text-slate-400 group-hover/btn:text-teal-600 dark:group-hover/btn:text-teal-400 font-normal">
                          • View
                        </span>
                      </button>
                    </td>

                    {/* Risk Badge with score */}
                    <td className="py-4.5 px-3 text-center">
                      <RiskBadge
                        level={patient.riskLevel}
                        size="sm"
                        score={patient.polypharmacyScore}
                      />
                    </td>

                    {/* Last Consultation */}
                    <td className="py-4.5 px-3">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{patient.lastConsultation || patient.lastReviewDate}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Dr. Sharma
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-4.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/doctor/patients/${patient.id}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer shadow-2xs inline-block btn-press"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => onStartConsultationForPatient(patient)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1 btn-press"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-teal-400 dark:text-white" />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer Summary */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <span>
          Showing <strong>{sortedPatients.length}</strong> of {patients.length} total patient records
        </span>
        <span className="text-[11px] text-slate-400 font-mono">
          Clinical Guidance: Beers Criteria 2023 & STOPP/START v3
        </span>
      </div>

      {/* Concise Patient Medications Quick Modal */}
      <PatientMedicationsModal
        patient={selectedPatientForMeds}
        isOpen={Boolean(selectedPatientForMeds)}
        onClose={() => setSelectedPatientForMeds(null)}
        onStartConsultation={onStartConsultationForPatient}
      />

    </div>
  );
}
