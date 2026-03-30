import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// MODERN DARK THEME COLORS
const COLORS = {
  bg: '#020617',
  textDark: '#ffffff',
  textGrey: '#94a3b8',
  primary: '#22c55e', // Yeşil (Ana Butonlar)
  accent: '#E9C46A',  // Sarı (Seçili Kartlar)
  cardBg: '#0f172a',
  border: '#1e293b',
  buttonGrey: '#334155',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // KULLANICI SEÇİMLERİ (State)
  const [selectedTraveler, setSelectedTraveler] = useState('couple');
  const [selectedTripType, setSelectedTripType] = useState('culture');
  const [durationValue, setDurationValue] = useState(1);
  const [budget, setBudget] = useState('mid');
  const [transport, setTransport] = useState('walk');

  // VERİ SETLERİ
  const travelers = [
    { id: 'solo', label: 'YALNIZ', icon: 'account' },
    { id: 'couple', label: 'EŞ/SEVGİLİ', icon: 'heart' },
    { id: 'family', label: 'AİLE', icon: 'account-group' },
    { id: 'friends', label: 'ARKADAŞLAR', icon: 'account-multiple' },
  ];

  const tripTypes = [
    { id: 'culture', label: 'KÜLTÜR', icon: 'bank' },
    { id: 'nature', label: 'DOĞA', icon: 'tree' },
    { id: 'fun', label: 'EĞLENCE', icon: 'party-popper' },
    { id: 'food', label: 'YEMEK', icon: 'food' },
  ];

  const transportTypes = [
    { id: 'walk', label: 'YAYAN', icon: 'walk' },
    { id: 'bus', label: 'TOPLU TAŞIMA', icon: 'bus' },
    { id: 'car', label: 'ŞAHSİ ARAÇ', icon: 'car' },
  ];

  const budgets = [
    { id: 'low', label: 'AZ (TASARRUF)', icon: 'cash' },
    { id: 'mid', label: 'ORTA (DENGELİ)', icon: 'cash-multiple' },
    { id: 'high', label: 'ÇOK (LÜKS)', icon: 'bank-transfer' },
  ];

  const durationLabels = ['1 GÜN', '2 GÜN', '3 + GÜN'];

  // ADIM KONTROLÜ
  const nextStep = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  // SEÇENEK KARTI BİLEŞENİ (Grid ve List uyumlu)
  const OptionCard = ({ item, isSelected, onPress, isList = false }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.optionCard,
        isList ? styles.optionCardList : styles.optionCardGrid,
        isSelected && styles.optionCardSelected,
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={item.icon}
        size={isList ? 26 : 32}
        color={isSelected ? COLORS.accent : COLORS.textGrey}
      />
      <Text style={[
        styles.optionLabel, 
        isList && styles.optionLabelList,
        isSelected && styles.optionLabelSelected
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER & PROGRESS BAR */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ROTA SİHİRBAZI</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarActive, { width: `${(currentStep / totalSteps) * 100}%` }]} />
        </View>
        <Text style={styles.progressSubText}>Adım {currentStep} / {totalSteps}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        
        {/* STEP 1: KİMİNLE? (GRID) */}
        {currentStep === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Kiminle gidiyorsun?</Text>
            <View style={styles.grid}>
              {travelers.map(item => (
                <OptionCard key={item.id} item={item} isSelected={selectedTraveler === item.id} onPress={() => setSelectedTraveler(item.id)} />
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: GEZİ TİPİ (GRID) */}
        {currentStep === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Nasıl bir gezi istiyorsun?</Text>
            <View style={styles.grid}>
              {tripTypes.map(item => (
                <OptionCard key={item.id} item={item} isSelected={selectedTripType === item.id} onPress={() => setSelectedTripType(item.id)} />
              ))}
            </View>
          </View>
        )}

        {/* STEP 3: ULAŞIM (LIST - DÜZELTİLDİ) */}
        {currentStep === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Ulaşım tercihin nedir?</Text>
            <View style={styles.list}>
              {transportTypes.map(item => (
                <OptionCard key={item.id} item={item} isSelected={transport === item.id} onPress={() => setTransport(item.id)} isList={true} />
              ))}
            </View>
          </View>
        )}

        {/* STEP 4: BÜTÇE (LIST - DÜZELTİLDİ) */}
        {currentStep === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Bütçen ne kadar?</Text>
            <View style={styles.list}>
              {budgets.map(item => (
                <OptionCard key={item.id} item={item} isSelected={budget === item.id} onPress={() => setBudget(item.id)} isList={true} />
              ))}
            </View>
          </View>
        )}

        {/* STEP 5: SÜRE (SLIDER) */}
        {currentStep === 5 && (
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>Kaç gün kalacaksın?</Text>
            <View style={styles.sliderContainer}>
                <Slider
                    minimumValue={0}
                    maximumValue={2}
                    step={1}
                    value={durationValue}
                    onValueChange={setDurationValue}
                    minimumTrackTintColor={COLORS.primary}
                    maximumTrackTintColor={COLORS.border}
                    thumbTintColor={COLORS.primary}
                />
                <View style={styles.sliderLabels}>
                    {durationLabels.map((label, index) => (
                    <Text key={index} style={[styles.sliderLabelText, durationValue === index && styles.sliderLabelActive]}>
                        {label}
                    </Text>
                    ))}
                </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={prevStep}>
            <Text style={styles.buttonText}>GERİ</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]} 
          onPress={currentStep === totalSteps ? () => alert("Rota Hazırlanıyor...") : nextStep}
        >
          <Text style={styles.buttonText}>
            {currentStep === totalSteps ? 'ROTAYI OLUŞTUR' : 'SONRAKİ ADIM'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  
  // Header
  header: { padding: 20, alignItems: 'center', backgroundColor: COLORS.bg },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginBottom: 12, letterSpacing: 1 },
  progressBarContainer: { width: '100%', height: 6, backgroundColor: COLORS.border, borderRadius: 10, overflow: 'hidden' },
  progressBarActive: { height: 6, backgroundColor: COLORS.primary },
  progressSubText: { marginTop: 8, color: COLORS.textGrey, fontSize: 12, fontWeight: '600' },
  
  // Content Area
  contentScroll: { padding: 20 },
  stepBox: { width: '100%', alignItems: 'center' },
  stepTitle: { fontSize: 18, color: COLORS.textDark, fontWeight: '700', marginBottom: 25, textAlign: 'center' },
  
  // Grid Layout (Step 1-2)
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  
  // List Layout (Step 3-4)
  list: { width: '100%' },

  // Base Option Card Style
  optionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 15,
  },
  
  // Grid Specific (Kare kartlar)
  optionCardGrid: {
    width: '47%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  // List Specific (Yatay ince kartlar - Senin sorunun buradaydı)
  optionCardList: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 65, // Yüksekliği sınırladık
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  optionCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#1e293b',
  },

  optionLabel: { fontSize: 12, color: COLORS.textGrey, marginTop: 8, fontWeight: '700', textAlign: 'center' },
  optionLabelList: { marginTop: 0, marginLeft: 15, fontSize: 14, textAlign: 'left' },
  optionLabelSelected: { color: COLORS.accent },

  // Slider
  sliderContainer: { width: '100%', backgroundColor: COLORS.cardBg, padding: 25, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  sliderLabelText: { color: COLORS.textGrey, fontSize: 11 },
  sliderLabelActive: { color: COLORS.primary, fontWeight: '800' },

  // Footer
  footer: { flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.bg },
  navButton: { padding: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  nextButton: { backgroundColor: COLORS.primary, flex: 2 },
  backButton: { backgroundColor: COLORS.buttonGrey, marginRight: 10, flex: 1 },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});