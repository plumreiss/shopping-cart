const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCart = document.getElementById('template-cart').content
const fragment = document.createDocumentFragment()
let cart = {}
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('cart'))
        cart = JSON.parse(localStorage.getItem('cart'))
    paintCart()
})

cards.addEventListener('click', e => {
    addCart(e)
})

items.addEventListener('click', e => {
    btnAction(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        addCards(data)
    } catch (error) {
        console.log(error)
    }
}

const addCards = data => {
    data.forEach(product => {
        console.log(product.title)
        templateCard.querySelector('h5').textContent = product.title
        templateCard.querySelector('p').textContent = product.precio
        templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCart = (e) => {
    if (e.target.classList.contains('btn-dark')) {
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCart = object => {
    console.log(object)
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        precio: object.querySelector('p').textContent,
        cantidad: 1
    }
    if (cart.hasOwnProperty(product.id)) {
        product.cantidad = ++cart[product.id].cantidad
    }
    cart[product.id] = { ...product } //spread operator
    paintCart()
}

const paintCart = () => {
    // console.log(cart)
    items.innerHTML = ''
    Object.values(cart).forEach(product => {
        templateCart.querySelector('th').textContent = product.id
        templateCart.querySelectorAll('td')[0].textContent = product.title
        templateCart.querySelectorAll('td')[1].textContent = product.cantidad
        templateCart.querySelector('.btn-info').dataset.id = product.id
        templateCart.querySelector('.btn-danger').dataset.id = product.id
        templateCart.querySelector('span').textContent = product.cantidad * product.precio

        const clone = templateCart.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    paintFooter()

    localStorage.setItem('cart', JSON.stringify(cart))
}

const paintFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(cart).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const nQuantity = Object.values(cart).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrice = Object.values(cart).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nQuantity
    templateFooter.querySelector('span').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnEmptyCart = document.getElementById('empty-cart')
    btnEmptyCart.addEventListener('click', () => {
        cart = {}
        paintCart()
    })
}

const btnAction = (e) => {
    //Increase
    if (e.target.classList.contains('btn-info')) {
        const product = cart[e.target.dataset.id]
        ++product.cantidad
        cart[e.target.dataset.id] = { ...product }
        paintCart()
    }
    else if (e.target.classList.contains('btn-danger')) {
        const product = cart[e.target.dataset.id]
        --product.cantidad
        if (product.cantidad === 0) {
            delete cart[e.target.dataset.id]
        }
        paintCart()
    }
    e.stopPropagation()
}