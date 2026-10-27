import type { AppState, Agent, AgentType, AgentBehavior, DSGEParameters, ABMParameters, MLParameters } from './types';

export function generateAgents(abmParams: ABMParameters): Agent[] {
  const agents: Agent[] = [];
  const total = abmParams.numHouseholds + abmParams.numFirms + abmParams.numBanks;

  const getBehavior = (): AgentBehavior => {
    const r = Math.random() * 100;
    if (r < abmParams.pctRational) return 'rational';
    if (r < abmParams.pctRational + abmParams.pctAdaptive) return 'adaptive';
    return 'herding';
  };

  // Households
  for (let i = 0; i < abmParams.numHouseholds; i++) {
    agents.push(createAgent(i, 'household', getBehavior(), abmParams));
  }

  // Firms
  for (let i = 0; i < abmParams.numFirms; i++) {
    agents.push(createAgent(abmParams.numHouseholds + i, 'firm', getBehavior(), abmParams));
  }

  // Banks
  for (let i = 0; i < abmParams.numBanks; i++) {
    agents.push(createAgent(abmParams.numHouseholds + abmParams.numFirms + i, 'bank', getBehavior(), abmParams));
  }

  // Generate network connections
  agents.forEach((agent, idx) => {
    agents.forEach((other, otherIdx) => {
      if (idx !== otherIdx && Math.random() < abmParams.networkDensity) {
        agent.connections.push(otherIdx);
      }
    });
  });

  return agents;
}

function createAgent(id: number, type: AgentType, behavior: AgentBehavior, params: ABMParameters): Agent {
  return {
    id,
    type,
    wealth: type === 'bank' ? 500000 + Math.random() * 500000 :
            type === 'firm' ? 100000 + Math.random() * 200000 :
            10000 + Math.random() * 50000,
    behavior,
    x: 20 + Math.random() * 360,
    y: 20 + Math.random() * 260,
    vx: (Math.random() - 0.5) * 2 * params.simSpeed,
    vy: (Math.random() - 0.5) * 2 * params.simSpeed,
    connections: [],
    sentiment: Math.random() * 2 - 1, // -1 to 1
    leverage: type === 'bank' ? 5 + Math.random() * (params.leverageMax - 5) :
              type === 'firm' ? 1 + Math.random() * 3 : 0
  };
}

export const defaultDSGEParams: DSGEParameters = {
  // Household Preferences
  beta: 0.99,
  sigma: 1.5,
  phi: 2.0,
  h: 0.7,

  // Production Technology
  alpha: 0.33,
  delta: 0.025,
  psi: 5.0,

  // Price & Wage Rigidity
  theta_p: 0.75,
  theta_w: 0.75,
  xi_p: 0.5,
  xi_w: 0.5,

  // Monetary Policy
  rho_r: 0.8,
  phi_pi: 1.5,
  phi_y: 0.125,
  phi_dy: 0.125,

  // Fiscal Policy
  g_y: 0.2,
  tau_c: 0.1,
  tau_k: 0.25,
  tau_l: 0.3,
  rho_g: 0.9,

  // Shock Processes
  rho_a: 0.95,
  sigma_a: 0.007,
  rho_b: 0.9,
  sigma_b: 0.005,
  rho_i: 0.85,
  sigma_i: 0.01,
  rho_p: 0.7,
  sigma_p: 0.005,
  rho_w: 0.7,
  sigma_w: 0.005,
  sigma_r: 0.002,
  sigma_g: 0.01
};

export const defaultABMParams: ABMParameters = {
  // Population
  numHouseholds: 60,
  numFirms: 15,
  numBanks: 5,

  // Behavior Distribution
  pctRational: 40,
  pctAdaptive: 40,
  pctHerding: 20,

  // Behavioral Parameters
  adaptationRate: 0.1,
  herdingStrength: 0.3,
  riskTolerance: 1.0,
  memoryLength: 10,

  // Network
  networkDensity: 0.1,
  clusterCoeff: 0.3,

  // Market
  priceImpact: 0.01,
  spreadBase: 0.005,
  volatilityMem: 0.9,

  // Banking
  leverageMax: 15,
  capitalReq: 0.08,
  interestSpread: 0.03,
  defaultThreshold: 0.1,

  // Simulation
  simSpeed: 1.0,
  shockProb: 0.02,
  shockMagnitude: 0.2
};

export const defaultMLParams: MLParameters = {
  // Model Selection
  useLSTM: true,
  useRandomForest: true,
  useGradientBoosting: true,
  useEnsemble: true,

  // LSTM
  lstmLayers: 2,
  lstmUnits: 64,
  lstmDropout: 0.2,
  lstmLookback: 30,

  // Random Forest
  rfTrees: 200,
  rfMaxDepth: 15,
  rfMinSamples: 5,

  // Gradient Boosting
  gbTrees: 200,
  gbLearningRate: 0.1,
  gbMaxDepth: 6,

  // Ensemble
  ensembleWeightLSTM: 0.4,
  ensembleWeightRF: 0.3,
  ensembleWeightGB: 0.3,

  // Features
  useSeasonality: true,
  useLags: 14,
  useDiff: true,
  useRollingStats: true,
  rollingWindow: 21,

  // Training
  trainTestSplit: 0.8,
  crossValidFolds: 5,
  earlyStopPatience: 20
};

// Scenario Presets
export const dsgeScenarios: Record<string, Partial<DSGEParameters>> = {
  baseline: {},
  hawkish: { phi_pi: 2.5, phi_y: 0.25, rho_r: 0.9 },
  dovish: { phi_pi: 1.2, phi_y: 0.05, rho_r: 0.7 },
  fiscal_expansion: { g_y: 0.25, tau_c: 0.08, rho_g: 0.95 },
  fiscal_austerity: { g_y: 0.15, tau_c: 0.15, tau_l: 0.35 },
  high_rigidity: { theta_p: 0.85, theta_w: 0.85, xi_p: 0.7, xi_w: 0.7 },
  flexible_prices: { theta_p: 0.5, theta_w: 0.5, xi_p: 0.2, xi_w: 0.2 },
  high_volatility: { sigma_a: 0.015, sigma_b: 0.01, sigma_i: 0.03, sigma_r: 0.005 },
  crisis_mode: { sigma_a: 0.02, sigma_i: 0.05, sigma_r: 0.008, phi_pi: 1.2, leverageMax: 25 }
};

export const abmScenarios: Record<string, Partial<ABMParameters>> = {
  baseline: {},
  rational_market: { pctRational: 80, pctAdaptive: 15, pctHerding: 5 },
  herding_behavior: { pctRational: 20, pctAdaptive: 30, pctHerding: 50, herdingStrength: 0.6 },
  high_leverage: { leverageMax: 25, capitalReq: 0.04, defaultThreshold: 0.15 },
  tight_regulation: { leverageMax: 8, capitalReq: 0.12, defaultThreshold: 0.05 },
  dense_network: { networkDensity: 0.3, clusterCoeff: 0.5 },
  sparse_network: { networkDensity: 0.05, clusterCoeff: 0.1 },
  volatile_market: { shockProb: 0.08, shockMagnitude: 0.4, volatilityMem: 0.95 }
};

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('cb-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const state: AppState = {
  theme: getInitialTheme(),
  activeModel: 'dsge',
  dsgeParams: { ...defaultDSGEParams },
  abmParams: { ...defaultABMParams },
  mlParams: { ...defaultMLParams },
  isSimulating: false,
  agents: [],
  activeDataSources: ['Credit Cards', 'Employment', 'Satellite', 'Google Trends'],
  animationFrame: null,
  selectedScenario: 'baseline'
};

// Initialize agents
state.agents = generateAgents(state.abmParams);

export function applyTheme(): void {
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  localStorage.setItem('cb-theme', state.theme);
}
