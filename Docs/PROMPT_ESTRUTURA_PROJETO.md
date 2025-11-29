# PROMPT: ESTRUTURA GENÉRICA DE GERENCIADOR DE DADOS COM CATEGORIAS

## CONTEXTO E OBJETIVO

Crie uma aplicação web completa de gerenciamento de dados com sistema de categorias. Esta é uma estrutura genérica e reutilizável que pode ser adaptada para diferentes tipos de dados (links, documentos, notas fiscais, receitas, etc.). O foco é criar uma base sólida onde apenas o tipo de dado armazenado precisa ser definido posteriormente.

**IMPORTANTE**: A estrutura deve ser genérica o suficiente para que, ao final, apenas seja necessário alterar:
- O nome da entidade principal (ex: "Link" → "Documento", "Nota Fiscal", etc.)
- Os campos específicos da entidade (ex: `url` → `numero`, `caminhoArquivo`, etc.)
- Os labels e textos da interface

Tudo mais (categorias, filtros, temas, import/export, banco de dados) permanece igual.

---

## STACK TECNOLÓGICA

### Backend
- **Runtime**: Node.js com TypeScript
- **Framework**: Fastify (API REST)
- **Banco de Dados**: SQLite3 (local, arquivo .db)
- **Validação**: Zod
- **Variáveis de Ambiente**: Dotenv

### Frontend
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **HTTP Client**: Axios
- **Animações**: Framer Motion
- **Ícones**: Lucide-react
- **Formulários**: React Hook Form + Zod
- **Gerenciamento de Estado**: React Hooks (useState, useEffect, custom hooks)

---

## ARQUITETURA DO PROJETO

### Estrutura de Diretórios

```
projeto/
├── backend/
│   ├── src/
│   │   ├── app.ts                    # Configuração do Fastify
│   │   ├── index.ts                  # Bootstrap do servidor
│   │   ├── controllers/              # Handlers de rotas HTTP
│   │   │   └── itemsController.ts    # CRUD da entidade principal
│   │   ├── services/                 # Lógica de negócio
│   │   │   └── itemsService.ts       # Regras de negócio
│   │   ├── models/                   # Operações de banco de dados
│   │   │   └── itemModel.ts         # Queries SQL
│   │   ├── schemas/                  # Validação Zod
│   │   │   └── itemSchemas.ts       # Schemas de validação
│   │   ├── routes/                   # Definição de rotas
│   │   │   ├── health.ts            # Health check
│   │   │   ├── items.ts             # Rotas da entidade principal
│   │   │   ├── categories.ts         # Rotas de categorias
│   │   │   └── exports.ts           # Rotas de import/export
│   │   ├── db/                       # Banco de dados
│   │   │   ├── database.ts          # Conexão SQLite
│   │   │   └── migrations/          # Migrations SQL
│   │   │       └── 001_create_tables.sql
│   │   └── utils/                    # Utilitários
│   │       ├── logger.ts            # Sistema de logs
│   │       └── errors.ts            # Tratamento de erros
│   ├── data/                          # Banco de dados SQLite (criado automaticamente)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   │   ├── Topbar/               # Barra superior
│   │   │   ├── ItemCard/             # Card do item (genérico)
│   │   │   ├── ItemGrid/             # Grid responsivo
│   │   │   ├── SearchFilter/        # Filtros e busca
│   │   │   ├── CategoryManager/      # Gerenciamento de categorias
│   │   │   ├── DatabaseManager/      # Import/Export/Clear
│   │   │   ├── Settings/             # Personalização de cores
│   │   │   ├── ThemeToggle/          # Toggle tema claro/escuro
│   │   │   ├── Modal/                # Modal reutilizável
│   │   │   ├── ConfirmModal/         # Modal de confirmação
│   │   │   ├── Toast/                # Notificações
│   │   │   ├── FloatingInfo/        # Botão flutuante de info
│   │   │   └── FloatingScrollToTop/  # Botão scroll to top
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Página principal
│   │   │   └── ItemEditor.tsx        # Formulário criar/editar
│   │   ├── hooks/                    # Custom hooks
│   │   │   ├── useApi.ts            # Hook para API calls
│   │   │   ├── useTheme.ts          # Hook para tema
│   │   │   └── useToasts.ts         # Hook para toasts
│   │   ├── services/
│   │   │   └── api.ts                # Cliente Axios
│   │   ├── types/
│   │   │   └── index.ts              # Interfaces TypeScript
│   │   ├── utils/
│   │   │   ├── clipboard.ts          # Utilitário de clipboard
│   │   │   └── colorUtils.ts        # Utilitários de cor
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css                 # Estilos globais
│   ├── public/
│   │   └── icon.ico                  # Ícone do projeto
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── Docs/
│   └── progress.txt                  # Documentação do progresso
│
├── install_dependencies.bat          # Script de instalação
├── [NomeProjeto].bat                 # Script de inicialização
└── criar_atalho.bat                  # Script para criar atalho

```

---

## ESQUEMA DO BANCO DE DADOS

### Tabela: `categories`
```sql
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `items` (genérica - adaptar nome e campos)
```sql
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                    -- Nome/título do item
  url TEXT NOT NULL,                     -- Campo principal (adaptar: url, numero, caminho, etc.)
  categoryId INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  favorite INTEGER DEFAULT 0,             -- Favorito (0 ou 1)
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(categoryId);
CREATE INDEX IF NOT EXISTS idx_items_favorite ON items(favorite);
CREATE INDEX IF NOT EXISTS idx_items_created ON items(createdAt);
```

### Tabela: `settings` (opcional)
```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

**NOTA**: A tabela `items` é genérica. Adapte:
- Nome da tabela (ex: `links`, `documentos`, `notas_fiscais`)
- Campo `url` para o campo principal do seu domínio
- Adicione campos extras se necessário (mas mantenha a estrutura base)

---

## INTERFACES TYPESCRIPT (GENÉRICAS)

### Backend (`models/itemModel.ts`)
```typescript
export interface Item {
  id: number;
  name: string;
  url: string;                    // Adaptar para o campo principal
  categoryId?: number | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;           // Join com categories
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  itemCount?: number;              // Contagem de itens
}

export interface ItemFilters {
  search?: string;
  categoryId?: number;
  favorite?: boolean;
  sort?: 'createdAt' | 'name' | 'favorite';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}
```

### Frontend (`types/index.ts`)
```typescript
export interface Item {
  id: number;
  name: string;
  url: string;                    // Adaptar conforme necessário
  categoryId?: number | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  linkCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ItemFilters {
  search?: string;
  categoryId?: number;
  favorite?: boolean;
  sort?: 'createdAt' | 'name' | 'favorite';
  order?: 'asc' | 'desc';
}
```

---

## VALIDAÇÃO COM ZOD

### Backend (`schemas/itemSchemas.ts`)
```typescript
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  url: z.string().min(1, 'Campo principal é obrigatório'),  // Adaptar validação
  categoryId: z.union([z.number().int().positive(), z.null()]).optional(),
  favorite: z.boolean().optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome muito longo'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(100, 'Nome muito longo'),
});
```

**ADAPTAÇÃO**: Altere a validação do campo `url` conforme o tipo de dado (URL, número, caminho de arquivo, etc.)

---

## ENDPOINTS DA API

### Health Check
- `GET /health` - Verifica se o servidor está rodando

### Items (Entidade Principal)
- `GET /api/items` - Lista todos os itens (com query params: search, categoryId, favorite, sort, order, page, perPage)
- `GET /api/items/:id` - Busca item por ID
- `POST /api/items` - Cria novo item
- `PUT /api/items/:id` - Atualiza item
- `DELETE /api/items/:id` - Exclui item

### Categories
- `GET /api/categories` - Lista todas as categorias
- `GET /api/categories/:id` - Busca categoria por ID
- `POST /api/categories` - Cria nova categoria
- `PUT /api/categories/:id` - Atualiza categoria
- `DELETE /api/categories/:id` - Exclui categoria (com reatribuição opcional)

### Export/Import
- `GET /api/export` - Exporta todos os dados como JSON
- `POST /api/import` - Importa dados de JSON
- `DELETE /api/clear` - Limpa todo o banco de dados

---

## FUNCIONALIDADES OBRIGATÓRIAS

### 1. CRUD Completo da Entidade Principal
- ✅ Criar item com nome e campo principal
- ✅ Listar todos os itens
- ✅ Buscar item por ID
- ✅ Atualizar item
- ✅ Excluir item
- ✅ Toggle de favorito

### 2. CRUD de Categorias
- ✅ Criar categoria
- ✅ Listar categorias com contagem de itens
- ✅ Renomear categoria
- ✅ Excluir categoria (com opção de reatribuir itens)
- ✅ Validação de categoria única

### 3. Sistema de Filtros e Busca
- ✅ Busca por nome ou campo principal
- ✅ Filtro por categoria
- ✅ Filtro por favoritos
- ✅ Ordenação:
  - Por data de criação (mais recente/mais antigo)
  - Por nome (A-Z / Z-A)
  - Favoritos primeiro

### 4. Interface Responsiva
- ✅ Grid responsivo:
  - 3 colunas (desktop)
  - 2 colunas (tablet)
  - 1 coluna (mobile)
- ✅ Cards com informações do item
- ✅ Botão de ação primária (adaptar conforme necessidade)
- ✅ Botão secundário (ex: copiar, visualizar, etc.)
- ✅ Toggle de favorito direto no card

### 5. Sistema de Temas
- ✅ Modo claro/escuro
- ✅ Preferência salva no localStorage
- ✅ CSS variables para cores
- ✅ Personalização de cores:
  - Cor primária para modo claro
  - Cor primária para modo escuro
  - Aplicação automática em todos os elementos
  - Persistência ao alternar temas
  - Botão de restaurar cor padrão

### 6. Gerenciamento de Categorias
- ✅ Modal dedicado para criar/editar/excluir
- ✅ Criação inline no editor de item
- ✅ Interface simples e intuitiva
- ✅ Validação de duplicatas

### 7. Import/Export
- ✅ Exportar todos os dados como JSON
- ✅ Importar JSON com verificação de duplicados
- ✅ Limpar banco de dados com confirmação dupla
- ✅ Feedback visual durante operações

### 8. UX e Animações
- ✅ Botão flutuante de informações (lado esquerdo)
- ✅ Botão flutuante de scroll to top (lado direito)
- ✅ Scroll suave com animação customizada (requestAnimationFrame)
- ✅ Animações suaves em todos os componentes (Framer Motion)
- ✅ Toasts para feedback do usuário
- ✅ Modais com animações

### 9. Banco de Dados
- ✅ SQLite local (arquivo .db)
- ✅ Migrations automáticas na primeira execução
- ✅ Banco inicia vazio (sem dados de exemplo)
- ✅ Foreign keys habilitadas
- ✅ Índices para performance

---

## COMPONENTES DO FRONTEND (DETALHAMENTO)

### Topbar
- Título do projeto
- Botão "Novo Item"
- Gerenciador de categorias (ícone)
- Gerenciador de banco de dados (ícone)
- Personalização de cores (ícone)
- Toggle de tema claro/escuro

### ItemCard
- Exibe: nome, campo principal, categoria, favorito
- Ações:
  - Ação primária (botão principal - adaptar conforme necessidade)
  - Ação secundária (ex: copiar, visualizar)
  - Editar
  - Excluir
  - Toggle favorito

### ItemGrid
- Grid responsivo com animações
- Estado de loading
- Mensagem quando não há itens

### SearchFilter
- Campo de busca
- Select de categoria
- Toggle de favoritos
- Select de ordenação

### CategoryManager
- Modal com lista de categorias
- Criar categoria
- Editar categoria
- Excluir categoria (com confirmação e reatribuição)

### DatabaseManager
- Exportar dados
- Importar dados
- Limpar banco de dados

### Settings
- Seletor de cor para modo claro
- Seletor de cor para modo escuro
- Botão restaurar cor padrão

### FloatingInfo
- Botão flutuante no lado esquerdo
- Mostra informações do projeto ao clicar
- Animação de entrada/saída

### FloatingScrollToTop
- Botão flutuante no lado direito
- Aparece após rolar 300px
- Scroll suave com animação customizada

---

## CONFIGURAÇÕES TÉCNICAS

### Backend
- **Porta**: 3018 (configurável via .env)
- **Host**: 0.0.0.0
- **CORS**: Habilitado para todas as origens
- **Error Handler**: Global com tratamento padronizado

### Frontend
- **Porta**: 3017 (configurável no vite.config.ts)
- **Proxy**: `/api` → `http://localhost:3018`
- **Build**: Vite com React
- **Tema Inicial**: Claro

### Banco de Dados
- **Localização**: `backend/data/[nome].db`
- **Criação Automática**: Sim, na primeira execução
- **Migrations**: Automáticas na inicialização

---

## SCRIPTS NECESSÁRIOS

### install_dependencies.bat
```batch
@echo off
echo Instalando dependências do Backend...
cd backend
call npm install
cd ..

echo Instalando dependências do Frontend...
cd frontend
call npm install
cd ..

echo Instalação concluída!
pause
```

### [NomeProjeto].bat
```batch
@echo off
echo Iniciando servidor backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando servidor frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Abrindo navegador...
start http://localhost:3017
```

### criar_atalho.bat
```batch
@echo off
set "SCRIPT_DIR=%~dp0"
set "ICON_PATH=%SCRIPT_DIR%frontend\public\icon.ico"
set "TARGET_PATH=%SCRIPT_DIR%[NomeProjeto].bat"
set "SHORTCUT_NAME=[NomeProjeto]"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"

powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP_PATH%\%SHORTCUT_NAME%.lnk'); $Shortcut.TargetPath = '%TARGET_PATH%'; $Shortcut.WorkingDirectory = '%SCRIPT_DIR%'; $Shortcut.IconLocation = '%ICON_PATH%'; $Shortcut.Description = '[Descrição]'; $Shortcut.Save()"

echo Atalho criado com sucesso!
pause
```

---

## PONTOS DE ADAPTAÇÃO (O QUE MUDAR)

### 1. Nomenclatura
- Substituir "Item" / "Link" pelo nome da entidade (ex: "Documento", "Nota Fiscal")
- Atualizar todos os textos da interface
- Renomear arquivos se necessário (ou manter genérico)

### 2. Campo Principal
- Se for URL: manter validação de URL
- Se for número: validar como número
- Se for caminho: validar como string
- Se for arquivo: adaptar para upload

### 3. Ações do Card
- **Ação Primária**: Adaptar conforme necessidade
  - Links: "Abrir" (abre URL)
  - Documentos: "Visualizar" ou "Abrir Arquivo"
  - Notas Fiscais: "Ver Detalhes"
- **Ação Secundária**: Adaptar conforme necessidade
  - Links: "Copiar URL"
  - Documentos: "Copiar Caminho" ou "Download"
  - Notas Fiscais: "Baixar PDF"

### 4. Campos Adicionais (Opcional)
Se precisar de campos extras além de `name` e `url`:
- Adicionar colunas na migration
- Atualizar interfaces TypeScript
- Atualizar schemas Zod
- Atualizar formulário ItemEditor
- Atualizar ItemCard para exibir novos campos

### 5. Validações Específicas
- Adaptar validação do campo principal conforme o tipo
- Adicionar validações específicas do domínio
- Manter estrutura base de validação

---

## EXEMPLOS DE ADAPTAÇÃO

### Exemplo 1: Gerenciador de Documentos
- **Entidade**: Documento
- **Campo Principal**: `caminhoArquivo` (string)
- **Ação Primária**: "Abrir Arquivo"
- **Ação Secundária**: "Copiar Caminho"
- **Validação**: Validar se arquivo existe (opcional)

### Exemplo 2: Gerenciador de Notas Fiscais
- **Entidade**: NotaFiscal
- **Campo Principal**: `numero` (string/number)
- **Campos Extras**: `valor`, `dataEmissao`, `fornecedor`
- **Ação Primária**: "Ver Detalhes"
- **Ação Secundária**: "Baixar PDF"
- **Validação**: Validar formato do número

### Exemplo 3: Gerenciador de Receitas
- **Entidade**: Receita
- **Campo Principal**: `nome` (já existe)
- **Campos Extras**: `ingredientes`, `tempoPreparo`, `porcoes`
- **Ação Primária**: "Ver Receita"
- **Ação Secundária**: "Imprimir"
- **Validação**: Validar campos obrigatórios

---

## CHECKLIST DE IMPLEMENTAÇÃO

### Backend
- [ ] Configurar projeto Node.js + TypeScript
- [ ] Instalar dependências (Fastify, SQLite3, Zod, etc.)
- [ ] Criar estrutura de pastas
- [ ] Configurar conexão SQLite
- [ ] Criar migration inicial
- [ ] Implementar models (CRUD)
- [ ] Implementar services (lógica de negócio)
- [ ] Implementar controllers (handlers HTTP)
- [ ] Criar schemas Zod
- [ ] Configurar rotas
- [ ] Configurar CORS e error handler
- [ ] Implementar import/export
- [ ] Testar todos os endpoints

### Frontend
- [ ] Configurar projeto React + Vite + TypeScript
- [ ] Instalar dependências (React, Tailwind, Axios, etc.)
- [ ] Configurar Tailwind CSS
- [ ] Criar estrutura de pastas
- [ ] Configurar tema claro/escuro
- [ ] Criar componentes base (Modal, Toast, etc.)
- [ ] Implementar Topbar
- [ ] Implementar ItemCard
- [ ] Implementar ItemGrid
- [ ] Implementar SearchFilter
- [ ] Implementar CategoryManager
- [ ] Implementar DatabaseManager
- [ ] Implementar Settings
- [ ] Implementar FloatingInfo
- [ ] Implementar FloatingScrollToTop
- [ ] Criar página Home
- [ ] Criar página ItemEditor
- [ ] Configurar API client
- [ ] Implementar hooks customizados
- [ ] Adicionar animações
- [ ] Testar todas as funcionalidades

### Scripts e Documentação
- [ ] Criar install_dependencies.bat
- [ ] Criar [NomeProjeto].bat
- [ ] Criar criar_atalho.bat
- [ ] Adicionar ícone do projeto
- [ ] Configurar favicon
- [ ] Criar documentação de progresso

---

## OBSERVAÇÕES IMPORTANTES

1. **Estrutura Genérica**: Mantenha a estrutura genérica. Use nomes como "Item" ou deixe claro que é adaptável.

2. **Categorias Sempre Iguais**: O sistema de categorias não muda, independente do tipo de dado.

3. **Filtros Sempre Iguais**: Busca, filtro por categoria e favoritos são universais.

4. **Temas Sempre Iguais**: Sistema de temas claro/escuro e personalização de cores é universal.

5. **Import/Export Sempre Iguais**: Funcionalidade de backup/restore é universal.

6. **Banco de Dados**: Estrutura base é sempre a mesma. Apenas a tabela principal muda de nome e campos.

7. **Validações**: Adapte apenas as validações específicas do campo principal.

8. **Ações do Card**: Adapte os botões de ação conforme a necessidade do domínio.

---

## RESULTADO ESPERADO

Ao final, você terá uma aplicação web completa e funcional que:

✅ Gerencia uma entidade principal com CRUD completo
✅ Possui sistema de categorias funcional
✅ Tem filtros e busca avançados
✅ Interface responsiva e moderna
✅ Sistema de temas claro/escuro
✅ Personalização de cores
✅ Import/Export de dados
✅ Animações suaves
✅ UX polida e profissional

**E o mais importante**: A estrutura está pronta para ser adaptada para qualquer tipo de dado, mudando apenas:
- Nome da entidade
- Campos específicos
- Validações específicas
- Ações do card

Tudo mais permanece igual e funcional!

---

## PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. Testar todas as funcionalidades
2. Adaptar para o tipo de dado específico (se necessário)
3. Personalizar textos e labels
4. Adicionar campos extras (se necessário)
5. Ajustar validações específicas
6. Personalizar ações do card
7. Adicionar ícone do projeto
8. Documentar o projeto

---

**Este prompt serve como guia completo para criar a estrutura base. Siga cada seção cuidadosamente e você terá uma aplicação robusta e reutilizável!**

