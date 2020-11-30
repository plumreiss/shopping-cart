const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let cart = {}
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
items.addEventListener('click', e => {
    addCart(e)
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
    items.appendChild(fragment)
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
    console.log(cart)
}


