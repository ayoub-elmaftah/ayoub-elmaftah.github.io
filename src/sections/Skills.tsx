import { motion } from 'motion/react';
import { useContent } from '../i18n';
import Logo from '../components/Logo';
import SectionHeader from '../components/SectionHeader';
import { fadeUp, inView, stagger } from '../components/motion';

export default function Skills() {
  const { otherSkills, toolGroups, ui } = useContent();
  return (
    <section id="competences" aria-labelledby="skills-title">
      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <SectionHeader id="skills-title" label={ui.skillsLabel} title={ui.skillsTitle} />

        <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {toolGroups.map((group) => (
            <motion.div key={group.title} variants={fadeUp} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-mono text-[0.75rem] font-medium tracking-[0.08em] text-muted uppercase">{group.title}</h3>
              <ul className="mt-4 grid gap-1">
                {group.items.map((item) => (
                  <li key={item} className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-accent-soft">
                    <span className="grid size-8 place-items-center transition-transform duration-300 group-hover:scale-110">
                      <Logo name={item} size={26} />
                    </span>
                    <span className="text-[1.02rem]">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={inView} className="mt-6 grid gap-6 md:grid-cols-3">
          {otherSkills.map((g) => (
            <motion.div key={g.title} variants={fadeUp} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-mono text-[0.75rem] font-medium tracking-[0.08em] text-muted uppercase">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li key={it} className="rounded-md border border-line px-3 py-1 text-[0.97rem] transition-colors duration-200 hover:border-accent/50 hover:text-accent">
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
