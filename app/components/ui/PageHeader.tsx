type Props = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          {subtitle}
        </p>
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}

    </div>
  );
}