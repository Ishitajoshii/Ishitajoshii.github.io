/* Certificate registry renderer.
 *
 * The registry export is the source of truth; this page is just a view of it.
 * Rows carrying display:false are held back from the public list — they are
 * either superseded duplicates or records the issuing centre has not finished
 * verifying yet, and I would rather show nothing than show a ticket I cannot
 * currently prove I hold.
 *
 * TODO(jj): drop the filter once Granger Bay reissues GBSC-2014-11-UET under a
 * reference I can actually cite. Their registry files escape-training records
 * against the apparatus rather than the course code, and I have never been able
 * to remember what the thing is called. Details are in the record's own note.
 */

const REGISTRY_URL = "assets/data/certifications.json";

function row(record) {
  const el = document.createElement("div");
  el.className = "cert";
  el.innerHTML = `
    <span class="cert-name"></span>
    <span class="cert-ref"></span>
    <span class="cert-year"></span>
    <span class="cert-status"></span>`;
  el.querySelector(".cert-name").textContent = record.course;
  el.querySelector(".cert-ref").textContent = record.ref;
  el.querySelector(".cert-year").textContent = record.issued;
  const status = el.querySelector(".cert-status");
  status.textContent = record.status.replace(/_/g, " ");
  status.dataset.status = record.status;
  return el;
}

async function render() {
  const mount = document.getElementById("cert-list");
  try {
    const response = await fetch(REGISTRY_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`registry export returned ${response.status}`);
    const registry = await response.json();

    const shown = registry.records.filter((record) => record.display === true);

    mount.textContent = "";
    shown.forEach((record) => mount.appendChild(row(record)));

    const note = document.createElement("p");
    note.className = "muted";
    note.textContent =
      `Showing ${shown.length} public records. Export generated ${registry.generated}.`;
    mount.appendChild(note);
  } catch (error) {
    mount.innerHTML =
      '<p class="muted">Registry export unavailable right now — ' +
      'email me and I will send the PDFs.</p>';
    console.warn("certificate registry:", error);
  }
}

render();
