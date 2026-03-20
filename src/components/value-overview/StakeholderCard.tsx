interface BenefitItem {
  title: string;
  description: string;
}

interface StakeholderCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accentColor: string;
  benefits: BenefitItem[];
  keyMetric?: { label: string; value: string };
}

export function StakeholderCard({
  icon,
  title,
  subtitle,
  accentColor,
  benefits,
  keyMetric,
}: StakeholderCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`${accentColor} px-6 py-5`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Key Metric */}
      {keyMetric && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-slate-brand uppercase tracking-wider">{keyMetric.label}</p>
          <p className="mt-1 text-xl font-bold text-navy">{keyMetric.value}</p>
        </div>
      )}

      {/* Benefits */}
      <div className="px-6 py-5">
        <ul className="space-y-4">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex gap-3">
              <div className={`w-6 h-6 rounded-full ${accentColor} flex items-center justify-center shrink-0 mt-0.5`}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                <p className="text-xs text-slate-brand mt-0.5">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
