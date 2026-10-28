export type Theme = 'light' | 'dark';
export type ModelType = 'dsge' | 'ml-abm';
export type Trend = 'up' | 'down' | 'stable';
export type AgentType = 'household' | 'firm' | 'bank';
export type AgentBehavior = 'rational' | 'adaptive' | 'herding';

export interface EconomicIndicator {
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: Trend;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  forecast: number | null;
}

// Extended DSGE Parameters
export interface DSGEParameters {
  [key: string]: number;
  // Household Preferences
  beta: number;        // Discount factor (0.9-0.999)
  sigma: number;       // Risk aversion / IES inverse (0.5-5)
  phi: number;         // Frisch elasticity of labor (0.5-5)
  h: number;           // Habit persistence (0-0.9)

  // Production Technology
  alpha: number;       // Capital share (0.2-0.5)
  delta: number;       // Depreciation rate (0.01-0.1)
  psi: number;         // Capital adjustment cost (0-10)

  // Price & Wage Rigidity (Calvo)
  theta_p: number;     // Price stickiness (0.5-0.9)
  theta_w: number;     // Wage stickiness (0.5-0.9)
  xi_p: number;        // Price indexation (0-1)
  xi_w: number;        // Wage indexation (0-1)

  // Monetary Policy (Taylor Rule)
  rho_r: number;       // Interest rate smoothing (0.5-0.95)
  phi_pi: number;      // Inflation response (1.1-3)
  phi_y: number;       // Output gap response (0-1)
  phi_dy: number;      // Output growth response (0-0.5)

  // Fiscal Policy
  g_y: number;         // Govt spending / GDP ratio (0.1-0.3)
  tau_c: number;       // Consumption tax rate (0-0.3)
  tau_k: number;       // Capital tax rate (0-0.5)
  tau_l: number;       // Labor tax rate (0-0.5)
  rho_g: number;       // Govt spending persistence (0.5-0.99)

  // Shock Processes
  rho_a: number;       // TFP persistence (0.5-0.99)
  sigma_a: number;     // TFP volatility (0.001-0.02)
  rho_b: number;       // Preference shock persistence (0.5-0.99)
  sigma_b: number;     // Preference shock volatility (0.001-0.02)
  rho_i: number;       // Investment shock persistence (0.5-0.99)
  sigma_i: number;     // Investment shock volatility (0.001-0.05)
  rho_p: number;       // Price markup shock persistence (0.5-0.99)
  sigma_p: number;     // Price markup shock volatility (0.001-0.02)
  rho_w: number;       // Wage markup shock persistence (0.5-0.99)
  sigma_w: number;     // Wage markup shock volatility (0.001-0.02)
  sigma_r: number;     // Monetary policy shock volatility (0.001-0.01)
  sigma_g: number;     // Govt spending shock volatility (0.001-0.03)
}

// Extended ABM Parameters
export interface ABMParameters {
  [key: string]: number;
  // Population
  numHouseholds: number;    // 50-500
  numFirms: number;         // 10-100
  numBanks: number;         // 2-20

  // Agent Behavior Distribution
  pctRational: number;      // 0-100%
  pctAdaptive: number;      // 0-100%
  pctHerding: number;       // 0-100%

  // Behavioral Parameters
  adaptationRate: number;   // Learning speed (0.01-0.5)
  herdingStrength: number;  // Network influence (0-1)
  riskTolerance: number;    // Risk appetite (0.1-2)
  memoryLength: number;     // Past periods considered (1-20)

  // Network Topology
  networkDensity: number;   // Connection probability (0.05-0.5)
  clusterCoeff: number;     // Clustering coefficient (0-1)

  // Market Microstructure
  priceImpact: number;      // Order impact on price (0.001-0.1)
  spreadBase: number;       // Base bid-ask spread (0.001-0.05)
  volatilityMem: number;    // GARCH memory (0.5-0.99)

  // Credit & Banking
  leverageMax: number;      // Max leverage ratio (5-30)
  capitalReq: number;       // Capital requirement (0.04-0.12)
  interestSpread: number;   // Lending spread (0.01-0.1)
  defaultThreshold: number; // Bankruptcy trigger (0-0.5)

  // Simulation
  simSpeed: number;         // Animation speed (0.5-3)
  shockProb: number;        // Random shock probability (0-0.1)
  shockMagnitude: number;   // Shock size (0.1-0.5)
}

// ML Nowcasting Parameters
export interface MLParameters {
  [key: string]: number | boolean;
  // Model Selection
  useLSTM: boolean;
  useRandomForest: boolean;
  useGradientBoosting: boolean;
  useEnsemble: boolean;

  // LSTM Hyperparameters
  lstmLayers: number;       // 1-5
  lstmUnits: number;        // 32-256
  lstmDropout: number;      // 0-0.5
  lstmLookback: number;     // 5-60 days

  // Random Forest
  rfTrees: number;          // 50-500
  rfMaxDepth: number;       // 5-30
  rfMinSamples: number;     // 2-20

  // Gradient Boosting
  gbTrees: number;          // 50-500
  gbLearningRate: number;   // 0.01-0.3
  gbMaxDepth: number;       // 3-15

  // Ensemble
  ensembleWeightLSTM: number;
  ensembleWeightRF: number;
  ensembleWeightGB: number;

  // Feature Engineering
  useSeasonality: boolean;
  useLags: number;          // 1-30
  useDiff: boolean;
  useRollingStats: boolean;
  rollingWindow: number;    // 5-60

  // Training
  trainTestSplit: number;   // 0.6-0.9
  crossValidFolds: number;  // 3-10
  earlyStopPatience: number; // 5-50
}

export interface Agent {
  id: number;
  type: AgentType;
  wealth: number;
  behavior: AgentBehavior;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
  sentiment: number;
  leverage: number;
}

export interface NowcastData {
  indicator: string;
  actual?: number;
  nowcast: number;
  confidence: number;
  sources: string[];
  updated: string;
}

export interface AppState {
  theme: Theme;
  activeModel: ModelType;
  dsgeParams: DSGEParameters;
  abmParams: ABMParameters;
  mlParams: MLParameters;
  isSimulating: boolean;
  agents: Agent[];
  activeDataSources: string[];
  animationFrame: number | null;
  selectedScenario: string;
}
