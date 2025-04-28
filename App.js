// App.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authAPI, profileAPI } from './src/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const windowWidth = Dimensions.get('window').width;

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login({ email, password });
      const token = res.data.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        navigation.replace('Profile');
      } else {
        setError('Giriş başarısız. Lütfen tekrar deneyin');
      }
    } catch (e) {
      if (e.response?.status === 401) setError('E-posta veya şifre hatalı');
      else if (e.response?.data?.message) setError(e.response.data.message);
      else if (e.message === 'Network Error') setError('Sunucuya bağlanılamıyor');
      else setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.container}>
            {/* logo + uygulama başlığı */}
            <View style={styles.logoContainer}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.logo} />
              <Text style={styles.appTitle}>EduConnect</Text>
              <Text style={styles.appSubtitle}>Eğitim Yönetim Sistemi</Text>
            </View>
            {/* form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#ccd0d5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff4d4f" />
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity style={styles.forgotPassword} onPress={()=>navigation.navigate('ResetPassword')}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Giriş Yap</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={()=>navigation.navigate('AdminLogin')}>
                <Text style={styles.secondaryButtonText}>Yönetici Girişi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={()=>navigation.navigate('Register')}>
                <Text style={styles.secondaryButtonText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.adminLogin({ email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('adminToken', response.data.token);
        navigation.replace('AdminDashboard');
      } else {
        setError('Giriş başarısız. Lütfen tekrar deneyin');
      }
    } catch (error) {
      if (error.response?.status === 401) setError('E-posta veya şifre hatalı');
      else if (error.response?.data?.message) setError(error.response.data.message);
      else if (error.message === 'Network Error') setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin');
      else setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.logo} />
              <Text style={styles.appTitle}>Admin Panel</Text>
              <Text style={styles.appSubtitle}>Yönetici Girişi</Text>
            </View>
            <View style={styles.formContainer}>
              {/* email & şifre input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#ccd0d5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff4d4f" />
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleAdminLogin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Giriş Yap</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={()=>navigation.goBack()}>
                <Text style={styles.secondaryButtonText}>Geri Dön</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword
      });
      const token = res.data.token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        navigation.replace('Profile');
      } else {
        setError('Kayıt sırasında hata oluştu');
      }
    } catch (e) {
      setError(e.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff"/>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Yeni Hesap Oluştur</Text>
              <Text style={styles.headerSubtitle}>Bilgilerinizi girerek kayıt olun</Text>
            </View>
            <View style={styles.formContainer}>
              {/* ad, email, şifre inputları */}
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor="#ccd0d5"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#ccd0d5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff4d4f"/>
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Kayıt Ol</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.textLink} onPress={()=>navigation.goBack()}>
                <Text style={styles.textLinkContent}>Zaten hesabınız var mı? Giriş yapın</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    if (!email || !password || !passwordConfirmation) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Şifreler eşleşmiyor');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const tokenRes = await authAPI.getResetToken(email);
      const token = tokenRes.data.token;
      await authAPI.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess('Şifreniz başarıyla sıfırlandı');
      setTimeout(()=>navigation.navigate('Login'), 2000);
    } catch (e) {
      if (e.response?.status === 401) setError('Geçersiz e-posta');
      else if (e.response?.data?.message) setError(e.response.data.message);
      else setError('Şifre sıfırlama başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff"/>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Şifre Sıfırlama</Text>
              <Text style={styles.headerSubtitle}>Yeni şifrenizi belirleyin</Text>
            </View>
            <View style={styles.formContainer}>
              {/* email + yeni şifre input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#ccd0d5"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre Tekrar"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff4d4f"/>
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}
              {success ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={18} color="#4caf50"/>
                  <Text style={styles.success}>{success}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Şifreyi Sıfırla</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await profileAPI.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      if (response.data.message === 'Password updated successfully') {
        setSuccess('Şifre başarıyla değiştirildi');
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        setError('Şifre değiştirme başarısız');
      }
    } catch (error) {
      if (error.response?.status === 401) setError('Mevcut şifre hatalı');
      else if (error.response?.data?.message) setError(error.response.data.message);
      else if (error.message === 'Network Error') setError('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin');
      else setError('Şifre değiştirme başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.gradientBackground}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?"padding":"height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff"/>
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Şifre Değiştir</Text>
              <Text style={styles.headerSubtitle}>Mevcut ve yeni şifrenizi girin</Text>
            </View>
            <View style={styles.formContainer}>
              {/* mevcut + yeni şifre input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Mevcut Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#fff" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre Tekrar"
                  placeholderTextColor="#ccd0d5"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff4d4f"/>
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}
              {success ? (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={18} color="#4caf50"/>
                  <Text style={styles.success}>{success}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.disabledButton]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Şifreyi Değiştir</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUser = async () => {
    try {
      const res = await authAPI.getUser();
      console.log('User data:', res.data);
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (error) {
      console.log('User load error:', error);
      setError('Kullanıcı yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const handleUpdateProfile = async () => {
    try {
      setError('');
      setSuccess('');
      const res = await profileAPI.update({ name, email });
      setSuccess('Profil güncellendi');
      setEditing(false);
      loadUser();
    } catch (error) {
      setError(error.response?.data?.message || 'Güncelleme başarısız');
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f"/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.profileSafeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4c669f"/>
      <View style={styles.profileHeader}>
        <LinearGradient colors={['#4c669f','#3b5998','#192f6a']} style={styles.profileHeaderGradient}>
          <View style={styles.profileHeaderContent}>
            <Image
              source={{ uri: user?.profile_photo_url || 'https://via.placeholder.com/150' }}
              style={styles.avatarImage}
            />
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </LinearGradient>
      </View>
      <ScrollView style={styles.profileContent} keyboardShouldPersistTaps="handled">
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Text style={styles.infoCardTitle}>Kişisel Bilgiler</Text>
            <TouchableOpacity style={styles.editButton} onPress={()=>setEditing(!editing)}>
              <Ionicons name={editing?'close':'pencil'} size={16} color="#4c669f"/>
              <Text style={styles.editButtonText}>{editing?'İptal':'Düzenle'}</Text>
            </TouchableOpacity>
          </View>
          {editing ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#4c669f" style={styles.inputIcon}/>
                <TextInput style={styles.input} value={name} onChangeText={setName}/>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#4c669f" style={styles.inputIcon}/>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={20} color="#4c669f" style={styles.infoIcon}/>
                <View>
                  <Text style={styles.infoLabel}>Ad Soyad</Text>
                  <Text style={styles.infoValue}>{user?.name}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="mail-outline" size={20} color="#4c669f" style={styles.infoIcon}/>
                <View>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.primaryButton} onPress={()=>navigation.navigate('ChangePassword')}>
            <Text style={styles.buttonText}>Şifre Değiştir</Text>
          </TouchableOpacity>
        </View>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color="#ff4d4f"/>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
        {success ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#4caf50"/>
            <Text style={styles.success}>{success}</Text>
          </View>
        ) : null}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4d4f" style={styles.logoutIcon}/>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  /* Mevcut style'larınız aynen korunuyor */
  gradientBackground:{flex:1},
  safeArea:{flex:1},
  keyboardView:{flex:1},
  container:{flexGrow:1,padding:24,alignItems:'center',justifyContent:'center'},
  logoContainer:{alignItems:'center',marginBottom:40},
  logo:{width:100,height:100,borderRadius:50,marginBottom:16,borderWidth:3,borderColor:'rgba(255,255,255,0.5)'},
  appTitle:{fontSize:28,fontWeight:'700',color:'#fff',marginBottom:8},
  appSubtitle:{fontSize:16,color:'rgba(255,255,255,0.8)'},
  formContainer:{width:'100%',maxWidth:350},
  inputContainer:{flexDirection:'row',alignItems:'center',backgroundColor:'#f5f5f5',borderRadius:8,marginBottom:12,paddingHorizontal:12},
  inputIcon:{marginRight:12},
  input:{flex:1,height:48,fontSize:16},
  errorContainer:{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,77,79,0.1)',padding:12,borderRadius:8,marginBottom:16},
  error:{color:'#ff4d4f',marginLeft:8,flex:1},
  forgotPassword:{alignSelf:'flex-end',marginBottom:24},
  forgotPasswordText:{color:'rgba(255,255,255,0.8)',fontSize:14},
  primaryButton:{backgroundColor:'#1a73e8',borderRadius:10,height:56,justifyContent:'center',alignItems:'center',marginBottom:16},
  disabledButton:{opacity:0.7},
  buttonText:{color:'#fff',fontSize:16,fontWeight:'600'},
  secondaryButton:{borderWidth:1,borderColor:'rgba(255,255,255,0.5)',borderRadius:10,height:56,justifyContent:'center',alignItems:'center'},
  secondaryButtonText:{color:'#fff',fontSize:16,fontWeight:'600'},
  backButton:{position:'absolute',top:16,left:16,zIndex:10},
  headerContainer:{alignItems:'center',marginBottom:40},
  headerTitle:{fontSize:24,fontWeight:'700',color:'#fff',marginBottom:8},
  headerSubtitle:{fontSize:14,color:'rgba(255,255,255,0.8)',textAlign:'center'},
  textLink:{alignItems:'center',marginTop:16},
  textLinkContent:{color:'rgba(255,255,255,0.8)',fontSize:14},
  loadingContainer:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f5f5f5'},
  profileSafeArea:{flex:1,backgroundColor:'#f5f5f5'},
  profileHeader:{height:200},
  profileHeaderGradient:{height:'100%',justifyContent:'center',alignItems:'center'},
  profileHeaderContent:{alignItems:'center'},
  avatarImage:{width:100,height:100,borderRadius:50,borderWidth:4,borderColor:'rgba(255,255,255,0.4)'},
  profileName:{fontSize:20,fontWeight:'700',color:'#fff',marginBottom:4},
  profileEmail:{fontSize:14,color:'rgba(255,255,255,0.8)'},
  profileContent:{flex:1,padding:16},
  infoCard:{backgroundColor:'#fff',borderRadius:12,padding:16,marginBottom:16},
  infoCardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16,borderBottomWidth:1,borderBottomColor:'#f0f0f0',paddingBottom:8},
  infoCardTitle:{fontSize:16,fontWeight:'600',color:'#333'},
  editButton:{flexDirection:'row',alignItems:'center'},
  editButtonText:{marginLeft:4,color:'#4c669f',fontSize:14},
  infoItem:{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#f0f0f0'},
  infoIcon:{marginRight:16},
  infoLabel:{fontSize:12,color:'#7d7d7d',marginBottom:2},
  infoValue:{fontSize:14,color:'#333'},
  saveButton:{backgroundColor:'#4c669f',padding:12,borderRadius:8,alignItems:'center',marginTop:8},
  saveButtonText:{color:'#fff',fontSize:16,fontWeight:'600'},
  successContainer:{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(76,175,80,0.1)',padding:12,borderRadius:8,marginBottom:16},
  success:{color:'#4caf50',marginLeft:8,flex:1},
  logoutButton:{flexDirection:'row',alignItems:'center',paddingVertical:16,marginTop:8},
  logoutIcon:{marginRight:16},
  logoutText:{fontSize:14,color:'#ff4d4f',fontWeight:'500'},
});
