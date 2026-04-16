import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const PLACEHOLDER = `// Paste your JSX component here
function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#7c3aed' }}>Hello from JSX Viewer!</h1>
      <p>Edit this code and tap <strong>Run</strong> to preview.</p>
    </div>
  );
}`;

export default function EditorScreen() {
  const [code, setCode] = useState(PLACEHOLDER);
  const [fileName, setFileName] = useState<string | null>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const name = asset.name ?? 'file';

      if (!name.endsWith('.jsx') && !name.endsWith('.tsx') && !name.endsWith('.js')) {
        Alert.alert('Unsupported file', 'Please select a .jsx, .tsx, or .js file.');
        return;
      }

      const content = await FileSystem.readAsStringAsync(asset.uri);
      setCode(content);
      setFileName(name);
    } catch {
      Alert.alert('Error', 'Failed to read file.');
    }
  };

  const runCode = () => {
    if (!code.trim()) {
      Alert.alert('Empty', 'Nothing to preview.');
      return;
    }
    router.push({ pathname: '/preview', params: { code } });
  };

  const clearCode = () => {
    setCode('');
    setFileName(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.btnSecondary} onPress={pickFile}>
          <Text style={styles.btnSecondaryText}>Import File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={clearCode}>
          <Text style={styles.btnSecondaryText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={runCode}>
          <Text style={styles.btnPrimaryText}>Run</Text>
        </TouchableOpacity>
      </View>

      {fileName && (
        <View style={styles.fileTag}>
          <Text style={styles.fileTagText}>{fileName}</Text>
        </View>
      )}

      {/* Editor */}
      <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.editor}
          multiline
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          placeholder="Paste JSX here…"
          placeholderTextColor="#484f58"
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#21262d',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  btnSecondaryText: {
    color: '#e6edf3',
    fontWeight: '600',
    fontSize: 15,
  },
  fileTag: {
    backgroundColor: '#161b22',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  fileTagText: {
    color: '#8b949e',
    fontSize: 12,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
  },
  editorScroll: {
    flex: 1,
  },
  editor: {
    flex: 1,
    minHeight: 600,
    color: '#e6edf3',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
    padding: 16,
  },
});
