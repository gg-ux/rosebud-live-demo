import { useState, useEffect } from 'react';

/**
 * ExportModal — popup for selecting which flows to export and the file format.
 *
 * Props:
 *   open       — boolean, controls visibility
 *   onClose    — () => void
 *   flows      — array of { id, label, description, count }
 *   onExport   — (selectedFlowIds: string[], format: 'png' | 'svg' | 'both') => void
 *   accentColor — optional hex string for the primary button (default #191C1A)
 */
export function ExportModal({ open, onClose, flows, onExport, accentColor = '#191C1A' }) {
  const [selected, setSelected] = useState(new Set(flows.map(f => f.id)));
  const [format, setFormat] = useState('png');

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setSelected(new Set(flows.map(f => f.id)));
      setFormat('png');
    }
  }, [open, flows]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggleFlow = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const totalSelectedScreens = flows
    .filter(f => selected.has(f.id))
    .reduce((sum, f) => sum + (f.count || 0), 0);

  const totalFiles = format === 'both' ? totalSelectedScreens * 2 : totalSelectedScreens;

  const canExport = selected.size > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[20px]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[460px] bg-white rounded-[20px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-[24px] pt-[24px] pb-[16px] border-b border-[#F0F0F0]">
          <div className="flex items-start justify-between gap-[12px]">
            <div>
              <h3 className="text-[18px] leading-[24px] font-[700] text-[#191C1A]">Export screens</h3>
              <p className="text-[13px] leading-[18px] font-[450] text-[#6D6C6A] mt-[2px]">
                Choose which flows and format you want.
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center hover:bg-[#F0F0F0] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#6D6C6A" strokeWidth="2" strokeLinecap="round" className="w-[16px] h-[16px]">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-[24px] py-[20px] flex flex-col gap-[20px] max-h-[60vh] overflow-y-auto">
          {/* Flows section */}
          <div>
            <div className="flex items-center justify-between mb-[10px]">
              <span className="text-[11px] leading-[14px] font-[600] tracking-[0.06em] uppercase text-[#8B828B]">
                Flows
              </span>
              <button
                onClick={() => {
                  if (selected.size === flows.length) setSelected(new Set());
                  else setSelected(new Set(flows.map(f => f.id)));
                }}
                className="text-[12px] leading-[16px] font-[500] text-[#6D6C6A] hover:text-[#191C1A] transition-colors cursor-pointer"
              >
                {selected.size === flows.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="flex flex-col gap-[6px]">
              {flows.map((flow) => {
                const isSelected = selected.has(flow.id);
                return (
                  <button
                    key={flow.id}
                    onClick={() => toggleFlow(flow.id)}
                    className={`text-left w-full p-[12px] rounded-[12px] border transition-all cursor-pointer flex items-start gap-[12px] ${
                      isSelected
                        ? 'border-[#191C1A] bg-[#F9F9F9]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#C0C0BF]'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`shrink-0 w-[18px] h-[18px] rounded-[5px] flex items-center justify-center mt-[1px] transition-all ${
                        isSelected
                          ? 'bg-[#191C1A] border border-[#191C1A]'
                          : 'border border-[#C0C0BF] bg-white'
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-[8px]">
                        <span className="text-[14px] leading-[20px] font-[500] text-[#191C1A]">{flow.label}</span>
                        <span className="shrink-0 text-[11px] leading-[14px] font-[500] text-[#8B828B] bg-[#F0F0F0] px-[6px] py-[2px] rounded-full">
                          {flow.count} screens
                        </span>
                      </div>
                      {flow.description && (
                        <p className="text-[12px] leading-[16px] font-[450] text-[#8B828B] mt-[2px]">
                          {flow.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format section */}
          <div>
            <span className="text-[11px] leading-[14px] font-[600] tracking-[0.06em] uppercase text-[#8B828B] mb-[10px] block">
              Format
            </span>
            <div className="grid grid-cols-3 gap-[6px]">
              {[
                { id: 'png', label: 'PNG', sub: '2x raster' },
                { id: 'svg', label: 'SVG', sub: 'Vector' },
                { id: 'both', label: 'Both', sub: 'PNG + SVG' },
              ].map((opt) => {
                const isActive = format === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormat(opt.id)}
                    className={`p-[10px] rounded-[10px] border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#191C1A] bg-[#F9F9F9]'
                        : 'border-[#E5E5E5] bg-white hover:border-[#C0C0BF]'
                    }`}
                  >
                    <div className="text-[13px] leading-[18px] font-[600] text-[#191C1A]">{opt.label}</div>
                    <div className="text-[10px] leading-[14px] font-[450] text-[#8B828B] mt-[1px]">{opt.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-[24px] py-[16px] border-t border-[#F0F0F0] flex items-center justify-between gap-[12px] bg-[#FAFAFA]">
          <span className="text-[12px] leading-[16px] font-[450] text-[#6D6C6A]">
            {canExport
              ? `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'} will be exported`
              : 'Select at least one flow'}
          </span>
          <div className="flex items-center gap-[8px]">
            <button
              onClick={onClose}
              className="px-[14px] py-[8px] rounded-[10px] text-[13px] leading-[18px] font-[500] text-[#6D6C6A] hover:bg-[#F0F0F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!canExport) return;
                onExport(Array.from(selected), format);
              }}
              disabled={!canExport}
              className="px-[16px] py-[8px] rounded-[10px] text-[13px] leading-[18px] font-[500] text-white transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: accentColor }}
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
