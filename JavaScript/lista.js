const PRODUTOS_STORAGE_KEY = 'produtosLoja';

function renderizarProdutos() {
	const container = document.getElementById('card-produto');
	const produtos = JSON.parse(localStorage.getItem(PRODUTOS_STORAGE_KEY)) || [];

	if (produtos.length === 0) {
		container.innerHTML = '<p class="ms-3">Nenhum produto cadastrado ainda.</p>';
		return;
	}

	const cardsHtml = produtos.map((produto) => {
		const imagemHtml = produto.imagem
			? `<img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}">`
			: '';

		return `
			<div class="card m-2" style="width: 18rem;">
				${imagemHtml}
				<div class="card-body">
					<h5 class="card-title">${produto.nome}</h5>
					<p class="card-text">Preco: R$ ${Number(produto.preco).toFixed(2)}</p>
				</div>
			</div>
		`;
	}).join('');

	container.innerHTML = cardsHtml;
}

document.addEventListener('DOMContentLoaded', renderizarProdutos);
