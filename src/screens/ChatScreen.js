import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const { isAuthenticated, authStudent } = useAuth();

  const fetchMessages = async () => {
    try {
      const response = await client.get('/chat');
      console.log('Fetched messages:', response.data);
      
      if (response.data?.success && Array.isArray(response.data.messages)) {
        // ID'si olmayan mesajları filtrele
        const validMessages = response.data.messages.filter(msg => msg?.id != null);
        setMessages(validMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Polling sırasında hata olursa sessizce devam et
      if (loading) {
        Alert.alert('Hata', 'Mesajlar yüklenirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Polling için useEffect
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages(); // İlk yükleme

      const interval = setInterval(fetchMessages, 1000); // 5 saniyede bir güncelle
      
      // Component unmount olduğunda interval'i temizle
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const sendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText || sending) return;

    // Optimistic update için yeni mesaj objesi
    const optimisticMessage = {
      id: Date.now(),
      message: messageText,
      sender_id: authStudent?.id,
      sender_type: 'App\\Models\\Student',
      receiver_id: 1,
      receiver_type: 'App\\Models\\User',
      created_at: new Date().toISOString()
    };

    try {
      setSending(true);
      
      // Önce mesajı state'e ekle
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      setNewMessage(''); // Input'u temizle
      flatListRef.current?.scrollToEnd({ animated: true });

      // Sonra API'ye gönder
      const response = await client.post('/chat/send', {
        message: messageText,
        receiver_id: 1,
        receiver_type: 'App\\Models\\User',
        sender_type: 'App\\Models\\Student'
      });

      console.log('Send response:', response.data);

      if (response.data?.success && response.data.id) {
        // API yanıtı başarılıysa, geçici mesajı güncelle
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === optimisticMessage.id 
              ? { ...msg, id: response.data.id }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Send error:', error);
      Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu.');
      
      // Hata durumunda geçici mesajı kaldır
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== optimisticMessage.id)
      );
      
      // Mesajı input'a geri koy
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (message) => {
    return (
      message?.sender_type === 'App\\Models\\Student' &&
      message?.sender_id === authStudent?.id
    );
  };

  const renderMessage = ({ item, index }) => {
    if (!item?.id) return null;

    const messageIsMine = isMyMessage(item);
    const senderName = item.sender_type === 'App\\Models\\Student' ? 'Öğrenci' : 'Öğretmen';
    console.log('Rendering message:', item);

    return (
      <View style={styles.messageWrapper}>
        <View style={[
          styles.messageContainer,
          messageIsMine ? styles.myMessage : styles.otherMessage,
        ]}>
          <Text style={styles.senderName}>
            {senderName}:
          </Text>
          <View style={[
            styles.messageBubble,
            messageIsMine ? styles.myMessageBubble : styles.otherMessageBubble
          ]}>
            <Text 
              style={[
                styles.messageText,
                messageIsMine ? styles.myMessageText : styles.otherMessageText
              ]}
              numberOfLines={0}
            >
              {item.message || ''}
            </Text>
          </View>
          <Text style={styles.messageTime}>
            {item.created_at ? new Date(item.created_at).toLocaleString('tr-TR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz mesaj yok</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Öğretmen ile Sohbet</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item?.id?.toString() ?? index.toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={renderEmptyList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Mesajınızı yazın..."
          multiline
          maxLength={500}
          editable={!sending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Gönder</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? 50 : 0, // iPhone için üstten padding
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: Platform.OS === 'ios' ? 20 : 15, // iPhone için header padding
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  messageWrapper: {
    marginVertical: 5,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 2,
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // iPhone için alt padding
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ChatScreen; 