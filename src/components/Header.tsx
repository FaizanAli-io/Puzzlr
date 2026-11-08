interface HeaderProps {
  title: string
  description: string
}

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="pt-4 text-center">
      <h1 className="text-4xl font-bold">{title}</h1>
      <h2 className="pt-4 text-xl font-semibold">{description}</h2>
    </header>
  )
}
