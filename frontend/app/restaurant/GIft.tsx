import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Image,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import colors from "@/constants/colors";
import typography from "@/constants/typography";
import Button from "@/components/Button";

type Coordinates = { lat: number | null; lng: number | null };
type MapType = "standard" | "satellite" | "hybrid" | "terrain";
type LocationSuggestion = {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  priority?: number;
};

const SendGift: React.FC<{ setGiftLocation: (location: { lat: number, lng: number }) => void, giftLocation: { lat: number, lng: number } | null }> = ({ setGiftLocation, giftLocation }) => {
  const [address, setAddress] = useState<string>("");
  const [coords, setCoords] = useState<Coordinates>({ lat: null, lng: null });
  const [processing, setProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 9.0108, // Default center (Addis Ababa)
    longitude: 38.7613,
    latitudeDelta: 5.05,
    longitudeDelta: 5.05,
  });
  const [mapType, setMapType] = useState<MapType>("standard");
  const [is3D, setIs3D] = useState(true);

  // 🧭 When coordinates change, update map region
  useEffect(() => {
    if (coords.lat && coords.lng) {
      setMapRegion({
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [coords]);

  // 🔍 URL-based autocomplete search with debouncing
  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    console.log("🔍 Searching for:", query);
    
    try {
      // Search specifically for Ethiopian locations
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Ethiopia')}&limit=20&addressdetails=1&countrycodes=et`;
      
      const response = await fetch(nominatimUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'BahiranApp/1.0 (contact@bahiran.com)',
          'Accept': 'application/json',
        },
      });
      
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 API Response:", data);
      
      if (data && data.length > 0) {
        // Filter for Ethiopian locations, exclude regions, and remove Arabic text
        let ethiopianSuggestions = data
          .filter((item: any) => {
            const country = item.address?.country_code || item.address?.country || '';
            const isEthiopian = country.toLowerCase().includes('et') || 
                               country.includes('ኢትዮጵያ') || 
                               country.includes('ethiopia') ||
                               item.display_name.includes('Ethiopia') ||
                               item.display_name.includes('ኢትዮጵያ');
            
            // Exclude regions and administrative boundaries
            const isRegion = item.type === 'administrative' || 
                           item.addresstype === 'administrative' ||
                           item.place_rank <= 12; // place_rank <= 12 are typically regions/states
            
            // Exclude locations that are clearly in regions/states outside Addis Ababa
            const displayName = item.display_name.toLowerCase();
            const isRegionalLocation = displayName.includes('oromia') || 
                                      displayName.includes('gam') ||
                                      displayName.includes('arsi') ||
                                      displayName.includes('guji') ||
                                      displayName.includes('benishangul') ||
                                      displayName.includes('tigray') ||
                                      displayName.includes('amhara') ||
                                      displayName.includes('sidama') ||
                                      displayName.includes('somali') ||
                                      displayName.includes('afar') ||
                                      displayName.includes('harari') ||
                                      displayName.includes('diredawa') ||
                                      displayName.includes('gambela');
            
            // For all searches, prioritize Addis Ababa locations over regional ones
            const isAddisAbabaLocation = displayName.includes('addis ababa') || 
                                         (item.address?.state_district?.toLowerCase().includes('addis ababa') ||
                                          item.address?.state?.toLowerCase().includes('addis ababa') ||
                                          item.address?.county?.toLowerCase().includes('addis ababa'));
            
            // For all searches, prefer Addis Ababa locations over regional ones
            // If we have Addis Ababa locations in results, filter out most regional locations
            const searchQuery = query.toLowerCase();
            if (!isAddisAbabaLocation && isRegionalLocation) {
              return false;
            }
            
            return isEthiopian && !isRegion && !isRegionalLocation;
          })
          .map((item: any) => {
            // Remove Arabic text from display_name
            let cleanDisplayName = item.display_name;
            // Remove Arabic characters and text
            cleanDisplayName = cleanDisplayName.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
            // Remove extra spaces and commas
            cleanDisplayName = cleanDisplayName.replace(/\s*,\s*,\s*/g, ', ').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '').trim();
            
            return {
              place_id: item.place_id || `${item.lat}-${item.lon}`,
              display_name: cleanDisplayName,
              lat: item.lat,
              lon: item.lon,
              // Add priority score for sorting (Addis Ababa locations get higher priority)
              priority: cleanDisplayName.toLowerCase().includes('addis ababa') ? 1 : 2,
            };
          })
          .filter((item: any) => item.display_name.length > 0); // Remove empty results after cleaning
        
        // Sort by priority (Addis Ababa locations first)
        ethiopianSuggestions.sort((a: any, b: any) => a.priority - b.priority);
        
        // Remove duplicates based on display_name (case-insensitive)
        const uniqueSuggestions = ethiopianSuggestions.filter((suggestion: any, index: number, self: any[]) =>
          index === self.findIndex((s: any) => 
            s.display_name.toLowerCase() === suggestion.display_name.toLowerCase()
          )
        );
        
        console.log("✅ Ethiopian suggestions found (Addis Ababa priority, no regions):", uniqueSuggestions.length);
        setSuggestions(uniqueSuggestions);
        setShowSuggestions(true);
      } else {
        console.log("❌ No results found");
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log("❌ Autocomplete error:", error);
      
      // Fallback to mock Ethiopian data for testing UI
      if (query.toLowerCase().includes('addis') || query.toLowerCase().includes('bole') || query.toLowerCase().includes('ayert')) {
        const mockSuggestions: LocationSuggestion[] = [
          {
            place_id: 'mock1',
            display_name: 'Addis Ababa, Ethiopia',
            lat: '9.0108',
            lon: '38.7613',
            priority: 1,
          },
          {
            place_id: 'mock2', 
            display_name: 'Bole International Airport, Addis Ababa, Ethiopia',
            lat: '8.9806',
            lon: '38.7997',
            priority: 1,
          },
          {
            place_id: 'mock3',
            display_name: 'Ayertena, Kolfe Keranio, Addis Ababa, Ethiopia',
            lat: '8.9835747',
            lon: '38.6971482',
            priority: 1,
          },
          {
            place_id: 'mock4',
            display_name: 'Mekelle, Tigray, Ethiopia',
            lat: '13.4967',
            lon: '39.4747',
            priority: 2,
          },
          {
            place_id: 'mock5',
            display_name: 'Bahir Dar, Amhara, Ethiopia',
            lat: '11.5944',
            lon: '37.3889',
            priority: 2,
          },
        ];
        console.log("🎭 Using mock Ethiopian suggestions");
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // 📝 Handle text input with debounced autocomplete
  const handleInputChange = (text: string) => {
    console.log("⌨️ Input changed:", text);
    setAddress(text);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      console.log("⏰ Triggering search for:", text);
      fetchSuggestions(text);
    }, 300);
    
    setSearchTimeout(timeout);
  };

  // Debug: Log when showSuggestions changes
  useEffect(() => {
    console.log("👁️ showSuggestions changed:", showSuggestions, "suggestions count:", suggestions.length);
  }, [showSuggestions, suggestions]);

  // 📍 Handle suggestion selection
  const handleSuggestionPress = (suggestion: LocationSuggestion) => {
    const latitude = parseFloat(suggestion.lat);
    const longitude = parseFloat(suggestion.lon);
    
    setAddress(suggestion.display_name);
    setCoords({ lat: latitude, lng: longitude });
    setGiftLocation({ lat: latitude, lng: longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setShowSuggestions(false);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  // �� Handle text address search using Expo Location
  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!address.trim()) return;

    setProcessing(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to search places.");
        setProcessing(false);
        return;
      }

      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setCoords({ lat: latitude, lng: longitude });
        setGiftLocation({ lat: latitude, lng: longitude });
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert("Location not found", "Try a more specific address.");
      }
    } catch (error) {
      console.log("Geocoding error:", error);
      Alert.alert("Error", "Could not find coordinates for this address.");
    }
    setProcessing(false);
  };

  // 🗺️ Handle tap on map to get coordinates
  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCoords({ lat: latitude, lng: longitude });
    setGiftLocation({ lat: latitude, lng: longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // 🎛️ Toggle 3D map tilt
  const toggle3D = () => {
    setIs3D(!is3D);
  };

  const getCamera = () => ({
    center: {
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
    },
    pitch: 0,
    heading: 0,
    altitude: 1000,
    zoom: 17,
  });

  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionTitle}>Select Gift Location</Text> */}
      <Text style={styles.instructions}>
        Enter a place name or tap anywhere on the map to select a location.
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.textInputWrapper}>
          <TextInput
            placeholder="Enter address (e.g., Ethiopia, Addis Ababa, Ayertena)"
            value={address}
            onChangeText={handleInputChange}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            editable={!processing}
            placeholderTextColor={colors.lightText}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow tap on suggestion items
              setTimeout(() => setShowSuggestions(false), 500);
            }}
          />
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {(() => {
                  console.log("🎨 Rendering suggestions dropdown:", suggestions.length);
                  return suggestions.map((item) => (
                    <TouchableOpacity
                      key={item.place_id}
                      style={styles.suggestionItem}
                      onPress={() => {
                        console.log("👆 Suggestion pressed:", item.display_name);
                        handleSuggestionPress(item);
                      }}
                    >
                      <Text style={styles.suggestionText} numberOfLines={2}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  ));
                })()}
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      <Button
        title={processing ? "Searching..." : "Find Location"}
        onPress={handleSearch}
        disabled={!address.trim() || processing}
        loading={processing}
        variant="primary"
        size="large"
        fullWidth
        style={styles.ctaButton}
      />

      {/* Map Style Selector */}
      <View style={styles.mapStyleContainer}>
        <Text style={styles.mapStyleLabel}>Map Style</Text>
        <View style={styles.mapTypeRow}>
          {(["standard", "satellite", "hybrid"] as MapType[]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setMapType(type)}
              style={[
                styles.mapTypeButton,
                mapType === type && styles.selectedMapTypeButton,
              ]}
            >
              <Text
                style={[
                  styles.mapTypeButtonText,
                  mapType === type && styles.selectedMapTypeButtonText,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          mapType={mapType}
          onPress={handleMapPress}
          showsBuildings
          showsCompass
          showsPointsOfInterest
          pitchEnabled
          rotateEnabled
          initialCamera={getCamera()}
          camera={getCamera()}
        >
          {coords.lat && coords.lng && (
            <Marker
              coordinate={{
                latitude: coords.lat,
                longitude: coords.lng,
              }}
              title="Selected Location"
              description={`Lat: ${coords.lat}, Lng: ${coords.lng}`}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Image
                source={require("../../assets/images/android-chrome-192x192.png")}
                style={styles.markerImage}
                resizeMode="contain"
              />
            </Marker>
          )}
        </MapView>
      </View>

      {/* Coordinates Display */}
      {coords.lat && coords.lng ? (
        // <View>
        <View style={styles.coordsContainer}>
          <View style={styles.coordsRow}>
            <Text style={styles.label}>Location has been captured.</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.placeholder}>Tap on the map or search an address</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 12 , paddingTop: 0},
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  instructions: { ...typography.body, color: colors.lightText, marginBottom: 12 },
  input: {
    padding: 14,
    fontSize: 16,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 12,
  },
  textInputWrapper: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.divider,
    overflow: "visible",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 1000,
    maxHeight: 300,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.cardBackground,
    minHeight: 60,
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  ctaButton: {
    marginBottom: 10,
  },
  mapStyleContainer: { marginBottom: 10 },
  mapStyleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  mapTypeRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  mapTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
    minWidth: 60,
    alignItems: "center",
  },
  selectedMapTypeButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  mapTypeButtonText: { fontSize: 12, fontWeight: "500", color: colors.lightText },
  selectedMapTypeButtonText: { color: colors.white },
  toggleButton: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  selectedToggleButton: { backgroundColor: colors.success },
  toggleButtonText: { fontSize: 14, fontWeight: "500", color: colors.text },
  selectedToggleButtonText: { color: colors.white },
  mapContainer: {
    width: "100%",
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    borderWidth: 2,
    borderColor: colors.divider,
    backgroundColor: colors.white,
  },
  map: { width: "100%", height: "100%" },
  coordsContainer: {
    backgroundColor: "lightgreen",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.divider,
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontWeight: "600", fontSize: 20, color: colors.lightText },
  value: { fontSize: 16, color: colors.text, fontWeight: "500" },
  placeholder: { color: colors.lightText, fontStyle: "italic", fontSize: 14, marginTop: 8 },
  markerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default SendGift;
