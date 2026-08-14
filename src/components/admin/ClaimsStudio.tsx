"use client";

import React, { useState, useEffect } from "react";
import { CheckIcon } from "@/components/icons/bravo";

interface Claim {
  id: string;
  label: string;
  value: string;
  status: "VALIDATED" | "PENDING_VALIDATION" | "REJECTED";
  source: string;
  legal_approved: boolean;
}

export function ClaimsStudio() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await fetch("/api/admin/claims");
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClaims();
  }, []);

  const handleSave = async () => {
    if (!editingClaim) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClaim),
      });
      if (res.ok) {
        setEditingClaim(null);
        await fetchClaims();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[20px] font-extrabold text-[#17131F] flex items-center gap-2">
          Gobernanza de Claims
        </h2>
        <p className="text-[14px] text-[#5B5266]">
          El contenido regulado o sensible no puede ser modificado libremente desde el CMS sin autorización.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-sm text-[#5B5266]">
          <span className="w-4 h-4 rounded-full border-2 border-[#5ECBDB] border-t-transparent animate-spin" />
          Cargando claims...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white rounded-xl border border-[#E7E3EC] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-mono text-[#8A8095] bg-[#F1EEF3] px-2 py-0.5 rounded">
                  {claim.id}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    claim.status === "VALIDATED"
                      ? "bg-[#22C55E]/10 text-[#157A5A]"
                      : claim.status === "PENDING_VALIDATION"
                      ? "bg-[#F59E0B]/10 text-[#B45309]"
                      : "bg-[#EF4444]/10 text-[#B91C1C]"
                  }`}
                >
                  {claim.status}
                </span>
              </div>
              <p className="font-extrabold text-[#17131F] text-[15px] leading-tight">{claim.value}</p>
              <div className="text-[12px] text-[#5B5266] mt-auto">
                <p><strong>Fuente:</strong> {claim.source || "N/A"}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${claim.legal_approved ? "bg-[#25D366]" : "bg-[#E7E3EC]"}`}>
                    {claim.legal_approved && <CheckIcon size={8} className="text-white" />}
                  </div>
                  <span>Aprobado por Legal</span>
                </div>
              </div>
              <button
                onClick={() => setEditingClaim({ ...claim })}
                className="mt-2 text-[13px] font-bold text-[#5B2C72] hover:text-[#45205A] text-left"
              >
                Editar claim →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingClaim && (
        <div className="fixed inset-0 z-50 bg-[#17131F]/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <h3 className="font-extrabold text-[18px]">Editar Claim</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#5B5266]">Identificador</label>
              <input type="text" disabled value={editingClaim.id} className="w-full h-10 px-3 rounded-lg border border-[#E7E3EC] bg-[#F1EEF3] text-[14px]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#5B5266]">Valor a publicar</label>
              <textarea 
                value={editingClaim.value} 
                onChange={(e) => setEditingClaim({ ...editingClaim, value: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#E7E3EC] text-[14px] min-h-[80px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#5B5266]">Fuente / Justificación</label>
              <input 
                type="text" 
                value={editingClaim.source} 
                onChange={(e) => setEditingClaim({ ...editingClaim, source: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#E7E3EC] text-[14px]" 
              />
            </div>
            
            {/* Roles de administrador pueden cambiar estados y aprobaciones */}
            <div className="flex flex-col gap-3 p-4 bg-[#F1EEF3] rounded-xl mt-2 border border-[#E7E3EC]">
              <label className="text-[12px] font-bold text-[#5B5266] uppercase tracking-wider">Zona de Cumplimiento</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editingClaim.legal_approved} 
                  onChange={(e) => setEditingClaim({ ...editingClaim, legal_approved: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E7E3EC] text-[#5B2C72]"
                />
                <span className="text-[14px]">Aprobación Legal Otorgada</span>
              </label>
              <label className="text-[12px] font-bold text-[#5B5266]">Estado de la métrica</label>
              <select 
                value={editingClaim.status}
                onChange={(e) => setEditingClaim({ ...editingClaim, status: e.target.value as any })}
                className="w-full h-10 px-3 rounded-lg border border-[#E7E3EC] text-[14px]"
              >
                <option value="VALIDATED">Validado para uso público</option>
                <option value="PENDING_VALIDATION">Pendiente de validación (No se publica)</option>
                <option value="REJECTED">Rechazado (No se publica)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button 
                onClick={() => setEditingClaim(null)}
                className="text-[14px] font-bold text-[#5B5266] hover:text-[#17131F] px-4 py-2"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#5B2C72] hover:bg-[#45205A] text-white px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
