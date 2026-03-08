import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PostalCode'>;
};

const CITIES = [
  {label: 'Ottawa', flag: '🇨🇦'},
  {label: 'Toronto', flag: '🇨🇦'},
  {label: 'Montreal', flag: '🇨🇦'},
  {label: 'Vancouver', flag: '🇨🇦'},
  {label: 'Calgary', flag: '🇨🇦'},
  {label: 'Edmonton', flag: '🇨🇦'},
  {label: 'Winnipeg', flag: '🇨🇦'},
  {label: 'Mississauga', flag: '🇨🇦'},
  {label: 'Brampton', flag: '🇨🇦'},
  {label: 'Hamilton', flag: '🇨🇦'},
  {label: 'New York', flag: '🇺🇸'},
  {label: 'Chicago', flag: '🇺🇸'},
  {label: 'Detroit', flag: '🇺🇸'},
  {label: 'Dearborn', flag: '🇺🇸'},
  {label: 'Houston', flag: '🇺🇸'},
  {label: 'Los Angeles', flag: '🇺🇸'},
];

export default function PostalCodeScreen({navigation}: Props) {
  const [city, setCity] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (label: string) => {
    setCity(label);
    setError('');
    setOpen(false);
  };

  const handleContinue = () => {
    if (!city) {
      setError('Please select a city');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Map', {city});
    }, 600);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/* Ambient glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Image
              source={require('../assets/sabeellogo.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.logoWord}>Sabeel</Text>
        </View>

        {/* Icon */}
        <View style={styles.mapIconWrap}>
          <Text style={styles.mapEmoji}>📍</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Where are{'\n'}<Text style={styles.headingGreen}>you located?</Text>
        </Text>
        <Text style={styles.subheading}>
          We'll find masajid and charities near you
        </Text>

        {/* Dropdown trigger */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TouchableOpacity
            style={[styles.dropdown, error ? styles.dropdownError : null]}
            onPress={() => setOpen(true)}
            activeOpacity={0.8}>
            {city ? (
              <View style={styles.dropdownSelected}>
                <Text style={styles.dropdownFlag}>
                  {CITIES.find(c => c.label === city)?.flag}
                </Text>
                <Text style={styles.dropdownValue}>{city}</Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>Select your city...</Text>
            )}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#001a0d" />
          ) : (
            <Text style={styles.btnText}>Find Nearby Masajid</Text>
          )}
        </TouchableOpacity>

        {/* Use location */}
        <TouchableOpacity style={styles.locationBtn} activeOpacity={0.7}>
          <Text style={styles.locationIcon}>🌐</Text>
          <Text style={styles.locationText}>Use my current location instead</Text>
        </TouchableOpacity>

      </View>

      {/* Bottom sheet modal */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.sheetTitle}>Select City</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {CITIES.map((item, index) => {
              const selected = city === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.option,
                    selected && styles.optionSelected,
                    index < CITIES.length - 1 && styles.optionBorder,
                  ]}
                  onPress={() => handleSelect(item.label)}
                  activeOpacity={0.7}>
                  <Text style={styles.optionFlag}>{item.flag}</Text>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
            <View style={styles.sheetBottom} />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const GREEN = '#00e676';
const BG = '#0d0d0d';
const CARD = '#1c1c1e';
const SHEET = '#1a1a1a';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  glowTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0,200,80,0.12)',
    top: -80,
    right: -60,
  },
  glowBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0,160,60,0.08)',
    bottom: 80,
    left: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoWord: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  mapIconWrap: {
    width: 72,
    height: 72,
    backgroundColor: CARD,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0,230,118,0.15)',
  },
  mapEmoji: {
    fontSize: 36,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 8,
  },
  headingGreen: {
    color: GREEN,
  },
  subheading: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 36,
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    paddingLeft: 4,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 100,
  },
  dropdownError: {
    borderColor: '#ff4444',
  },
  dropdownSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownFlag: {
    fontSize: 18,
  },
  dropdownValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.2)',
  },
  chevron: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.3)',
    transform: [{rotate: '90deg'}],
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    paddingLeft: 4,
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: GREEN,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#001a0d',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: SHEET,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '72%',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    paddingLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 4,
    gap: 14,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  optionSelected: {
    // subtle highlight handled by text color
  },
  optionFlag: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
  },
  optionLabelSelected: {
    color: GREEN,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: GREEN,
    fontWeight: '700',
  },
  sheetBottom: {
    height: 24,
  },
});
