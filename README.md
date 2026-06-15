# Landing Page Oxiville

Arquivos prontos para publicação estática. Mobile-first, SEO e otimizado para conversões via WhatsApp.

Arquivos principais:
- `index.html`
- `styles.css`
- `script.js`
- `sitemap.xml`
- `robots.txt`

Personalização rápida:
-- Altere o número do WhatsApp em `script.js` na constante `WHATSAPP_NUMBER` (formato internacional, ex: 5511999999999).
-- Atualize `og:image`, `canonical` e os campos do JSON-LD em `index.html` com informações reais da empresa.
-- Adicione IDs do Google Tag Manager / GA4 / Meta Pixel no cabeçalho de `index.html` onde indicado.

Domínio configurado para produção: https://www.oxiville.com.br

Observação: se precisar testar em um host de desenvolvimento, atualize temporariamente `canonical`, `og:url`, JSON-LD e `sitemap.xml` para o host de dev.

Recomendações de deploy:
- Hospede como site estático (Netlify, Vercel, S3, Apache, Nginx).
- Para capturar leads em servidor, implemente endpoint `/api/leads` e descomente a chamada fetch em `script.js` (função `saveLead`).

Performance & SEO:
- Todas as imagens são placeholders inline SVG; substitua por imagens otimizadas (WebP/AVIF) e atualize atributos `src` e `alt`.
- Teste no Google PageSpeed e ajuste compressão de imagens, cache e headers no servidor.
