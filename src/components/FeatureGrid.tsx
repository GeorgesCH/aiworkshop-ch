import React from 'react'
import { Sparkles, Cpu, Trophy } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

export function FeatureGrid() {
  const { t } = useLanguage();
  const features = [
    { icon: Sparkles, titleKey: 'features.1.title', descKey: 'features.1.desc' },
    { icon: Cpu,      titleKey: 'features.2.title', descKey: 'features.2.desc' },
    { icon: Trophy,   titleKey: 'features.3.title', descKey: 'features.3.desc' },
  ]

  return (
    <section className="section-apple">
      <div className="container-apple">
        <div className="grid gap-apple-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className={`relative rounded-2xl border border-border/60 bg-background/90 backdrop-blur p-6 transition-apple hover:-translate-y-[2px] hover:shadow-apple-lg fade-in-up ${i===0 ? 'stagger-1' : i===1 ? 'stagger-2' : 'stagger-3'}`}
              >
                <div className="relative z-10 space-y-4">
                  <div className="brand-chip">
                    <div className="brand-chip__inner flex items-center justify-center w-full h-full rounded-[12px]">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h2 className="font-sigum text-lg font-semibold text-foreground">{t(f.titleKey)}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
