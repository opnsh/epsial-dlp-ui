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

const defaultPolicyConfig = {
  log_level: 'INFO',
  audit_mode: false,
  pii: {
    use_nlp: true,
    nlp_model: 'fr_core_news_sm',
    detect_email: true,
    detect_phone: true,
    detect_iban: true,
    detect_siret: true,
    detect_ip: true,
    detect_date: true,
    detect_nir: true,
    detect_card: true,
    detect_names: true,
    detect_orgs: false,
    detect_locations: true,
    detect_custom_keywords: true,
    custom_keywords: ['confidentiel', 'secret projet', 'token api interne'],
    custom_names: [],
    custom_locations: [],
    custom_organizations: [],
  },
  storage: {
    ttl_seconds: null,
    db_path: null,
    key_path: null,
  },
  ui: {
    show_systray: true,
    show_notifications: true,
    notification_duration: 3,
    pause_duration_minutes: 15,
  },
  monitor: {
    poll_interval: 0.4,
    monitor_clipboard: null,
    monitor_primary: false,
    only_when_ai_active: true,
    fallback_when_detection_unavailable: false,
    extra_ai_domains: {},
  },
  targets: {
    web_domains: [
      'chatgpt.com',
      'chat.openai.com',
      'claude.ai',
      'gemini.google.com',
      'aistudio.google.com',
      'copilot.microsoft.com',
      'meta.ai',
      'chat.mistral.ai',
      'mistral.ai',
      'perplexity.ai',
      'huggingface.co',
      'poe.com',
      'you.com',
      'character.ai',
      'chat.deepseek.com',
      'deepseek.com',
      'grok.com',
      'pi.ai',
      'coral.cohere.com',
    ],
    title_keywords: {
      chatgpt: 'ChatGPT',
      'chat.openai.com': 'ChatGPT',
      claude: 'Claude',
      'claude.ai': 'Claude',
      gemini: 'Gemini',
      'aistudio.google.com': 'Google AI Studio',
      copilot: 'Copilot',
      mistral: 'Mistral',
      perplexity: 'Perplexity',
      deepseek: 'DeepSeek',
      huggingface: 'Hugging Face',
      huggingchat: 'HuggingChat',
      'meta ai': 'Meta AI',
      'character.ai': 'Character.AI',
      grok: 'Grok',
      ollama: 'Ollama',
      'lm studio': 'LM Studio',
      'poe.com': 'Poe',
      'you.com': 'You.com',
      'pi.ai': 'Pi',
    },
    desktop_apps: [
      {
        service: 'Claude Desktop',
        processes: ['claude'],
        wm_classes: ['claude', 'claude-desktop'],
        title_keywords: ['claude'],
      },
      {
        service: 'ChatGPT Desktop',
        processes: ['chatgpt'],
        wm_classes: ['chatgpt', 'chat-gpt'],
        title_keywords: ['chatgpt'],
      },
      {
        service: 'Microsoft Copilot',
        processes: ['copilot'],
        wm_classes: ['copilot'],
        title_keywords: ['copilot'],
      },
      {
        service: 'LM Studio',
        processes: ['lmstudio'],
        wm_classes: ['lmstudio', 'lm-studio'],
        title_keywords: ['lm studio'],
      },
      {
        service: 'Ollama',
        processes: ['ollama'],
        wm_classes: ['ollama'],
        title_keywords: ['ollama'],
      },
    ],
    browser_processes_windows: ['brave.exe', 'chrome.exe', 'chromium.exe', 'firefox.exe', 'msedge.exe', 'opera.exe', 'opera_gx.exe', 'vivaldi.exe'],
  },
  integration: {
    native_host_name: 'com.dlpai.agent',
    browser_extension_id_chrome: '',
    browser_extension_id_firefox: 'dlp-browser@example.com',
    enable_browser_extension: true,
    enable_gnome_shell_extension: true,
  },
};

const configSectionLabels = {
  log_level: 'Général',
  audit_mode: 'Mode audit',
  pii: 'Détection PII',
  storage: 'Stockage local',
  ui: 'Interface utilisateur',
  monitor: 'Monitoring',
  targets: 'Cibles IA',
  integration: 'Intégrations',
};

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
      label: 'Configurateur',
      title: 'Éditeur complet de configuration Epsial',
      body:
        'Chaque option du fichier JSON réel peut être modifiée depuis cette interface : détection PII, stockage, UI, monitoring, cibles IA, applications desktop et intégrations.',
      json: 'Politique JSON générée',
      download: 'Télécharger le JSON',
      back: 'Retour à l\'accueil',
      reset: 'Réinitialiser',
      add: 'Ajouter',
      remove: 'Supprimer',
      nullValue: 'Valeur nulle',
      useValue: 'Définir une valeur',
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
      label: 'Configurator',
      title: 'Complete Epsial configuration editor',
      body:
        'Every option from the real JSON file can be edited here: PII detection, storage, UI, monitoring, AI targets, desktop applications, and integrations.',
      json: 'Generated JSON policy',
      download: 'Download JSON',
      back: 'Back home',
      reset: 'Reset',
      add: 'Add',
      remove: 'Remove',
      nullValue: 'Null value',
      useValue: 'Set a value',
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
            <img src="/logo.png" alt="" className="h-7 w-7 object-contain sm:h-9 sm:w-9" />
          </span>
          <span className="hidden text-xl font-semibold text-white md:inline">EPSIAL</span>
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

function cloneConfig(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatConfigLabel(key) {
  return configSectionLabels[key] || key.replaceAll('_', ' ');
}

function isNullablePath(pathKey) {
  return ['storage.ttl_seconds', 'storage.db_path', 'storage.key_path', 'monitor.monitor_clipboard'].includes(pathKey);
}

function getValueAtPath(source, path) {
  return path.reduce((cursor, key) => cursor?.[key], source);
}

function setValueAtPath(source, path, value) {
  if (!path.length) return value;
  const [head, ...tail] = path;
  const next = Array.isArray(source) ? [...source] : { ...source };
  next[head] = setValueAtPath(next[head], tail, value);
  return next;
}

function createEmptyValue(example) {
  if (Array.isArray(example)) return [];
  if (example && typeof example === 'object') return cloneConfig(example);
  if (typeof example === 'boolean') return false;
  if (typeof example === 'number') return 0;
  return '';
}

function ConfigurationSection({ t, setPage }) {
  const [config, setConfig] = useState(() => cloneConfig(defaultPolicyConfig));
  const policyJson = JSON.stringify(config, null, 2);

  const updatePath = (path, value) => setConfig((current) => setValueAtPath(current, path, value));
  const resetConfig = () => setConfig(cloneConfig(defaultPolicyConfig));

  const downloadJson = () => {
    const blob = new Blob([policyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `epsial-config-${new Date().toISOString().slice(0, 10)}.json`;
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
            <button onClick={resetConfig} className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              {t.config.reset}
            </button>
            <button onClick={downloadJson} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600">
              <DatabaseZap className="h-4 w-4" />
              {t.config.download}
            </button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_0.82fr]">
          <div className="grid gap-6">
            <section className="rounded-md border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Général</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ConfigField label="log_level" value={config.log_level} path={['log_level']} config={config} updatePath={updatePath} t={t} />
                <ConfigField label="audit_mode" value={config.audit_mode} path={['audit_mode']} config={config} updatePath={updatePath} t={t} />
              </div>
            </section>

            {Object.entries(config)
              .filter(([key]) => !['log_level', 'audit_mode'].includes(key))
              .map(([key, value]) => (
                <section key={key} className="rounded-md border border-slate-200 bg-white p-5">
                  <h2 className="text-xl font-semibold">{formatConfigLabel(key)}</h2>
                  <div className="mt-5">
                    <ConfigObject value={value} path={[key]} config={config} updatePath={updatePath} t={t} />
                  </div>
                </section>
              ))}
          </div>

          <section className="sticky top-24 h-fit rounded-md border border-slate-200 bg-slate-950 p-5 text-white">
            <h2 className="text-xl font-semibold">{t.config.json}</h2>
            <pre className="mt-5 max-h-[calc(100vh-190px)] overflow-auto rounded-md border border-white/10 bg-black/30 p-4 text-xs leading-6 text-emerald-100">
              <code>{policyJson}</code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}

function ConfigObject({ value, path, config, updatePath, t }) {
  return (
    <div className="grid gap-4">
      {Object.entries(value).map(([key, item]) => (
        <ConfigField key={key} label={key} value={item} path={[...path, key]} config={config} updatePath={updatePath} t={t} />
      ))}
    </div>
  );
}

function ConfigField({ label, value, path, config, updatePath, t }) {
  const pathKey = path.join('.');

  if (value === null) {
    return <NullField label={label} path={path} pathKey={pathKey} updatePath={updatePath} t={t} />;
  }

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="font-medium">{formatConfigLabel(label)}</p>
          <p className="mt-1 text-xs text-slate-500">{pathKey}</p>
          {isNullablePath(pathKey) && (
            <button onClick={() => updatePath(path, null)} className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              {t.config.nullValue}
            </button>
          )}
        </div>
        <Toggle checked={value} onChange={(checked) => updatePath(path, checked)} />
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <LabeledControl label={label} pathKey={pathKey}>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(event) => updatePath(path, Number(event.target.value))}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
        />
        {isNullablePath(pathKey) && <NullableButton onClick={() => updatePath(path, null)} label={t.config.nullValue} />}
      </LabeledControl>
    );
  }

  if (typeof value === 'string') {
    return (
      <LabeledControl label={label} pathKey={pathKey}>
        {pathKey === 'log_level' ? (
          <select
            value={value}
            onChange={(event) => updatePath(path, event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            {['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        ) : (
          <input
            value={value}
            onChange={(event) => updatePath(path, event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
        )}
        {isNullablePath(pathKey) && <NullableButton onClick={() => updatePath(path, null)} label={t.config.nullValue} />}
      </LabeledControl>
    );
  }

  if (Array.isArray(value)) {
    return <ArrayField label={label} value={value} path={path} pathKey={pathKey} config={config} updatePath={updatePath} t={t} />;
  }

  return <ObjectField label={label} value={value} path={path} pathKey={pathKey} config={config} updatePath={updatePath} t={t} />;
}

function LabeledControl({ label, pathKey, children }) {
  return (
    <label className="block rounded-md border border-slate-200 bg-slate-50 p-4">
      <span className="font-medium">{formatConfigLabel(label)}</span>
      <span className="mt-1 block text-xs text-slate-500">{pathKey}</span>
      <span className="mt-3 block">{children}</span>
    </label>
  );
}

function NullableButton({ onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
      {label}
    </button>
  );
}

function NullField({ label, path, pathKey, updatePath, t }) {
  const isNumber = pathKey === 'storage.ttl_seconds';
  const isBoolean = pathKey === 'monitor.monitor_clipboard';

  const setDefaultValue = () => {
    if (isBoolean) {
      updatePath(path, true);
    } else if (isNumber) {
      updatePath(path, 0);
    } else {
      updatePath(path, '');
    }
  };

  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{formatConfigLabel(label)}</p>
          <p className="mt-1 text-xs text-slate-500">{pathKey}</p>
        </div>
        <span className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{t.config.nullValue}</span>
      </div>
      <button onClick={setDefaultValue} className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <Plus className="h-4 w-4" />
        {t.config.useValue}
      </button>
    </div>
  );
}

function ObjectField({ label, value, path, pathKey, config, updatePath, t }) {
  const entries = Object.entries(value);
  const isEditableMap = entries.every(([, item]) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean');

  if (isEditableMap) {
    const addEntry = () => {
      const baseKey = 'new_key';
      let nextKey = `${baseKey}_${entries.length + 1}`;
      let suffix = entries.length + 1;
      while (Object.hasOwn(value, nextKey)) {
        suffix += 1;
        nextKey = `${baseKey}_${suffix}`;
      }
      updatePath(path, { ...value, [nextKey]: '' });
    };
    const updateKey = (oldKey, newKey) => {
      const next = {};
      Object.entries(value).forEach(([key, item]) => {
        next[key === oldKey ? newKey : key] = item;
      });
      updatePath(path, next);
    };
    const updateValue = (key, nextValue) => updatePath(path, { ...value, [key]: nextValue });
    const removeEntry = (keyToRemove) => {
      const next = { ...value };
      delete next[keyToRemove];
      updatePath(path, next);
    };

    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">{formatConfigLabel(label)}</h3>
            <p className="mt-1 text-xs text-slate-500">{pathKey}</p>
          </div>
          <button onClick={addEntry} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Plus className="h-4 w-4" />
            {t.config.add}
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {entries.length ? entries.map(([key, item]) => (
            <div key={key} className="grid gap-2 rounded-md border border-slate-200 bg-white p-3 md:grid-cols-[0.8fr_1fr_auto] md:items-center">
              <input value={key} onChange={(event) => updateKey(key, event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-500" />
              <input value={String(item)} onChange={(event) => updateValue(key, event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-500" />
              <button onClick={() => removeEntry(key)} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                {t.config.remove}
              </button>
            </div>
          )) : (
            <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">Objet vide.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold">{formatConfigLabel(label)}</h3>
      <p className="mt-1 text-xs text-slate-500">{pathKey}</p>
      <div className="mt-4">
        <ConfigObject value={value} path={path} config={config} updatePath={updatePath} t={t} />
      </div>
    </div>
  );
}

function ArrayField({ label, value, path, pathKey, config, updatePath, t }) {
  const exampleValue = getValueAtPath(defaultPolicyConfig, path)?.[0] ?? '';
  const addItem = () => updatePath(path, [...value, createEmptyValue(exampleValue)]);
  const updateItem = (index, item) => updatePath(path, value.map((current, currentIndex) => (currentIndex === index ? item : current)));
  const removeItem = (index) => updatePath(path, value.filter((_, currentIndex) => currentIndex !== index));

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">{formatConfigLabel(label)}</h3>
          <p className="mt-1 text-xs text-slate-500">{pathKey}</p>
        </div>
        <button onClick={addItem} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Plus className="h-4 w-4" />
          {t.config.add}
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {value.length ? value.map((item, index) => (
          <ArrayItem key={`${pathKey}-${index}`} item={item} index={index} onChange={(next) => updateItem(index, next)} onRemove={() => removeItem(index)} path={[...path, index]} config={config} updatePath={updatePath} t={t} />
        )) : (
          <p className="rounded-md border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">Liste vide.</p>
        )}
      </div>
    </div>
  );
}

function ArrayItem({ item, index, onChange, onRemove, path, config, updatePath, t }) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-semibold">Élément {index + 1}</p>
          <button onClick={onRemove} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
            {t.config.remove}
          </button>
        </div>
        <ConfigObject value={item} path={path} config={config} updatePath={updatePath} t={t} />
      </div>
    );
  }

  return (
    <div className="grid gap-2 rounded-md border border-slate-200 bg-white p-3 md:grid-cols-[1fr_auto] md:items-center">
      <input
        value={String(item)}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-500"
      />
      <button onClick={onRemove} className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
        {t.config.remove}
      </button>
    </div>
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
