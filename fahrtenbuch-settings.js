// Fahrtenbuch Settings v4.2 - FIXED & INTEGRATED
console.log('fahrtenbuch-settings.js loading...');

var FahrtenbuchSettings = {
  isOpen: false,
  
  // Toggle Settings Panel
  toggle: function(e) {
    console.log('FahrtenbuchSettings.toggle() called');
    if(e) e.preventDefault();
    var panel = document.getElementById('fahrtenbuch-settings-panel');
    if (!panel) {
      console.error('Panel not found!');
      return false;
    }
    this.isOpen = !this.isOpen;
    panel.style.display = this.isOpen ? 'block' : 'none';
    console.log('Panel toggled, now:', this.isOpen ? 'OPEN' : 'CLOSED');
    return false;
  },
  
  load: function() {
    console.log('Loading settings...');
    var t = document.getElementById('fahrtenbuch_github_token');
    var o = document.getElementById('fahrtenbuch_github_owner');
    var r = document.getElementById('fahrtenbuch_github_repo');
    if(t) t.value = localStorage.getItem('Fahrtenbuch_token') || '';
    if(o) o.value = localStorage.getItem('Fahrtenbuch_owner') || 'roger-manser';
    if(r) r.value = localStorage.getItem('Fahrtenbuch_repo') || 'fahrtenbuch';
    console.log('Settings loaded');
  },
  
  save: function() {
    this.setStatus('⏳ Speichere...');
    setTimeout(() => {
      localStorage.setItem('Fahrtenbuch_token', document.getElementById('fahrtenbuch_github_token').value);
      localStorage.setItem('Fahrtenbuch_owner', document.getElementById('fahrtenbuch_github_owner').value);
      localStorage.setItem('Fahrtenbuch_repo', document.getElementById('fahrtenbuch_github_repo').value);
      this.setStatus('✅ Gespeichert!');
      setTimeout(() => this.setStatus(''), 2000);
    }, 500);
  },
  
  testGitHub: function() {
    this.setStatus('🧪 Teste GitHub...');
    var t = document.getElementById('fahrtenbuch_github_token').value;
    var o = document.getElementById('fahrtenbuch_github_owner').value;
    var r = document.getElementById('fahrtenbuch_github_repo').value;
    
    if(!t || !o || !r) {
      this.setStatus('❌ Felder fehlen!');
      setTimeout(() => this.setStatus(''), 3000);
      return;
    }
    
    fetch('https://api.github.com/repos/' + o + '/' + r, {
      headers: {'Authorization': 'token ' + t}
    })
    .then(x => {
      if(x.ok) this.setStatus('✅ GitHub OK!');
      else if(x.status === 401) this.setStatus('❌ Token ungültig!');
      else if(x.status === 404) this.setStatus('❌ Repo nicht gefunden!');
      else this.setStatus('❌ Fehler: ' + x.status);
      setTimeout(() => this.setStatus(''), 3000);
    })
    .catch(e => {
      this.setStatus('❌ ' + e.message);
      setTimeout(() => this.setStatus(''), 3000);
    });
  },
  
  exportSettings: function() {
    this.setStatus('⏳ Exportiere...');
    var data = {
      app: 'Fahrtenbuch',
      exported: new Date().toISOString(),
      settings: {
        github_token: localStorage.getItem('Fahrtenbuch_token'),
        github_owner: localStorage.getItem('Fahrtenbuch_owner'),
        github_repo: localStorage.getItem('Fahrtenbuch_repo')
      }
    };
    
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'fahrtenbuch_settings_' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    this.setStatus('✅ Exportiert!');
    setTimeout(() => this.setStatus(''), 2000);
  },
  
  importSettings: function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    var self = this;
    input.onchange = (e) => {
      self.setStatus('⏳ Importiere...');
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = (event) => {
        try {
          var data = JSON.parse(event.target.result);
          localStorage.setItem('Fahrtenbuch_token', data.settings.github_token);
          localStorage.setItem('Fahrtenbuch_owner', data.settings.github_owner);
          localStorage.setItem('Fahrtenbuch_repo', data.settings.github_repo);
          self.load();
          self.setStatus('✅ Importiert!');
          setTimeout(() => self.setStatus(''), 2000);
        } catch(err) {
          self.setStatus('❌ ' + err.message);
          setTimeout(() => self.setStatus(''), 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },
  
  clearAll: function() {
    if(confirm('Wirklich alle Einstellungen löschen?')) {
      this.setStatus('⏳ Lösche...');
      setTimeout(() => {
        localStorage.clear();
        this.load();
        this.setStatus('✅ Gelöscht!');
        setTimeout(() => this.setStatus(''), 2000);
      }, 500);
    }
  },
  
  setStatus: function(msg) {
    var statusEl = document.getElementById('fahrtenbuch-settings-status');
    if(statusEl) statusEl.textContent = msg;
  }
};

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, loading settings');
    FahrtenbuchSettings.load();
  });
} else {
  console.log('Page already loaded, loading settings');
  FahrtenbuchSettings.load();
}
