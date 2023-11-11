async function cargarServicios() {
    try {
        const respone = await fetch("./js/servicios.json")
        if (!respone.ok) {
            throw new Error("No se pudo cargar la lista de productos")
        }
        const data = await respone.json()
        servicios = data
    } catch (error) {

    }
}

async function cotizacionDolar() {
    const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
    const data = await response.json();
    dolar = data; // Asignas el valor a la variable global dentro del fetch
}


function calcImpuestosCarrito(impuestosCalculados, servSelect, checked) { // Se procesan los impuestos para agregar al carrito
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
    if (precioTotal < -0.00) {
        precioTotal = 0;
    }
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
        const conversion = precio * dolar.compra;
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
        let textoMin = texto.toLowerCase().replace(/\s/g, '-');

        textoMin = textoMin
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u')
            .replace(/Á/g, 'A')
            .replace(/É/g, 'E')
            .replace(/Í/g, 'I')
            .replace(/Ó/g, 'O')
            .replace(/Ú/g, 'U');

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

    let $precioTotal = document.getElementById("precio-total-navbar")

    $precioTotal.innerText = formatNum(precioTotal)

    let $carrito = document.getElementById("carrito")

    let $carritoVacio = document.querySelector(".carrito-vacio")
    let $impContainer = document.querySelector(`.impuestos`)
    $impContainer.innerHTML = `
    <h3>Precio sin impuestos: <strong>$${formatNum(precioSinImp)}</strong></h3> 
    <h2>Impuestos a aplicar</h2>` 
    impuestosCalculados.forEach((e, i) => {
        let imp = document.createElement(`div`)
        imp.classList.add(`impuestos-${i}`)
        imp.innerHTML = `<p><strong>${e.nombre}</strong> = $${formatNum(e.valor)}`;
        $impContainer.appendChild(imp);
    });

    if (precioTotal != 0) { // Se muestra el carrito
        let $listServSelect = document.getElementById("list-serv-select")

        $listServSelect.innerHTML = "";
        carrito.forEach((e, i) => {
            let serv = document.createElement("ul")
            serv.cassName = `servicio-${i}`
            serv.innerHTML = `<li><strong>${e.servicio}</strong> Plan ${e.plan} = $${formatNum(e.precio)}</li>`
            $listServSelect.appendChild(serv);
            $listServSelect.style.display = "block"
        })
        $listServSelect.style.display = "block"
    } else { // Si el carrito está vacío oculta los datos del carrito
        let $listServSelect = document.getElementById("list-serv-select")
        $listServSelect.style.display = "none"
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

const impuestos =
    [{ nombre: "IVA 21%", valor: 0.21 },
    { nombre: "Impuesto PAIS 8%", valor: 0.08 },
    { nombre: "Percepción a cuenta de Ganancias 45%", valor: 0.45 },
    { nombre: "Percepción a cuenta de Bienes Personales 25%", valor: 0.25 }];

let servicios
let dolar

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let precioSinImp = JSON.parse(localStorage.getItem('precioSinImp') || 0);
let impTotal = JSON.parse(localStorage.getItem('impTotal') || 0);
let precioTotal = JSON.parse(localStorage.getItem('precioTotal') || 0);
let impuestosCalculados = initImpCalculados();

cargarServicios().then(() => {
    cotizacionDolar().then(() => {
        let $servicios = document.querySelector(`.cards`)
        let categorias = servicios.map(servicio => servicio.categoria);
        categorias = [...new Set(categorias)]
        categorias.forEach(categ => {
            let $categoria = document.createElement("div");
            let tituloCateg = document.createElement("div")
            $categoria.classList.add(`categoria` ,formatTexto("min", categ))
            tituloCateg.innerHTML = `<h1>${categ}</h1>`
            $servicios.append(tituloCateg)
            $servicios.appendChild($categoria);
        })

        servicios.forEach((s, i) => { 
            let $cardCateg = document.querySelector(`.${formatTexto("min", s.categoria)}`);
            let categServicio = formatTexto("min", s.categoria)
            let $card = document.createElement("div");
            let nomServicio = formatTexto("min", s.nombre);
            $card.classList.add(`card`, `${nomServicio}`);
            if (i % 2 == 0) {
                $card.innerHTML = `
                <div class="precios-container color-${nomServicio}">
                    <div class="precios" id="${nomServicio}">
                </div>
                </div>
                <div class="logo" id="logo-${nomServicio}">
                    <img src="img/logo-bands/${categServicio}/${nomServicio}.svg" alt="Logo ${s.nombre}">
                </div>`;
            } else {
                $card.innerHTML = `
                <div class="logo logo-invert" id="logo-${nomServicio}">
                    <img src="img/logo-bands/${categServicio}/${nomServicio}.svg" alt="Logo ${s.nombre}">
                </div>
                <div class="precios-container precios-container-invert color-${nomServicio}">
                    <div class="precios" id="${nomServicio}">
                </div>
                </div>`;
            }
            $cardCateg.appendChild($card);
            let $planes = document.getElementById(`${nomServicio}`);
            s.planes.forEach(p => {
                let plan = document.createElement("div");
                plan.className = `${nomServicio}`
                plan.innerHTML = `<input class="${p.nombre}" id="${nomServicio}-${p.nombre}" type="checkbox"><p><span class="negrita plan">${p.nombre}</span>: $${calcImpuestos(s.moneda, p.precio)}</p>`;
                $planes.appendChild(plan);
            });
        });


        //  Checkbox en true para los productos que están en el carrito guardados en el localStorage

        if (carrito.length != 0) {
            let checkbox

            carrito.forEach(e => {
                let serv = e.servicio
                servFormat = formatTexto("min", serv)
                let $card = document.querySelector(`.${servFormat}`);
                checkbox = document.getElementById(`${servFormat}-${e.plan}`)
                checkbox.checked = true;
                $card.style.transform = 'scale(1.1)';
            });
        }

        // Se muestran los productos que se encuentran en el localStorage
        mostrarCarrito();

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
                            servPrecio = servPrecio * dolar.compra
                        }

                        if (e.target.checked) {
                            $card.style.transform = 'scale(1.1)';
                            carrito.push(new ServicioCarrito(servSelect.nombre, plan, servPrecio));
                            calcImpuestosCarrito(impuestosCalculados, servPrecio, e.target.checked);
                            console.log(servPrecio);
                            precioSinImp += servPrecio;
                            console.log(precioSinImp);

                        } else {
                            $card.style.cssText = "scale(1.0); background-color: black;";
                            carrito = carrito.filter(c => c.plan !== plan);
                            calcImpuestosCarrito(impuestosCalculados, servPrecio, e.target.checked);
                            precioSinImp -= servPrecio;
                            precioTotal - precioSinImp;
                        }

                        precioTotal = impTotal + precioSinImp

                        localStorage.setItem('precioSinImp', JSON.stringify(precioSinImp));
                        localStorage.setItem('precioTotal', JSON.stringify(precioTotal));
                        localStorage.setItem('impTotal', JSON.stringify(impTotal));
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        localStorage.setItem('impuestosCalculados', JSON.stringify(impuestosCalculados));

                        mostrarCarrito();
                    }
                }
            }
        });
    });
});


// Actualiza el año del copyright :)

let date = new Date();
let copyrightYear = date.getFullYear();
let copyright = document.getElementById("date-copy");

copyright.innerHTML = copyrightYear;

let prevScrollpos = window.pageYOffset;
        window.onscroll = function() {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("menu").style.top = "0";
            } else {
                document.getElementById("menu").style.top = "-50px";
            }
            prevScrollpos = currentScrollPos;
        }