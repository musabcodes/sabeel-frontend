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
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};


export default function LoginScreen({navigation}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/* Ambient glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Logo row */}
          <View style={styles.topRow}>
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
            Sign in to{'\n'}<Text style={styles.headingGreen}>Your Account</Text>
          </Text>
          <Text style={styles.subheading}>Give to those near you</Text>

          {/* Form */}
          <View style={styles.form}>

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
                  placeholder="Enter your password"
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

            {/* Remember / Forgot */}
            <View style={styles.rowOptions}>
              <Text style={styles.rememberText}>Remember me</Text>
              <TouchableOpacity>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign in button */}
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PostalCode')}>
              <Text style={styles.btnPrimaryText}>Sign in</Text>
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

          {/* Sign up link */}
          <View style={styles.bottomLink}>
            <Text style={styles.bottomLinkText}>Don't have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.bottomLinkAction}>Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  glowTopRight: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,200,80,0.13)',
    top: -80,
    right: -80,
  },
  glowBottomLeft: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0,160,60,0.08)',
    bottom: 60,
    left: -80,
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
    marginBottom: 36,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoWord: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
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
    fontWeight: '400',
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    paddingLeft: 4,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    paddingVertical: 16,
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
    fontSize: 18,
  },
  rowOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  rememberText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  forgotLink: {
    fontSize: 13,
    color: GREEN,
    fontWeight: '500',
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
    marginVertical: 4,
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
    marginVertical: 4,
  },
  btnCircle: {
    width: 56,
    height: 56,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
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
    paddingTop: 32,
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
