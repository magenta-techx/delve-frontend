interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps): JSX.Element {
  return (
    <div className='group rounded-lg border border-transparent bg-card p-6 transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-md'>
      <div className='mb-4 text-4xl'>{icon}</div>
      <h3 className='mb-3 text-xl font-semibold transition-colors group-hover:text-primary'>
        {title}
      </h3>
      <p className='text-sm text-muted-foreground leading-relaxed'>
        {description}
      </p>
    </div>
  );
}
