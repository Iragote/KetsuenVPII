body { 
    font-family: 'Montserrat', sans-serif; 
    background-color: #000; 
    color: #ffcc00; 
    margin: 0; 
    padding: 10px; 
}

.container { 
    max-width: 600px; 
    margin: auto; 
    border: 2px solid #e60000; 
    border-radius: 15px; 
    padding: 15px; 
    background: #0a0a0a; 
}

h1, h3, .tab-btn, .preco, #btn-enviar { 
    font-family: 'Oswald', sans-serif; 
    text-transform: uppercase; 
}

h1 { 
    color: #e60000; 
    text-align: center; 
    margin-bottom: 5px; 
    letter-spacing: 1px; 
}

.subtitle { 
    text-align: center; 
    color: #fff; 
    font-size: 0.9rem; 
    margin-bottom: 20px; 
    font-weight: bold; 
}

/* Status da Loja */
.status-loja {
    text-align: center;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 6px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-transform: uppercase;
}
.status-loja.aberto { background: #1b4332; color: #74c69d; border: 1px solid #2d6a4f; }
.status-loja.fechado { background: #431b1b; color: #ff8a8a; border: 1px solid #661d1d; }

.tabs { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 5px; 
    justify-content: center; 
    margin-bottom: 20px; 
    position: sticky; 
    top: 0; 
    background: #0a0a0a; 
    padding: 10px 0; 
    z-index: 10; 
}

.tab-btn { 
    background: #222; 
    color: #fff; 
    border: 1px solid #e60000; 
    padding: 10px; 
    border-radius: 5px; 
    cursor: pointer; 
    flex: 1 1 30%; 
    font-weight: bold; 
    font-size: 0.75rem; 
}

.tab-btn.active { 
    background: #e60000; 
    color: #fff; 
}

.menu-page { 
    display: none; 
}

.menu-page.active { 
    display: block; 
}

.item { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    border-bottom: 1px solid #222; 
    padding: 12px 0; 
}
.item span {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 0.9rem;
}
.item div {
    display: flex;
    align-items: center;
}

.preco { 
    color: #ffcc00; 
    font-weight: bold; 
    margin-right: 10px; 
    font-size: 0.9rem; 
}

button.add-btn { 
    background: #e60000; 
    color: white; 
    border: none; 
    padding: 6px 14px; 
    border-radius: 5px; 
    cursor: pointer; 
    font-weight: bold; 
    font-size: 1rem;
}

.header-combo { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    margin-top: 20px; 
    border-bottom: 2px solid #e60000; 
    padding-bottom: 5px; 
}

.header-combo img { 
    width: 80px; 
    height: 80px; 
    object-fit: cover; 
    border-radius: 8px; 
    border: 1px solid #ffcc00; 
}

.carrinho-fixo { 
    background: #111; 
    padding: 15px; 
    border: 2px solid #e60000; 
    border-radius: 10px; 
    margin-top: 30px; 
}

.campo-cliente { 
    width: 100%; 
    padding: 10px; 
    margin: 5px 0 10px 0; 
    background: #222; 
    border: 1px solid #ffcc00; 
    color: #fff; 
    border-radius: 5px; 
    box-sizing: border-box; 
    font-family: 'Montserrat', sans-serif; 
}

#btn-enviar { 
    width: 100%; 
    background: #25d366; 
    color: #fff; 
    padding: 15px; 
    border: none; 
    border-radius: 8px; 
    font-size: 1.1rem; 
    font-weight: bold; 
    cursor: pointer; 
    margin-top: 10px; 
}

/* Botão e Modal de Informação (Ingredientes) */
.info-btn {
    background: transparent;
    border: 1px solid #ffcc00;
    color: #ffcc00;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    cursor: pointer;
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #111;
    border: 2px solid #e60000;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 350px;
    text-align: center;
}
