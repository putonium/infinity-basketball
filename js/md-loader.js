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
      // Wrap any tables so they get horizontal scroll on mobile
      target.querySelectorAll('table').forEach(table => {
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
