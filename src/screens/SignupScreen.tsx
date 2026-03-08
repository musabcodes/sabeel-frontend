import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export default function SignupScreen({navigation}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/* Ambient glows */}
      <View style={styles.glowTopLeft} />
      <View style={styles.glowBottomRight} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top row: back + logo */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.logoIcon}>
              <Image
                source={require('../assets/sabeellogo.png')}
                style={styles.logoImage}
              />
            </View>
            <Text style={styles.logoWord}>Sabeel</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>
            Create{'\n'}<Text style={styles.headingGreen}>Your Account</Text>
          </Text>
          <Text style={styles.subheading}>Start giving to those near you</Text>

          {/* Form */}
          <View style={styles.form}>

            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.2)"
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Create a password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(v => !v)}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Repeat your password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirm(v => !v)}>
                  <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreed(v => !v)}
              activeOpacity={0.7}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Create account button */}
            <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Create Account</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.btnCircle} activeOpacity={0.7}>
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.btnCircle} activeOpacity={0.7}>
                  <Text style={styles.socialIcon}></Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnCircle} activeOpacity={0.7}>
                <Text style={[styles.socialIcon, {color: '#1877F2'}]}>f</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Sign in link */}
          <View style={styles.bottomLink}>
            <Text style={styles.bottomLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.bottomLinkAction}>Sign in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const GREEN = '#00e676';
const BG = '#0d0d0d';
const CARD = '#1c1c1e';

const styles = StyleSheet.create({
  flex: {flex: 1},
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  glowTopLeft: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,200,80,0.12)',
    top: -60,
    left: -60,
  },
  glowBottomRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0,160,60,0.08)',
    bottom: 60,
    right: -60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  backArrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
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
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
    lineHeight: 38,
    marginBottom: 6,
  },
  headingGreen: {
    color: GREEN,
  },
  subheading: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 28,
    fontWeight: '400',
  },
  form: {
    gap: 14,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    paddingLeft: 4,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 100,
    fontSize: 15,
    color: '#ffffff',
  },
  inputWithIcon: {
    paddingRight: 52,
  },
  eyeBtn: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 17,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  checkmark: {
    color: '#001a0d',
    fontSize: 11,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: GREEN,
    fontWeight: '500',
  },
  btnPrimary: {
    width: '100%',
    paddingVertical: 17,
    backgroundColor: GREEN,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: GREEN,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  btnPrimaryText: {
    color: '#001a0d',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  btnCircle: {
    width: 54,
    height: 54,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  bottomLinkText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
  },
  bottomLinkAction: {
    fontSize: 14,
    color: GREEN,
    fontWeight: '600',
  },
});
