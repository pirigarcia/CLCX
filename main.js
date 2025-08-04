// --- DEBUG: Verifica coincidencia de IDs entre parametros y parametros excluidos ---
if (window.parametrosExcluidosPorSucursal && window.parametros) {
  const excluidos = window.parametrosExcluidosPorSucursal;
  const parametros = window.parametros.map(p => p.id);

  Object.entries(excluidos).forEach(([sucursal, excluidosArr]) => {
    excluidosArr.forEach(paramId => {
      if (!parametros.includes(paramId)) {
        console.warn(`¡El parámetro excluido "${paramId}" para la sucursal "${sucursal}" NO existe en parametros.js!`);
      }
    });
  });
} else {
  console.error('parametrosExcluidosPorSucursal o parametros no están definidos. Verifica el orden de carga de los scripts.');
}
// --- FIN DEBUG ---

// Puedes cambiar el valor a 'admin', 'gop' o 'franquicias' para probar
window.userRole = 'admin'; // 'admin', 'gop', 'franquicias'

// --- FUNCION AUXILIAR PARA DETECTAR FRANQUICIA ---
function esFranquicia(id) {
  return !!window.parametrosExcluidosPorFranquicia && window.parametrosExcluidosPorFranquicia.hasOwnProperty(id);
}
// --- FIN FUNCION AUXILIAR ---

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('#sidebar a');
    const main = document.getElementById('main-content');
  
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const section = link.dataset.section;
        loadSection(section);
      });
    });
  
    // Carga inicial
    loadSection('dashboard');
    links[0].classList.add('active');
  
    function loadSection(section) {
      switch (section) {
        case 'dashboard':
          main.innerHTML = `
            <div class="card">
              <h1>Dashboard General</h1>
              <div style="display: flex; gap: 2rem;">
                <div>
                  <h3>Evaluaciones del mes</h3>
                  <p>25</p>
                </div>
                <div>
                  <h3>Promedio general</h3>
                  <p>88%</p>
                </div>
                <div>
                  <h3>Mejor sucursal</h3>
                  <p>Altabrisa</p>
                </div>
                <div>
                  <h3>Peor sucursal</h3>
                  <p>Pista</p>
                </div>
              </div>
            </div>
          `;
          break;
        case 'matriz':
          // Matriz invertida: parámetros en filas, sucursales/franquicias en columnas, filtradas por rol y exclusión
          const sucursales = window.sucursales || [];
          const franquicias = window.franquicias || [];
          const parametros = window.parametros || [];
          const excluidos = window.parametrosExcluidosPorSucursal || {};
          let columnas = [];
          if (window.userRole === 'admin') {
            columnas = [...sucursales, ...franquicias];
          } else if (window.userRole === 'gop') {
            columnas = sucursales;
          } else if (window.userRole === 'franquicias') {
            columnas = franquicias;
          }

          let tableHead = '<tr><th>Parámetro</th>';
          columnas.forEach(suc => {
            tableHead += `<th>${suc.nombre}</th>`;
          });
          tableHead += '</tr>';

          let tableBody = '';
          parametros.forEach(param => {
            tableBody += `<tr><td>${param.nombre}</td>`;
            columnas.forEach(suc => {
              // Si el parámetro está excluido para esta sucursal/franquicia, celda negra
              let excluidosArr = [];
              if (esFranquicia(suc.id)) {
                excluidosArr = window.obtenerParametrosExcluidosFranquicia(suc.id);
              } else {
                excluidosArr = excluidos[suc.id] || [];
              }
              console.log(
                "[DEBUG] Columna ID:", suc.id,
                "| Param ID:", param.id,
                "| Excluidos:", excluidosArr,
                "| ¿Es excluido?:", excluidosArr.includes(param.id)
              );
              const esExcluido = excluidosArr.includes(param.id);
              if (esExcluido) {
                tableBody += `<td class="celda-no-aplica"></td>`;
              } else {
                tableBody += `<td>-</td>`;
              }
            });
            tableBody += '</tr>';
          });

          main.innerHTML = `
            <div style=\"margin-bottom:12px; font-size:1rem; color:#393e5c;\">
              <strong>Usuario actual:</strong> <span style=\"text-transform:capitalize;\">${window.userRole}</span> &mdash; <strong>Columnas visibles:</strong> ${columnas.length}
            </div>
            <div class=\"card\">
              <h1>Matriz de Evaluación</h1>
              <div style=\"overflow-x:auto;\">
                <table>
                  <thead>${tableHead}</thead>
                  <tbody>${tableBody}</tbody>
                </table>
              </div>
            </div>
          `;
          break;
        case 'graficas':
          main.innerHTML = `
            <div class="card">
              <h1>Gráficas Comparativas</h1>
              <div style="height:220px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center;">
                <span style="color:#999;">Aquí irán las gráficas comparativas</span>
              </div>
            </div>
          `;
          break;
        case 'parametros':
          main.innerHTML = `
            <div class="card">
              <h1>Parámetros de Evaluación</h1>
              <details>
                <summary>Saludo</summary>
                <p>El colaborador saludó y estableció contacto visual.</p>
              </details>
              <details>
                <summary>Agradecimiento</summary>
                <p>El colaborador dio las gracias e invitó a volver.</p>
              </details>
              <details>
                <summary>Producto del mes</summary>
                <p>Mencionó el producto del mes.</p>
              </details>
            </div>
          `;
          break;
        case 'usuarios':
          main.innerHTML = `
            <div class="card">
              <h1>Gestión de Usuarios</h1>
              <p>(Solo admin) Aquí irá la gestión de usuarios.</p>
            </div>
          `;
          break;
        default:
          main.innerHTML = `<div class="card"><h1>Bienvenido</h1></div>`;
      }
    }
  });