import React, { useState, useEffect } from 'react';
import { StyleSheet,Text, View, TextInput, Button, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { supabase } from './src/services/supabase';
import { registerForLocalNotificationsAsync, triggerLocalNotification } from './src/helper/notificationsHelper';

// Organizo nesta tela o formulário de envio e o acompanhamento da conexão.
export default function App() {
  // Guardo o título, a mensagem, o carregamento e o status nos estados da tela.
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('🟡 Conectando...');

  // Inicio a escuta quando monto a tela; o array vazio evita repetir a configuração a cada renderização.
  useEffect(() => {
    // Mantenho a chamada do tutorial. Neste helper, retorno true sem pedir permissão ao sistema.
    registerForLocalNotificationsAsync().then((ok) => {
      if (!ok) setStatus('🔴 Sem Permissão de Notificação');
    });

    // Escuto somente novas inserções na tabela notifications do esquema public.
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        // Recebo o registro inserido em new e o chamo de data para acessar seus campos.
        ({ new: data }) => {
          // Exibo o aviso apenas quando encontro título e mensagem no registro.
          if (data?.title && data?.body) {
            triggerLocalNotification(data.title, data.body);
          }
        }
      )
      .subscribe((state) => {
        // Atualizo o texto da tela quando recebo a confirmação da inscrição no canal.
        if (state === 'SUBSCRIBED') {
          setStatus('🟢 Conectado e Escutando Avisos');
        } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
          setStatus('🔴 Falha na conexão. Verifique a internet e o Supabase.');
        } else if (state === 'CLOSED') {
          setStatus('⚪ Conexão encerrada');
        }
      });

    // Removo o canal quando a tela é desmontada para não deixar uma escuta aberta.
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendNotification = async () => {
    // Retiro espaços das extremidades antes de validar e enviar os campos.
    const cleanTitle = title.trim();
    const cleanMessage = message.trim();

    // Interrompo o envio se algum campo estiver vazio, inclusive quando só contém espaços.
    if (!cleanTitle || !cleanMessage) {
      return Alert.alert('Atenção', 'Preencha o título e a mensagem.');
    }

    // Valido o envio, mostro o carregamento e trato falhas de conexão.
    setLoading(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{ title: cleanTitle, body: cleanMessage }]);

      if (error) throw error;
      Alert.alert('Sucesso', 'Notificação transmitida!');
      setTitle('');
      setMessage('');
    } catch (error) {
      Alert.alert('Erro ao enviar', error?.message || 'Não foi possível enviar o aviso.');
    } finally {
      setLoading(false);
    }
  };

  // Uso uma área rolável para reunir o status da conexão e os campos do formulário.
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📡 EngComp Alert (Realtime)</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status do Sistema:</Text>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subHeader}>Área do Coordenador</Text>

        <TextInput
          style={styles.input}
          placeholder="Título (ex: Prova Liberada)"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mensagem (ex: Confira no sistema acadêmico)"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        {/* Durante o envio, substituo o botão por um indicador de carregamento. */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Button title="DISPARAR ALERTA" onPress={sendNotification} />
        )}
      </ScrollView>
    </View>
  );
}

// Centralizo os estilos para organizar as cores, os espaçamentos e os tamanhos da tela.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // Aplico o espaçamento superior do exemplo apenas no Android.
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scroll: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  statusText: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
});
