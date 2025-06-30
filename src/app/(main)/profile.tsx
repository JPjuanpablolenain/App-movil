import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabBar from '../../components/BottomTabBar';
import Header from '../../components/Header';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('more');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const router = useRouter();

  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+54', country: 'AR', flag: '🇦🇷' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+52', country: 'MX', flag: '🇲🇽' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('currentUser');
      const name = await AsyncStorage.getItem('currentUserName');
      const phone = await AsyncStorage.getItem(`phone_${email}`);
      const savedCountryCode = await AsyncStorage.getItem(`countryCode_${email}`);
      const address = await AsyncStorage.getItem(`address_${email}`);
      const regDate = await AsyncStorage.getItem(`regDate_${email}`);
      const savedImage = await AsyncStorage.getItem(`profileImage_${email}`);
      
      if (email) setUserEmail(email);
      if (name) setUserName(name);
      if (phone) setUserPhone(phone);
      if (savedCountryCode) setCountryCode(savedCountryCode);
      if (address) setUserAddress(address);
      if (regDate) setRegistrationDate(regDate);
      if (savedImage) setProfileImage(savedImage);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = async () => {
    try {
      const email = await AsyncStorage.getItem('currentUser');
      
      switch (editingField) {
        case 'name':
          await AsyncStorage.setItem('currentUserName', tempValue);
          setUserName(tempValue);
          break;
        case 'phone':
          await AsyncStorage.setItem(`phone_${email}`, tempValue);
          await AsyncStorage.setItem(`countryCode_${email}`, countryCode);
          setUserPhone(tempValue);
          break;
        case 'email':
          await AsyncStorage.setItem('currentUser', tempValue);
          setUserEmail(tempValue);
          break;
        case 'address':
          await AsyncStorage.setItem(`address_${email}`, tempValue);
          setUserAddress(tempValue);
          break;
      }
      
      setEditingField(null);
      Alert.alert('Success', 'Information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update information');
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be implemented soon');
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      
      try {
        await AsyncStorage.setItem(`profileImage_${userEmail}`, imageUri);
        Alert.alert('Success', 'Profile photo updated!');
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile photo');
      }
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        router.push('/(main)/home');
        break;
      case 'favorites':
        router.push('/(main)/favorites');
        break;
      case 'scan':
        router.push('/(main)/scan');
        break;
      case 'cart':
        router.push('/(main)/cart');
        break;
      case 'more':
        router.push('/(main)/more');
        break;
    }
  };

  const renderPhoneField = () => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name="call" size={20} color="#666" />
        <Text style={styles.fieldLabel}>Phone Number</Text>
      </View>
      {editingField === 'phone' ? (
        <View style={styles.editContainer}>
          <TouchableOpacity 
            style={styles.countryCodeButton}
            onPress={() => setShowCountryPicker(!showCountryPicker)}
          >
            <Text style={styles.countryCodeText}>{countryCode}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            value={tempValue}
            onChangeText={setTempValue}
            keyboardType="phone-pad"
            placeholder="Phone number"
            autoFocus
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingField(null)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.fieldValue} 
          onPress={() => handleEdit('phone', userPhone)}
        >
          <Text style={styles.valueText}>
            {userPhone ? `${countryCode} ${userPhone}` : 'Not set'}
          </Text>
          <Ionicons name="pencil" size={16} color="#999" />
        </TouchableOpacity>
      )}
      {showCountryPicker && editingField === 'phone' && (
        <View style={styles.countryPicker}>
          {countryCodes.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={styles.countryOption}
              onPress={() => {
                setCountryCode(country.code);
                setShowCountryPicker(false);
              }}
            >
              <Text style={styles.countryFlag}>{country.flag}</Text>
              <Text style={styles.countryCode}>{country.code}</Text>
              <Text style={styles.countryName}>{country.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderEditableField = (label: string, value: string, field: string, icon: string) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon as any} size={20} color="#666" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {editingField === field ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={tempValue}
            onChangeText={setTempValue}
            autoFocus
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingField(null)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.fieldValue} 
          onPress={() => handleEdit(field, value)}
        >
          <Text style={styles.valueText}>{value || 'Not set'}</Text>
          <Ionicons name="pencil" size={16} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.emptyHeader}>
          <Text style={styles.headerTitle}>Profile settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : require('../../assets/images/icon.png')}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity style={styles.editPhotoButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderEditableField('Full Name', userName, 'name', 'person')}
          {renderEditableField('Email', userEmail, 'email', 'mail')}
          {renderPhoneField()}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          {renderEditableField('Main Address', userAddress, 'address', 'location')}
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <Ionicons name="lock-closed" size={20} color="#666" />
            <Text style={styles.menuItemText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>{registrationDate || 'Recently'}</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications" size={20} color="#666" />
            <Text style={styles.menuItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="language" size={20} color="#666" />
            <Text style={styles.menuItemText}>Language</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerSafeArea: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  emptyHeader: {
    height: 80,
    paddingTop: 45,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  photoSection: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: 'green',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#666',
  },
  fieldValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#333',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 80,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  countryPicker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 200,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    minWidth: 50,
  },
  countryName: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
});