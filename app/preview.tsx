import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildPreviewHtml } from '../src/buildPreviewHtml';

export default function PreviewScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  if (!code) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No code to preview.</Text>
      </View>
    );
  }

  const html = buildPreviewHtml(code);

  return (
    <WebView
      style={styles.webview}
      source={{ html }}
      originWhitelist={['*']}
      javaScriptEnabled
      mixedContentMode="always"
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1117',
  },
  errorText: {
    color: '#e6edf3',
    fontSize: 16,
  },
});
