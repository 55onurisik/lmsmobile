import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { useNavigation } from '@react-navigation/native';

const classLevels = ['9', '10', '11', '12', 'Mezun'];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { submit, loading, error } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    class_level: '',
    schedule_day: '',
    schedule_time: '',
  });

  const handleSubmit = async () => {
    try {
      const response = await submit(formData);
      Alert.alert(
        'Başarılı',
        'Kayıt talebiniz başarıyla alındı. Onay bekleniyor.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err) {
      // Error is already handled by the hook
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Kayıt Ol</Text>

        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefon"
          value={formData.phone}
          onChangeText={(text) => updateFormData('phone', text)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={formData.password}
          onChangeText={(text) => updateFormData('password', text)}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre Tekrar"
          value={formData.password_confirmation}
          onChangeText={(text) => updateFormData('password_confirmation', text)}
          secureTextEntry
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Sınıf Seviyesi</Text>
          <View style={styles.classLevelContainer}>
            {classLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.classLevelButton,
                  formData.class_level === level && styles.classLevelButtonActive,
                ]}
                onPress={() => updateFormData('class_level', level)}
              >
                <Text
                  style={[
                    styles.classLevelText,
                    formData.class_level === level && styles.classLevelTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Program Günü (Opsiyonel)"
          value={formData.schedule_day}
          onChangeText={(text) => updateFormData('schedule_day', text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Program Saati (Opsiyonel)"
          value={formData.schedule_time}
          onChangeText={(text) => updateFormData('schedule_time', text)}
        />

        {error && (
          <Text style={styles.errorText}>
            {error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.'}
          </Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Zaten hesabınız var mı? Giriş yapın
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  classLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  classLevelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  classLevelButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  classLevelText: {
    color: '#333',
  },
  classLevelTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 