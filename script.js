// Verificar horário de funcionamento (Ex: Aberto das 17:30 às 23:59)
function verificarHorarioLoja() {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const horaDecimal = hora + minutos / 60;

    const statusDiv = document.getElementById('status-loja');
    // Das 17:30 (17.5) até 23:59 (23.99)
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

// Chamar ao carregar a página
window.onload = function() {
    verificarHorarioLoja();
};

// Funções do Modal de Ingredientes
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

// Atualização da função de envio para incluir o sistema de Fidelidade (10º pedido)
function enviar() {
    if (!verificarHorarioLoja()) {
        return alert("Desculpe, a loja está fechada no momento! Não é possível enviar pedidos.");
    }
    
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    const nome = document.getElementById('nome-cli').value;
    const end = document.getElementById('end-cli').value;
    const tel = document.getElementById('tel-cli').value;
    const pag = document.getElementById('pagamento').value;

    if (!nome || !end || !tel) return alert("Preencha seus dados de entrega!");

    // Sistema de Fidelidade (Contador de Pedidos)
    let totalPedidos = parseInt(localStorage.getItem('ketsuen_pedidos') || '0') + 1;
    localStorage.setItem('ketsuen_pedidos', totalPedidos);

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

    // Regra do 10º Pedido
    if (totalPedidos >= 10) {
        msg += `\n🎉 *PARABÉNS! ESTE É O SEU 10º PEDIDO!*\n`;
        msg += `🎁 *Brinde Fidelidade Resgatado:*\n`;
        msg += `- Entrega Grátis\n`;
        msg += `- 1x Rolinho Primavera (Cortesia)\n`;
        msg += `- 1x Kani de Queijo (Cortesia)\n`;
        // Reseta o contador se quiser reiniciar o ciclo após ganhar
        localStorage.setItem('ketsuen_pedidos', '0');
    }

    msg += `\n*TOTAL A PAGAR: R$ ${totalBase.toFixed(2)}*`;
    msg += `\n────────────────────`;

    const fone = "558183418003";
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`);
}

function gerenciarCamposExtras() {
    const pag = document.getElementById('pagamento').value;
    document.getElementById('div-troco').style.display = (pag === "Dinheiro") ? "block" : "none";
}
