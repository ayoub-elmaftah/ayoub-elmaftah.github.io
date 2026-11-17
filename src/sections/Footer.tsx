import { useContent } from '../i18n';

export default function Footer() {
  const { person, ui } = useContent();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-[0.9rem] text-muted sm:px-8">
        <p>© {new Date().getFullYear()} {person.firstName} {person.lastName}. {ui.rights}</p>
        <a href="#top" className="link-line pb-0.5 transition-colors hover:text-ink">{ui.top}</a>
      </div>
    </footer>
  );
}
