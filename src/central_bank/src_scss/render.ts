import { icon } from './icons';
import { state, dsgeScenarios, abmScenarios } from './state';
import { dsgeIndicators, mlIndicators, nowcasts, dataSources, dataSourceIcons } from './data';
import type { EconomicIndicator } from './types';

export function renderStatCard(indicator: EconomicIndicator, size: 'sm' | 'md' | 'lg' = 'sm'): string {
  const trendIcons: Record<string, string> = { up: 'trending-up', down: 'trending-down', stable: 'minus' };
  const trendColors: Record<string, string> = { up: 'text-cb-growth-500', down: 'text-cb-decline-500', stable: 'text-cb-navy-400' };
  const padding = size === 'lg' ? 'p-6' : size === 'md' ? 'p-4' : 'p-3';
  const textSize = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl';

  return `
    <div class="stat-card ${padding}">
      <div class="flex items-start justify-between mb-2">
        <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">${indicator.name}</span>
        <span class="flex items-center gap-1 text-xs font-semibold ${trendColors[indicator.trend]}">
          ${icon(trendIcons[indicator.trend], 'icon-xs')}
          ${indicator.change > 0 ? '+' : ''}${indicator.change.toFixed(1)}%
        </span>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="font-bold text-white ${textSize}">${indicator.value.toLocaleString()}</span>
        <span class="text-sm text-zinc-400">${indicator.unit}</span>
      </div>
    </div>
  `;
}

function renderSlider(id: string, label: string, symbol: string, value: number, min: number, max: number, step: number, description: string): string {
  const percent = ((value - min) / (max - min)) * 100;
  const decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : 1;
  return `
    <div class="param-group group">
      <div class="param-header">
        <div class="param-label">
          <span class="text-xs font-medium text-zinc-300">${label}</span>
          <span class="param-symbol">${symbol}</span>
        </div>
        <span class="param-value" id="${id}-value">${value.toFixed(decimals)}</span>
      </div>
      <div class="slider-track">
        <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"
          class="slider-gold relative z-10">
        <div class="slider-progress progress-gold" style="width: ${percent}%"></div>
      </div>
      <p class="param-desc">${description}</p>
    </div>
  `;
}

function renderToggle(id: string, label: string, checked: boolean): string {
  return `
    <label class="toggle-container">
      <span class="text-xs text-zinc-300">${label}</span>
      <div class="toggle-wrapper">
        <input type="checkbox" id="${id}" class="sr-only peer" ${checked ? 'checked' : ''}>
        <div class="toggle-bg peer-checked:bg-cb-gold-500"></div>
        <div class="toggle-knob peer-checked:translate-x-4"></div>
      </div>
    </label>
  `;
}

function renderSelect(id: string, label: string, options: string[], selected: string): string {
  return `
    <div class="mb-3">
      <label class="block text-xs font-medium text-zinc-400 mb-1">${label}</label>
      <select id="${id}">
        ${options.map(opt => `<option value="${opt}" ${opt === selected ? 'selected' : ''}>${opt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('')}
      </select>
    </div>
  `;
}

function renderSectionHeader(iconName: string, title: string, colorClass: string): string {
  return `
    <div class="section-header">
      ${icon(iconName, `icon-sm ${colorClass}`)}
      <h3 class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">${title}</h3>
    </div>
  `;
}

export function renderHeader(): string {
  return `
    <header class="header">
      <div class="header-top">
        <div class="max-w-[1600px] mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="logo-circle">
              ${icon('landmark', 'icon-lg text-zinc-900')}
            </div>
            <div>
              <h1 class="text-lg font-serif font-bold tracking-wide">CENTRAL BANK MODELING SYSTEM</h1>
              <p class="text-xs text-zinc-500 tracking-widest uppercase">Macroeconomic Analysis Division</p>
            </div>
          </div>
          <button id="theme-toggle" class="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            ${icon(state.theme === 'light' ? 'moon' : 'sun', `icon-md ${state.theme === 'dark' ? 'text-cb-gold-400' : ''}`)}
          </button>
        </div>
      </div>
      <nav class="max-w-[1600px] mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="model-tabs">
            <button data-model="dsge" class="model-tab ${state.activeModel === 'dsge' ? 'active' : ''}">
              <span class="flex items-center gap-2">
                <span class="tab-dot gold"></span>
                DSGE Model
              </span>
            </button>
            <button data-model="ml-abm" class="model-tab ${state.activeModel === 'ml-abm' ? 'active' : ''}">
              <span class="flex items-center gap-2">
                <span class="tab-dot emerald"></span>
                ML / ABM Nowcasting
              </span>
            </button>
          </div>
          <div class="hidden md:flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="status-dot animate-pulse-dot"></span>
              <span class="text-zinc-400">System Online</span>
            </div>
            <div class="text-zinc-500">${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </nav>
    </header>
  `;
}

export function renderDSGEPage(): string {
  const p = state.dsgeParams;
  return `
    <div class="min-h-screen bg-zinc-900">
      <div class="bg-gradient-header text-white py-6">
        <div class="max-w-[1600px] mx-auto px-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-cb-gold-500/20 rounded-xl animate-float">
              ${icon('activity', 'icon-xl text-cb-gold-400')}
            </div>
            <div>
              <h1 class="text-2xl font-serif font-bold">Dynamic Stochastic General Equilibrium</h1>
              <p class="text-zinc-400 text-sm">Structural macroeconomic modeling with rational expectations</p>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            ${dsgeIndicators.map(i => renderStatCard(i)).join('')}
          </div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Parameter Panels - 2 columns on large screens -->
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- Scenario Selector -->
            <div class="md:col-span-2 card">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${icon('layers', 'icon-md text-cb-gold-500')}
                  <h2 class="font-semibold text-white">Scenario Presets</h2>
                </div>
                <select id="dsge-scenario">
                  ${Object.keys(dsgeScenarios).map(s => `<option value="${s}" ${s === state.selectedScenario ? 'selected' : ''}>${s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Household Preferences -->
            <div class="card">
              ${renderSectionHeader('users', 'Household Preferences', 'text-cb-gold-500')}
              ${renderSlider('beta', 'Discount Factor', 'β', p.beta, 0.9, 0.999, 0.001, 'Rate households discount future utility')}
              ${renderSlider('sigma', 'Risk Aversion', 'σ', p.sigma, 0.5, 5, 0.1, 'Inverse of intertemporal elasticity')}
              ${renderSlider('phi', 'Frisch Elasticity', 'φ', p.phi, 0.5, 5, 0.1, 'Labor supply elasticity')}
              ${renderSlider('h', 'Habit Persistence', 'h', p.h, 0, 0.9, 0.05, 'Consumption habit formation')}
            </div>

            <!-- Production Technology -->
            <div class="card">
              ${renderSectionHeader('factory', 'Production Technology', 'text-emerald-500')}
              ${renderSlider('alpha', 'Capital Share', 'α', p.alpha, 0.2, 0.5, 0.01, 'Capital share in production')}
              ${renderSlider('delta', 'Depreciation', 'δ', p.delta, 0.01, 0.1, 0.005, 'Quarterly depreciation rate')}
              ${renderSlider('psi', 'Adjustment Cost', 'ψ', p.psi, 0, 10, 0.5, 'Capital adjustment cost')}
            </div>

            <!-- Price & Wage Rigidity -->
            <div class="card">
              ${renderSectionHeader('lock', 'Price & Wage Rigidity', 'text-blue-500')}
              ${renderSlider('theta_p', 'Price Stickiness', 'θₚ', p.theta_p, 0.5, 0.95, 0.01, 'Calvo price rigidity')}
              ${renderSlider('theta_w', 'Wage Stickiness', 'θw', p.theta_w, 0.5, 0.95, 0.01, 'Calvo wage rigidity')}
              ${renderSlider('xi_p', 'Price Indexation', 'ξₚ', p.xi_p, 0, 1, 0.05, 'Price indexation to past inflation')}
              ${renderSlider('xi_w', 'Wage Indexation', 'ξw', p.xi_w, 0, 1, 0.05, 'Wage indexation to past inflation')}
            </div>

            <!-- Monetary Policy -->
            <div class="card">
              ${renderSectionHeader('landmark', 'Monetary Policy (Taylor Rule)', 'text-purple-500')}
              ${renderSlider('rho_r', 'Interest Smoothing', 'ρᵣ', p.rho_r, 0.5, 0.95, 0.01, 'Interest rate persistence')}
              ${renderSlider('phi_pi', 'Inflation Response', 'φπ', p.phi_pi, 1.1, 3, 0.1, 'Taylor rule inflation coefficient')}
              ${renderSlider('phi_y', 'Output Gap Response', 'φy', p.phi_y, 0, 1, 0.025, 'Taylor rule output coefficient')}
              ${renderSlider('phi_dy', 'Growth Response', 'φΔy', p.phi_dy, 0, 0.5, 0.025, 'Response to output growth')}
            </div>

            <!-- Fiscal Policy -->
            <div class="card">
              ${renderSectionHeader('building-2', 'Fiscal Policy', 'text-orange-500')}
              ${renderSlider('g_y', 'Govt Spending/GDP', 'G/Y', p.g_y, 0.1, 0.3, 0.01, 'Government spending ratio')}
              ${renderSlider('tau_c', 'Consumption Tax', 'τc', p.tau_c, 0, 0.3, 0.01, 'VAT / Sales tax rate')}
              ${renderSlider('tau_k', 'Capital Tax', 'τk', p.tau_k, 0, 0.5, 0.01, 'Tax on capital income')}
              ${renderSlider('tau_l', 'Labor Tax', 'τl', p.tau_l, 0, 0.5, 0.01, 'Tax on labor income')}
              ${renderSlider('rho_g', 'Spending Persistence', 'ρg', p.rho_g, 0.5, 0.99, 0.01, 'Govt spending shock persistence')}
            </div>

            <!-- Shock Processes -->
            <div class="md:col-span-2 card">
              ${renderSectionHeader('zap', 'Shock Processes', 'text-red-500')}
              <div class="grid grid-cols-2 gap-x-6 gap-y-1">
                <div>
                  ${renderSlider('rho_a', 'TFP Persist.', 'ρₐ', p.rho_a, 0.5, 0.99, 0.01, 'Technology shock AR(1)')}
                  ${renderSlider('sigma_a', 'TFP Vol.', 'σₐ', p.sigma_a, 0.001, 0.02, 0.001, 'Technology shock std')}
                </div>
                <div>
                  ${renderSlider('rho_b', 'Pref. Persist.', 'ρb', p.rho_b, 0.5, 0.99, 0.01, 'Preference shock AR(1)')}
                  ${renderSlider('sigma_b', 'Pref. Vol.', 'σb', p.sigma_b, 0.001, 0.02, 0.001, 'Preference shock std')}
                </div>
                <div>
                  ${renderSlider('rho_i', 'Invest. Persist.', 'ρᵢ', p.rho_i, 0.5, 0.99, 0.01, 'Investment shock AR(1)')}
                  ${renderSlider('sigma_i', 'Invest. Vol.', 'σᵢ', p.sigma_i, 0.001, 0.05, 0.001, 'Investment shock std')}
                </div>
                <div>
                  ${renderSlider('rho_p', 'Price Markup Pers.', 'ρₚ', p.rho_p, 0.5, 0.99, 0.01, 'Price markup AR(1)')}
                  ${renderSlider('sigma_p', 'Price Markup Vol.', 'σₚ', p.sigma_p, 0.001, 0.02, 0.001, 'Price markup std')}
                </div>
                <div>
                  ${renderSlider('rho_w', 'Wage Markup Pers.', 'ρw', p.rho_w, 0.5, 0.99, 0.01, 'Wage markup AR(1)')}
                  ${renderSlider('sigma_w', 'Wage Markup Vol.', 'σw', p.sigma_w, 0.001, 0.02, 0.001, 'Wage markup std')}
                </div>
                <div>
                  ${renderSlider('sigma_r', 'MP Shock Vol.', 'σᵣ', p.sigma_r, 0.001, 0.01, 0.0005, 'Monetary policy shock std')}
                  ${renderSlider('sigma_g', 'Fiscal Shock Vol.', 'σg', p.sigma_g, 0.001, 0.03, 0.001, 'Govt spending shock std')}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="md:col-span-2 flex gap-3">
              <button id="run-simulation" class="btn-primary flex-1">
                ${icon('play', 'icon-sm')}
                Run Simulation
              </button>
              <button id="reset-params" class="btn-secondary">
                ${icon('rotate-ccw', 'icon-sm')}
                Reset
              </button>
              <button class="btn-secondary">
                ${icon('download', 'icon-sm')}
                Export
              </button>
            </div>
          </div>

          <!-- Charts Panel -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Model Info -->
            <div class="bg-gradient-header card border-zinc-700">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-cb-gold-500/20 rounded-lg">
                  ${icon('file-text', 'icon-md text-cb-gold-400')}
                </div>
                <div>
                  <h3 class="font-semibold text-white mb-1">About DSGE Models</h3>
                  <p class="text-xs text-zinc-400 leading-relaxed">
                    This is a medium-scale New Keynesian DSGE model with sticky prices and wages (Calvo), habit formation,
                    capital adjustment costs, and a comprehensive set of structural shocks. The model features a Taylor-type
                    monetary policy rule and detailed fiscal policy instruments.
                  </p>
                </div>
              </div>
            </div>

            <!-- Charts -->
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div class="card">
                <h3 class="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Output Gap Response</h3>
                <canvas id="gdp-chart" height="200"></canvas>
              </div>
              <div class="card">
                <h3 class="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Inflation Dynamics</h3>
                <canvas id="inflation-chart" height="200"></canvas>
              </div>
            </div>

            <!-- IRF Grid -->
            <div class="card">
              <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Impulse Response Functions</h3>
              <div class="grid grid-cols-4 gap-3">
                ${['Output', 'Consumption', 'Investment', 'Hours', 'Inflation', 'Interest Rate', 'Real Wage', 'Capital'].map(v => `
                  <div class="irf-item">
                    <div class="irf-chart">
                      ${icon('trending-up', 'icon-md text-cb-gold-500')}
                    </div>
                    <p class="text-xs font-medium text-zinc-300">${v}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Equations -->
            <div class="card">
              <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Core Model Equations</h3>
              <div class="grid grid-cols-2 gap-3">
                ${[
                  { icon: 'banknote', color: 'text-cb-gold-500', name: 'Euler Equation', eq: '1 = β E[(Cₜ-hCₜ₋₁)/(Cₜ₊₁-hCₜ)]^σ Rₜ₊₁/πₜ₊₁' },
                  { icon: 'factory', color: 'text-emerald-500', name: 'Production', eq: 'Yₜ = Aₜ Kₜ^α Lₜ^(1-α)' },
                  { icon: 'landmark', color: 'text-purple-500', name: 'Taylor Rule', eq: 'iₜ = ρᵣiₜ₋₁ + (1-ρᵣ)[φπ πₜ + φy ŷₜ]' },
                  { icon: 'alert-triangle', color: 'text-red-500', name: 'NKPC', eq: 'πₜ = βEπₜ₊₁ + ξₚπₜ₋₁ + κₚmcₜ' }
                ].map(e => `
                  <div class="equation-card">
                    <div class="equation-header">
                      ${icon(e.icon, `icon-xs ${e.color}`)}
                      <span class="text-xs font-semibold text-zinc-400 uppercase">${e.name}</span>
                    </div>
                    <code class="equation-text">${e.eq}</code>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderMLABMPage(): string {
  const abm = state.abmParams;
  const ml = state.mlParams;

  return `
    <div class="min-h-screen bg-zinc-900">
      <div class="bg-gradient-emerald text-white py-6">
        <div class="max-w-[1600px] mx-auto px-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-emerald-500/20 rounded-xl animate-float">
              ${icon('brain', 'icon-xl text-emerald-400')}
            </div>
            <div>
              <h1 class="text-2xl font-serif font-bold">Machine Learning & Agent-Based Modeling</h1>
              <p class="text-zinc-400 text-sm">Real-time nowcasting with heterogeneous agent simulation</p>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            ${mlIndicators.map(i => renderStatCard(i)).join('')}
          </div>
        </div>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Left Controls - 2 columns -->
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- Scenario Selector -->
            <div class="md:col-span-2 card">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${icon('layers', 'icon-md text-emerald-500')}
                  <h2 class="font-semibold text-white">ABM Scenario Presets</h2>
                </div>
                <select id="abm-scenario">
                  ${Object.keys(abmScenarios).map(s => `<option value="${s}">${s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Agent Population -->
            <div class="card">
              ${renderSectionHeader('users', 'Agent Population', 'text-emerald-500')}
              ${renderSlider('numHouseholds', 'Households', 'N_H', abm.numHouseholds, 20, 200, 10, 'Number of household agents')}
              ${renderSlider('numFirms', 'Firms', 'N_F', abm.numFirms, 5, 50, 5, 'Number of firm agents')}
              ${renderSlider('numBanks', 'Banks', 'N_B', abm.numBanks, 2, 15, 1, 'Number of bank agents')}
            </div>

            <!-- Behavior Distribution -->
            <div class="card">
              ${renderSectionHeader('brain', 'Behavior Distribution', 'text-purple-500')}
              ${renderSlider('pctRational', 'Rational %', '%R', abm.pctRational, 0, 100, 5, 'Pct of rational agents')}
              ${renderSlider('pctAdaptive', 'Adaptive %', '%A', abm.pctAdaptive, 0, 100, 5, 'Pct of adaptive learners')}
              ${renderSlider('pctHerding', 'Herding %', '%H', abm.pctHerding, 0, 100, 5, 'Pct following herd')}
            </div>

            <!-- Behavioral Parameters -->
            <div class="card">
              ${renderSectionHeader('settings-2', 'Behavioral Parameters', 'text-blue-500')}
              ${renderSlider('adaptationRate', 'Learning Rate', 'η', abm.adaptationRate, 0.01, 0.5, 0.01, 'Speed of adaptation')}
              ${renderSlider('herdingStrength', 'Herding Strength', 'λ', abm.herdingStrength, 0, 1, 0.05, 'Network influence weight')}
              ${renderSlider('riskTolerance', 'Risk Tolerance', 'γ', abm.riskTolerance, 0.1, 2, 0.1, 'Risk appetite')}
              ${renderSlider('memoryLength', 'Memory Length', 'M', abm.memoryLength, 1, 30, 1, 'Past periods considered')}
            </div>

            <!-- Network Topology -->
            <div class="card">
              ${renderSectionHeader('network', 'Network Topology', 'text-orange-500')}
              ${renderSlider('networkDensity', 'Connection Prob.', 'p', abm.networkDensity, 0.02, 0.4, 0.02, 'Edge probability')}
              ${renderSlider('clusterCoeff', 'Clustering', 'C', abm.clusterCoeff, 0, 1, 0.05, 'Local clustering coefficient')}
            </div>

            <!-- Market Microstructure -->
            <div class="card">
              ${renderSectionHeader('bar-chart-3', 'Market Microstructure', 'text-cyan-500')}
              ${renderSlider('priceImpact', 'Price Impact', 'λₚ', abm.priceImpact, 0.001, 0.1, 0.005, 'Order impact on price')}
              ${renderSlider('spreadBase', 'Base Spread', 's₀', abm.spreadBase, 0.001, 0.05, 0.002, 'Base bid-ask spread')}
              ${renderSlider('volatilityMem', 'GARCH Memory', 'α', abm.volatilityMem, 0.5, 0.99, 0.01, 'Volatility persistence')}
            </div>

            <!-- Banking & Credit -->
            <div class="card">
              ${renderSectionHeader('landmark', 'Banking & Credit', 'text-red-500')}
              ${renderSlider('leverageMax', 'Max Leverage', 'L_max', abm.leverageMax, 5, 30, 1, 'Maximum leverage ratio')}
              ${renderSlider('capitalReq', 'Capital Req.', 'k', abm.capitalReq, 0.04, 0.15, 0.01, 'Regulatory capital requirement')}
              ${renderSlider('interestSpread', 'Interest Spread', 'Δr', abm.interestSpread, 0.01, 0.1, 0.005, 'Lending rate spread')}
              ${renderSlider('defaultThreshold', 'Default Threshold', 'd', abm.defaultThreshold, 0, 0.3, 0.02, 'Bankruptcy trigger level')}
            </div>

            <!-- Simulation Controls -->
            <div class="card">
              ${renderSectionHeader('cpu', 'Simulation Controls', 'text-cb-gold-500')}
              ${renderSlider('simSpeed', 'Animation Speed', 'v', abm.simSpeed, 0.2, 3, 0.1, 'Simulation speed multiplier')}
              ${renderSlider('shockProb', 'Shock Probability', 'P_s', abm.shockProb, 0, 0.15, 0.01, 'Random shock frequency')}
              ${renderSlider('shockMagnitude', 'Shock Magnitude', 'M_s', abm.shockMagnitude, 0.1, 0.6, 0.05, 'Shock size when triggered')}
            </div>

            <!-- ML Model Selection -->
            <div class="md:col-span-2 card">
              ${renderSectionHeader('brain', 'ML Model Configuration', 'text-violet-500')}
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-xs text-zinc-400 mb-2 uppercase">Active Models</h4>
                  ${renderToggle('useLSTM', 'LSTM Neural Network', ml.useLSTM)}
                  ${renderToggle('useRandomForest', 'Random Forest', ml.useRandomForest)}
                  ${renderToggle('useGradientBoosting', 'Gradient Boosting', ml.useGradientBoosting)}
                  ${renderToggle('useEnsemble', 'Ensemble Averaging', ml.useEnsemble)}
                </div>
                <div>
                  <h4 class="text-xs text-zinc-400 mb-2 uppercase">Feature Engineering</h4>
                  ${renderToggle('useSeasonality', 'Seasonality Features', ml.useSeasonality)}
                  ${renderToggle('useDiff', 'Differencing', ml.useDiff)}
                  ${renderToggle('useRollingStats', 'Rolling Statistics', ml.useRollingStats)}
                  ${renderSlider('useLags', 'Lag Features', 'L', ml.useLags, 1, 30, 1, 'Number of lag variables')}
                </div>
              </div>
            </div>

            <!-- ML Hyperparameters -->
            <div class="card">
              ${renderSectionHeader('settings-2', 'LSTM Hyperparameters', 'text-pink-500')}
              ${renderSlider('lstmLayers', 'Layers', 'L', ml.lstmLayers, 1, 5, 1, 'Number of LSTM layers')}
              ${renderSlider('lstmUnits', 'Units/Layer', 'U', ml.lstmUnits, 16, 256, 16, 'Neurons per layer')}
              ${renderSlider('lstmDropout', 'Dropout', 'D', ml.lstmDropout, 0, 0.5, 0.05, 'Dropout rate')}
              ${renderSlider('lstmLookback', 'Lookback', 'T', ml.lstmLookback, 5, 60, 5, 'Input sequence length')}
            </div>

            <!-- Tree Models -->
            <div class="card">
              ${renderSectionHeader('git-branch', 'Tree Model Parameters', 'text-lime-500')}
              ${renderSlider('rfTrees', 'RF Trees', 'n_rf', ml.rfTrees, 50, 500, 50, 'Random Forest estimators')}
              ${renderSlider('rfMaxDepth', 'RF Depth', 'd_rf', ml.rfMaxDepth, 5, 30, 1, 'Max tree depth (RF)')}
              ${renderSlider('gbTrees', 'GB Trees', 'n_gb', ml.gbTrees, 50, 500, 50, 'Gradient Boosting estimators')}
              ${renderSlider('gbLearningRate', 'GB Learning Rate', 'η_gb', ml.gbLearningRate, 0.01, 0.3, 0.01, 'GB step size')}
            </div>

            <!-- Action Buttons -->
            <div class="md:col-span-2 flex gap-3">
              <button id="toggle-simulation" class="${state.isSimulating ? 'btn-danger' : 'btn-success'} flex-1">
                ${icon(state.isSimulating ? 'pause' : 'play', 'icon-sm')}
                ${state.isSimulating ? 'Stop' : 'Run'} Simulation
              </button>
              <button id="reset-agents" class="btn-secondary">
                ${icon('refresh-cw', 'icon-sm')}
                Reset Agents
              </button>
              <button class="btn-secondary">
                ${icon('download', 'icon-sm')}
                Export
              </button>
            </div>
          </div>

          <!-- Right Panel - Visualization -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Agent Canvas -->
            <div class="card">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-white">Agent Network Simulation</h3>
                <div class="flex items-center gap-4 text-xs">
                  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-cb-gold-400"></span> Households</span>
                  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Firms</span>
                  <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Banks</span>
                </div>
              </div>
              <canvas id="agent-canvas" width="600" height="350" class="canvas-container"></canvas>
              <div class="grid grid-cols-3 gap-3 mt-3">
                ${[
                  { label: 'Households', type: 'household', color: 'bg-cb-gold-400' },
                  { label: 'Firms', type: 'firm', color: 'bg-emerald-500' },
                  { label: 'Banks', type: 'bank', color: 'bg-blue-500' }
                ].map(s => `
                  <div class="text-center p-2 bg-zinc-700/50 rounded-lg">
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <span class="w-2 h-2 rounded-full ${s.color}"></span>
                      <span class="text-lg font-bold text-white">${state.agents.filter(a => a.type === s.type).length}</span>
                    </div>
                    <span class="text-xs text-zinc-400">${s.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Nowcasts -->
            <div class="card">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  ${icon('zap', 'icon-md text-cb-gold-500')}
                  <h3 class="text-sm font-semibold text-white">Real-Time Nowcasts</h3>
                </div>
                <div class="flex items-center gap-2 text-xs text-zinc-500">
                  ${icon('clock', 'icon-sm')}
                  Auto-refresh: 15 min
                </div>
              </div>
              <div class="space-y-3">
                ${nowcasts.map(n => `
                  <div class="nowcast-card">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h4 class="text-sm font-semibold text-white">${n.indicator}</h4>
                        <div class="nowcast-sources">
                          ${n.sources.map(s => `<span class="source-tag">${s}</span>`).join('')}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-xl font-bold text-emerald-400 font-mono">${n.nowcast}%</div>
                        <div class="text-xs text-zinc-500">${n.updated}</div>
                      </div>
                    </div>
                    <div class="confidence-bar">
                      <div class="confidence-fill ${n.confidence > 0.85 ? 'high' : n.confidence > 0.7 ? 'medium' : 'low'}" style="width: ${n.confidence * 100}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Chart -->
            <div class="card">
              <h3 class="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">GDP Growth: Nowcast vs Actual</h3>
              <canvas id="nowcast-chart" height="180"></canvas>
            </div>

            <!-- Data Sources -->
            <div class="card">
              <h3 class="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Alternative Data Sources</h3>
              <div class="grid grid-cols-4 gap-2">
                ${dataSources.map(source => {
                  const active = state.activeDataSources.includes(source);
                  return `
                    <button data-source="${source}" class="data-source-btn ${active ? 'active' : ''}">
                      ${icon(dataSourceIcons[source], 'icon-sm')}
                      <span class="text-xs">${source}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderFooter(): string {
  return `
    <footer class="footer">
      <div class="max-w-[1600px] mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-center md:text-left">
            <p class="text-sm text-zinc-400">Central Bank Modeling System</p>
            <p class="text-xs text-zinc-600">Macroeconomic Analysis Division | For Research Purposes Only</p>
          </div>
          <div class="flex items-center gap-6 text-xs text-zinc-500">
            <span>DSGE v3.2</span>
            <span>|</span>
            <span>ML Pipeline v2.1</span>
            <span>|</span>
            <span>ABM Engine v1.5</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function renderLinktreeButton(): string {
  return `
    <a href="https://linktree.diegonmarcos.com" target="_blank" class="linktree-btn" title="LINK <GO>">
      <span class="linktree-btn__cmd">LINK</span>
      <span class="linktree-btn__go">&lt;GO&gt;</span>
      <span class="linktree-btn__label">DIEGONMARCOS</span>
      ${icon('external-link', 'linktree-btn__icon')}
    </a>
  `;
}
