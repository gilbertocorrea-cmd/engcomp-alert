# Tutorial 1 — GitHub e GitHub Actions

## Para que serve?
O Git guarda o histórico do projeto. O GitHub hospeda o repositório. O GitHub Actions verifica automaticamente se o aplicativo consegue gerar o bundle Android.

Repositório: https://github.com/gilbertocorrea-cmd/engcomp-alert

## 1. Clonar o projeto

Abra o terminal do Linux e execute:

```bash
git clone https://github.com/gilbertocorrea-cmd/engcomp-alert.git
cd engcomp-alert
code .
```

- `git clone` baixa o repositório.
- `cd` entra na pasta.
- `code .` abre a pasta atual no VS Code.

Se já tiver clonado, entre na pasta e rode apenas:

```bash
git pull
```

Isso busca alterações publicadas depois do seu clone.

## 2. Entender a estrutura

```text
engcomp-alert/
├── App.js                          # Tela, formulário e eventos
├── src/services/supabase.js        # Conexão com o Supabase
├── src/helper/notificationsHelper.js # Exibição dos alertas
├── supabase/setup.sql              # Criação do banco e políticas
├── .github/workflows/validate.yml  # Validação automática
├── package.json                    # Dependências
├── app.json                        # Configurações do Expo
└── README.md                       # Documentação principal
```

## 3. Publicar alterações

Depois de editar um arquivo, confira o que mudou:

```bash
git status
git diff
```

Se estiver correto, registre e envie:

```bash
git add .
git commit -m "docs: atualizar documentacao"
git push origin main
```

- `add`: seleciona arquivos alterados.
- `commit`: grava uma versão local.
- `push`: envia essa versão ao GitHub.

Atenção: confira o `git status` antes de adicionar arquivos. Nunca envie arquivos `.env` com credenciais privadas.

## 4. Como funciona o GitHub Actions

Abra `.github/workflows/validate.yml`.

O arquivo define um processo que começa após um `push` na branch `main` ou em um pull request. Esse processo:

1. Baixa o código do repositório.
2. Instala Node.js 22.
3. Executa `npm ci`, usando as dependências do `package-lock.json`.
4. Executa `npx expo export --platform android --output-dir /tmp/engcomp-build`.

O comando de exportação verifica se o bundle Android é gerado. **Ele não produz um APK instalável e não testa a tela num celular.**

## 5. Verificar o resultado

1. Abra o repositório no GitHub.
2. Clique em **Actions**.
3. Clique em **Validar aplicativo**.
4. Abra a execução mais recente.
5. Clique nas etapas para ver os logs.

Uma execução concluída com sucesso durante a configuração foi:
https://github.com/gilbertocorrea-cmd/engcomp-alert/actions/runs/44004250259

Se uma etapa ficar vermelha, abra-a e leia a primeira mensagem de erro.

## Resumo

GitHub = guardar e compartilhar o código.
GitHub Actions = executar verificações automáticas sempre que o código muda.
