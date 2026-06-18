// Configurável: altere apenas esta variável para definir o número do WhatsApp (formato internacional, sem sinais)
const WHATSAPP_NUMBER = '553134170535'; // e.g. 553134170535
const COMPANY_NAME = 'Oxiville';

// Utility: constrói link wa.me com mensagem encodificada
function buildWhatsAppUrl(number, message){
  const base = `https://wa.me/${number}`;
  const encoded = encodeURIComponent(message);
  return `${base}?text=${encoded}`;
}

// Salva lead no localStorage (array 'oxivilleLeads')
function saveLead(lead){
  try{
    const key = 'oxivilleLeads';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({...lead, createdAt: new Date().toISOString()});
    localStorage.setItem(key, JSON.stringify(existing));
    // opcional: enviar para servidor (exemplo comentado)
    // fetch('/api/leads', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(lead)})
  }catch(e){console.warn('Erro ao salvar lead',e)}
}

// Rastreadores - placeholders para GTM/GA4/Meta Pixel
function trackEvent(name, payload={}){
  // dataLayer push para GTM
  try{window.dataLayer = window.dataLayer || []; window.dataLayer.push({event: name, ...payload});}catch(e){}
  // GA4 / Meta Pixel podem ser inseridos aqui
  console.log('trackEvent', name, payload);
}

// Form submission handler (orcamento)
function handleOrcamentoSubmit(e){
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const produto = document.getElementById('produto').value;
  const quantidade = document.getElementById('quantidade').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();

  const lead = {nome, empresa, telefone, produto, quantidade, mensagem, canal: 'form'};
  saveLead(lead);
  trackEvent('orcamento_submit', {produto, canal:'form'});

  const fullMessage = `Olá, meu nome é ${nome}.\n\nEmpresa: ${empresa || '-'}\n\nTelefone: ${telefone}\n\nGostaria de solicitar orçamento para:\n\nProduto: ${produto}\n\nQuantidade: ${quantidade || '-'}\n\nObservações: ${mensagem || '-'}\n\nAguardo retorno.`;
  window.location.href = buildWhatsAppUrl(WHATSAPP_NUMBER, fullMessage);
}

// WhatsApp modal form handler
function handleWhatsappFormSubmit(e){
  e.preventDefault();
  const nome = document.getElementById('w-nome').value.trim();
  const empresa = document.getElementById('w-empresa').value.trim();
  const telefone = document.getElementById('w-telefone').value.trim();
  const produto = document.getElementById('w-produto').value;
  const quantidade = document.getElementById('w-quantidade').value.trim();
  const observacoes = document.getElementById('w-observacoes').value.trim();

  const lead = {nome, empresa, telefone, produto, quantidade, observacoes, canal: 'whatsapp_modal'};
  saveLead(lead);
  trackEvent('whatsapp_modal_submit', {produto, canal:'whatsapp'});

  const fullMessage = `Olá, meu nome é ${nome}.\n\nEmpresa: ${empresa || '-'}\n\nTelefone: ${telefone}\n\nGostaria de solicitar orçamento para:\n\nProduto: ${produto}\n\nQuantidade: ${quantidade || '-'}\n\nObservações: ${observacoes || '-'}\n\nAguardo retorno.`;
  // abrir wa.me
  window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, fullMessage), '_blank');
  closeWhatsappModal();
}

// Open modal
function openWhatsappModal(){
  const modal = document.getElementById('whatsapp-modal');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeWhatsappModal(){
  const modal = document.getElementById('whatsapp-modal');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// Initialize events
function init(){
  const form = document.getElementById('form-orcamento');
  form && form.addEventListener('submit', handleOrcamentoSubmit);

  const waForm = document.getElementById('whatsapp-form');
  waForm && waForm.addEventListener('submit', handleWhatsappFormSubmit);

  const floatBtn = document.getElementById('whatsapp-float');
  floatBtn && floatBtn.addEventListener('click', openWhatsappModal);

  const modalClose = document.getElementById('modal-close');
  modalClose && modalClose.addEventListener('click', closeWhatsappModal);

  const modalOverlay = document.getElementById('modal-overlay');
  modalOverlay && modalOverlay.addEventListener('click', closeWhatsappModal);

  const btnWhatsapp = document.getElementById('btn-whatsapp');
  btnWhatsapp && btnWhatsapp.addEventListener('click', (e)=>{e.preventDefault(); openWhatsappModal();});

  // botões de 'Solicitar Orçamento' nos cards: pré-preenche produto e rola até o formulário
  document.querySelectorAll('[data-product]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const produto = btn.getAttribute('data-product');
      const select = document.getElementById('produto');
      if(select){ select.value = produto; }
      document.getElementById('contato')?.scrollIntoView({behavior:'smooth'});
    });
  });

  // footer whatsapp
  const footerWa = document.getElementById('footer-whatsapp');
  footerWa && footerWa.addEventListener('click', (e)=>{e.preventDefault(); openWhatsappModal();});

  // exemplo de evento de clique para analytics
  document.getElementById('whatsapp-float')?.addEventListener('click', ()=>trackEvent('whatsapp_click', {location:'float_button'}));

  // otimização: prefetch wa.me (opcional em ambientes suportados)
  const link = document.createElement('link'); link.rel='preconnect'; link.href='https://wa.me'; document.head.appendChild(link);

  // Fechar modal com ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const modal = document.getElementById('whatsapp-modal');
      if(modal && modal.getAttribute('aria-hidden') === 'false'){
        closeWhatsappModal();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
