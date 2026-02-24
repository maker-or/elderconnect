import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as IntentLauncher from "expo-intent-launcher";
import * as Calendar from "expo-calendar";
import Constants from "expo-constants";

type TimeOfDay = "Morning" | "Afternoon" | "Evening" | "Night";

interface Reminder {
  id: string;
  title: string;
  timeOfDay: TimeOfDay;
  time: string; // e.g. "6:00"
}

const INITIAL_REMINDERS: Reminder[] = [
  { id: "1", title: "sugar tablet", timeOfDay: "Morning", time: "6:00" },
  { id: "2", title: "BP tablet", timeOfDay: "Afternoon", time: "3:00" },
  { id: "3", title: "vitamins", timeOfDay: "Night", time: "8:00" },
];

export default function RemindersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newTimeOfDay, setNewTimeOfDay] = useState<TimeOfDay>("Morning");
  const isExpoGo = Constants.appOwnership === "expo";

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios') {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Calendar permission not granted');
        }
      }
    })();
  }, []);

  const createSystemAlarm = async (title: string, date: Date) => {
    try {
      const hours = date.getHours();
      const minutes = date.getMinutes();

      if (Platform.OS === 'android') {
        if (isExpoGo) {
          // Expo Go cannot declare SET_ALARM; open Clock app as fallback.
          await IntentLauncher.startActivityAsync("android.intent.action.SHOW_ALARMS");
          Alert.alert(
            "Alarm integration needs dev build",
            "You're running in Expo Go, which blocks direct alarm creation. Opened your Clock app instead. Use a development build to create alarms automatically."
          );
          return;
        }
        await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
          extra: {
            'android.intent.extra.alarm.MESSAGE': title,
            'android.intent.extra.alarm.HOUR': hours,
            'android.intent.extra.alarm.MINUTES': minutes,
            'android.intent.extra.alarm.SKIP_UI': false,
          },
        });
      } else if (Platform.OS === 'ios') {
        const { status } = await Calendar.getCalendarPermissionsAsync();
        if (status === 'granted') {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCalendar = calendars.find(c => c.allowsModifications) || calendars[0];
          
          if (defaultCalendar) {
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            if (startDate < new Date()) {
              startDate.setDate(startDate.getDate() + 1);
            }
            
            await Calendar.createEventAsync(defaultCalendar.id, {
              title: `Reminder: ${title}`,
              startDate: startDate,
              endDate: new Date(startDate.getTime() + 15 * 60000), // 15 mins later
              alarms: [{ relativeOffset: 0 }],
            });
            Alert.alert("Success", "Reminder added to your Calendar!");
          }
        } else {
          Alert.alert("Permission required", "Calendar access is needed to set reminders on iOS.");
        }
      }
    } catch (e) {
      console.error("Error creating system alarm:", e);
      Alert.alert(
        "Couldn't create alarm",
        "Please try again, or open your Clock app and add it manually."
      );
    }
  };

  const handleAddReminder = async () => {
    if (!newTitle.trim()) return;

    const timeString = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      timeOfDay: newTimeOfDay,
      time: timeString,
    };

    setReminders([...reminders, newReminder]);
    await createSystemAlarm(newReminder.title, newTime);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewTitle("");
    setNewTime(new Date());
    setNewTimeOfDay("Morning");
    setIsDropdownOpen(false);
    setShowTimePicker(false);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) {
      setNewTime(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Feather name="chevron-left" size={32} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Reminder List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.card}>
            <Text style={styles.cardTitle}>{reminder.title}</Text>
            
            <View style={styles.cardFooter}>
              <Text style={styles.timeOfDayText}>{reminder.timeOfDay}</Text>
              <View style={styles.timeContainer}>
                <Feather name="bell" size={20} color="#E6CCFF" style={{ opacity: 0.9 }} />
                <Text style={styles.timeText}>{reminder.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
             <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
               <Text style={styles.cancelButtonText}>✕ cancel</Text>
             </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder=""
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              {Platform.OS === 'ios' ? (
                <View style={styles.timePickerContainerIOS}>
                  <DateTimePicker
                    value={newTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                    themeVariant="light"
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.timeButtonText}>
                      {newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={newTime}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </>
              )}
            </View>

            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                activeOpacity={0.9}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Text style={styles.dropdownButtonText}>{newTimeOfDay}</Text>
                <Feather name="chevron-down" size={20} color="#661F85" />
              </TouchableOpacity>
              
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {(["Morning", "Afternoon", "Evening", "Night"] as TimeOfDay[]).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setNewTimeOfDay(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity 
              style={styles.createButton} 
              activeOpacity={0.9}
              onPress={handleAddReminder}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#661F85", // Background color matching the prompt
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: "#A65DF6", // Slightly lighter/tinted purple for the button to match design
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: "#9331F6", // Primary color matching the prompt
    borderRadius: 16,
    height: 220,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FDEAE5",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  cardFooter: {
    justifyContent: 'flex-start',
  },
  timeOfDayText: {
    fontSize: 24,
    color: "#FDEAE5",
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 22,
    color: "#FDEAE5",
    opacity: 0.9,
    fontWeight: '300',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "#4B1663", // Darker purple backdrop
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 16,
    paddingBottom: 8,
  },
  cancelButton: {
    backgroundColor: "#A65DF6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  },
  modalContent: {
    backgroundColor: "#9331F6",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    height: '70%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 20,
    marginBottom: 8,
    fontWeight: '400',
  },
  textInput: {
    backgroundColor: "#D9B3FF", // Light purple field background
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#333',
  },
  timeButton: {
    backgroundColor: "#D9B3FF",
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 18,
    color: '#333',
  },
  timePickerContainerIOS: {
    backgroundColor: "#D9B3FF",
    borderRadius: 12,
    padding: 8,
    alignItems: 'flex-start',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 10, // Ensure dropdown list goes over other elements
  },
  dropdownButton: {
    backgroundColor: "#D9B3FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 18,
    color: '#661F85',
    fontWeight: '500',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#F3E6FF',
    borderRadius: 12,
    marginTop: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 31, 133, 0.1)',
  },
  dropdownItemText: {
    fontSize: 18,
    color: '#661F85',
  },
  createButton: {
    backgroundColor: "#4B1663",
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
  },
});
