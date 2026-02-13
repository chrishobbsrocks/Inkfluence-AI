export function AppHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="h-13 px-5 flex items-center justify-between border-b border-stone-200 bg-white">
      <h2 className="text-sm font-semibold text-stone-800">{title}</h2>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
