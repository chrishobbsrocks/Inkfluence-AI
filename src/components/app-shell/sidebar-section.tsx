export function SidebarSection({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1.5">
      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
