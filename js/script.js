function procesarImpuestos(impuestosCalculados, servSelect, checked) { // Se procesan los impuestos para agregar al carrito
    let sumaImp = 0;
    let sumaTotal = 0;

    if (checked) { 
        for (let i = 0; i < impuestos.length; i++) {
            sumaImp = impuestos[i].valor * servSelect; 
            impuestosCalculados[i].valor += sumaImp // Se agrega el resultado de la operación a un array igual al de los impuestos
            sumaTotal += sumaImp
        }
        impuestosCalculados[4].valor += sumaTotal;
        impTotal += sumaTotal;
    } else {
        for (let i = 0; i < impuestos.length; i++) {
            sumaImp = impuestos[i].valor * servSelect;
            impuestosCalculados[i].valor -= sumaImp;
            sumaTotal += sumaImp
            if (sumaTotal < 0) {
                sumaTotal = 0;
            }
        }
        impuestosCalculados[4].valor -= sumaTotal // Se agrega el total de los impuestos sumados a un campo adicional en el array
        impTotal -= sumaTotal;

        return impuestosCalculados;
    }

}

function formatNum(num) {
    let numConvert = num.toFixed(2).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    // Agrega el separador de miles (también reemplaza la coma por un punto), cambia el punto por la coma en los decimales y limita a 2 los números después de la coma.
    return numConvert
}

function calcImpuestos(moneda, precio) {// Calcula los impuestos para ser mostrados
    let totalImpuestos = 0;
    let totalFinal = 0;
    if (moneda === "peso") {
        impuestos.forEach(e => { // Calcula el precio del servicio con el porcentaje de impuestos
            totalImpuestos += precio * e.valor;
        });
        totalFinal = totalImpuestos + precio; // Suma el total de impuestos con el precio

    } else if (moneda === "dolar") {
        const conversion = precio * monedas[0].valor;
        impuestos.forEach(e => { 
            totalImpuestos += conversion * e.valor;
        });
        totalFinal = totalImpuestos + conversion;
    }
    return formatNum(totalFinal);
}

function formatTexto(tipo, texto) {

    if (tipo === "may") {
        // Reemplaza los guiones por espacios
        let textoConEspacios = texto.replace(/-/g, ' ');

        // Divide el texto en palabras
        let palabras = textoConEspacios.split(' ');

        // Convierte la primera letra de cada palabra a mayúsculas
        for (let i = 0; i < palabras.length; i++) {
            palabras[i] = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1);
        }

        // Junta las palabras de nuevo en una cadena de texto
        let textoFormateado = palabras.join(' ');

        return textoFormateado;

    } else if (tipo === "min") {

        // Convierte la primer letra en minúscula y reemplaza el espacio por el guión
        let textoMin = texto.toLowerCase().replace(/\s/g, '-')
        return textoMin
    }

}

function initImpCalculados() { // Inicializa el array para guardar impuestos calculados
    let array = []
    if (JSON.parse(localStorage.getItem('impuestosCalculados')) === null) {
        array = JSON.parse(JSON.stringify(impuestos));
        array.push({ nombre: "Suma de impuestos" });
        array.forEach(impuesto => {
            impuesto.valor = 0;
        });
    } else {
        array = JSON.parse(localStorage.getItem('impuestosCalculados'))
    }

    return array
}

function mostrarCarrito() {
    let $totalFinal = document.getElementById("total-final")

    $totalFinal.innerHTML = formatNum(precioTotal);

    let $precioSinImp = document.getElementById("precio-total-navbar")

    $precioSinImp.innerText = formatNum(precioTotal)

    let $carrito = document.getElementById("carrito")

    let $carritoVacio = document.getElementById("carrito-vacio")

    impuestosCalculados.forEach((e, i) => {
        let $imp = document.getElementById(`impuestos-${i}`)
        $imp.innerHTML = `<p>${e.nombre} = $${formatNum(e.valor)}`;
    });

    if (precioTotal != 0) { // Se muestra el carrito
        let $listServSelect = document.getElementById("list-serv-select")

        $carritoVacio.style.display = "none" 
        $listServSelect.innerHTML = ""; 
        carrito.forEach((e, i) => {
            let serv = document.createElement("div")
            serv.cassName = `servicio-${i}`
            serv.innerHTML = `<p><strong>${e.servicio}</strong> Plan ${e.plan} = $${formatNum(e.precio)}</p>`
            $listServSelect.appendChild(serv);

        })
        $carrito.style.display = "block"
    } else { // Si el carrito está vacío oculta los datos del carrito
        let $carrito = document.getElementById("carrito");
        $carrito.style.display = "none"
        $carritoVacio.style.display = "block"
    }
}

class Servicio {
    constructor(nombre, planes, categoria, moneda) {
        this.nombre = nombre;
        this.planes = planes;
        this.categoria = categoria
        this.moneda = moneda;
    }
};

class ServicioCarrito {
    constructor(servicio, plan, precio) {
        this.servicio = servicio,
            this.plan = plan,
            this.precio = precio
    }
}

const monedas = [{ divisa: "dolar", valor: 349.98 }];

const impuestos =
    [{ nombre: "IVA 21%", valor: 0.21 },
    { nombre: "Impuesto PAIS 8%", valor: 0.08 },
    { nombre: "Percepción a cuenta de Ganancias 45%", valor: 0.45 },
    { nombre: "Percepción a cuenta de Bienes Personales 25%", valor: 0.25 }];

const servicios = [

    new Servicio("Netflix", [{ nombre: "Básico", precio: 1649 }, { nombre: "Estándar", precio: 2799 }, { nombre: "Premium", precio: 3999 },], "video", "peso",),

    new Servicio("Prime Video", [{ nombre: "Individual", precio: 580 }], "video", "peso"),

    new Servicio("HBO Max", [{ nombre: "Móvil", precio: 389 }, { nombre: "Estándar", precio: 699 }], "video", "peso"),

    new Servicio("Disney Star Plus", [{ nombre: "Disney+", precio: 799 }, { nombre: "Star+", precio: 1749 }, { nombre: "Combo Disney+ Star+", precio: 1999 }], "video", "peso"),

    new Servicio("Spotify", [{ nombre: "Individual", precio: 599 }, { nombre: "Duo", precio: 699 }, { nombre: "Familiar", precio: 999 }, { nombre: "Premium Estudiante", precio: 329 }], "musica", "peso"),

    new Servicio("Apple Music", [{ nombre: "Individual", precio: 6.49 }, { nombre: "Familiar", precio: 9.99 }, { nombre: "Estudiantes", precio: 3.99 }], "musica", "dolar"),

    new Servicio("Tidal", [{ nombre: "Hi-Fi", precio: 380 }, { nombre: "Hi-Fi Plus", precio: 570 }, { nombre: "Familiar Hi-Fi", precio: 589 }, { nombre: "Familiar Hi-Fi Plus", precio: 890 }], "musica", "peso"),

    new Servicio("Deezer", [{ nombre: "Premium", precio: 429 }, { nombre: "Familair", precio: 719 }, { nombre: "Student", precio: 209 }], "musica", "peso"),

    new Servicio("Nvidia GeForce Now", [{ nombre: "Priority", precio: 8242 }, { nombre: "Pro", precio: 14842 }, { nombre: "Ultra", precio: 28044 }], "gaming", "peso"),

    new Servicio("Playstation Plus", [{ nombre: "Essential", precio: 6.99 }, { nombre: "Estra", precio: 10.49 }, { nombre: "Ultra", precio: 11.99 }], "gaming", "dolar"),

    new Servicio("EA Play", [{ nombre: "Estándar", precio: 0.99 }, { nombre: "Pro", precio: 14.99 }], "gaming", "dolar"),

    new Servicio("Xbox Game Pass", [{ nombre: "PC", precio: 1199 }, { nombre: "Core", precio: 949 }, { nombre: "Ultimate", precio: 1499 }], "gaming", "peso"),

    new Servicio("Dropbox", [{ nombre: "Plus 2TB", precio: 9.99 }, { nombre: "Essentials 3TB", precio: 18 }, { nombre: "Business 9TB", precio: 20 }, { nombre: "Business Plus 15TB", precio: 26 }], "storage", "dolar"),

    new Servicio("iCloud", [{ nombre: "50GB", precio: 0.99 }, { nombre: "200GB", precio: 2.99 }, { nombre: "2TB", precio: 10.99 }], "storage", "dolar"),

    new Servicio("Google One", [{ nombre: "Básico 100GB", precio: 1.99 }, { nombre: "Standard 200GB", precio: 2.99 }, { nombre: "Premium 2TB", precio: 9.99 }], "storage", "dolar"),

    new Servicio("One Drive", [{ nombre: "Básico 100GB", precio: 229 }], "storage", "peso"),

    new Servicio("YouTube Premium", [{ nombre: "Individual", precio: 389 }, { nombre: "Familiar", precio: 699 }], "video", "peso")];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let precioSinImp = JSON.parse(localStorage.getItem('precioTotal') || 0);
let impTotal = 0;
let precioTotal = JSON.parse(localStorage.getItem('precioTotal') || 0);
let impuestosCalculados = initImpCalculados();

document.addEventListener("DOMContentLoaded", function () {
    //Carga de los servicios al HTML
    servicios.forEach(s => {
        let nomServicio = formatTexto("min", s.nombre);
        let $servicio = document.getElementById(`${nomServicio}`);
        s.planes.forEach(p => {
            let plan = document.createElement("div");
            plan.className = `${nomServicio}`
            plan.innerHTML = `<input class="${p.nombre}" id="${nomServicio}-${p.nombre}" type="checkbox"><p><span class="negrita plan">${p.nombre}</span>: $${calcImpuestos(s.moneda, p.precio)}</p>`;
            $servicio.appendChild(plan);
        });
    });

    //  Checkbox en true para los productos que están en el carrito guardados en el localStorage

    if (carrito.length != 0) {
        let checkbox
        carrito.forEach(e => {
            let serv = e.servicio
            servFormat = formatTexto("min", serv)
            checkbox = document.getElementById(`${servFormat}-${e.plan}`)
            checkbox.checked = true
        });
    }

    // Se muestran los productos que se encuentran en el localStorage
    mostrarCarrito();
});

let select = document.querySelector("main");



select.addEventListener("click", e => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        const plan = e.target.className; // Toma el nombre del plan que se seleccionó
        const servicioClass = e.target.parentElement.className; // Toma el nombre del servicio que se seleccionó
        const servSelect = servicios.find(e => formatTexto("min", e.nombre) === servicioClass); // Busca el servicio seleccionado en el array


        if (servSelect) { 
            const moneda = servSelect.moneda;
            let servPrecio = servSelect.planes.find(e => e.nombre === plan)?.precio;
            let $card = document.querySelector(`.${servicioClass}`);

            if (servPrecio) {
                if (moneda === "dolar") {
                    servPrecio = servPrecio * monedas[0].valor
                }

                if (e.target.checked) {
                    $card.style.transform = 'scale(1.1)';
                    const servicio = formatTexto("may", servicioClass);
                    carrito.push(new ServicioCarrito(servicio, plan, servPrecio));
                    procesarImpuestos(impuestosCalculados, servPrecio, e.target.checked);
                    precioSinImp += servPrecio;

                } else {
                    $card.style.cssText = "scale(1.0); background-color: black;";
                    carrito = carrito.filter(c => c.plan !== plan);
                    procesarImpuestos(impuestosCalculados, servPrecio, e.target.checked);
                    precioSinImp -= servPrecio;
                    precioTotal - precioSinImp;
                }

                precioTotal = impTotal + precioSinImp

                localStorage.setItem('precioSinImp', JSON.stringify(precioSinImp));
                localStorage.setItem('precioTotal', JSON.stringify(precioTotal));
                localStorage.setItem('carrito', JSON.stringify(carrito));
                localStorage.setItem('impuestosCalculados', JSON.stringify(impuestosCalculados));

                mostrarCarrito();
            }
        }
    }
});

// Actualiza el año del copyright :)

let date = new Date();
let copyrightYear = date.getFullYear();
let copyright = document.getElementById("date-copy");
copyright.innerHTML = copyrightYear;