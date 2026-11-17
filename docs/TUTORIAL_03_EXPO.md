# Tutorial 3 — Expo e Expo Go no celular

## 1. Qual é a função de cada ferramenta?

- **React Native**: biblioteca para criar telas mobile com JavaScript e React.
- **Expo**: ferramentas para desenvolver e executar apps React Native.
- **Metro Bundler**: prepara o JavaScript durante o desenvolvimento.
- **Expo Go**: aplicativo que abre o projeto no celular sem gerar um APK primeiro.

## 2. Preparar o Linux

Abra o terminal e verifique:

```bash
node -v
npm -v
git --version
```

Se ainda não baixou o projeto:

```bash
git clone https://github.com/gilbertocorrea-cmd/engcomp-alert.git
cd engcomp-alert
```

Se já clonou, entre na pasta e atualize:

```bash
cd engcomp-alert
git pull
```

## 3. Instalar as dependências

```bash
npm install
```

O comando lê `package.json` e instala os pacotes na pasta local `node_modules`.

Esse passo é necessário após clonar: o Git não guarda as dependências instaladas.

### Erro que apareceu durante a configuração

```text
Cannot determine the project's Expo SDK version because the module 'expo' is not installed
```

Significa que a dependência `expo` ainda não estava instalada na pasta. A correção foi `npm install`.

## 4. Conta Expo

Site: https://expo.dev/signup

Se ainda não tiver conta, crie uma. Depois, no terminal:

```bash
npx expo login
```

Faça login com sua conta.

### Segundo erro da configuração

```text
Couldn't create a signed tunnel URL for this project.
You're not logged in to your Expo account.
```

O túnel precisava da sessão Expo. Depois do login, o comando de inicialização funcionou.

## 5. Gerar o QR Code

Na pasta do aplicativo:

```bash
npx expo start --tunnel
```

O Expo inicia o Metro Bundler e exibe um **QR Code no próprio terminal**.

O QR Code não é obtido no GitHub nem no Supabase.

Mantenha esse terminal aberto durante o teste.

## 6. Abrir no celular

1. Instale **Expo Go** no celular.
2. Abra o Expo Go.
3. Use a função de leitura de QR Code.
4. Escaneie o QR Code do terminal.
5. Espere o aplicativo carregar.

Na tela, confira a mensagem **Conectado e Escutando Avisos**.

## 7. Enviar um aviso

Na tela do EngComp Alert:

1. Digite um título, como `Mudança de sala`.
2. Digite uma mensagem, como `A aula será na sala 12`.
3. Toque em **DISPARAR ALERTA**.
4. Verifique a confirmação de envio.
5. Confira a nova linha no Supabase.

O app só envia após validar se os campos não estão vazios.

## 8. Testar o recebimento

1. Abra o projeto no Expo Go de **dois celulares**.
2. Aguarde a conexão Realtime em ambos.
3. Envie uma mensagem no primeiro.
4. Veja se o segundo exibe o alerta automaticamente.

O objetivo do PDF é exibir avisos **com o app aberto**. Não são notificações push do Android ou iOS.

## 9. Outros comandos úteis

```bash
npx expo start
```

Inicia normalmente, geralmente na rede local.

```bash
npx expo start --tunnel
```

Inicia por túnel, útil quando a rede local não permite conexão direta.

```bash
npx expo start --clear
```

Inicia limpando o cache, útil quando mudanças não aparecem.

Para encerrar o servidor, pressione `Ctrl+C` no terminal.

## 10. Expo Go não é publicação em loja

- **Expo Go:** testa o projeto no celular.
- **Exportação de bundle:** verifica os arquivos do JavaScript para a plataforma.
- **APK:** pacote instalável no Android, exige processo de build apropriado.
- **Google Play / App Store:** publicação em loja, não foi feita nesta atividade.

O projeto foi validado automaticamente com exportação de bundle Android pelo GitHub Actions, não com um APK final.
