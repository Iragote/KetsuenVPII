let cart = [];
let totalBase = 0;

const TAXAS = {
    "Pix": 0, 
    "Dinheiro": 0, 
    "Débito": 0.0279,
    "Crédito 1x": 0.0599, 
    "Crédito 2x": 0.1139,
    "Crédito 3x": 0.1249, 
    "Crédito 4x": 0.1309, 
    "Crédito 5x": 0.1379
};

function abrirPagina(id, event) {
    document.querySelectorAll('.menu-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(event) event.currentTarget.classList.add('active');
}

function add(n, p) {
    cart.push({ n, p });
    totalBase += p;
    renderCart();
    atualizarTotalComTaxa();
}

function remove(index) {
    totalBase -= cart[index].p;
    cart.splice(index, 1);
    renderCart();
    atualizarTotalComTaxa();
}

function renderCart() {
    const lista = document.getElementById('lista-carrinho');
    
    if (cart.length === 0) {
        lista.innerHTML = "Carrinho vazio";
        return;
    }

    lista.innerHTML = cart.map((item, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; background: #1a1a1a; padding: 5px 10px; border-radius: 5px; border-left: 3px solid #e60000;">
            <span style="font-size: 0.85rem;">• ${item.n} (R$ ${item.p.toFixed(2)})</span>
            <button onclick="remove(${index})" style="background: #e60000; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-weight: bold; font-size: 0.7rem;">X</button>
        </div>
    `).join('');
}

function gerenciarCamposExtras() {
    const pag = document.getElementById('pagamento').value;
    document.getElementById('div-troco').style.display = (pag === "Dinheiro") ? "block" : "none";
    document.getElementById('div-parcelas').style.display = (pag === "Crédito") ? "block" : "none";
    document.getElementById('div-misto').style.display = (pag === "Misto") ? "block" : "none";
    atualizarTotalComTaxa();
}

function atualizarTotalComTaxa() {
    const pag = document.getElementById('pagamento').value;
    let totalFinal = 0;

    if (pag === "Misto") {
        const vEsp = parseFloat(document.getElementById('m-especie').value) || 0;
        const vDeb = parseFloat(document.getElementById('m-debito').value) || 0;
        const vCre = parseFloat(document.getElementById('m-credito').value) || 0;
        
        const somaDigitada = vEsp + vDeb + vCre;
        const status = document.getElementById('status-misto');
        
        status.innerText = `Soma informada: R$ ${somaDigitada.toFixed(2)}`;
        if (somaDigitada >= (totalBase - 0.01)) {
            status.className = "valor-ok";
            status.innerText += " (Valor atingido! ✅)";
        } else {
            status.className = "valor-falta";
            status.innerText += ` (Faltam R$ ${(totalBase - somaDigitada).toFixed(2)})`;
        }

        totalFinal = vEsp + (vDeb * (1 + TAXAS["Débito"])) + (vCre * (1 + TAXAS["Crédito 1x"]));
    } else {
        const parcelas = document.getElementById('parcelas').value;
        let chaveTaxa = (pag === "Crédito") ? parcelas : pag;
        totalFinal = totalBase * (1 + (TAXAS[chaveTaxa] || 0));
    }

    document.getElementById('total-val').innerText = totalFinal.toFixed(2).replace('.', ',');
    return totalFinal;
}

function enviar() {
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    const pag = document.getElementById('pagamento').value;
    const totalComTaxas = atualizarTotalComTaxa(); 
    
    const nome = document.getElementById('nome-cli').value;
    const end = document.getElementById('end-cli').value;
    const tel = document.getElementById('tel-cli').value;

    if (!nome || !end || !tel) return alert("Preencha seus dados de entrega!");

    if (pag === "Misto") {
        const vEsp = parseFloat(document.getElementById('m-especie').value) || 0;
        const vDeb = parseFloat(document.getElementById('m-debito').value) || 0;
        const vCre = parseFloat(document.getElementById('m-credito').value) || 0;
        if ((vEsp + vDeb + vCre) < (totalBase - 0.01)) {
            return alert("A soma dos valores informados é menor que o total do pedido!");
        }
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

    if (pag === "Misto") {
        const vEsp = parseFloat(document.getElementById('m-especie').value) || 0;
        const vDeb = parseFloat(document.getElementById('m-debito').value) || 0;
        const vCre = parseFloat(document.getElementById('m-credito').value) || 0;
        
        msg += `*💳 PAGAMENTO MISTO:*\n`;
        if(vEsp > 0) msg += `- Dinheiro/Pix: R$ ${vEsp.toFixed(2)}\n`;
        if(vDeb > 0) msg += `- Débito: R$ ${vDeb.toFixed(2)}\n`;
        if(vCre > 0) msg += `- Crédito 1x: R$ ${vCre.toFixed(2)}\n`;
    } else {
        const mod = (pag === "Crédito") ? document.getElementById('parcelas').value : pag;
        msg += `*💳 FORMA DE PAGAMENTO:* ${mod}\n`;
    }

    if (pag === "Dinheiro") {
        const troco = document.getElementById('troco-cli').value;
        if(troco) msg += `*💵 TROCO PARA:* R$ ${troco}\n`;
    }

    msg += `\n*💰 RESUMO FINANCEIRO:*\n`;
    msg += `- Subtotal: R$ ${totalBase.toFixed(2)}\n`;
    
    const valorTaxas = totalComTaxas - totalBase;
    if (valorTaxas > 0.01) {
        msg += `- Taxas de Cartão: R$ ${valorTaxas.toFixed(2)}\n`;
    }
    
    msg += `\n*TOTAL A PAGAR: R$ ${totalComTaxas.toFixed(2)}*`;
    msg += `\n────────────────────`;

    const fone = "558183418003";
    window.open(`https://wa.me/${fone}?text=${encodeURIComponent(msg)}`);
}
