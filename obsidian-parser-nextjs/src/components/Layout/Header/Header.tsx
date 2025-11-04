type HeaderProps = {
  title: string;
  subtitle: string;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header role='banner'>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h1>
      <p className='text-gray-600 mb-8'>{subtitle}</p>
    </header>
  );
};
