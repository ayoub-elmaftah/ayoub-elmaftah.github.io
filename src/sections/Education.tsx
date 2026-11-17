import { useContent } from '../i18n';
import SectionHeader from '../components/SectionHeader';
import MetroLine from '../components/MetroLine';

export default function Education() {
  const { parcours, ui } = useContent();
  return (
    <section id="formation" aria-labelledby="formation-title" className="border-t border-line bg-subtle">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <SectionHeader id="formation-title" label={ui.educationLabel} title={ui.educationTitle} intro={ui.educationIntro} />
        <div className="mt-16">
          <MetroLine stations={parcours} />
        </div>
      </div>
    </section>
  );
}
