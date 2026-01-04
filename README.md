# YouTube Calendar PWA - Gerenciador de Postagens

## 📹 Sobre o Projeto

PWA profissional para gerenciamento completo de calendário de postagens do YouTube. Controle suas publicações, receba lembretes e organize seu cronograma de conteúdo com uma interface moderna e intuitiva.

## ✨ Funcionalidades

### 📅 Calendário Visual
- Visualização mensal completa com navegação intuitiva
- Indicadores visuais de postagens agendadas e realizadas
- Destaque do dia atual
- Clique em qualquer dia para criar postagem

### 📝 Gerenciamento de Postagens
- Criar, editar e excluir postagens
- Campos completos:
  - Título do vídeo
  - Data e horário da postagem
  - URL do vídeo (opcional)
  - Observações e notas
- Status: Pendente ou Publicado
- Alternância rápida de status

### 🔔 Sistema de Lembretes
- Lembretes automáticos 24h antes da postagem
- Notificações push no navegador
- Ativação opcional por postagem

### 📊 Dashboard de Estatísticas
- Total de postagens cadastradas
- Postagens do mês atual
- Próximas postagens (7 dias)

### 📱 PWA Completo
- Funciona offline
- Instalável no celular e desktop
- Design responsivo
- Rápido e leve
- Ícone do YouTube integrado

## 🚀 Como Usar

### Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/MFelipeG/youtube-calendar-pwa.git
cd youtube-calendar-pwa
```

2. Abra o arquivo `index.html` em um servidor local:
```bash
# Usando Python 3
python -m http.server 8000

# Usando PHP
php -S localhost:8000

# Usando Node.js (npx)
npx serve
```

3. Acesse no navegador: `http://localhost:8000`

### Deploy no Netlify

1. Faça fork ou clone este repositório
2. Acesse [Netlify](https://netlify.com)
3. Clique em "Add new site" > "Import an existing project"
4. Conecte seu repositório GitHub
5. Configure:
   - Build command: (deixe vazio)
   - Publish directory: `/`
6. Clique em "Deploy"

### Deploy no GitHub Pages

1. Vá em Settings do repositório
2. Navegue até Pages
3. Em "Source", selecione "main" branch
4. Salve e aguarde alguns minutos
5. Acesse: `https://mfelipeg.github.io/youtube-calendar-pwa/`

## 💻 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com CSS Grid e Flexbox
- **JavaScript Vanilla** - Lógica pura sem dependências
- **PWA** - Service Worker e Manifest
- **LocalStorage** - Persistência de dados local
- **Notifications API** - Sistema de lembretes

## 🎨 Design

- Paleta de cores oficial do YouTube
- Interface limpa e profissional
- Responsivo para mobile e desktop
- Animações suaves e intuitivas
- Iconografia moderna

## 💾 Estrutura de Dados

Cada postagem é armazenada com:
```javascript
{
  id: 1234567890,
  title: "Título do Vídeo",
  date: "2025-01-15",
  time: "18:00",
  url: "https://youtube.com/watch?v=...",
  notes: "Observações adicionais",
  reminder: true,
  isPosted: false,
  createdAt: "2025-01-04T07:38:00.000Z"
}
```

## 🔧 Personalização

Para personalizar cores, edite as variáveis CSS no arquivo `styles.css`:

```css
:root {
    --youtube-red: #FF0000;
    --youtube-dark: #282828;
    --text-primary: #0f0f0f;
    /* ... */
}
```

## 📱 Instalando como App

### No Desktop (Chrome/Edge)
1. Acesse o site
2. Clique no ícone de instalação na barra de endereço
3. Clique em "Instalar"

### No Mobile (Android)
1. Acesse o site no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"

### No Mobile (iOS)
1. Acesse o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

## 🐛 Suporte

Navegadores compatíveis:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📝 Próximas Features

- [ ] Exportar calendário para Google Calendar
- [ ] Integração com YouTube API
- [ ] Estatísticas avançadas
- [ ] Tema escuro
- [ ] Múltiplos canais
- [ ] Backup na nuvem

## 👤 Autor

**Marlon Grochoska**
- GitHub: [@MFelipeG](https://github.com/MFelipeG)

## 📝 Licença

MIT License - sinta-se livre para usar e modificar!

---

**Desenvolvido com ❤️ para criadores de conteúdo do YouTube**

---

## 🔧 Correções Recentes (Janeiro 2026)

### PWA Mobile Corrigido ✅

**Problema anterior:** O PWA não podia ser instalado em dispositivos móveis devido a configurações incorretas no `manifest.json`.

**Solução aplicada:**
- Adicionado `start_url` correto para GitHub Pages: `/youtube-calendar-pwa/`
- Adicionado `scope` correto: `/youtube-calendar-pwa/`
- Atualizado service worker (`sw.js`) com paths completos para cache

### Sincronização PC/Mobile ✅

**Como funciona:**
- A sincronização entre dispositivos é feita automaticamente através do Firebase Realtime Database
- Todos os dados são salvos em tempo real e sincronizados instantaneamente
- Funciona tanto em PC quanto em dispositivos móveis quando online
- Fallback automático para localStorage quando offline

**Para usar em múltiplos dispositivos:**
1. Acesse o app em ambos os dispositivos: https://mfelipeg.github.io/youtube-calendar-pwa/
2. Certifique-se de estar conectado à internet
3. As postagens serão sincronizadas automaticamente entre os dispositivos

### Como Instalar o PWA

**No Mobile (Android/iOS):**
1. Acesse: https://mfelipeg.github.io/youtube-calendar-pwa/
2. No Chrome (Android): Toque no menu (⋮) > "Adicionar à tela inicial"
3. No Safari (iOS): Toque no botão compartilhar > "Adicionar à Tela de Início"

**No Desktop:**
1. Acesse: https://mfelipeg.github.io/youtube-calendar-pwa/
2. Clique no ícone de instalação na barra de endereço
3. Ou vá em Menu > "Instalar YouTube Calendar"

### Tecnologias de Sincronização

- **Firebase Realtime Database** - Sincronização em tempo real entre dispositivos
- **Service Worker** - Cache offline para funcionamento sem internet
- **localStorage** - Backup local automático
