const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
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