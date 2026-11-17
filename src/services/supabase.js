import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// URL e chave pública do projeto de demonstração.
// A chave de administração do banco nunca deve ser usada no aplicativo.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://cvtiuijumodtagxlgjav.supabase.co';

const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_w3aPVNu-GE9aJ-xvVTTqEQ_d9JecO1m';

export const supabase = createClient(supabaseUrl, supabaseKey);
