window.matrizEvaluacion = {}; // { sucursalId: { parametroId: valor, ... }, ... }

async function guardarMatrizBorrador() {
  const mesActual = new Date().toISOString().slice(0, 7); // Ejemplo: "2025-08"
  await firebase.firestore().collection('evaluaciones_matriz').doc(mesActual).set({
    matriz: window.matrizEvaluacion,
    publicado: false,
    fecha: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

// --- FUNCIONES PARA MATRIZ EVALUACION ---

// Actualiza la matriz local y guarda en Firebase
function actualizarMatrizEvaluacion(sucursalId, paramId, valor) {
  if (window.userRole !== 'admin') return; // Solo admin puede editar
  if (!window.matrizEvaluacion[sucursalId]) window.matrizEvaluacion[sucursalId] = {};
  if (valor === null) {
    delete window.matrizEvaluacion[sucursalId][paramId];
  } else {
    window.matrizEvaluacion[sucursalId][paramId] = valor;
  }
  guardarMatrizBorrador();
}

// Cargar matriz desde Firebase (según rol y estado publicado)
async function cargarMatrizEvaluacion() {
  const mesActual = new Date().toISOString().slice(0, 7);
  const doc = await firebase.firestore().collection('evaluaciones_matriz').doc(mesActual).get();
  const data = doc.data();
  if (!data) {
    window.matrizEvaluacion = {};
    return;
  }
  if (window.userRole === 'admin' || data.publicado) {
    window.matrizEvaluacion = data.matriz || {};
  } else {
    window.matrizEvaluacion = {};
  }
}

// Publicar matriz (solo admin)
async function publicarMatrizEvaluacion() {
  const mesActual = new Date().toISOString().slice(0, 7);
  await firebase.firestore().collection('evaluaciones_matriz').doc(mesActual).update({
    publicado: true,
    creadoPor: firebase.auth().currentUser.email,
    fecha: firebase.firestore.FieldValue.serverTimestamp(),
  });
  alert('¡Matriz publicada!');
}
// --- FIN FUNCIONES MATRIZ ---

// 1. Inicializar Firebase (asegúrate de tener firebaseConfig.js cargado)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// 2. Correos permitidos
const ALLOWED_USERS = [
  "unknownshoppersmx@gmail.com",
  "gop@cafelacabana.com",
  "franquicias@cafelacabana.com",
  "dg@cafelacabana.com"
];

// 3. Mostrar login si no hay sesión
function showLogin() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('main-content').style.display = 'none';
}

// 4. Mostrar app si hay sesión
function showApp() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('sidebar').style.display = '';
  document.getElementById('main-content').style.display = '';
}

// 5. Listener de login
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!ALLOWED_USERS.includes(email)) {
    document.getElementById('login-error').textContent = "Usuario no autorizado.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('login-error').textContent = "";
      showApp();
    })
    .catch(err => {
      document.getElementById('login-error').textContent = "Credenciales incorrectas.";
    });
});

// 6. Listener de estado de sesión
auth.onAuthStateChanged(user => {
  if (user && ALLOWED_USERS.includes(user.email)) {
    window.userRole = getRoleFromEmail(user.email); // Asigna el rol según el email
    console.log('[onAuthStateChanged] Usuario autenticado:', user.email, 'Rol asignado:', window.userRole);
    showApp();
    // Refresca la sección activa (por ejemplo, la matriz si está activa)
    const activeSection = document.querySelector('#sidebar .active')?.dataset.section || 'dashboard';
    if (typeof loadSection === 'function') {
      loadSection(activeSection);
    }
  } else {
    console.log('[onAuthStateChanged] Usuario no autenticado');
    showLogin();
  }
});

// Listener para el botón de logout
document.getElementById('logout-btn').addEventListener('click', function() {
  auth.signOut().then(() => {
    // Firebase Auth cierra la sesión y el listener onAuthStateChanged se encarga de mostrar el login
  });
});

// 7. Función auxiliar para roles
function getRoleFromEmail(email) {
  let rol = "usuario";
  if (email === "unknownshoppersmx@gmail.com") rol = "admin";
  if (email === "gop@cafelacabana.com") rol = "gop";
  if (email === "franquicias@cafelacabana.com") rol = "franquicias";
  if (email === "dg@cafelacabana.com") rol = "dg";
  console.log('[getRoleFromEmail] Email:', email, '-> Rol:', rol);
  return rol;
}

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
  const sucursales = window.sucursales || [];
  const franquicias = window.franquicias || [];
  const parametros = window.parametros || [];
  const excluidos = window.parametrosExcluidosPorSucursal || {};

  cargarMatrizEvaluacion().then(() => {
    console.log('[loadSection:matriz] Renderizando matriz para rol:', window.userRole);
    // FILTRO ESTRICTO DE COLUMNAS SEGÚN ROL
    let columnas = [];
    if (window.userRole === "admin" || window.userRole === "dg") {
      columnas = [...sucursales, ...franquicias];
    } else if (window.userRole === "gop") {
      columnas = [...sucursales];
    } else if (window.userRole === "franquicias") {
      columnas = [...franquicias];
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
        let excluidosArr = [];
        if (typeof esFranquicia === "function" && esFranquicia(suc.id)) {
          excluidosArr = window.obtenerParametrosExcluidosFranquicia
            ? window.obtenerParametrosExcluidosFranquicia(suc.id)
            : [];
        } else {
          excluidosArr = excluidos[suc.id] || [];
        }
        const esExcluido = excluidosArr.includes(param.id);
        if (esExcluido) {
          tableBody += `<td class="celda-no-aplica"></td>`;
        } else {
          // Determinar si la celda debe estar seleccionada
          const valor = window.matrizEvaluacion[suc.id]?.[param.id] || '';
          const seleccionada = valor ? 'celda-seleccionada' : '';
          const contenido = valor ? `<span class='valor-parametro'>${valor}</span>` : '';
          // Solo admin puede editar
          let tdClass = `celda-parametro ${seleccionada}`;
          let tdAttrs = `data-param-id="${param.id}" data-col-id="${suc.id}"`;
          if (window.userRole === 'admin') {
            tableBody += `<td class="${tdClass}" ${tdAttrs} style="cursor:pointer;">${contenido}</td>`;
          } else {
            tableBody += `<td class="${tdClass}" ${tdAttrs} style="cursor:default;">${contenido}</td>`;
          }
        }
      });
      tableBody += '</tr>';
    });

    // === BLOQUE NUEVO: Sumas y Porcentajes por columna ===
    // Calcular sumas y máximos por columna
    let sumaPorColumna = {};
    let maxPorColumna = {};
    columnas.forEach(suc => {
      sumaPorColumna[suc.id] = 0;
      maxPorColumna[suc.id] = 0;
      parametros.forEach(param => {
        let excluidosArr = [];
        if (typeof esFranquicia === "function" && esFranquicia(suc.id)) {
          excluidosArr = window.obtenerParametrosExcluidosFranquicia
            ? window.obtenerParametrosExcluidosFranquicia(suc.id)
            : [];
        } else {
          excluidosArr = excluidos[suc.id] || [];
        }
        const esExcluido = excluidosArr.includes(param.id);
        if (!esExcluido) {
          const valor = window.matrizEvaluacion[suc.id]?.[param.id] || 0;
          sumaPorColumna[suc.id] += Number(valor);
          maxPorColumna[suc.id] += Number(param.peso || 0);
        }
      });
    });

    // Fila de sumas
    let filaSuma = '<tr><td><strong>Total</strong></td>';
    columnas.forEach(suc => {
      filaSuma += `<td><strong>${sumaPorColumna[suc.id]}</strong></td>`;
    });
    filaSuma += '</tr>';

    // Fila de porcentaje/KPI
    let filaPorcentaje = '<tr><td><strong>% KPI</strong></td>';
    columnas.forEach(suc => {
      const porcentaje = maxPorColumna[suc.id] > 0
        ? ((sumaPorColumna[suc.id] / maxPorColumna[suc.id]) * 100).toFixed(1)
        : '0.0';
      filaPorcentaje += `<td><strong>${porcentaje}%</strong></td>`;
    });
    filaPorcentaje += '</tr>';

    // Agrega las filas al final del tbody
    tableBody += filaSuma + filaPorcentaje;

    main.innerHTML = `
      <div style="margin-bottom:12px; font-size:1rem; color:#393e5c;">
        <strong>Usuario actual:</strong> <span style="text-transform:capitalize;">${window.userRole}</span> &mdash; <strong>Columnas visibles:</strong> ${columnas.length}
      </div>
      <div class="card">
        <h1>Matriz de Evaluación</h1>
        <div style="overflow-x:auto;">
          <table>
            <thead>${tableHead}</thead>
            <tbody>${tableBody}</tbody>
          </table>
        </div>
      </div>
    `;

    // SOLO ADMIN AGREGA LISTENERS DE EDICIÓN Y BOTONES DE ACCIÓN
    if (window.userRole === 'admin') {
      const celdas = main.querySelectorAll('.celda-parametro');
      celdas.forEach(celda => {
        celda.addEventListener('click', function() {
          const sucursalId = celda.getAttribute('data-col-id');
          const paramId = celda.getAttribute('data-param-id');
          const param = parametros.find(p => p.id === paramId);
          if (celda.classList.contains('celda-seleccionada')) {
            celda.classList.remove('celda-seleccionada');
            celda.innerHTML = '';
            actualizarMatrizEvaluacion(sucursalId, paramId, null);
          } else {
            celda.classList.add('celda-seleccionada');
            celda.innerHTML = `<span class='valor-parametro'>${param.peso}</span>`;
            actualizarMatrizEvaluacion(sucursalId, paramId, param.peso);
          }
        });
      });

      // --- BLOQUE NUEVO: Botones de acción visualmente profesionales ---
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '16px';
      btnContainer.style.margin = '24px 0 0 0';
      btnContainer.style.justifyContent = 'flex-end';

      // Botón guardar cambios (borrador)
      const btnGuardar = document.createElement('button');
      btnGuardar.textContent = ' Guardar cambios (borrador)';
      btnGuardar.id = 'btn-guardar-borrador';
      btnGuardar.style.background = 'linear-gradient(90deg,#4e54c8,#8f94fb)';
      btnGuardar.style.color = '#fff';
      btnGuardar.style.border = 'none';
      btnGuardar.style.padding = '10px 20px';
      btnGuardar.style.borderRadius = '6px';
      btnGuardar.style.fontWeight = 'bold';
      btnGuardar.style.fontSize = '1rem';
      btnGuardar.style.cursor = 'pointer';
      btnGuardar.style.boxShadow = '0 2px 8px rgba(78,84,200,0.1)';
      btnGuardar.addEventListener('mouseenter',()=>btnGuardar.style.opacity='0.85');
      btnGuardar.addEventListener('mouseleave',()=>btnGuardar.style.opacity='1');
      btnGuardar.addEventListener('click', () => {
        guardarMatrizBorrador();
        btnGuardar.textContent = ' Cambios guardados';
        setTimeout(()=>{
          btnGuardar.textContent = ' Guardar cambios (borrador)';
        }, 1500);
      });
      btnContainer.appendChild(btnGuardar);

      // Botón publicar matriz mensual
      const btnPublicar = document.createElement('button');
      btnPublicar.textContent = ' Publicar matriz mensual';
      btnPublicar.id = 'btn-publicar-matriz';
      btnPublicar.style.background = 'linear-gradient(90deg,#11998e,#38ef7d)';
      btnPublicar.style.color = '#fff';
      btnPublicar.style.border = 'none';
      btnPublicar.style.padding = '10px 20px';
      btnPublicar.style.borderRadius = '6px';
      btnPublicar.style.fontWeight = 'bold';
      btnPublicar.style.fontSize = '1rem';
      btnPublicar.style.cursor = 'pointer';
      btnPublicar.style.boxShadow = '0 2px 8px rgba(17,153,142,0.1)';
      btnPublicar.addEventListener('mouseenter',()=>btnPublicar.style.opacity='0.85');
      btnPublicar.addEventListener('mouseleave',()=>btnPublicar.style.opacity='1');
      btnPublicar.addEventListener('click', publicarMatrizEvaluacion);
      btnContainer.appendChild(btnPublicar);

      main.appendChild(btnContainer);
    }
    // Si no es admin y la matriz no está publicada, mostrar mensaje
    if (window.userRole !== 'admin' && Object.keys(window.matrizEvaluacion).length === 0) {
      main.innerHTML = "<div class='card'><h2>Matriz aún no publicada.</h2></div>";
    }
  });
  break;
        
          // Matriz invertida: parámetros en filas, sucursales/franquicias en columnas, filtradas por rol y exclusión


        case 'graficas':
          // --- BLOQUE NUEVO: Gráfica de barras comparativa con Chart.js y permisos ---
          // Crear contenedor para la gráfica
          main.innerHTML = `
            <div class="card">
              <h1>Gráficas Comparativas</h1>
              <canvas id="grafica-kpi" height="120"></canvas>
            </div>
          `;
          // Filtrar datos según permisos
          let columnasGraficas = [];
          if (window.userRole === "admin" || window.userRole === "dg") {
            columnasGraficas = [...(window.sucursales||[]), ...(window.franquicias||[])];
          } else if (window.userRole === "gop") {
            columnasGraficas = [...(window.sucursales||[])];
          } else if (window.userRole === "franquicias") {
            columnasGraficas = [...(window.franquicias||[])];
          }
          // Calcular % KPI para cada columna
          let dataLabels = [];
          let dataKPI = [];
          columnasGraficas.forEach(suc => {
            let suma = 0;
            let max = 0;
            (window.parametros||[]).forEach(param => {
              let excluidosArr = [];
              if (typeof esFranquicia === "function" && esFranquicia(suc.id)) {
                excluidosArr = window.obtenerParametrosExcluidosFranquicia
                  ? window.obtenerParametrosExcluidosFranquicia(suc.id)
                  : [];
              } else {
                excluidosArr = (window.parametrosExcluidosPorSucursal||{})[suc.id] || [];
              }
              const esExcluido = excluidosArr.includes(param.id);
              if (!esExcluido) {
                const valor = window.matrizEvaluacion[suc.id]?.[param.id] || 0;
                suma += Number(valor);
                max += Number(param.peso || 0);
              }
            });
            dataLabels.push(suc.nombre);
            dataKPI.push(max > 0 ? ((suma / max) * 100).toFixed(1) : 0);
          });
          console.log('Labels para gráfica:', dataLabels);
          console.log('Valores KPI para gráfica:', dataKPI);
          // Cargar Chart.js si no está cargado
          if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = renderGraficaKPI;
            document.head.appendChild(script);
          } else {
            renderGraficaKPI();
          }
          function renderGraficaKPI() {
            console.log('Renderizando Chart.js con:', dataLabels, dataKPI);
            const ctx = document.getElementById('grafica-kpi').getContext('2d');
            if (window._graficaKPI) window._graficaKPI.destroy();
            window._graficaKPI = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: dataLabels,
                datasets: [{
                  label: '% KPI logrado',
                  data: dataKPI,
                  backgroundColor: dataLabels.map((_,i)=>i%2===0?'#4e54c8':'#38ef7d'),
                  borderRadius: 8,
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { callback: v => v + '%' },
                    title: { display: true, text: '% KPI' }
                  },
                  x: {
                    title: { display: true, text: 'Sucursal / Franquicia' }
                  }
                }
              }
            });
          }
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
          if (window.userRole === 'admin') {
            main.innerHTML = `
              <div class="card">
                <h1>Gestión de Usuarios</h1>
                <p>(Solo admin) Aquí irá la gestión de usuarios.</p>
              </div>
            `;
          } else {
            main.innerHTML = `
              <div class="card">
                <h2>Acceso denegado</h2>
                <p>No tienes permisos para ver esta sección.</p>
              </div>
            `;
          }
          break;
        default:
          main.innerHTML = `<div class="card"><h1>Bienvenido</h1></div>`;
      }
    }
  });

  