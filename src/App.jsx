import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
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
  WalletCards,
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
    nav: { home: 'Vitrine', product: 'Produit', demo: 'Démo', config: 'Configurateur', contact: 'Contact', language: 'Langue' },
    hero: {
      badge: 'Protection IA sans friction',
      title: 'Laissez vos équipes utiliser l’IA sans exposer vos données sensibles.',
      body:
        'Epsial masque automatiquement les noms, e-mails, IBAN, IP, SIRET et données confidentielles avant qu’un prompt parte vers ChatGPT, Claude, Gemini ou Copilot. L’utilisateur continue simplement à copier-coller.',
      primary: 'Voir la démo',
      secondary: 'Ouvrir le configurateur',
      proof: ['Zéro cloud', 'Traitement local', 'Pensé RGPD', 'Copier-coller inchangé'],
    },
    visual: {
      label: 'EPSIAL - PROTECTION LOCALE',
      nodes: [
        ['1. Copier / coller', 'Une action utilisateur naturelle déclenche l’analyse locale.'],
        ['2. Tokenisation', '[NOM_1], [IBAN_1], [IP_1] remplacent les valeurs réelles.'],
        ['3. Réponse IA', 'L’IA travaille sur un contexte utile, sans données sensibles.'],
        ['4. Restitution locale', 'Le texte final est restauré uniquement sur le poste utilisateur.'],
      ],
    },
    value: {
      title: 'Une couche de sécurité invisible entre vos équipes et les IA génératives.',
      cards: [
        ['Gain de temps', 'Plus besoin de nettoyer manuellement un prompt avant de l’envoyer à l’IA. Epsial le fait en arrière-plan.'],
        ['Réduction du risque DLP', 'Les données sensibles sont remplacées par des tokens avant l’envoi vers les services IA externes.'],
        ['Adoption facilitée', 'Les collaborateurs gardent leur usage naturel : copier, coller, obtenir une réponse, récupérer le texte final.'],
      ],
    },
    architecture: {
      label: 'Architecture',
      title: 'Un traitement local, lisible et rassurant pour les équipes sécurité.',
      subtitle: 'Epsial agit comme un filtre local entre le presse-papier, le navigateur et les interfaces IA autorisées.',
      points: [
        ['Interception locale', 'Le contenu est analysé sur le poste avant l’envoi vers une IA.'],
        ['Coffre de correspondance', 'Les valeurs réelles restent dans une table locale chiffrée.'],
        ['Aucune télémétrie', 'Pas de collecte, pas de compte obligatoire, pas d’appel cloud Epsial.'],
      ],
    },
    demo: {
      label: 'Démo prioritaire',
      title: 'Trois situations réelles. Même geste utilisateur. Données protégées.',
      intro:
        'Sélectionnez un cas, lancez l’obfuscation, puis regardez la réponse que l’IA aurait réellement pu produire à partir du prompt tokenisé.',
      input: 'Prompt envoyé par l’utilisateur',
      locked: 'Prompt verrouillé pour une démonstration stable.',
      obfuscate: 'Obfusquer avant envoi',
      tokenized: 'Prompt vu par l’IA',
      noToken: 'Cliquez sur Obfusquer pour voir la version sécurisée.',
      aiTitle: 'Réponse IA simulée réaliste',
      aiEmpty: 'La réponse IA apparaîtra après obfuscation.',
      vault: 'Restitution locale',
      reveal: 'Révéler le résultat final',
      emptyVault: 'Les correspondances locales apparaîtront ici.',
      workflowTitle: 'Flux utilisateur',
      workflowText: 'Le collaborateur colle son texte comme d’habitude. Epsial sécurise automatiquement les données sensibles avant l’envoi à l’IA, puis restaure les vraies valeurs localement.',
    },
    cases: [
      {
        id: 'employee',
        icon: FileText,
        title: 'Correction rapide',
        role: 'Collaborateur métier',
        prompt:
          'Bonjour, je m’appelle John Doe, mon IBAN est FR76 1234 5678 9012 3456 7890 123, mon IP est 192.168.1.1. Contactez-moi à john.doe@epsial.fr ou au +33 6 12 34 56 78. Peux-tu corriger les fautes de ce message ?',
        response:
          'Bonjour, je m’appelle [NOM_1]. Mon IBAN est [IBAN_1] et mon adresse IP est [IP_1]. Vous pouvez me contacter à [EMAIL_1] ou au [TEL_1].',
      },
      {
        id: 'developer',
        icon: Code2,
        title: 'Code avec secrets',
        role: 'Développeur',
        prompt:
          'Peux-tu relire ce script ? const owner = "Jane Martin"; const apiEmail = "jane.martin@epsial.fr"; const serverIp = "10.12.4.8"; const iban = "FR76 3000 6000 0112 3456 7890 189"; // client SIRET 552 100 554 00013',
        response:
          'Le script fonctionne, mais je recommande de sortir owner, apiEmail, serverIp, iban et SIRET dans des variables d’environnement. Exemple : process.env.OWNER_NAME, process.env.API_EMAIL et process.env.SERVER_IP. Évitez de commiter [NOM_1], [EMAIL_1], [IP_1], [IBAN_1] ou [SIRET_1] dans le dépôt.',
      },
      {
        id: 'finance',
        icon: WalletCards,
        title: 'Analyse fournisseur',
        role: 'Équipe finance',
        prompt:
          'Prépare une réponse professionnelle pour John Doe. Le fournisseur indique le SIRET 552 100 554 00013, le compte FR76 1234 5678 9012 3456 7890 123 et le contact john.doe@epsial.fr.',
        response:
          'Bonjour [NOM_1], nous avons bien reçu les informations fournisseur associées au SIRET [SIRET_1] et au compte [IBAN_1]. Notre équipe va procéder à la vérification interne et vous recontactera à [EMAIL_1] si un complément est nécessaire.',
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
      back: 'Retour à la vitrine',
      enabled: 'Actif',
      paused: 'Pause',
    },
    roadmap: {
      title: 'Trajectoire produit',
      items: [
        ['Avril - Juin 2026', 'Conception technique et prototype'],
        ['Juillet 2026', 'Bêta privée'],
        ['Octobre 2026', 'Bêta publique et inscriptions sur Epsial.fr'],
        ['Décembre 2026', 'Version 1.0 stable'],
        ['2027', 'Dashboard multi-postes, extension navigateur, MDM'],
        ['2028+', 'API SIEM et IA sémantique embarquée'],
      ],
    },
    cta: {
      title: 'Une promesse simple : vos équipes gagnent du temps sans donner vos données à l’IA.',
      body: 'Epsial transforme la contrainte sécurité en automatisme discret.',
      contact: 'Nous contacter',
    },
    faq: {
      label: 'FAQ',
      title: 'Questions fréquentes',
      items: [
        ['Mes données partent-elles sur un serveur ?', 'Non. Epsial fonctionne avec une logique de traitement local : les données sensibles sont détectées et remplacées avant l’envoi vers un outil IA.'],
        ['Est-ce que l’utilisateur doit changer sa manière de travailler ?', 'Non. Le geste reste le même : copier, coller, obtenir une réponse, puis récupérer localement le texte avec les vraies valeurs.'],
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
      back: 'Retour à la vitrine',
      cards: [
        ['Démonstration', 'Voir le parcours complet : prompt, obfuscation, réponse IA et restitution locale.'],
        ['Technique', 'Discuter règles de détection, intégration navigateur, JSON de politique et contraintes DSI.'],
        ['Partenariat', 'Explorer un pilote, une présentation école/entreprise ou une collaboration produit.'],
      ],
    },
  },
  en: {
    nav: { home: 'Showcase', product: 'Product', demo: 'Demo', config: 'Configurator', contact: 'Contact', language: 'Language' },
    hero: {
      badge: 'Frictionless AI protection',
      title: 'Let your teams use AI without exposing sensitive data.',
      body:
        'Epsial automatically masks names, emails, IBANs, IP addresses, SIRET numbers, and confidential data before prompts reach ChatGPT, Claude, Gemini, or Copilot. Users keep copying and pasting as usual.',
      primary: 'Watch the demo',
      secondary: 'Open configurator',
      proof: ['Zero cloud', 'Local processing', 'GDPR-minded', 'Same copy-paste flow'],
    },
    visual: {
      label: 'EPSIAL LOCAL GUARD',
      nodes: [
        ['1. Copy / paste', 'A natural user action triggers local inspection.'],
        ['2. Tokenization', '[NOM_1], [IBAN_1], [IP_1] replace raw values.'],
        ['3. AI response', 'The AI works on useful context, not sensitive data.'],
        ['4. Local reveal', 'The final text is restored only on the workstation.'],
      ],
    },
    value: {
      title: 'An invisible security layer between your teams and generative AI.',
      cards: [
        ['Save time', 'No manual prompt cleanup before using AI. Epsial handles it in the background.'],
        ['Reduce DLP risk', 'Sensitive data is replaced with tokens before content is sent to external AI services.'],
        ['Easy adoption', 'Employees keep their natural workflow: copy, paste, get an answer, recover the final text.'],
      ],
    },
    architecture: {
      label: 'Architecture',
      title: 'Local processing that security teams can understand and trust.',
      subtitle: 'Epsial acts as a local filter between the clipboard, the browser, and authorized AI interfaces.',
      points: [
        ['Local interception', 'Content is analyzed on the workstation before it reaches an AI tool.'],
        ['Mapping vault', 'Real values stay in an encrypted local correspondence table.'],
        ['No telemetry', 'No collection, no mandatory account, no Epsial cloud call.'],
      ],
    },
    demo: {
      label: 'Main demo',
      title: 'Three real situations. Same user gesture. Protected data.',
      intro:
        'Select a case, run obfuscation, then see the kind of answer the AI could realistically produce from the tokenized prompt.',
      input: 'User prompt',
      locked: 'Prompt locked for a stable demonstration.',
      obfuscate: 'Obfuscate before sending',
      tokenized: 'Prompt seen by AI',
      noToken: 'Click Obfuscate to see the secured version.',
      aiTitle: 'Realistic simulated AI response',
      aiEmpty: 'The AI response will appear after obfuscation.',
      vault: 'Local reveal',
      reveal: 'Reveal final result',
      emptyVault: 'Local mappings will appear here.',
      workflowTitle: 'User flow',
      workflowText: 'The employee pastes text as usual. Epsial automatically secures sensitive data before AI submission, then restores real values locally.',
    },
    cases: [
      {
        id: 'employee',
        icon: FileText,
        title: 'Fast proofreading',
        role: 'Business employee',
        prompt:
          'Hello, my name is John Doe, my IBAN is FR76 1234 5678 9012 3456 7890 123, my IP is 192.168.1.1. Contact me at john.doe@epsial.fr or +33 6 12 34 56 78. Can you proofread this message?',
        response:
          'Hello, my name is [NOM_1]. My IBAN is [IBAN_1] and my IP address is [IP_1]. You can contact me at [EMAIL_1] or [TEL_1].',
      },
      {
        id: 'developer',
        icon: Code2,
        title: 'Code with secrets',
        role: 'Developer',
        prompt:
          'Can you review this script? const owner = "Jane Martin"; const apiEmail = "jane.martin@epsial.fr"; const serverIp = "10.12.4.8"; const iban = "FR76 3000 6000 0112 3456 7890 189"; // client SIRET 552 100 554 00013',
        response:
          'The script is readable, but owner, apiEmail, serverIp, iban, and SIRET should be moved to environment variables. Use names such as process.env.OWNER_NAME, process.env.API_EMAIL, and process.env.SERVER_IP. Avoid committing [NOM_1], [EMAIL_1], [IP_1], [IBAN_1], or [SIRET_1] to the repository.',
      },
      {
        id: 'finance',
        icon: WalletCards,
        title: 'Supplier analysis',
        role: 'Finance team',
        prompt:
          'Prepare a professional response for John Doe. The supplier lists SIRET 552 100 554 00013, account FR76 1234 5678 9012 3456 7890 123 and contact john.doe@epsial.fr.',
        response:
          'Hello [NOM_1], we have received the supplier information associated with SIRET [SIRET_1] and account [IBAN_1]. Our team will proceed with the internal verification and contact you at [EMAIL_1] if additional details are required.',
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
    roadmap: {
      title: 'Product trajectory',
      items: [
        ['April - June 2026', 'Technical design and prototype'],
        ['July 2026', 'Private beta'],
        ['October 2026', 'Public beta and Epsial.fr registration'],
        ['December 2026', 'Stable v1.0'],
        ['2027', 'Multi-host dashboard, browser extension, MDM'],
        ['2028+', 'SIEM API and embedded semantic AI'],
      ],
    },
    cta: {
      title: 'A simple promise: your teams save time without handing sensitive data to AI.',
      body: 'Epsial turns security constraints into a quiet automatic reflex.',
      contact: 'Contact us',
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        ['Do my data leave my workstation?', 'No. Epsial is designed around local processing: sensitive data is detected and replaced before content is sent to an AI tool.'],
        ['Do users need to change how they work?', 'No. The workflow stays the same: copy, paste, get an answer, then recover real values locally.'],
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
        ['Demo', 'See the full journey: prompt, obfuscation, AI response, and local reveal.'],
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
          <DemoSection t={t} language={language} />
          <RoadmapSection t={t} />
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={() => goHomeAnchor('#top')} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400 text-slate-950 shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold text-white">Epsial</span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <NavButton active={page === 'home'} onClick={() => goHomeAnchor('#top')}>{t.nav.home}</NavButton>
          <NavButton onClick={() => goHomeAnchor('#product')}>{t.nav.product}</NavButton>
          <NavButton onClick={() => goHomeAnchor('#demo')}>{t.nav.demo}</NavButton>
          <NavButton active={page === 'config'} onClick={() => setPage('config')}>{t.nav.config}</NavButton>
          <NavButton active={page === 'contact'} onClick={() => setPage('contact')}>{t.nav.contact}</NavButton>
          <div className="flex items-center gap-1 rounded-md border border-white/15 bg-slate-900 p-1" aria-label={t.nav.language}>
            <button
              onClick={() => setLanguage('fr')}
              className={`rounded px-3 py-1.5 text-sm font-semibold ${language === 'fr' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Français
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded px-3 py-1.5 text-sm font-semibold ${language === 'en' ? 'bg-emerald-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
            >
              English
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white ${active ? 'bg-white/10 text-white' : ''}`}>
      {children}
    </button>
  );
}

function Hero({ t, setPage }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(23,201,100,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(135deg,#08111f_0%,#0d1b33_48%,#111827_100%)]" />
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

function DemoSection({ t, language }) {
  return (
    <section id="demo" className="bg-slate-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">{t.demo.label}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{t.demo.title}</h2>
          </div>
          <p className="text-lg leading-8 text-slate-300">{t.demo.intro}</p>
        </div>
        <DemoWidget t={t} language={language} />
      </div>
    </section>
  );
}

function DemoWidget({ t }) {
  const [caseId, setCaseId] = useState(t.cases[0].id);
  const [obfuscated, setObfuscated] = useState('');
  const [vault, setVault] = useState([]);
  const [revealed, setRevealed] = useState('');
  const activeCase = t.cases.find((item) => item.id === caseId) || t.cases[0];

  useEffect(() => {
    setCaseId(t.cases[0].id);
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

  const selectCase = (id) => {
    setCaseId(id);
    setObfuscated('');
    setVault([]);
    setRevealed('');
  };

  return (
    <div className="rounded-md border border-white/10 bg-white/10 p-3 shadow-glow">
      <div className="grid gap-3 lg:grid-cols-3">
        {t.cases.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => selectCase(item.id)}
              className={`rounded-md border p-4 text-left transition ${activeCase.id === item.id ? 'border-emerald-300 bg-emerald-300/15 text-white' : 'border-white/10 bg-slate-900 text-slate-300 hover:bg-slate-800'}`}
            >
              <Icon className="h-5 w-5 text-emerald-300" />
              <span className="mt-3 block font-semibold">{item.title}</span>
              <span className="mt-1 block text-sm text-slate-400">{item.role}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-md border border-white/10 bg-slate-900 p-5">
          <div className="mb-4 rounded-md border border-emerald-300/25 bg-emerald-300/10 p-4">
            <p className="text-sm font-semibold text-emerald-100">{t.demo.workflowTitle}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t.demo.workflowText}</p>
          </div>
          <label className="text-sm font-semibold text-slate-200" htmlFor="demo-input">{t.demo.input}</label>
          <textarea
            id="demo-input"
            value={activeCase.prompt}
            readOnly
            className="mt-3 min-h-64 w-full resize-none rounded-md border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-100 outline-none"
          />
          <p className="mt-2 text-sm text-slate-400">{t.demo.locked}</p>
          <button onClick={runObfuscation} className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300">
            <Sparkles className="h-4 w-4" />
            {t.demo.obfuscate}
          </button>
        </section>

        <section className="grid gap-3">
          <ResultPanel icon={Layers3} title={t.demo.tokenized} content={obfuscated || t.demo.noToken} />
          <ResultPanel icon={Bot} title={t.demo.aiTitle} content={simulatedAiResponse} />
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
            <div className="mt-4 flex flex-wrap gap-2">
              {vault.length ? vault.map((item) => <TokenChip key={item.token} token={item.token} />) : <span className="text-sm text-slate-400">{t.demo.emptyVault}</span>}
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

function TokenChip({ token }) {
  return <span className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">{token}</span>;
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

function RoadmapSection({ t }) {
  return (
    <section className="bg-white py-16 text-slate-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold">{t.roadmap.title}</h2>
        <div className="mt-8 grid gap-0">
          {t.roadmap.items.map(([date, title], index) => (
            <div key={date} className="grid grid-cols-[32px_1fr] gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white">
                  {index < 2 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
                {index !== t.roadmap.items.length - 1 && <span className="h-full min-h-12 w-px bg-slate-200" />}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-emerald-700">{date}</p>
                <p className="mt-1 font-semibold text-slate-900">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <div className="mx-auto max-w-5xl rounded-md border border-white/10 bg-white/10 p-8 text-center shadow-glow">
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(23,201,100,0.2),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.16),transparent_30%)]" />
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
