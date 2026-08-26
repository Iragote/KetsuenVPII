let cart = [];
let totalBase = 0;

// ==========================================
// 1. SISTEMA DE LOJA ABERTA / FECHADA
// ==========================================
function verificarHorarioLoja() {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaDecimal = hora + minutos / 60;

    const statusDiv = document.getElementById('status-loja');
    
    // Configurado para abrir das 17:30 até 23:59 (Adapte se precisar)
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

// Chamar a função assim que o site carregar
window.onload = function() {
    verificarHorarioLoja();
};

// ==========================================
// 2. NAVEGAÇÃO E MODAL DE INGREDIENTES
// ==========================================
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

// ==========================================
// 3. LÓGICA DO CARRINHO
// ==========================================
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

// ==========================================
// 4. ENVIO PARA WHATSAPP & FIDELIDADE (1 Pedido p/ Dia)
// ==========================================
function enviar() {
    // Bloqueia se estiver fechado
    if (!verificarHorarioLoja()) {
        return alert("Desculpe, a loja está fechada no momento! Não é possível enviar pedidos.");
    }
    
    if (cart.length === 0) return alert("Adicione algo ao carrinho primeiro!");
    
    const nome = document.getElementById('nome-cli').value;
    const end = document.getElementById('end-cli').value;
    const tel = document.getElementById('tel-cli').value;
    const pag = document.getElementById('pagamento').value;

    if (!nome || !end || !tel) return alert("Por favor, preencha seus dados de entrega!");

    // --- LÓGICA DE FIDELIDADE (1 DIA = 1 PONTO) ---
    // Resgata os dados antigos ou cria novos
    let dadosFidelidade = JSON.parse(localStorage.getItem('ketsuen_fidelidade')) || { contador: 0, ultimaData: "" };
    
    // Pega a data atual (Ex: "2023-10-31")
    const hoje = new Date().toISOString().split('T')[0];

    // Se a data de hoje for diferente da última data salva, ele ganha +1 no contador de dias
    if (dadosFidelidade.ultimaData !== hoje) {
        dadosFidelidade.contador += 1;
        dadosFidelidade.ultimaData = hoje;
    }

    // Salva os dados atualizados no navegador
    localStorage.setItem('ketsuen_fidelidade', JSON.stringify(dadosFidelidade));
    // ---------------------------------------------

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
    
    // Regra do 10º Dia (Se atingiu 10 ou mais)
    if (dadosFidelidade.contador >= 10) {
        msg += `\n🎉 *PARABÉNS! ESTE É SEU 10º PEDIDO DE DIAS DIFERENTES!*\n`;
        msg += `🎁 *Brindes a receber:*\n`;
        msg += `- Entrega Grátis\n`;
        msg += `- 1x Rolinho Primavera (Cortesia)\n`;
        msg += `- 1x Kani de Queijo (Cortesia)\n`;
        
        // Zera o contador para o cliente começar um novo ciclo na próxima vez
        dadosFidelidade.contador = 0;
        localStorage.setItem('ketsuen_fidelidade', JSON.stringify(dadosFidelidade));
    } else {
        msg += `\n🌟 *Fidelidade:* Este é o seu pedido do dia ${dadosFidelidade.contador}/10. (Ao completar 10 você ganha Brindes!)\n`;
    }
    
    msg += `────────────────────`;

    // INSIRA SEU NÚMERO DE WHATSAPP AQUI (Somente números com código do país e DDD)
    const fone = "558183418003"; 
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`);
}
