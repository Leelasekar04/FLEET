"use client";

import { useState } from "react";
import { FileText, Loader2, CheckCircle, AlertTriangle, XCircle, Upload, ZoomIn, X, ShieldCheck, Save } from "lucide-react";
import { useDriverSync } from "@/hooks/useDriverSync";

interface LicenseForm {
  license_no: string;
  license_expiry: string;
  document_url: string;
}

export default function DriverDocumentsPage() {
  const { driverMe, loading, refetch } = useDriverSync();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);

  // License detail modal state
  const [licenseModal, setLicenseModal] = useState(false);
  const [licenseForm, setLicenseForm] = useState<LicenseForm>({ license_no: "", license_expiry: "", document_url: "" });
  const [savingLicense, setSavingLicense] = useState(false);

  const d = driverMe?.driver || {} as any;
  const v = driverMe?.assignedVehicle as any;

  const docs = [
    {
      name: "Driving License",
      type: "driver",
      docKey: "license_url",
      numberLabel: d.license_no,
      expiry: d.license_expiry,
      currentUrl: d.license_url,
      vehicleReq: false,
      isLicense: true,
    },
    {
      name: "RC Copy",
      type: "vehicle",
      docKey: "rc_url",
      numberLabel: v?.rc_number,
      expiry: v?.rc_expiry,
      currentUrl: v?.rc_url,
      vehicleReq: true,
      isLicense: false,
    },
    {
      name: "Insurance Certificate",
      type: "vehicle",
      docKey: "insurance_url",
      numberLabel: v?.insurance_number,
      expiry: v?.insurance_expiry,
      currentUrl: v?.insurance_url,
      vehicleReq: true,
      isLicense: false,
    },
    {
      name: "Fitness Certificate",
      type: "vehicle",
      docKey: "fitness_url",
      numberLabel: null,
      expiry: v?.fitness_expiry,
      currentUrl: v?.fitness_url,
      vehicleReq: true,
      isLicense: false,
    },
    {
      name: "Permit",
      type: "vehicle",
      docKey: "permit_url",
      numberLabel: null,
      expiry: v?.permit_expiry,
      currentUrl: v?.permit_url,
      vehicleReq: true,
      isLicense: false,
    },
    {
      name: "PUC Certificate",
      type: "vehicle",
      docKey: "puc_url",
      numberLabel: null,
      expiry: v?.puc_expiry,
      currentUrl: v?.puc_url,
      vehicleReq: true,
      isLicense: false,
    },
  ];

  const getDocStatus = (expiryDate: string | undefined | null) => {
    if (!expiryDate) return { label: "Unknown", badgeClass: "badge", icon: <FileText size={13} /> };
    const expiry = new Date(expiryDate);
    const today = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    if (expiry < today) return { label: "Expired", badgeClass: "badge badge-danger", icon: <XCircle size={13} /> };
    if (expiry <= soon) return { label: "Expiring Soon", badgeClass: "badge badge-warning", icon: <AlertTriangle size={13} /> };
    return { label: "Valid", badgeClass: "badge badge-completed", icon: <CheckCircle size={13} /> };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docKey: string, isLicense: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;

      if (isLicense) {
        // Open a modal asking for license details
        setLicenseForm({
          license_no: d.license_no || "",
          license_expiry: d.license_expiry ? d.license_expiry.split("T")[0] : "",
          document_url: dataUrl,
        });
        setLicenseModal(true);
      } else {
        // Non-license documents: upload directly
        uploadDocument(docKey, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadDocument = async (docKey: string, documentUrl: string, extra?: { license_no?: string; license_expiry?: string }) => {
    setUploadingDoc(docKey);
    try {
      const token = localStorage.getItem("driver_token");
      const body: any = { document_type: docKey, document_url: documentUrl, ...extra };
      const res = await fetch("http://localhost:4000/api/portal/driver/me/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        refetch();
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLicense(true);
    await uploadDocument("license_url", licenseForm.document_url, {
      license_no: licenseForm.license_no,
      license_expiry: licenseForm.license_expiry,
    });
    setSavingLicense(false);
    setLicenseModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-white">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="cmd-root p-6 max-w-7xl mx-auto">
      {/* ── Banner ── */}
      <div className="cmd-banner animate-fade-in">
        <div className="cmd-banner-left">
          <h1 className="cmd-banner-title">Documents</h1>
          <p className="cmd-banner-sub">
            Manage your driving licenses, vehicle permits, and compliance certificates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-fade-in stagger-1">
        {docs.map((doc, idx) => {
          if (doc.vehicleReq && !v) return null;

          const status = getDocStatus(doc.expiry);
          const isUploading = uploadingDoc === doc.docKey;

          return (
            <div
              key={idx}
              className="cmd-chart-card flex flex-col h-full"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.type === "driver" ? "bg-blue-50 text-blue-600" : "bg-indigo-50 text-indigo-600"}`}>
                  <FileText size={24} />
                </div>
                <div className={`${status.badgeClass} flex items-center gap-1.5`}>
                  {status.icon} {status.label}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{doc.name}</h3>
              <p className="text-sm text-slate-500 font-semibold mb-4">
                {doc.numberLabel || (doc.currentUrl ? "Uploaded" : "Not Uploaded")}
              </p>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</span>
                <span className="text-sm font-bold text-slate-900">
                  {doc.expiry ? new Date(doc.expiry).toLocaleDateString() : "—"}
                </span>
              </div>

              {/* Upload hint for license */}
              {doc.isLicense && !doc.currentUrl && (
                <p className="text-[10px] text-blue-600 font-semibold bg-blue-50 rounded-lg px-2 py-1 mb-3 flex items-center gap-1">
                  <CheckCircle size={10} /> Uploading will fill your profile details
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                {doc.currentUrl ? (
                  <>
                    <button
                      onClick={() => setViewingUrl(doc.currentUrl!)}
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      <ZoomIn size={14} /> View
                    </button>
                    <label className={`btn btn-secondary btn-sm flex-1 cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? "Uploading..." : "Replace"}
                      <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileChange(e, doc.docKey, doc.isLicense)} />
                    </label>
                  </>
                ) : (
                  <label className={`btn btn-primary btn-sm w-full cursor-pointer ${isUploading ? "opacity-60 pointer-events-none" : ""}`}>
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {isUploading ? "Uploading..." : "Upload Document"}
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileChange(e, doc.docKey, doc.isLicense)} />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!v && (
        <div className="empty-state mt-6">
          <FileText size={48} className="text-slate-200 mb-4" />
          <p className="max-w-sm mx-auto">Vehicle documents will appear here once a vehicle is assigned to your active trip.</p>
        </div>
      )}

      {/* ─── License Details Modal ─── */}
      {licenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h2 className="font-bold text-slate-900">Fill License Details</h2>
              </div>
              <button onClick={() => setLicenseModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Preview */}
            {licenseForm.document_url && (
              <div className="mx-6 mt-4 rounded-xl overflow-hidden border border-slate-200 h-32">
                <img src={licenseForm.document_url} alt="License preview" className="w-full h-full object-cover" />
              </div>
            )}

            <form onSubmit={handleLicenseSubmit} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 -mt-2">Enter your license details — they will automatically appear in your profile.</p>

              <div>
                <label className="form-label">License Number</label>
                <input
                  type="text"
                  required
                  value={licenseForm.license_no}
                  onChange={e => setLicenseForm(f => ({ ...f, license_no: e.target.value }))}
                  placeholder="e.g. TN10 20230012345"
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={licenseForm.license_expiry}
                  onChange={e => setLicenseForm(f => ({ ...f, license_expiry: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLicenseModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLicense}
                  className="btn btn-primary flex-1"
                >
                  {savingLicense ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {savingLicense ? "Saving..." : "Save & Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Document Lightbox ─── */}
      {viewingUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in"
          onClick={() => setViewingUrl(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setViewingUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 flex items-center gap-1 text-sm font-bold transition-colors"
            >
              <X size={18} /> Close
            </button>
            <img src={viewingUrl} alt="Document" className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
