const DB_KEY = 'epsial.mock.database.v1';
const SESSION_KEY = 'epsial.admin.session.v1';

const ADMIN_USER = {
  username: 'admin',
  password: 'TheoBastien2026',
  role: 'administrator',
};

const defaultDatabase = {
  targetAiInterfaces: [
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com', enabled: true },
    { id: 'claude', name: 'Claude', url: 'https://claude.ai', enabled: true },
    { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', enabled: true },
    { id: 'copilot', name: 'Copilot', url: 'https://copilot.microsoft.com', enabled: true },
    { id: 'mistral', name: 'Mistral', url: 'https://chat.mistral.ai', enabled: false },
    { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai', enabled: false },
  ],
  piiRules: [
    { id: 'emails', label: 'Emails', enabled: true },
    { id: 'phones', label: 'Phone numbers', enabled: true },
    { id: 'names', label: 'Names', enabled: true },
    { id: 'iban', label: 'IBAN', enabled: true },
    { id: 'siret', label: 'SIRET', enabled: true },
    { id: 'ip', label: 'IP addresses', enabled: true },
    { id: 'ssn', label: 'Social Security Numbers', enabled: false },
  ],
  auditLog: [],
};

const isBrowser = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readJson = (key, fallback) => {
  if (!isBrowser()) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to write ${key}`, error);
  }
};

const cloneDefaults = () => JSON.parse(JSON.stringify(defaultDatabase));

const addAuditEvent = (database, event) => ({
  ...database,
  auditLog: [
    {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event,
    },
    ...database.auditLog,
  ].slice(0, 12),
});

export const database = {
  initialize() {
    const persisted = readJson(DB_KEY, null);
    if (!persisted?.targetAiInterfaces || !persisted?.piiRules) {
      writeJson(DB_KEY, cloneDefaults());
    }
  },

  getState() {
    return readJson(DB_KEY, cloneDefaults());
  },

  saveState(nextState) {
    writeJson(DB_KEY, nextState);
    return nextState;
  },

  updateAiInterface(id, patch) {
    const current = this.getState();
    const next = addAuditEvent(
      {
        ...current,
        targetAiInterfaces: current.targetAiInterfaces.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      },
      { type: 'configuration', message: `Updated target AI interface: ${id}` },
    );
    return this.saveState(next);
  },

  updatePiiRule(id, enabled) {
    const current = this.getState();
    const next = addAuditEvent(
      {
        ...current,
        piiRules: current.piiRules.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)),
      },
      { type: 'rule', message: `PII rule ${enabled ? 'enabled' : 'disabled'}: ${id}` },
    );
    return this.saveState(next);
  },

  // This mock repository is the single authentication boundary for the app.
  // It validates exact admin credentials and persists only a short-lived session, never the password.
  authenticate(username, password) {
    const cleanUsername = username.trim();
    const authorized = cleanUsername === ADMIN_USER.username && password === ADMIN_USER.password;

    if (!authorized) {
      const current = this.getState();
      this.saveState(
        addAuditEvent(current, {
          type: 'security',
          message: `Rejected administrator login attempt for "${cleanUsername || 'empty'}"`,
        }),
      );
      return { ok: false, error: 'Invalid administrator credentials.' };
    }

    const session = {
      username: ADMIN_USER.username,
      role: ADMIN_USER.role,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    };

    writeJson(SESSION_KEY, session);
    this.saveState(
      addAuditEvent(this.getState(), {
        type: 'security',
        message: 'Administrator session opened',
      }),
    );

    return { ok: true, session };
  },

  getSession() {
    const session = readJson(SESSION_KEY, null);
    if (!session || session.expiresAt < Date.now()) {
      this.logout();
      return null;
    }
    return session;
  },

  logout() {
    if (isBrowser()) window.localStorage.removeItem(SESSION_KEY);
  },
};
