"use client";

import React, { useState, useEffect } from "react";

export function LandingsStudio() {
  const [landings, setLandings] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingLanding, setEditingLanding] = useState<any>(null);

  const fetchLandings = async () => {
    try {
      const res = await fetch("/api/admin/landings");
      const data = await res.json();
      if (data.success) {
        setLandings(data.pages);
      }
    } catch (err) {
      console.error("Failed to fetch landings:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLandings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLanding?.slug) return;
    
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/landings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLanding),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        setEditingLanding(null);
        fetchLandings();
      } else {
        alert("Error saving landing page.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la landing /lp/${slug}?`)) return;

    try {
      const res = await fetch(`/api/admin/landings?slug=${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchLandings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="bg-white p-5 rounded-[22px] border border-[#E7E3EC] shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#5B2C72] font-extrabold uppercase tracking-wider mb-1">
            <span>Módulo de Configuración</span>
            <span>·</span>
            <span className="text-[#157A5A]">Landings</span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold tracking-[-0.03em] text-[#17131F] m-0">
            Paid Landings (Noindex)
          </h2>
        </div>
        <button
          onClick={() => setEditingLanding({ slug: "", status: "DRAFT", headline: "", subheadline: "", cta_text: "" })}
          className="px-5 py-2 bg-[#5B2C72] hover:bg-[#431F54] text-white rounded-xl text-[13px] font-extrabold shadow-sm transition-all"
        >
          + Nueva Landing
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#F1FAF6] border border-[#C6E6D9] text-[#157A5A] rounded-2xl font-bold text-[13.5px]">
          Landing page guardada con éxito.
        </div>
      )}

      {editingLanding ? (
        <div className="bg-white p-6 rounded-[24px] border border-[#E7E3EC] shadow-sm">
          <h3 className="text-[17px] font-extrabold text-[#17131F] mb-4">
            {editingLanding.slug ? "Editar Landing" : "Crear Landing"}
          </h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#8A8095] uppercase mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  placeholder="ej. meta-oferta-1"
                  disabled={editingLanding.slug && landings.some(l => l.slug === editingLanding.slug)}
                  value={editingLanding.slug}
                  onChange={(e) => setEditingLanding({ ...editingLanding, slug: e.target.value.replace(/[^a-z0-9-]/g, "") })}
                  className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#17131F] focus:outline-none focus:border-[#5B2C72] focus:ring-1 focus:ring-[#5B2C72]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#8A8095] uppercase mb-1">Estado</label>
                <select
                  value={editingLanding.status}
                  onChange={(e) => setEditingLanding({ ...editingLanding, status: e.target.value })}
                  className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#17131F] focus:outline-none focus:border-[#5B2C72] focus:ring-1 focus:ring-[#5B2C72]"
                >
                  <option value="DRAFT">Borrador</option>
                  <option value="PUBLISHED">Publicado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#8A8095] uppercase mb-1">Titular (H1)</label>
              <input
                type="text"
                required
                value={editingLanding.headline || ""}
                onChange={(e) => setEditingLanding({ ...editingLanding, headline: e.target.value })}
                className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#17131F] focus:outline-none focus:border-[#5B2C72] focus:ring-1 focus:ring-[#5B2C72]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#8A8095] uppercase mb-1">Subtítulo</label>
              <input
                type="text"
                required
                value={editingLanding.subheadline || ""}
                onChange={(e) => setEditingLanding({ ...editingLanding, subheadline: e.target.value })}
                className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#17131F] focus:outline-none focus:border-[#5B2C72] focus:ring-1 focus:ring-[#5B2C72]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#8A8095] uppercase mb-1">Botón CTA</label>
              <input
                type="text"
                required
                value={editingLanding.cta_text || ""}
                onChange={(e) => setEditingLanding({ ...editingLanding, cta_text: e.target.value })}
                className="w-full bg-[#FAF8FB] border border-[#E7E3EC] rounded-xl px-4 py-2.5 text-[14px] font-medium text-[#17131F] focus:outline-none focus:border-[#5B2C72] focus:ring-1 focus:ring-[#5B2C72]"
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditingLanding(null)}
                className="px-5 py-2.5 bg-[#FAF8FB] text-[#5B5266] border border-[#C9C1D4] rounded-xl text-[13px] font-bold hover:text-[#17131F]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#157A5A] hover:bg-[#106247] text-white rounded-xl text-[13px] font-extrabold shadow-sm transition-all"
              >
                {isSaving ? "Guardando..." : "Guardar Landing"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] border border-[#E7E3EC] shadow-sm overflow-hidden">
          {landings.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8FB] border-b border-[#E7E3EC] text-[#8A8095] text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Titular</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3EC] text-[13px]">
                {landings.map((l) => (
                  <tr key={l.slug} className="hover:bg-[#FAF8FB]">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#17131F]">/lp/{l.slug}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        l.status === "PUBLISHED" ? "bg-[#F1FAF6] text-[#157A5A] border-[#C6E6D9]" : "bg-[#FAF8FB] text-[#8A8095] border-[#E7E3EC]"
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5B5266] truncate max-w-[200px]">{l.headline}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => setEditingLanding(l)} className="text-[#5B2C72] font-bold hover:underline mr-3">Editar</button>
                      <button onClick={() => handleDelete(l.slug)} className="text-[#B02A24] font-bold hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-[#5B5266] text-[13px]">
              No hay landings pagadas configuradas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
