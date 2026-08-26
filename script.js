let cart = [];
let totalBase = 0;

// 1. Verificador de Horário da Loja
function verificarHorarioLoja() {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaDecimal = hora + minutos / 60;

    const statusDiv = document.getElementById('status-loja');
    // Aberto das 17:30 às 23:59 (Modifique se precisar)
    const aberto = horaDecimal >= 17.5 && horaDecimal <= 23.99;

    if (aberto) {
        statusDiv.className = "status-loja aberto";
        statusDiv.innerText = "🟢 Estamos Abertos para Pedidos!";
        return true;
    } else {
        statusDiv.className = "status-loja fechado";
        statusDiv.innerText = "🔴 Loja Fechada (Abrimos às 17:30)";
        return false;
    }
}

// 2. Renderizar Cartão Fidelidade (Mini-jogo visual)
function renderizarFidelidade() {
    const grid = document.getElementById('fidelidade-grid');
    const texto = document.getElementById('fidelidade-texto');
    
    let dadosFidelidade = JSON.parse(localStorage.getItem('ketsuen_fidelidade')) || { contador: 0, ultimaData: "" };
    let contador = dadosFidelidade.contador;

    let html = '';
    for (let i = 1; i <= 10; i++) {
        if (i <= contador) {
            html += `<div class="fidelidade-slot preenchido">🍣</div>`;
        } else {
            html += `<div class="fidelidade-slot">⚪</div>`;
        }
    }
    grid.innerHTML = html;
    
    if (contador >= 10) {
        texto.innerHTML = "<b>🎉 Parabéns! Você completou 10 pedidos!</b> O próximo pedido terá brindes!";
        texto.style.color = "#2ecc71";
    } else {
        texto.innerHTML = `Faltam apenas <b>${10 - contador}</b> pedidos (em dias diferentes) para o seu brinde!`;
        texto.style.color = "#fff";
    }
}

window.onload = function() {
    verificarHorarioLoja();
    renderizarFidelidade();
};

// Navegação e Modais
function abrirPagina(id, event) {
    document.querySelectorAll('.menu-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

function verIngredientes(nomePrato, desc) {
    document.getElementById('modal-titulo').innerText = nomePrato;
    document.getElementById('modal-texto').innerText = desc;
    document.getElementById('modal-ingredientes').style.display = 'flex';
}

function fecharModal(event) {
    if (!event || event.target.id === 'modal-ingredientes') {
        document.getElementById('modal-ingredientes').style.display = 'none';
    }
}

// Carrinho
function add(n, p) {
    cart.push({ n, p });
    totalBase += p;
    renderCart();
}

function remove(index) {
    totalBase -= cart[index].p;
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const lista = document.getElementById('lista-carrinho');
    document.getElementById('total-val').innerText = totalBase.toFixed(2).replace('.', ',');
    
    if (cart.length === 0) {
        lista.innerHTML = "Carrinho vazio";
        return;
    }

    lista.innerHTML = cart.map((item, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; background: #1a1a1a; padding: 8px 10px; border-radius: 5px; border-left: 3px solid #e60000;">
            <span style="font-size: 0.85rem;">• ${item.n} (R$ ${item.p.toFixed(2)})</span>
            <button onclick="remove(${index})" style="background: #e60000; color: white; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">X</button>
        </div>
    `).join('');
}

function gerenciarCamposExtras() {
    const pag = document.getElementById('pagamento').value;
    document.getElementById('div-troco').style.display = (pag === "Dinheiro") ? "block" : "none";
}

// Envio e Reset Inteligente
function enviar() {
    if (!verificarHorarioLoja()) {
        return alert("Desculpe, a loja está fechada no momento! Não é possível enviar pedidos.");
    }
    
    if (cart.length === 0) return alert("Adicione algo ao carrinho primeiro!");
    
    const nome = document.getElementById('nome-cli').value;
    const end = document.getElementById('end-cli').value;
    const tel = document.getElementById('tel-cli').value;
    const pag = document.getElementById('pagamento').value;

    if (!nome || !end || !tel) return alert("Por favor, preencha seus dados de entrega!");

    // Fidelidade (1 por dia)
    let dadosFidelidade = JSON.parse(localStorage.getItem('ketsuen_fidelidade')) || { contador: 0, ultimaData: "" };
    const hoje = new Date().toISOString().split('T')[0];

    if (dadosFidelidade.ultimaData !== hoje) {
        dadosFidelidade.contador += 1;
        dadosFidelidade.ultimaData = hoje;
    }

    let msg = `*🍱 NOVO PEDIDO - KETSUEN VP*\n`;
    msg += `────────────────────\n`;
    msg += `*👤 CLIENTE:* ${nome}\n`;
    msg += `*📍 ENDEREÇO:* ${end}\n`;
    msg += `*📞 CONTATO:* ${tel}\n`;
    msg += `────────────────────\n\n`;

    msg += `*📝 ITENS DO PEDIDO:*\n`;
    msg += cart.map(i => `• ${i.n} (R$ ${i.p.toFixed(2)})`).join('\n');
    msg += `\n\n────────────────────\n`;
    msg += `*💳 FORMA DE PAGAMENTO:* ${pag}\n`;

    if (pag === "Dinheiro") {
        const troco = document.getElementById('troco-cli').value;
        if(troco) msg += `*💵 TROCO PARA:* R$ ${troco}\n`;
    }

    msg += `\n*💰 TOTAL A PAGAR: R$ ${totalBase.toFixed(2)}*\n`;
    
    if (dadosFidelidade.contador >= 10) {
        msg += `\n🎉 *PARABÉNS! ESTE É SEU 10º PEDIDO DE DIAS DIFERENTES!*\n`;
        msg += `🎁 *Brindes resgatados:*\n`;
        msg += `- Entrega Grátis\n`;
        msg += `- 1x Rolinho Primavera (Cortesia)\n`;
        msg += `- 1x Kani de Queijo (Cortesia)\n`;
        
        dadosFidelidade.contador = 0; // Reseta o ciclo do carimbo
    } else {
        msg += `\n🌟 *Fidelidade:* Pedido do dia ${dadosFidelidade.contador}/10.\n`;
    }
    
    localStorage.setItem('ketsuen_fidelidade', JSON.stringify(dadosFidelidade));
    msg += `────────────────────`;

    const fone = "558183418003"; 
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`);

    // ==========================================
    // RESET TOTAL PÓS-PEDIDO
    // ==========================================
    cart = [];
    totalBase = 0;
    renderCart();
    
    document.getElementById('nome-cli').value = '';
    document.getElementById('end-cli').value = '';
    document.getElementById('tel-cli').value = '';
    document.getElementById('troco-cli').value = '';
    document.getElementById('pagamento').value = 'Pix';
    gerenciarCamposExtras();
    
    renderizarFidelidade(); // Atualiza os carimbos visuais
}
