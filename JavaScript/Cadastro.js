const PRODUTOS_STORAGE_KEY = 'produtosLoja';

function lerProdutosStorage() {
    const produtosSalvos = localStorage.getItem(PRODUTOS_STORAGE_KEY);
    if (!produtosSalvos) {
        return [];
    }
    return JSON.parse(produtosSalvos);
}

function salvarProdutosStorage(produtos) {
    localStorage.setItem(PRODUTOS_STORAGE_KEY, JSON.stringify(produtos));
}

function OnClickCadastrar() {
    const cardsHTML = `
      <div class="card">
        <img id="img-cabecario" src="../Imagens/IconeAdicionar.png" class="card-img-top" alt="Icone adicionar">
        <div class="card-body">
          <h5 class="card-title">Cadastro</h5>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <input type="text" class="form-control" id="nome-produto" placeholder="Nome do produto">
                <input type="number" id="preco" step="0.01" class="form-control" placeholder="Preço">
                <div id="drop-area" class="drop-area">
                  <p id="drop-text">Arraste uma imagem aqui ou clique para selecionar</p>
                  <input type="file" id="file-input" accept="image/*" style="display: none;">
                  <img id="imagem-produto" src="" alt="Imagem do produto" style="display: none;">
                </div>
              </div>
            </div>
          </div>
          <a id="btn-salvar-cadastro" class="btn btn-success" onclick="OnClickSalvarCadastro()">Salvar Cadastro</a>
        </div>
      </div>
    `;

    document.getElementById('cards-container').innerHTML = cardsHTML;
    configurarDragAndDrop();
}

function OnClickSalvarCadastro() {
    const nomeProduto = document.getElementById('nome-produto').value.trim();
    const precoProduto = document.getElementById('preco').value;
    const imagemElemento = document.getElementById('imagem-produto');
    const imagemProduto = imagemElemento.src;

    if (!nomeProduto || !precoProduto) {
        alert('Preencha nome e preco do produto.');
        return;
    }

    const produto = {
        nome: nomeProduto,
        preco: Number(precoProduto),
        imagem: imagemElemento.style.display === 'none' ? '' : imagemProduto
    };

    const produtos = lerProdutosStorage();
    produtos.push(produto);
    salvarProdutosStorage(produtos);

    limparFormularioCadastro();
    alert('Produto salvo com sucesso!');
}

function limparFormularioCadastro() {
    const inputNome = document.getElementById('nome-produto');
    const inputPreco = document.getElementById('preco');
    const inputArquivo = document.getElementById('file-input');
    const imagemProduto = document.getElementById('imagem-produto');
    const dropText = document.getElementById('drop-text');

    inputNome.value = '';
    inputPreco.value = '';
    inputArquivo.value = '';

    imagemProduto.removeAttribute('src');
    imagemProduto.style.display = 'none';

    if (dropText) {
        dropText.textContent = 'Arraste uma imagem aqui ou clique para selecionar';
    }
}

function configurarDragAndDrop() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processarArquivo(files[0]);
        }
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processarArquivo(e.target.files[0]);
        }
    });
}

function processarArquivo(file) {
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imagemProduto = document.getElementById('imagem-produto');
        const dropText = document.getElementById('drop-text');

        imagemProduto.src = e.target.result;
        imagemProduto.style.display = 'block';

        if (dropText) {
            dropText.textContent = 'Imagem carregada! Arraste outra para trocar.';
        }
    };
    reader.readAsDataURL(file);
}
function OnClickRemoverCadastro() {
     const removerProdutosHTML = `
      <div class="card">
        <img id="img-cabecario" src="../Imagens/IconeRemover.png" class="card-img-top" alt="Icone remover">
        <div class="card-body">
          <h5 class="card-title">Remover Produto</h5>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <input type="text" class="form-control" id="nome-produto-remover" placeholder="Nome do produto a remover">
                <a id="btn-remover-cadastro" class="btn btn-danger" onclick="OnClickRemoverProduto()">Remover Produto</a>
                </div>  
            </div>
          </div>
        </div>
      </div>
    `;
    const containerPrincipal = document.getElementById('cards-container');
    const containerRemover = document.getElementById('remover-container');

    if (containerPrincipal) {
        containerPrincipal.innerHTML = removerProdutosHTML;
    }

    if (containerRemover) {
        containerRemover.innerHTML = '';
    }
    


}
function OnClickRemoverProduto() {
    const nomeProdutoRemover = document.getElementById('nome-produto-remover').value.trim();

    if (!nomeProdutoRemover) {
        alert('Preencha o nome do produto a remover.');
        return;
    }

    const produtos = lerProdutosStorage();
    const nomeNormalizado = nomeProdutoRemover.toLowerCase();
    const indiceProduto = produtos.findIndex((produto) => {
        return produto.nome && produto.nome.toLowerCase() === nomeNormalizado;
    });

    if (indiceProduto === -1) {
        alert('Produto nao encontrado.');
        return;
    }

    produtos.splice(indiceProduto, 1);
    salvarProdutosStorage(produtos);

    document.getElementById('nome-produto-remover').value = '';
    alert('Produto removido com sucesso!');
}