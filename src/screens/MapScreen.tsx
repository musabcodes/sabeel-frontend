import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
  route: RouteProp<RootStackParamList, 'Map'>;
};

const {height} = Dimensions.get('window');

// City coordinate lookup — will be replaced with real geocoding via backend
const CITY_COORDS: Record<string, {lat: number; lng: number}> = {
  'toronto': {lat: 43.6532, lng: -79.3832},
  'ottawa': {lat: 45.4215, lng: -75.6972},
  'montreal': {lat: 45.5017, lng: -73.5673},
  'vancouver': {lat: 49.2827, lng: -123.1207},
  'calgary': {lat: 51.0447, lng: -114.0719},
  'edmonton': {lat: 53.5461, lng: -113.4938},
  'winnipeg': {lat: 49.8951, lng: -97.1384},
  'hamilton': {lat: 43.2557, lng: -79.8711},
  'mississauga': {lat: 43.5890, lng: -79.6441},
  'brampton': {lat: 43.7315, lng: -79.7624},
  'new york': {lat: 40.7128, lng: -74.0060},
  'london': {lat: 51.5074, lng: -0.1278},
  'chicago': {lat: 41.8781, lng: -87.6298},
  'los angeles': {lat: 34.0522, lng: -118.2437},
  'houston': {lat: 29.7604, lng: -95.3698},
  'detroit': {lat: 42.3314, lng: -83.0458},
  'dearborn': {lat: 42.3223, lng: -83.1763},
};

function getCityCoords(city: string): {lat: number; lng: number} {
  const key = city.toLowerCase().trim();
  // exact match
  if (CITY_COORDS[key]) {return CITY_COORDS[key];}
  // partial match (e.g. "Ottawa, ON")
  for (const k of Object.keys(CITY_COORDS)) {
    if (key.includes(k) || k.includes(key)) {return CITY_COORDS[k];}
  }
  // default fallback
  return {lat: 43.6532, lng: -79.3832};
}

const PLACES_API_KEY = 'AIzaSyAJ4MHDj64tyaEtakZd9mZ3UKfKrHhGwNs';

// Haversine distance in km between two coords
function getDistanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): string {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

type Org = {
  id: string;
  name: string;
  type: 'Masjid' | 'Charity';
  distance: string;
  address: string;
  campaign: string;
  raised: number;
  goal: number;
  emoji: string;
  lat: number;
  lng: number;
};

export default function MapScreen({navigation, route}: Props) {
  const {city} = route.params;
  const [activeTab, setActiveTab] = useState<'all' | 'masjid' | 'charity'>('all');
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [fetching, setFetching] = useState(true);

  const cityCenter = getCityCoords(city);

  useEffect(() => {
    const fetchMosques = async () => {
      setFetching(true);
      try {
        const {lat, lng} = cityCenter;
        const url =
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
          `?location=${lat},${lng}&radius=10000&type=mosque&key=${PLACES_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const mapped: Org[] = data.results.slice(0, 15).map((p: any, i: number) => ({
            id: p.place_id,
            name: p.name,
            type: 'Masjid' as const,
            distance: getDistanceKm(lat, lng, p.geometry.location.lat, p.geometry.location.lng),
            address: p.vicinity || '',
            campaign: 'Support this masjid',
            raised: 0,
            goal: 10000,
            emoji: '🕌',
            lat: p.geometry.location.lat,
            lng: p.geometry.location.lng,
          }));
          setOrgs(mapped);
        }
      } catch (e) {
        console.warn('Places API error:', e);
      } finally {
        setFetching(false);
      }
    };
    fetchMosques();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const filtered = orgs.filter(o => {
    const matchesTab =
      activeTab === 'masjid' ? o.type === 'Masjid' :
      activeTab === 'charity' ? o.type === 'Charity' :
      true;
    const matchesSearch = search.trim() === '' ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.address.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Showing results near</Text>
          <Text style={styles.headerTitle}>📍 {city}</Text>
        </View>
        <View style={styles.logoIcon}>
          <Image
            source={require('../assets/sabeellogo.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search masajid or charities..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Map */}
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: cityCenter.lat,
          longitude: cityCenter.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={Platform.OS === 'android' ? darkMapStyle : []}>
        {filtered.map(org => (
          <Marker
            key={org.id}
            coordinate={{latitude: org.lat, longitude: org.lng}}
            title={org.name}
            description={org.campaign}>
            <View style={styles.markerWrap}>
              <Text style={styles.markerEmoji}>{org.emoji}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {(['all', 'masjid', 'charity'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'all' ? 'All' : tab === 'masjid' ? '🕌 Masajid' : '🤲 Charities'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Org list */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 24}}>
        {fetching && (
          <View style={styles.emptyState}>
            <ActivityIndicator color="#00e676" size="large" />
            <Text style={styles.emptySubText}>Finding masajid near {city}...</Text>
          </View>
        )}
        {!fetching && filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🕌</Text>
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubText}>Try a different search term</Text>
          </View>
        )}
        {filtered.map(org => {
          const progress = org.raised / org.goal;
          return (
            <TouchableOpacity key={org.id} style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardTop}>
                <View style={styles.cardEmoji}>
                  <Text style={styles.emojiText}>{org.emoji}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <Text style={styles.orgMeta}>{org.distance} away</Text>
                  {org.address ? <Text style={styles.orgAddress} numberOfLines={1}>{org.address}</Text> : null}
                </View>
                <TouchableOpacity style={styles.donateBtn}>
                  <Text style={styles.donateBtnText}>Give</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.campaignName}>{org.campaign}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.raisedText}>${org.raised.toLocaleString()} raised</Text>
                <Text style={styles.goalText}>of ${org.goal.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN = '#00e676';
const BG = '#0d0d0d';
const CARD = '#1c1c1e';

const darkMapStyle = [
  {elementType: 'geometry', stylers: [{color: '#1a1a2e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#8ec3b9'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#1a3646'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#2c2c3e'}]},
  {featureType: 'road', elementType: 'geometry.stroke', stylers: [{color: '#212135'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#0e1626'}]},
  {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#1c1c2e'}]},
];

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
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
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#ffffff',
  },
  clearBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  map: {
    height: height * 0.28,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  markerWrap: {
    backgroundColor: CARD,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerEmoji: {
    fontSize: 20,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: CARD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tabActive: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  tabText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#001a0d',
    fontWeight: '700',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  cardEmoji: {
    width: 44,
    height: 44,
    backgroundColor: '#111',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  orgMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
  },
  orgAddress: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    marginTop: 1,
  },
  donateBtn: {
    backgroundColor: GREEN,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  donateBtnText: {
    color: '#001a0d',
    fontSize: 13,
    fontWeight: '700',
  },
  campaignName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: GREEN,
    borderRadius: 100,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  raisedText: {
    fontSize: 12,
    color: GREEN,
    fontWeight: '600',
  },
  goalText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  emptySubText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.25)',
  },
});
