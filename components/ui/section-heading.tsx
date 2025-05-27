import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  dropShadow?: boolean;
  strongShadow?: boolean;
}

const SectionHeading = ({
  title,
  subtitle,
  alignment = 'center', // Changed default to center as requested
  className,
  dropShadow = true, // Enable drop shadow by default
  strongShadow = false,
}: SectionHeadingProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto section-heading-centered',
    right: 'text-right ml-auto',
  };

  const shadowClasses = dropShadow
    ? strongShadow
      ? 'section-heading-shadow-strong'
      : 'section-heading-shadow'
    : '';

  return (
    <div className={cn('max-w-2xl', alignmentClasses[alignment], className)}>
      <h2 className={cn(
        'text-3xl font-bold tracking-tight sm:text-4xl',
        shadowClasses
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'mt-4 text-lg text-muted-foreground',
          dropShadow ? 'section-heading-shadow' : ''
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;