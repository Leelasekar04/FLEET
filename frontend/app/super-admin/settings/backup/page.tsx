"use client";

import { 
  Save, 
  CheckCircle2, 
  Database,
  Cloud,
  HardDrive,
  RefreshCw,
  Download,
  RotateCcw,
  Clock,
  Trash2,
  Calendar
} from "lucide-react";
import { useState } from "react";

export default function BackupSettingsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  
  const [formData, setFormData] = useState({
    schedule: "Daily",
    retentionDays: "30",
    storageProvider: "AWS S3",
    bucketName: "fleet-backups-prod",
    region: "us-east-1"
  });

  const recentBackups = [
    { id: 1, date: "2026-07-15 02:00 AM", size: "1.2 GB", type: "Automated", status: "Success" },
    { id: 2, date: "2026-07-14 02:00 AM", size: "1.2 GB", type: "Automated", status: "Success" },
    { id: 3, date: "2026-07-13 14:30 PM", size: "1.1 GB", type: "Manual", status: "Success" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
    showToast("Backup settings saved successfully");
  };

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsBackingUp(false);
    showToast("Manual backup completed successfully");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="cmd-root p-6 max-w-[1600px] mx-auto">
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Backup Settings</h1>
          <p className="cmd-banner-sub">
            Configure automated database backups, storage locations, and retention policies.
          </p>
        </div>
        <div className="cmd-banner-actions">
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleManualBackup}
            disabled={isBackingUp}
          >
            <Database size={16} className={isBackingUp ? "animate-pulse text-blue-500" : "text-blue-500"} /> 
            {isBackingUp ? "Backing up..." : "Backup Now"}
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 animate-fade-in stagger-1">
        
        {/* Schedule Settings */}
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={18} className="text-emerald-500" /> Automated Schedule
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" /> Frequency
                </label>
                <select 
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900"
                >
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Retention (Days)</label>
                <input 
                  type="number" 
                  name="retentionDays"
                  value={formData.retentionDays}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mt-4 flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Schedule Active</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Automated backups are currently running at 02:00 AM UTC every day.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Configuration */}
        <div className="cmd-chart-card p-6">
          <h2 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
            <Cloud size={18} className="text-blue-500" /> Cloud Storage
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storage Provider</label>
              <select 
                name="storageProvider"
                value={formData.storageProvider}
                onChange={handleChange}
                className="form-input !h-10 w-full text-sm font-medium text-slate-900"
              >
                <option value="AWS S3">AWS S3</option>
                <option value="Google Cloud Storage">Google Cloud Storage</option>
                <option value="Azure Blob Storage">Azure Blob Storage</option>
                <option value="Local Server">Local Server</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <HardDrive size={12} className="text-slate-400" /> Bucket Name
                </label>
                <input 
                  type="text" 
                  name="bucketName"
                  value={formData.bucketName}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                <input 
                  type="text" 
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="form-input !h-10 w-full text-sm font-medium text-slate-900" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Backups Table */}
      <div className="cmd-chart-card mt-6 animate-fade-in stagger-2">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Database size={18} className="text-purple-500" /> Recent Backups
          </h2>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Size</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBackups.map((backup) => (
                <tr key={backup.id} className="group">
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{backup.date}</div>
                  </td>
                  <td>
                    <span className={`badge ${backup.type === 'Automated' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                      {backup.type}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-slate-700 text-sm">{backup.size}</div>
                  </td>
                  <td>
                    <span className="badge badge-completed">{backup.status}</span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="btn btn-secondary btn-sm !px-2"
                        title="Download Backup"
                        onClick={() => showToast("Downloading backup file...")}
                      >
                        <Download size={14} className="text-blue-600" />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm !px-2"
                        title="Restore"
                        onClick={() => showToast("Restore initiated from backup")}
                      >
                        <RotateCcw size={14} className="text-emerald-600" />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm !px-2"
                        title="Delete"
                        onClick={() => showToast("Backup deleted")}
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
