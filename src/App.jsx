import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Clipboard,
  Cpu,
  DatabaseZap,
  Eye,
  FileText,
  Globe2,
  HelpCircle,
  KeyRound,
  Layers3,
  Lock,
  Mail,
  MonitorCog,
  Plus,
  Send,
  Server,
  ShieldCheck,
  ShieldEllipsis,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { database } from './services/mockDatabase.js';

const tokenPatterns = [
  { type: 'EMAIL', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { type: 'IBAN', regex: /\bFR\d{2}(?:\s?\d{4}){5}\s?\d{3}\b/gi },
  { type: 'IP', regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { type: 'TEL', regex: /(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}\b/g },
  { type: 'NOM', regex: /\b(?:John Doe|Jane Martin)\b/gi },
  { type: 'SIRET', regex: /\b\d{3}\s?\d{3}\s?\d{3}\s?\d{5}\b/g },
];

const content = {
  fr: {
    nav: { home: 'Accueil', product: 'Solution', demo: 'Démo', config: 'Config', contact: 'Contact', language: 'Langue' },
    hero: {
      badge: 'Sécurité locale pour les usages IA',
      title: 'Sécurisez les échanges entre vos équipes et les IA génératives.',
      body:
        'Epsial détecte et remplace les données sensibles avant qu’un contenu soit soumis à ChatGPT, Claude, Gemini ou Copilot. Texte saisi au clavier, prompt collé ou envoi depuis une interface métier : les valeurs réelles restent sur le poste utilisateur.',
      primary: 'Voir la démo',
      secondary: 'Ouvrir le configurateur',
      proof: ['Saisie et collage couverts', 'Filtrage local', 'Tokens réversibles', 'Sans télémétrie'],
    },
    visual: {
      label: 'EPSIAL - PROTECTION LOCALE',
      nodes: [
        ['1. Saisie ou collage', 'Le contenu est inspecté au moment où l’utilisateur prépare son envoi IA.'],
        ['2. Filtrage local', '[NOM_1], [IBAN_1] et [EMAIL_1] remplacent les valeurs réelles.'],
        ['3. Envoi sécurisé', 'L’IA reçoit un contexte exploitable, sans données personnelles brutes.'],
        ['4. Restitution locale', 'Le texte final peut être restauré uniquement sur le poste utilisateur.'],
      ],
    },
    value: {
      title: 'Une couche de sécurité invisible entre vos équipes et les IA génératives.',
      cards: [
        ['Usage naturel', 'Les collaborateurs rédigent, collent ou soumettent un contenu sans devoir nettoyer manuellement chaque demande IA.'],
        ['Risque DLP réduit', 'Les données sensibles sont remplacées par des tokens avant l’envoi vers les services IA externes.'],
        ['Contrôle local', 'Les correspondances entre tokens et valeurs réelles restent dans un coffre local, maîtrisé par l’entreprise.'],
      ],
    },
    architecture: {
      label: 'Architecture',
      title: 'Un traitement local, lisible et rassurant pour les équipes sécurité.',
      subtitle: 'Epsial agit comme un filtre local entre la saisie utilisateur, le navigateur et les interfaces IA autorisées.',
      points: [
        ['Analyse avant envoi', 'Le contenu soumis à une IA est analysé sur le poste, qu’il soit tapé, collé ou transmis depuis une application.'],
        ['Coffre de correspondance', 'Les valeurs réelles restent dans une table locale chiffrée.'],
        ['Aucune télémétrie', 'Pas de collecte, pas de compte obligatoire, pas d’appel cloud Epsial.'],
      ],
    },
    demo: {
      label: 'Démo',
      title: 'Un envoi IA sécurisé, en quatre étapes lisibles.',
      intro:
        'Un exemple volontairement simple montre ce qui se passe quand un utilisateur écrit ou colle un message dans une IA.',
      input: 'Message rédigé ou collé dans l’IA',
      locked: 'Exemple verrouillé pour garder la démonstration lisible.',
      obfuscate: 'Sécuriser l’envoi IA',
      tokenized: 'Message transmis à l’IA',
      noToken: 'Cliquez sur Sécuriser pour voir la version envoyée.',
      aiTitle: 'Réponse IA sur données tokenisées',
      aiEmpty: 'La réponse IA apparaîtra après sécurisation.',
      vault: 'Restitution locale',
      reveal: 'Afficher le résultat restauré',
      emptyVault: 'Aucune donnée sensible isolée pour le moment.',
      vaultReady: 'valeurs sensibles conservées localement',
      workflowTitle: 'Contexte de la démo',
      workflowText: 'Un collaborateur rédige directement une demande dans un outil IA. Au moment de l’envoi, Epsial remplace les données sensibles par des tokens, puis garde les vraies valeurs localement.',
    },
    cases: [
      {
        id: 'employee',
        icon: FileText,
        title: 'Message client',
        role: 'Saisie directe dans une IA',
        prompt:
          'Rédige une réponse courte pour John Doe. Son dossier indique l’e-mail john.doe@epsial.fr, le téléphone +33 6 12 34 56 78 et l’IBAN FR76 1234 5678 9012 3456 7890 123. Confirme que la mise à jour de son profil est bien prise en compte.',
        response:
          'Bonjour [NOM_1], nous vous confirmons que la mise à jour de votre profil a bien été prise en compte. Les informations associées à [EMAIL_1], [TEL_1] et [IBAN_1] ont été enregistrées dans votre dossier.',
      },
    ],
    config: {
      label: 'Configuration publique',
      title: 'Montrez aux DSI ce qui est configurable, sans connexion.',
      body:
        'La maquette ci-dessous illustre une politique exportable en JSON : interfaces IA autorisées, règles de détection, traitement local et absence de télémétrie.',
      interfaces: 'Interfaces IA ciblées',
      activeInterfaces: 'interfaces actives',
      rules: 'Règles de détection des données sensibles',
      activeRules: 'règles actives',
      json: 'Politique JSON générée',
      download: 'Télécharger le JSON',
      back: 'Retour à l\'accueil',
      enabled: 'Actif',
      paused: 'Pause',
    },
    cta: {
      title: 'Déployer l’IA sans exposer les données sensibles.',
      body: 'Epsial ajoute un contrôle local clair entre les utilisateurs, les applications métier et les services d’IA générative.',
      contact: 'Nous contacter',
    },
    faq: {
      label: 'FAQ',
      title: 'Questions fréquentes',
      items: [
        ['Mes données partent-elles sur un serveur ?', 'Non. Epsial fonctionne avec une logique de traitement local : les données sensibles sont détectées et remplacées avant l’envoi vers un outil IA.'],
        ['Est-ce que l’utilisateur doit changer sa manière de travailler ?', 'Non. Il peut rédiger, coller ou soumettre un contenu à une IA. Epsial sécurise l’envoi et peut restaurer les vraies valeurs localement.'],
        ['Que voit réellement l’IA ?', 'L’IA reçoit un prompt utile, mais les valeurs sensibles sont remplacées par des tokens comme [EMAIL_1], [IBAN_1] ou [IP_1].'],
        ['À quoi sert le JSON du configurateur ?', 'Il simule une politique exportable pour une DSI : interfaces IA autorisées, règles de détection actives, traitement local et absence de télémétrie.'],
        ['Qui développe le projet ?', 'Le projet Epsial est développé par une équipe de futurs ingénieurs spécialisés en logiciel, cybersécurité et usages IA en entreprise.'],
      ],
    },
    contact: {
      label: 'Contact',
      title: 'Échanger avec l’équipe Epsial',
      body: 'Vous préparez un déploiement IA, un projet DLP ou une démonstration interne ? Écrivez-nous et nous vous répondrons avec une approche claire, technique et concrète.',
      email: 'contact@epsial.fr',
      mailButton: 'Envoyer un e-mail',
      back: 'Retour à l\'accueil',
      cards: [
        ['Démonstration', 'Voir le parcours complet : saisie, filtrage local, réponse IA et restitution.'],
        ['Technique', 'Discuter règles de détection, intégration navigateur, JSON de politique et contraintes DSI.'],
        ['Partenariat', 'Explorer un pilote, une présentation école/entreprise ou une collaboration produit.'],
      ],
    },
  },
  en: {
    nav: { home: 'Home', product: 'Solution', demo: 'Demo', config: 'Config', contact: 'Contact', language: 'Language' },
    hero: {
      badge: 'Local security for AI workflows',
      title: 'Secure the exchanges between your teams and generative AI.',
      body:
        'Epsial detects and replaces sensitive data before content is submitted to ChatGPT, Claude, Gemini, or Copilot. Typed text, pasted prompts, or submissions from business tools: real values stay on the user workstation.',
      primary: 'Watch the demo',
      secondary: 'Open configurator',
      proof: ['Typing and paste covered', 'Local filtering', 'Reversible tokens', 'No telemetry'],
    },
    visual: {
      label: 'EPSIAL LOCAL GUARD',
      nodes: [
        ['1. Type or paste', 'Content is inspected when the user prepares an AI submission.'],
        ['2. Local filtering', '[NOM_1], [IBAN_1], and [EMAIL_1] replace real values.'],
        ['3. Secured submission', 'The AI receives useful context without raw personal data.'],
        ['4. Local reveal', 'The final text can be restored only on the user workstation.'],
      ],
    },
    value: {
      title: 'An invisible security layer between your teams and generative AI.',
      cards: [
        ['Natural workflow', 'Employees can type, paste, or submit content without manually cleaning each AI request.'],
        ['Reduce DLP risk', 'Sensitive data is replaced with tokens before content is sent to external AI services.'],
        ['Local control', 'Mappings between tokens and real values stay in a local vault controlled by the organization.'],
      ],
    },
    architecture: {
      label: 'Architecture',
      title: 'Local processing that security teams can understand and trust.',
      subtitle: 'Epsial acts as a local filter between user input, the browser, and authorized AI interfaces.',
      points: [
        ['Pre-send analysis', 'Content submitted to AI is analyzed on the workstation, whether typed, pasted, or sent from an application.'],
        ['Mapping vault', 'Real values stay in an encrypted local correspondence table.'],
        ['No telemetry', 'No collection, no mandatory account, no Epsial cloud call.'],
      ],
    },
    demo: {
      label: 'Demo',
      title: 'One secured AI submission, explained in four clear steps.',
      intro:
        'A deliberately simple example shows what happens when a user writes or pastes a message into an AI tool.',
      input: 'Message typed or pasted into AI',
      locked: 'Example locked to keep the demonstration readable.',
      obfuscate: 'Secure AI submission',
      tokenized: 'Message sent to AI',
      noToken: 'Click Secure to see the submitted version.',
      aiTitle: 'AI response on tokenized data',
      aiEmpty: 'The AI response will appear after securing the message.',
      vault: 'Local reveal',
      reveal: 'Show restored result',
      emptyVault: 'No sensitive data isolated yet.',
      vaultReady: 'sensitive values kept locally',
      workflowTitle: 'Demo context',
      workflowText: 'An employee writes a request directly in an AI tool. When the message is submitted, Epsial replaces sensitive data with tokens and keeps the real values locally.',
    },
    cases: [
      {
        id: 'employee',
        icon: FileText,
        title: 'Customer message',
        role: 'Direct typing in AI',
        prompt:
          'Write a short response for John Doe. His file lists john.doe@epsial.fr, phone +33 6 12 34 56 78, and IBAN FR76 1234 5678 9012 3456 7890 123. Confirm that his profile update has been processed.',
        response:
          'Hello [NOM_1], we confirm that your profile update has been processed. The information associated with [EMAIL_1], [TEL_1], and [IBAN_1] has been saved in your file.',
      },
    ],
    config: {
      label: 'Public configuration',
      title: 'Show IT teams what can be configured, without a login.',
      body:
        'The mockup below illustrates an exportable JSON policy: allowed AI interfaces, detection rules, local processing, and no telemetry.',
      interfaces: 'Target AI interfaces',
      activeInterfaces: 'active interfaces',
      rules: 'Detection rules',
      activeRules: 'active rules',
      json: 'Generated JSON policy',
      download: 'Download JSON',
      back: 'Back to showcase',
      enabled: 'Enabled',
      paused: 'Paused',
    },
    cta: {
      title: 'Deploy AI without exposing sensitive data.',
      body: 'Epsial adds a clear local control layer between users, business applications, and generative AI services.',
      contact: 'Contact us',
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        ['Do my data leave my workstation?', 'No. Epsial is designed around local processing: sensitive data is detected and replaced before content is sent to an AI tool.'],
        ['Do users need to change how they work?', 'No. They can type, paste, or submit content to AI. Epsial secures the submission and can restore real values locally.'],
        ['What does the AI actually see?', 'The AI receives useful context, but sensitive values are replaced with tokens such as [EMAIL_1], [IBAN_1], or [IP_1].'],
        ['What is the configurator JSON for?', 'It simulates an exportable IT policy: authorized AI interfaces, active detection rules, local processing, and no telemetry.'],
        ['Who developed the project?', 'Epsial is developed by a team of future engineers focused on software, cybersecurity, and enterprise AI use cases.'],
      ],
    },
    contact: {
      label: 'Contact',
      title: 'Talk to the Epsial team',
      body: 'Preparing an AI rollout, a DLP project, or an internal demo? Write to us and we will answer with a clear, technical, and concrete approach.',
      email: 'contact@epsial.fr',
      mailButton: 'Send an email',
      back: 'Back to showcase',
      cards: [
        ['Demo', 'See the full journey: input, local filtering, AI response, and reveal.'],
        ['Technical', 'Discuss detection rules, browser integration, policy JSON, and IT constraints.'],
        ['Partnership', 'Explore a pilot, a school/company presentation, or a product collaboration.'],
      ],
    },
  },
};

const ruleLabels = {
  fr: {
    emails: 'Adresses e-mail',
    phones: 'Numéros de téléphone',
    names: 'Noms et prénoms',
    iban: 'IBAN',
    siret: 'SIRET',
    ip: 'Adresses IP',
    ssn: 'Numéros de sécurité sociale',
  },
  en: {
    emails: 'Emails',
    phones: 'Phone numbers',
    names: 'Names',
    iban: 'IBAN',
    siret: 'SIRET',
    ip: 'IP addresses',
    ssn: 'Social Security Numbers',
  },
};

function obfuscateText(input) {
  let output = input;
  const vault = [];
  const counters = {};

  tokenPatterns.forEach(({ type, regex }) => {
    output = output.replace(regex, (match) => {
      counters[type] = (counters[type] || 0) + 1;
      const token = `[${type}_${counters[type]}]`;
      vault.push({ token, value: match });
      return token;
    });
  });

  return { output, vault };
}

function revealText(text, vault) {
  return vault.reduce((result, item) => result.replaceAll(item.token, item.value), text);
}

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('epsial.language') || 'fr');
  const [page, setPage] = useState('home');
  const t = content[language];

  useEffect(() => {
    database.initialize();
  }, []);

  useEffect(() => {
    localStorage.setItem('epsial.language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <TopNav language={language} setLanguage={setLanguage} t={t} page={page} setPage={setPage} />
      {page === 'home' ? (
        <main>
          <Hero t={t} setPage={setPage} />
          <ValueSection t={t} />
          <ArchitectureSection t={t} />
          <DemoSection t={t} />
          <FaqSection t={t} />
          <FinalCta t={t} setPage={setPage} />
        </main>
      ) : page === 'config' ? (
        <ConfigurationSection t={t} language={language} setPage={setPage} />
      ) : (
        <ContactPage t={t} setPage={setPage} />
      )}
    </div>
  );
}

function TopNav({ language, setLanguage, t, page, setPage }) {
  const goHomeAnchor = (anchor) => {
    setPage('home');
    window.setTimeout(() => {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:px-6 lg:px-8">
        <button onClick={() => goHomeAnchor('#top')} className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-glow sm:h-10 sm:w-10">
            <img src="/favicon.png" alt="" className="h-7 w-7 object-contain sm:h-9 sm:w-9" />
          </span>
          <span className="hidden text-xl font-semibold text-white md:inline">Epsial</span>
        </button>
        <div className="scrollbar-none flex min-w-0 flex-1 items-center justify-end gap-1 overflow-x-auto">
          <NavButton active={page === 'home'} onClick={() => goHomeAnchor('#top')}>{t.nav.home}</NavButton>
          <NavButton onClick={() => goHomeAnchor('#product')}>{t.nav.product}</NavButton>
          <NavButton onClick={() => goHomeAnchor('#demo')}>{t.nav.demo}</NavButton>
          <NavButton active={page === 'config'} onClick={() => setPage('config')}>{t.nav.config}</NavButton>
          <NavButton active={page === 'contact'} onClick={() => setPage('contact')}>{t.nav.contact}</NavButton>
          <div className="flex shrink-0 items-center gap-0.5 rounded-md border border-white/15 bg-slate-900 p-0.5 sm:gap-1 sm:p-1" aria-label={t.nav.language}>
            <button
              onClick={() => setLanguage('fr')}
              className={`rounded px-1.5 py-1.5 text-[11px] font-semibold sm:px-3 sm:text-sm ${language === 'fr' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded px-1.5 py-1.5 text-[11px] font-semibold sm:px-3 sm:text-sm ${language === 'en' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`shrink-0 whitespace-nowrap rounded-md px-1.5 py-2 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm ${active ? 'bg-white/10 text-white' : ''}`}>
      {children}
    </button>
  );
}

function Hero({ t, setPage }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#07111d_0%,#0d1b2b_54%,#10251d_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-emerald-300/35 bg-emerald-300/10 px-3 py-2 text-sm font-medium text-emerald-100">
            <Lock className="h-4 w-4" />
            {t.hero.badge}
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{t.hero.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">
              {t.hero.primary}
              <ArrowRight className="h-4 w-4" />
            </a>
            <button onClick={() => setPage('config')} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10">
              <MonitorCog className="h-4 w-4" />
              {t.hero.secondary}
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {t.hero.proof.map((item) => (
              <span key={item} className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>
        <ProductVisual t={t} />
      </div>
    </section>
  );
}

function ProductVisual({ t }) {
  const icons = [Clipboard, ShieldEllipsis, Bot, DatabaseZap];

  return (
    <div className="rounded-md border border-white/10 bg-white/10 p-4 shadow-glow backdrop-blur">
      <div className="rounded-md bg-slate-950 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-emerald-200">{t.visual.label}</span>
        </div>
        {t.visual.nodes.map(([title, detail], index) => {
          const Icon = icons[index];
          return (
            <div key={title}>
              <FlowNode icon={Icon} title={title} detail={detail} active={index === 0 || index === 3} />
              {index !== t.visual.nodes.length - 1 && <Connector />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Connector() {
  return <div className="ml-7 h-8 border-l border-dashed border-emerald-300/60" />;
}

function FlowNode({ icon: Icon, title, detail, active }) {
  return (
    <div className="flex gap-4 rounded-md border border-white/10 bg-slate-900 p-4">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${active ? 'bg-emerald-400 text-slate-950' : 'bg-sky-400/20 text-sky-100'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-300">{detail}</p>
      </div>
    </div>
  );
}

function ValueSection({ t }) {
  const icons = [Sparkles, ShieldCheck, UserRound];

  return (
    <section id="product" className="bg-slate-50 py-16 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-emerald-700">Epsial</p>
          <h2 className="mt-3 text-3xl font-semibold">{t.value.title}</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.value.cards.map(([title, body], index) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              {(() => {
                const Icon = icons[index];
                return <Icon className="h-7 w-7 text-emerald-600" />;
              })()}
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection({ t }) {
  const icons = [Cpu, KeyRound, Server];

  return (
    <section className="bg-white py-16 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">{t.architecture.label}</p>
          <h2 className="mt-3 text-3xl font-semibold">{t.architecture.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.architecture.subtitle}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.architecture.points.map(([title, body], index) => {
              const Icon = icons[index];
              return (
                <div key={title} className="rounded-md border border-slate-200 bg-slate-50 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoSection({ t }) {
  return (
    <section id="demo" className="bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">{t.demo.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{t.demo.title}</h2>
          </div>
          <p className="text-lg leading-8 text-slate-300">{t.demo.intro}</p>
        </div>
        <DemoWidget t={t} />
      </div>
    </section>
  );
}

function DemoWidget({ t }) {
  const [obfuscated, setObfuscated] = useState('');
  const [vault, setVault] = useState([]);
  const [revealed, setRevealed] = useState('');
  const activeCase = t.cases[0];

  useEffect(() => {
    setObfuscated('');
    setVault([]);
    setRevealed('');
  }, [t]);

  const simulatedAiResponse = useMemo(() => (obfuscated ? activeCase.response : t.demo.aiEmpty), [activeCase, obfuscated, t]);

  const runObfuscation = () => {
    const result = obfuscateText(activeCase.prompt);
    setObfuscated(result.output);
    setVault(result.vault);
    setRevealed('');
  };

  return (
    <div className="rounded-md border border-white/10 bg-slate-900/70 p-4 shadow-glow">
      <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-md border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-5 flex items-start gap-3 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-100">{t.demo.workflowTitle}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t.demo.workflowText}</p>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-200" htmlFor="demo-input">{t.demo.input}</label>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">{activeCase.role}</span>
          </div>
          <textarea
            id="demo-input"
            value={activeCase.prompt}
            readOnly
            className="min-h-52 w-full resize-none rounded-md border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-100 outline-none"
          />
          <p className="mt-2 text-sm text-slate-400">{t.demo.locked}</p>
          <button onClick={runObfuscation} className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300">
            <Sparkles className="h-4 w-4" />
            {t.demo.obfuscate}
          </button>
        </section>

        <section className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <ResultPanel icon={Layers3} title={t.demo.tokenized} content={obfuscated || t.demo.noToken} />
            <ResultPanel icon={Bot} title={t.demo.aiTitle} content={simulatedAiResponse} />
          </div>
          <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-emerald-100">{t.demo.vault}</h3>
              <button
                onClick={() => setRevealed(revealText(simulatedAiResponse, vault))}
                disabled={!vault.length}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-300/40 px-3 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-300/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Eye className="h-4 w-4" />
                {t.demo.reveal}
              </button>
            </div>
            <div className="mt-4 rounded-md bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
              {vault.length ? (
                <span>
                  <strong className="text-emerald-100">{vault.length}</strong> {t.demo.vaultReady}
                </span>
              ) : (
                <span>{t.demo.emptyVault}</span>
              )}
            </div>
            {revealed && <p className="mt-4 rounded-md bg-slate-950 p-4 text-sm leading-7 text-slate-100">{revealed}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function ResultPanel({ icon: Icon, title, content }) {
  return (
    <div className="rounded-md border border-white/10 bg-slate-900 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-emerald-300" />
        <h3 className="font-semibold text-slate-200">{title}</h3>
      </div>
      <p className="mt-3 min-h-24 rounded-md bg-slate-950 p-4 text-sm leading-7 text-slate-200">{content}</p>
    </div>
  );
}

function ConfigurationSection({ t, language, setPage }) {
  const [state, setState] = useState(database.getState());
  const enabledTargets = state.targetAiInterfaces.filter((item) => item.enabled).length;
  const enabledRules = state.piiRules.filter((item) => item.enabled).length;
  const policyJson = JSON.stringify(
    {
      epsialPolicyVersion: '1.0-public-preview',
      language,
      aiTargets: state.targetAiInterfaces.map(({ name, url, enabled }) => ({ name, url, enabled })),
      piiDetectionRules: state.piiRules.reduce((acc, rule) => ({ ...acc, [rule.id]: rule.enabled }), {}),
      localProcessing: true,
      cloudTelemetry: false,
      tokenFormat: '[TYPE_INDEX]',
    },
    null,
    2,
  );

  const updateTarget = (id, patch) => setState(database.updateAiInterface(id, patch));
  const updateRule = (id, enabled) => setState(database.updatePiiRule(id, enabled));
  const downloadJson = () => {
    const blob = new Blob([policyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `epsial-policy-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main id="config" className="min-h-[calc(100vh-68px)] bg-slate-100 py-16 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-emerald-700">{t.config.label}</p>
            <h1 className="mt-3 text-3xl font-semibold">{t.config.title}</h1>
            <p className="mt-3 leading-7 text-slate-600">{t.config.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setPage('home')} className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              {t.config.back}
            </button>
            <button onClick={downloadJson} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600">
              <DatabaseZap className="h-4 w-4" />
              {t.config.download}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="grid gap-6">
            <section className="rounded-md border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{t.config.interfaces}</h3>
                  <p className="mt-1 text-sm text-slate-500">{enabledTargets} {t.config.activeInterfaces}</p>
                </div>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" title="Add interface">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3">
                {state.targetAiInterfaces.map((item) => (
                  <div key={item.id} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <Toggle checked={item.enabled} onChange={(checked) => updateTarget(item.id, { enabled: checked })} />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <input
                        value={item.url}
                        onChange={(event) => updateTarget(item.id, { url: event.target.value })}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${item.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {item.enabled ? t.config.enabled : t.config.paused}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5">
              <h3 className="text-xl font-semibold">{t.config.rules}</h3>
              <p className="mt-1 text-sm text-slate-500">{enabledRules} {t.config.activeRules}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {state.piiRules.map((rule) => (
                  <label key={rule.id} className="flex cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-4">
                    <span className="font-medium">{ruleLabels[language]?.[rule.id] || rule.label}</span>
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(event) => updateRule(rule.id, event.target.checked)}
                      className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-md border border-slate-200 bg-slate-950 p-5 text-white">
            <h3 className="text-xl font-semibold">{t.config.json}</h3>
            <pre className="mt-5 max-h-[760px] overflow-auto rounded-md border border-white/10 bg-black/30 p-4 text-xs leading-6 text-emerald-100">
              <code>{policyJson}</code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}

function FaqSection({ t }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-slate-100 py-16 text-slate-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase text-emerald-700">{t.faq.label}</p>
        <h2 className="mt-3 text-3xl font-semibold">{t.faq.title}</h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {t.faq.items.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            return (
              <div key={question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-slate-900 hover:bg-slate-50"
                >
                  <span>{question}</span>
                  <ChevronRight className={`h-5 w-5 shrink-0 text-slate-400 transition ${isOpen ? 'rotate-90 text-emerald-600' : ''}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 leading-7 text-slate-600">{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ t, setPage }) {
  return (
    <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Globe2 className="mx-auto h-8 w-8 text-emerald-300" />
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold text-white">{t.cta.title}</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-300">{t.cta.body}</p>
        <button onClick={() => setPage('contact')} className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">
          <Mail className="h-4 w-4" />
          {t.cta.contact}
        </button>
      </div>
    </section>
  );
}

function ContactPage({ t, setPage }) {
  return (
    <main className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-[linear-gradient(135deg,#08111f,#111827_55%,#092016)] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(23,201,100,0.16),transparent_42%,rgba(56,189,248,0.1))]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-300">{t.contact.label}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{t.contact.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${t.contact.email}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">
              <Send className="h-4 w-4" />
              {t.contact.mailButton}
            </a>
            <button onClick={() => setPage('home')} className="inline-flex items-center justify-center rounded-md border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10">
              {t.contact.back}
            </button>
          </div>
        </div>
        <section className="rounded-md border border-white/10 bg-white/10 p-6 shadow-glow backdrop-blur">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-400 text-slate-950">
              <Mail className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm text-slate-400">Epsial</p>
              <p className="text-xl font-semibold">{t.contact.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {t.contact.cards.map(([title, body]) => (
              <div key={title} className="rounded-md border border-white/10 bg-slate-950/60 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-md border border-emerald-300/25 bg-emerald-300/10 p-4">
            <p className="text-sm font-semibold text-emerald-100">Epsial</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">France / Europe · AI DLP · Privacy by design</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-pressed={checked}>
      <span className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default App;
