interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Card({ children, className = "", title, description }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {(title || description) && (
        <div className="px-5 py-3 border-b border-gray-100">
          {title && <h3 className="font-semibold text-navy">{title}</h3>}
          {description && <p className="text-sm text-slate-brand mt-0.5">{description}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
