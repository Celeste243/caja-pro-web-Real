// Capturamos elementos del DOM para Productos (Stock)
const formProducto = document.getElementById("formProducto");
const tablaProductos = document.getElementById("tablaProductos");
const mensajeProducto = document.getElementById("mensajeProducto");

// Capturamos elementos del DOM para Ventas (Cajero)
const formVenta = document.getElementById("formVenta");
const productoSelect = document.getElementById("productoSelect");
const cantidadVenta = document.getElementById("cantidadVenta");
const tablaVentas = document.getElementById("tablaVentas");
const mensajeVenta = document.getElementById("mensajeVenta");

// Elementos del Visor Digital de Caja
const visorMonto = document.getElementById("visorMonto");
const visorDetalle = document.getElementById("visorDetalle");

let listaProductos = [];
let editando = false;
let idMongo = null;

// Actualiza el visor digital verde estilo caja de supermercado en tiempo real
function actualizarVisor() {
  const prod = listaProductos.find(p => p._id === productoSelect.value);
  const cant = Number(cantidadVenta.value) || 0;

  if (!prod) {
    visorMonto.textContent = "$0.00";
    visorDetalle.textContent = "Sin productos cargados";
    return;
  }

  const subtotal = prod.precio * cant;
  visorMonto.textContent = `$${subtotal.toFixed(2)}`;
  visorDetalle.textContent = `${cant} x ${prod.nombre} ($${prod.precio} c/u)`;
}

productoSelect.addEventListener("change", actualizarVisor);
cantidadVenta.addEventListener("input", actualizarVisor);

// ==========================================
// 1. FUNCIONES DE CONTROL DE STOCK (PRODUCTOS)
// ==========================================

async function cargarProductos() {
  const res = await fetch("/productos/api");
  listaProductos = await res.json();

  tablaProductos.innerHTML = "";
  productoSelect.innerHTML = "";

  listaProductos.forEach(p => {
    let claseStock = "stock-ok";
    if (p.stock === 0) claseStock = "stock-cero";
    else if (p.stock <= 5) claseStock = "stock-bajo";

    tablaProductos.innerHTML += `
      <tr>
        <td><strong>${p.nombre}</strong></td>
        <td>$${p.precio}</td>
        <td><span class="${claseStock}">${p.stock} u.</span></td>
        <td>
          <button class="btn-editar" onclick="editar('${p._id}', '${p.nombre}', ${p.precio}, ${p.stock})">
            Editar
          </button>
          <button class="btn-eliminar" onclick="eliminar('${p._id}')">
            Borrar
          </button>
        </td>
      </tr>
    `;

    productoSelect.innerHTML += `
      <option value="${p._id}">
        ${p.nombre} — $${p.precio} (Disp: ${p.stock})
      </option>
    `;
  });

  actualizarVisor();
}

formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeProducto.style.display = "none";
  mensajeProducto.textContent = "";

  const nombre = document.getElementById("nombre").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);

  // Validación en frontend
  if (!nombre) {
    mensajeProducto.textContent = "Ingresá un nombre válido para el producto.";
    mensajeProducto.style.display = "block";
    return;
  }

  if (isNaN(precio) || precio <= 0) {
    mensajeProducto.textContent = "El precio debe ser un número mayor a 0.";
    mensajeProducto.style.display = "block";
    return;
  }

  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    mensajeProducto.textContent = "El stock debe ser un número entero (0 o más).";
    mensajeProducto.style.display = "block";
    return;
  }

  const producto = { nombre, precio, stock };

  let metodo = "POST";
  let url = "/productos";

  if (editando) {
    metodo = "PUT";
    url = `/productos/${idMongo}`;
  }

  const res = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(producto)
  });

  const data = await res.json();

  if (!res.ok) {
    mensajeProducto.textContent = data.mensaje;
    mensajeProducto.style.display = "block";
    return;
  }

  formProducto.reset();
  editando = false;
  idMongo = null;
  cargarProductos();
});

function editar(id, nombre, precio, stock) {
  mensajeProducto.style.display = "none";
  idMongo = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("stock").value = stock;
  editando = true;
}

async function eliminar(id) {
  await fetch(`/productos/${id}`, {
    method: "DELETE"
  });

  formProducto.reset();
  editando = false;
  idMongo = null;
  cargarProductos();
}

// ==========================================
// 2. FUNCIONES DE CAJERO (VENTAS)
// ==========================================

async function cargarVentas() {
  const res = await fetch("/ventas/api");
  const ventas = await res.json();

  tablaVentas.innerHTML = "";

  ventas.forEach(v => {
    tablaVentas.innerHTML += `
      <tr>
        <td>${v.productoNombre}</td>
        <td>${v.cantidad}</td>
        <td>$${v.precioUnitario}</td>
        <td class="total-ticket">$${v.total}</td>
      </tr>
    `;
  });
}

formVenta.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensajeVenta.style.display = "none";
  mensajeVenta.textContent = "";

  const cantidad = Number(cantidadVenta.value);

  if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
    mensajeVenta.textContent = "La cantidad debe ser un número entero mayor a 0.";
    mensajeVenta.style.display = "block";
    return;
  }

  const nuevaVenta = {
    productoId: productoSelect.value,
    cantidad
  };

  const res = await fetch("/ventas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaVenta)
  });

  const data = await res.json();

  if (!res.ok) {
    mensajeVenta.textContent = data.mensaje;
    mensajeVenta.style.display = "block";
    return;
  }

  formVenta.reset();
  cantidadVenta.value = 1;
  cargarProductos();
  cargarVentas();
});

cargarProductos();
cargarVentas();