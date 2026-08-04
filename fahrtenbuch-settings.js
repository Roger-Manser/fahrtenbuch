// Fahrtenbuch Settings v4.0 - KOMPAKT & SMART
var fahrtenbuchSettings = {
  isOpen: false,
  statusMsg: '',
  
  // Toggle Settings Panel
  toggleSettings: function() {
    var panel = document.getElementById('fahrtenbuch-settings-panel');
    this.isOpen = !this.isOpen;
    panel.style.display = this.isOpen ? 'block' : 'none';
  },
  
  // Load settings from localStorage
  load: function() {
    var t = document.getElementById('fahrtenbuch_github_token');
    var o = document.getElementById('fahrtenbuch_github_owner');
    var r = document.getElementById('fahrtenbuch_github_repo');
    if(t) t.value = localStorage.getItem('Fahrtenbuch_token') || '';
    if(o) o.value = localStorage.getItem('Fahrtenbuch_owner') || 'roger-manser';
    if(r) r.value = localStorage.getItem('Fahrtenbuch_repo') || 'fahrtenbuch';
  },
  
  // Save settings
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
  
  // Test GitHub Token
  testGitHub: function() {
    this.setStatus('🧪 Teste GitHub...');
    var t = document.getElementById('fahrtenbuch_github_token').value;
    var o = document.getElementById('fahrtenbuch_github_owner').value;
    var r = document.getElementById('fahrtenbuch_github_repo').value;
    
    if(!t || !o || !r) {
      this.setStatus('❌ Felder fehlen!');
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
      this.setStatus('❌ Fehler: ' + e.message);
      setTimeout(() => this.setStatus(''), 3000);
    });
  },
  
  // Export settings
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
  
  // Import settings
  importSettings: function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      this.setStatus('⏳ Importiere...');
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = (event) => {
        try {
          var data = JSON.parse(event.target.result);
          localStorage.setItem('Fahrtenbuch_token', data.settings.github_token);
          localStorage.setItem('Fahrtenbuch_owner', data.settings.github_owner);
          localStorage.setItem('Fahrtenbuch_repo', data.settings.github_repo);
          this.load();
          this.setStatus('✅ Importiert!');
          setTimeout(() => this.setStatus(''), 2000);
        } catch(err) {
          this.setStatus('❌ Fehler: ' + err.message);
          setTimeout(() => this.setStatus(''), 3000);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  },
  
  // Clear all
  clearAll: function() {
    if(confirm('Wirklich alle Einstellungen löschen?')) {
      this.setStatus('⏳ Lösche...');
      localStorage.clear();
      this.load();
      this.setStatus('✅ Gelöscht!');
      setTimeout(() => this.setStatus(''), 2000);
    }
  },
  
  // Set status message
  setStatus: function(msg) {
    this.statusMsg = msg;
    var statusEl = document.getElementById('fahrtenbuch-settings-status');
    if(statusEl) statusEl.textContent = msg;
  }
};

// Load on page load
window.addEventListener('load', function() {
  fahrtenbuchSettings.load();
});
