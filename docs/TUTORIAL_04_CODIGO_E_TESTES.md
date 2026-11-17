# Tutorial 4 — Como funciona o código e como testar

## 1. Visão geral

```text
Celular 1: digita título e mensagem
       |
       v
App.js valida os campos
       |
       v
Supabase JS envia INSERT
       |
       v
PostgreSQL armazena em public.notifications
       |
       v
Supabase Realtime anuncia a inserção
       |
       v
Celulares conectados recebem o evento
       |
       v
notificationsHelper.js exibe Alert.alert
```

## 2. `src/services/supabase.js`

Esse arquivo cria a conexão usada pelo resto do aplicativo:

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- `createClient` cria o cliente da API.
- `supabaseUrl` aponta para o projeto.
- `supabaseKey` deve ser uma chave pública.
- `export` disponibiliza a conexão para outros arquivos.

No repositório real, esse arquivo também carrega `react-native-url-polyfill/auto` e lê variáveis de ambiente opcionais.

## 3. `App.js`: estados

```js
const [title, setTitle] = useState('');
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState('🟡 Conectando...');
```

`useState` guarda valores que mudam enquanto o app é usado.

- `title`: título escrito.
- `message`: corpo da mensagem.
- `loading`: indica se está salvando.
- `status`: indica o estado da conexão Realtime.

## 4. `App.js`: inscrição nos eventos

O `useEffect` abre um canal:

```js
const channel = supabase
  .channel('public:notifications')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    ({ new: data }) => {
      if (data?.title && data?.body) {
        triggerLocalNotification(data.title, data.body);
      }
    }
  )
  .subscribe();
```

O que cada parte significa?

- `channel`: canal de comunicação.
- `postgres_changes`: mudanças detectadas no PostgreSQL.
- `INSERT`: somente novos registros.
- `schema: 'public'`: esquema do banco.
- `table: 'notifications'`: tabela monitorada.
- `new: data`: dados do registro recém-inserido.
- `triggerLocalNotification`: exibe o aviso.

O código completo também acompanha o estado de inscrição `SUBSCRIBED` e possíveis falhas. Quando a tela é desmontada, remove o canal para não manter uma escuta desnecessária.

## 5. `App.js`: envio

```js
const cleanTitle = title.trim();
const cleanMessage = message.trim();

if (!cleanTitle || !cleanMessage) {
  return Alert.alert('Atenção', 'Preencha o título e a mensagem.');
}

const { error } = await supabase
  .from('notifications')
  .insert([{ title: cleanTitle, body: cleanMessage }]);
```

- `trim()`: remove espaços no início e no fim.
- `if`: bloqueia campos vazios.
- `from`: escolhe a tabela.
- `insert`: grava o aviso.
- `await`: aguarda a resposta do servidor.

O arquivo completo usa `try/catch/finally` para informar falhas e parar o indicador de carregamento mesmo se houver erro.

## 6. `notificationsHelper.js`

O arquivo mostra o aviso:

```js
Alert.alert(
  `🔔 ${title}`,
  body,
  [{ text: 'OK', style: 'default' }],
  { cancelable: true }
);
```

`Alert.alert` é uma **caixa de diálogo na tela**, não um push do sistema. Por isso o aplicativo precisa estar aberto.

## 7. Roteiro de testes

- [ ] Iniciar o app pelo QR Code.
- [ ] Esperar o status indicar conexão.
- [ ] Tentar enviar campos vazios; deve bloquear.
- [ ] Tentar enviar apenas espaços; deve bloquear.
- [ ] Enviar título e mensagem; deve confirmar.
- [ ] Confirmar nova linha em `public.notifications`.
- [ ] Abrir o app em dois celulares.
- [ ] Enviar de um e receber no outro sem atualizar a tela.
- [ ] Conferir o workflow verde no GitHub Actions.

**Não marque testes de celular como concluídos sem executá-los.**

## 8. Problemas comuns

**Erro `expo is not installed`:**

```bash
npm install
```

**Túnel pede login:**

```bash
npx expo login
```

**Mensagem salva, mas não chega no outro celular:**
- Confira se os dois apps estão abertos.
- Confira se usam o mesmo projeto Supabase.
- Aguarde `SUBSCRIBED`.
- Verifique se `notifications` está habilitada na publicação Realtime.

**Erro de permissão no Supabase:**
- Confirme as políticas de `SELECT` e `INSERT` do exercício.
- Nunca resolva isso expondo chave `service_role`.

**Aviso `npm audit`:**
- Inspecione com `npm audit`.
- Não rode `npm audit fix --force` sem verificar a compatibilidade com o Expo.

## 9. Como explicar o projeto ao professor

O usuário preenche um formulário no React Native. O aplicativo usa o Supabase JS para inserir esses dados no PostgreSQL. Como a tabela participa do Supabase Realtime, cada nova inserção pode ser comunicada aos aplicativos inscritos. O React Native recebe o evento e exibe o título e a mensagem com `Alert.alert`, sem que o usuário atualize a tela.

O GitHub armazena o projeto e o GitHub Actions executa uma validação automática do bundle Android.
