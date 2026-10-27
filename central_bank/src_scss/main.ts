import './scss/main.scss';
import { state, applyTheme, generateAgents, defaultDSGEParams, defaultABMParams, defaultMLParams, dsgeScenarios, abmScenarios } from './state';
import { renderHeader, renderDSGEPage, renderMLABMPage, renderFooter, renderLinktreeButton } from './render';
import { initDSGECharts, initMLCharts, destroyCharts } from './charts';
import { initAgentCanvas } from './canvas';
import type { ModelType, DSGEParameters, ABMParameters, MLParameters } from './types';

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  destroyCharts();

  app.innerHTML = `
    ${renderHeader()}
    ${state.activeModel === 'dsge' ? renderDSGEPage() : renderMLABMPage()}
    ${renderFooter()}
    ${renderLinktreeButton()}
  `;

  setTimeout(() => {
    if (state.activeModel === 'dsge') {
      initDSGECharts();
    } else {
      initMLCharts();
      initAgentCanvas();
    }
  }, 50);

  bindEvents();
}

function bindSlider<T extends Record<string, number | boolean>>(
  id: string,
  params: T,
  key: keyof T,
  onChange?: () => void
): void {
  const slider = document.getElementById(id) as HTMLInputElement | null;
  if (!slider) return;

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value);
    (params as Record<string, number>)[key as string] = value;

    const valueEl = document.getElementById(`${id}-value`);
    if (valueEl) {
      const step = parseFloat(slider.step);
      valueEl.textContent = value.toFixed(step < 0.01 ? 3 : step < 0.1 ? 2 : 1);
    }

    const progressBar = slider.nextElementSibling as HTMLElement | null;
    if (progressBar) {
      const min = parseFloat(slider.min);
      const max = parseFloat(slider.max);
      const percent = ((value - min) / (max - min)) * 100;
      progressBar.style.width = `${percent}%`;
    }

    onChange?.();
  });
}

function bindToggle<T extends Record<string, number | boolean>>(
  id: string,
  params: T,
  key: keyof T
): void {
  const toggle = document.getElementById(id) as HTMLInputElement | null;
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    (params as Record<string, boolean>)[key as string] = toggle.checked;
  });
}

function bindEvents(): void {
  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    render();
  });

  // Model tabs
  document.querySelectorAll<HTMLButtonElement>('.model-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const model = btn.dataset.model as ModelType;
      if (model && model !== state.activeModel) {
        state.activeModel = model;
        render();
      }
    });
  });

  // =====================
  // DSGE Parameters
  // =====================

  // DSGE Scenario selector
  const dsgeScenarioSelect = document.getElementById('dsge-scenario') as HTMLSelectElement | null;
  dsgeScenarioSelect?.addEventListener('change', () => {
    const scenario = dsgeScenarioSelect.value;
    state.selectedScenario = scenario;
    state.dsgeParams = { ...defaultDSGEParams, ...dsgeScenarios[scenario] } as DSGEParameters;
    render();
  });

  // Household Preferences
  bindSlider('beta', state.dsgeParams, 'beta');
  bindSlider('sigma', state.dsgeParams, 'sigma');
  bindSlider('phi', state.dsgeParams, 'phi');
  bindSlider('h', state.dsgeParams, 'h');

  // Production Technology
  bindSlider('alpha', state.dsgeParams, 'alpha');
  bindSlider('delta', state.dsgeParams, 'delta');
  bindSlider('psi', state.dsgeParams, 'psi');

  // Price & Wage Rigidity
  bindSlider('theta_p', state.dsgeParams, 'theta_p');
  bindSlider('theta_w', state.dsgeParams, 'theta_w');
  bindSlider('xi_p', state.dsgeParams, 'xi_p');
  bindSlider('xi_w', state.dsgeParams, 'xi_w');

  // Monetary Policy
  bindSlider('rho_r', state.dsgeParams, 'rho_r');
  bindSlider('phi_pi', state.dsgeParams, 'phi_pi');
  bindSlider('phi_y', state.dsgeParams, 'phi_y');
  bindSlider('phi_dy', state.dsgeParams, 'phi_dy');

  // Fiscal Policy
  bindSlider('g_y', state.dsgeParams, 'g_y');
  bindSlider('tau_c', state.dsgeParams, 'tau_c');
  bindSlider('tau_k', state.dsgeParams, 'tau_k');
  bindSlider('tau_l', state.dsgeParams, 'tau_l');
  bindSlider('rho_g', state.dsgeParams, 'rho_g');

  // Shock Processes
  bindSlider('rho_a', state.dsgeParams, 'rho_a');
  bindSlider('sigma_a', state.dsgeParams, 'sigma_a');
  bindSlider('rho_b', state.dsgeParams, 'rho_b');
  bindSlider('sigma_b', state.dsgeParams, 'sigma_b');
  bindSlider('rho_i', state.dsgeParams, 'rho_i');
  bindSlider('sigma_i', state.dsgeParams, 'sigma_i');
  bindSlider('rho_p', state.dsgeParams, 'rho_p');
  bindSlider('sigma_p', state.dsgeParams, 'sigma_p');
  bindSlider('rho_w', state.dsgeParams, 'rho_w');
  bindSlider('sigma_w', state.dsgeParams, 'sigma_w');
  bindSlider('sigma_r', state.dsgeParams, 'sigma_r');
  bindSlider('sigma_g', state.dsgeParams, 'sigma_g');

  // Reset DSGE params
  document.getElementById('reset-params')?.addEventListener('click', () => {
    state.dsgeParams = { ...defaultDSGEParams } as DSGEParameters;
    state.selectedScenario = 'baseline';
    render();
  });

  // Run DSGE simulation
  document.getElementById('run-simulation')?.addEventListener('click', () => {
    const btn = document.getElementById('run-simulation');
    if (btn) {
      btn.innerHTML = '<span class="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin"></span> Running...';
      (btn as HTMLButtonElement).disabled = true;
      setTimeout(() => {
        render();
      }, 2000);
    }
  });

  // =====================
  // ABM Parameters
  // =====================

  // ABM Scenario selector
  const abmScenarioSelect = document.getElementById('abm-scenario') as HTMLSelectElement | null;
  abmScenarioSelect?.addEventListener('change', () => {
    const scenario = abmScenarioSelect.value;
    state.abmParams = { ...defaultABMParams, ...abmScenarios[scenario] } as ABMParameters;
    state.agents = generateAgents(state.abmParams);
    render();
  });

  // Agent Population (regenerate on change)
  const regenerateAgents = () => {
    state.agents = generateAgents(state.abmParams);
  };
  bindSlider('numHouseholds', state.abmParams, 'numHouseholds', regenerateAgents);
  bindSlider('numFirms', state.abmParams, 'numFirms', regenerateAgents);
  bindSlider('numBanks', state.abmParams, 'numBanks', regenerateAgents);

  // Behavior Distribution
  bindSlider('pctRational', state.abmParams, 'pctRational', regenerateAgents);
  bindSlider('pctAdaptive', state.abmParams, 'pctAdaptive', regenerateAgents);
  bindSlider('pctHerding', state.abmParams, 'pctHerding', regenerateAgents);

  // Behavioral Parameters
  bindSlider('adaptationRate', state.abmParams, 'adaptationRate');
  bindSlider('herdingStrength', state.abmParams, 'herdingStrength');
  bindSlider('riskTolerance', state.abmParams, 'riskTolerance');
  bindSlider('memoryLength', state.abmParams, 'memoryLength');

  // Network Topology
  bindSlider('networkDensity', state.abmParams, 'networkDensity', regenerateAgents);
  bindSlider('clusterCoeff', state.abmParams, 'clusterCoeff');

  // Market Microstructure
  bindSlider('priceImpact', state.abmParams, 'priceImpact');
  bindSlider('spreadBase', state.abmParams, 'spreadBase');
  bindSlider('volatilityMem', state.abmParams, 'volatilityMem');

  // Banking & Credit
  bindSlider('leverageMax', state.abmParams, 'leverageMax');
  bindSlider('capitalReq', state.abmParams, 'capitalReq');
  bindSlider('interestSpread', state.abmParams, 'interestSpread');
  bindSlider('defaultThreshold', state.abmParams, 'defaultThreshold');

  // Simulation Controls
  bindSlider('simSpeed', state.abmParams, 'simSpeed');
  bindSlider('shockProb', state.abmParams, 'shockProb');
  bindSlider('shockMagnitude', state.abmParams, 'shockMagnitude');

  // =====================
  // ML Parameters
  // =====================

  // Model toggles
  bindToggle('useLSTM', state.mlParams, 'useLSTM');
  bindToggle('useRandomForest', state.mlParams, 'useRandomForest');
  bindToggle('useGradientBoosting', state.mlParams, 'useGradientBoosting');
  bindToggle('useEnsemble', state.mlParams, 'useEnsemble');

  // Feature toggles
  bindToggle('useSeasonality', state.mlParams, 'useSeasonality');
  bindToggle('useDiff', state.mlParams, 'useDiff');
  bindToggle('useRollingStats', state.mlParams, 'useRollingStats');
  bindSlider('useLags', state.mlParams, 'useLags');

  // LSTM Hyperparameters
  bindSlider('lstmLayers', state.mlParams, 'lstmLayers');
  bindSlider('lstmUnits', state.mlParams, 'lstmUnits');
  bindSlider('lstmDropout', state.mlParams, 'lstmDropout');
  bindSlider('lstmLookback', state.mlParams, 'lstmLookback');

  // Tree Model Parameters
  bindSlider('rfTrees', state.mlParams, 'rfTrees');
  bindSlider('rfMaxDepth', state.mlParams, 'rfMaxDepth');
  bindSlider('gbTrees', state.mlParams, 'gbTrees');
  bindSlider('gbLearningRate', state.mlParams, 'gbLearningRate');

  // =====================
  // Common Controls
  // =====================

  // Data sources
  document.querySelectorAll<HTMLButtonElement>('.data-source-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const source = btn.dataset.source;
      if (source) {
        if (state.activeDataSources.includes(source)) {
          state.activeDataSources = state.activeDataSources.filter(s => s !== source);
        } else {
          state.activeDataSources.push(source);
        }
        render();
      }
    });
  });

  // Toggle simulation
  document.getElementById('toggle-simulation')?.addEventListener('click', () => {
    state.isSimulating = !state.isSimulating;
    render();
  });

  // Reset agents
  document.getElementById('reset-agents')?.addEventListener('click', () => {
    state.agents = generateAgents(state.abmParams);
    render();
  });
}

// Initialize
applyTheme();
render();
