// Carrego a compatibilidade de URLs utilizada na integração com o React Native.
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Preencho estes valores com a URL e a chave anon pública do meu projeto no Supabase.
// Consulto esses dados no painel, em Project Settings > API.
// Ainda mantenho os exemplos abaixo; preciso substituí-los antes de executar o app.
const supabaseUrl = 'SUA_URL_DO_SUPABASE';
const supabaseKey = 'SUA_CHAVE_ANON_PUBLICA';

// Crio uma conexão compartilhada para enviar os avisos e escutar os eventos do banco.
export const supabase = createClient(supabaseUrl, supabaseKey);
