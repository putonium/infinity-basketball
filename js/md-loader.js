// Loads a Markdown file and renders it into #md-content.
// The path to the .md file is set via the data-src attribute on this script tag.
(function () {
  const script = document.currentScript;
  const src = script.getAttribute('data-src');
  const target = document.getElementById('md-content');
  if (!src || !target) return;

  fetch(src)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load ' + src);
      return res.text();
    })
    .then(text => {
      target.innerHTML = marked.parse(text);
      target.querySelectorAll('table').forEach(table => {
        // Tag each td with its column header for CSS card layout on mobile
        const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(row => {
          row.querySelectorAll('td').forEach((td, i) => {
            if (headers[i]) td.setAttribute('data-label', headers[i]);
          });
        });
        // Wrap for horizontal scroll fallback on larger tables
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      });
    })
    .catch(() => {
      target.innerHTML = '<p style="color:var(--text-muted)">Content could not be loaded.</p>';
    });
})();
