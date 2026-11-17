import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Expo carrega variáveis EXPO_PUBLIC_ do arquivo .env local.
// Use apenas a chave pública (publishable/anon); nunca a service_role.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase não configurado. Preencha o arquivo .env conforme .env.example.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
