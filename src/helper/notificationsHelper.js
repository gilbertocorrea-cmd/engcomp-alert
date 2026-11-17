// Reúno neste arquivo as funções que uso para exibir os avisos dentro do aplicativo.
import { Alert } from 'react-native';

// Mantenho a constante do tutorial, embora eu não a utilize no App.js desta versão.
export const isExpoGo = true;

// Retorno true porque uso alertas em tela, que não exigem permissão de notificação.
// Preservo a função assíncrona para manter a chamada usada no App.js.
export async function registerForLocalNotificationsAsync() {
  return true;
}

// Recebo o título e a mensagem e mostro uma caixa de diálogo com o aplicativo aberto.
// Uso Alert.alert; por isso, não envio notificações push ou avisos em segundo plano.
export async function triggerLocalNotification(title, body) {
  try {
    Alert.alert(
      `🔔 ${title}`,
      body,
      [{ text: 'OK', style: 'default' }],
      { cancelable: true }
    );
  } catch (error) {
    // Registro no console um erro que ocorra durante a chamada de exibição do aviso.
    console.error('Erro ao exibir aviso:', error);
  }
}
