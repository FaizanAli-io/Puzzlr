export const Header = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <header className="pt-16 text-center">
    <h1 className="text-4xl font-bold">{title}</h1>
    <h2 className="pt-2 text-neutral-500 dark:text-neutral-400">
      {description}
    </h2>
  </header>
)
