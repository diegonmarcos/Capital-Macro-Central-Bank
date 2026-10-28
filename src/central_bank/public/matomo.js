/**
 * Matomo Tracking - Central Bank Terminal Page
 *
 * Tracks:
 * - Model tab switches (DSGE/ABM)
 * - Parameter adjustments
 * - Simulation controls
 * - Chart interactions
 * - Data source selections
 */

(function() {
  'use strict';

  if (typeof _paq === 'undefined') {
    console.warn('Matomo not loaded - tracking disabled');
    return;
  }

  // Click tracking
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a, button, .model-tab, .data-source-btn');
    if (!target) return;

    // Model tab switches
    if (target.classList.contains('model-tab')) {
      var model = target.getAttribute('data-model') || target.textContent.trim();

      _paq.push(['trackEvent', 'CentralBank', 'Model Switch', model]);
    }

    // Simulation controls
    else if (target.id === 'run-simulation') {
      _paq.push(['trackEvent', 'CentralBank', 'Simulation', 'Run']);
    }

    else if (target.id === 'toggle-simulation') {
      _paq.push(['trackEvent', 'CentralBank', 'Simulation', 'Toggle']);
    }

    else if (target.id === 'reset-params') {
      _paq.push(['trackEvent', 'CentralBank', 'Parameters', 'Reset']);
    }

    else if (target.id === 'reset-agents') {
      _paq.push(['trackEvent', 'CentralBank', 'Agents', 'Reset']);
    }

    // Data source selections
    else if (target.classList.contains('data-source-btn')) {
      var source = target.getAttribute('data-source') || target.textContent.trim();

      _paq.push(['trackEvent', 'CentralBank', 'Data Source', source]);
    }

    // Theme toggle
    else if (target.id === 'theme-toggle') {
      _paq.push(['trackEvent', 'CentralBank', 'Theme', 'Toggle']);
    }
  });

  // Track parameter changes
  document.addEventListener('change', function(e) {
    var target = e.target;
    if (target.tagName === 'INPUT' && target.type === 'range') {
      var paramName = target.id || 'unknown';
      var paramValue = target.value;

      _paq.push(['trackEvent', 'CentralBank', 'Parameter Change', paramName, parseFloat(paramValue)]);
    }
  });

  // Track page load
  window.addEventListener('load', function() {
    var charts = document.querySelectorAll('canvas');
    var modelTabs = document.querySelectorAll('.model-tab');

    if (charts.length > 0) {
      _paq.push(['trackEvent', 'CentralBank', 'Charts Loaded', charts.length.toString()]);
    }

    if (modelTabs.length > 0) {
      _paq.push(['trackEvent', 'CentralBank', 'Models Available', modelTabs.length.toString()]);
    }
  });

})();
