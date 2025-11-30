# Problema: Banco de Dados Não Persiste no Render

## 🔍 Diagnóstico

O SQLite **deve** persistir, mas no Render ele precisa estar salvo no **Persistent Disk**. Se o banco estiver sendo criado em um local temporário, os dados serão perdidos quando o serviço reiniciar.

## ✅ Solução

### 1. Verificar Persistent Disk no Render

1. Acesse o dashboard do serviço no Render
2. Vá em **Settings** → **Disks**
3. **DEVE existir** um disk com:
   - **Name**: `easylink-db` (ou similar)
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: 1GB (ou mais)

**⚠️ Se NÃO existir o Persistent Disk, você precisa criar:**

1. Clique em **"Add Disk"**
2. Configure:
   - **Name**: `easylink-db`
   - **Mount Path**: `/opt/render/project/src/backend/data`
   - **Size**: `1` GB
3. Salve

### 2. Verificar Variável DB_PATH

1. Vá em **Settings** → **Environment**
2. Procure pela variável `DB_PATH`
3. **DEVE estar** como: `/opt/render/project/src/backend/data/easylink.db`

**⚠️ Se estiver diferente ou não existir:**

1. Adicione/Edite a variável:
   - **Key**: `DB_PATH`
   - **Value**: `/opt/render/project/src/backend/data/easylink.db`
2. Salve

### 3. Verificar Logs

Após fazer as correções acima, verifique os logs:

1. Vá em **Logs** no dashboard
2. Procure por:
   - `DB_PATH configurado: /opt/render/project/src/backend/data/easylink.db`
   - `Conectado ao banco de dados SQLite em: /opt/render/project/src/backend/data/easylink.db`

**Se aparecer um caminho diferente** (como `/tmp` ou `/opt/render/project/src/backend/dist/data/`), o problema é o DB_PATH.

## 🚨 Problemas Comuns

### Problema 1: Persistent Disk não criado
**Sintoma**: Dados são perdidos após reiniciar
**Solução**: Criar o Persistent Disk conforme passo 1

### Problema 2: DB_PATH apontando para local errado
**Sintoma**: Logs mostram caminho diferente de `/opt/render/project/src/backend/data/`
**Solução**: Corrigir DB_PATH conforme passo 2

### Problema 3: Persistent Disk montado em local diferente
**Sintoma**: Disk existe mas mountPath é diferente
**Solução**: 
- Opção A: Ajustar DB_PATH para o mountPath do disk
- Opção B: Recriar o disk com o mountPath correto

## 📋 Checklist

- [ ] Persistent Disk criado e montado em `/opt/render/project/src/backend/data`
- [ ] Variável `DB_PATH` configurada como `/opt/render/project/src/backend/data/easylink.db`
- [ ] Logs mostram o caminho correto do banco
- [ ] Teste: Criar um link, reiniciar o serviço, verificar se o link ainda existe

## 🔄 Após Corrigir

1. Faça um **Manual Deploy** no Render (para garantir que as variáveis sejam aplicadas)
2. Aguarde o deploy terminar
3. Teste criando um link
4. Aguarde 5 minutos
5. Recarregue a página
6. Verifique se o link ainda está lá

Se ainda não persistir, me envie:
- Screenshot da configuração do Persistent Disk
- Screenshot da variável DB_PATH
- Logs do servidor (especialmente as linhas sobre DB_PATH)


