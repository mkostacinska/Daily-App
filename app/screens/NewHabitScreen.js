import { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, Pressable, Text, StyleSheet, View, TextInput, Dimensions, ScrollView } from 'react-native';
import PressableScale from '../components/PressableScale';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebase';
import { doc, addDoc, collection, query, where, getDocs } from "firebase/firestore";


function NewHabitScreen(props) {
    const [habitName, onChangeHabitName] = useState('');
    const [namePrompt, onChangeNamePrompt] = useState('Name your habit');
    const [namePromptColour, onChangeNamePromptColour] = useState('black');
    const [icon, onChangeIcon] = useState('');
    const [iconPrompt, onChangeIconPrompt] = useState('Pick an icon for your habit');
    const [iconPromptColour, onChangeIconPromptColour] = useState('black');
    const [remindDays, onChangeRemindDays] = useState([]);
    const icons = ['alarm', 'application-brackets-outline', 'arm-flex-outline',
        'bathtub-outline', 'bed-king-outline', 'book-open-outline',
        'bookshelf', 'calculator', 'candy-off', 'carrot', 'check', 'chef-hat',
        'code-tags', 'fountain-pen', 'draw-pen', 'run', 'beer-outline'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [uid, onChangeUid] = useState('')
    const [habits, onHabitsChange] = useState([]);

    const chooseIcon = (i) => {
        onChangeIcon(i);
    }

    useEffect(() => {
        onChangeUid(auth.currentUser.uid);
    }, [])

    useEffect(() => {
    }, [remindDays])

    useEffect(() => {
        onChangeIconPrompt('Pick an icon for your habit');
        onChangeIconPromptColour('black');
        if (habits.length != 0 && !habits.includes(habitName.toLowerCase())) {
            //not sure if needed, but stylistic for the moment it may take to load
            onChangeNamePrompt('Name your habit');
            onChangeNamePromptColour("black");

            //name valid, push new entry into the database
            pushEntry().then(() => {
                props.navigation.navigate("Landing", { 'params': 'param' });
            });
        }
        else if (habits.length != 0) {
            //name cannot be the same as a name used before!
            onChangeNamePrompt('The chosen habit name is already taken');
            onChangeNamePromptColour("#c40c0c");
        }
    }, [habits])

    const addRemoveDay = (d) => {
        const remind = [...remindDays]
        if (remind.includes(d)) {
            remind.splice(remind.indexOf(d), 1);
        }
        else {
            remind.push(d);
        }
        onChangeRemindDays(remind)
    }

    // push the habit into the database :)
    const createHabit = async () => {
        if (habitName != "" && icon != "") {
            const habitsRef = collection(db, "habits");
            const habitsQuery = query(habitsRef, where("user-id", "==", uid));
            getHabitNames(habitsQuery);
        }
        // catch necessary information missing from the habit
        else {
            if (habitName == "") {
                onChangeNamePrompt('Please provide a name for your habit');
                onChangeNamePromptColour("#c40c0c");
            }
            else {
                onChangeNamePrompt('Name your habit');
                onChangeNamePromptColour('black');
            }

            if (icon == '') {
                onChangeIconPrompt('Please choose an icon for your habit');
                onChangeIconPromptColour("#c40c0c");
            }
            else {
                onChangeIconPrompt('Pick an icon for your habit');
                onChangeIconPromptColour('black');
            }
        }

        // since we need to continue only once the habits are downloaded, we instead continue in a separate useEffect
    }

    const getHabitNames = async (q) => {
        const querySnapshot = await getDocs(q);
        const newHabits = []
        querySnapshot.forEach((doc) => {
            newHabits.push(doc.data().title.toLowerCase())
        })
        onHabitsChange(newHabits);
    }

    const pushEntry = async () => {
        const docRef = await addDoc(collection(db, "habits"), {
            'icon': icon,
            'title': habitName,
            'user-id': uid,
            'reminders': remindDays
        });
        console.log("Document written with ID: ", docRef.id);
    }

    return (
        <KeyboardAvoidingView style={{ display: 'flex', flexDirection: 'column' }}>
            {/* HABIT NAME */}
            <View style={[styles.container, {
                marginTop: Dimensions.get('window').height * 0.05,
            }]}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: namePromptColour }}>{namePrompt}</Text>
                <TextInput
                    placeholder="New Habit"
                    value={habitName}
                    onChangeText={onChangeHabitName}
                    style={styles.inputName} />
            </View>
            <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1, marginTop: 20 }} />
            {/* ICONS CAROUSEL */}
            <View style={[styles.container, { marginTop: 20 }]}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: iconPromptColour }}>{iconPrompt}</Text>
                <ScrollView style={styles.iconCarousel} horizontal={true} showsHorizontalScrollIndicator
                    ={false}>
                    {icons.map((i) => (
                        <Pressable onPress={() => { chooseIcon(i) }} key={i}>
                            <View style={[styles.icon, { backgroundColor: i == icon ? '#3A602D' : 'white' }]}>
                                <MaterialCommunityIcons name={i} size={35} color={i == icon ? 'white' : '#3A602D'} />
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
            <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1, marginTop: 20, marginBottom: 20 }} />
            {/* DAYS OF WEEK TO SET REMINDERS */}
            <View style={styles.container}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>When would you like to be reminded?</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    {days.map((d) => (
                        <Pressable onPress={() => { addRemoveDay(d) }} key={d}>
                            <View key={d} style={[styles.dayCircle, { backgroundColor: remindDays.includes(d) ? '#3A602D' : 'white' }]}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, color: remindDays.includes(d) ? 'white' : '#3A602D' }}>{d[0]}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* CREATE BUTTON */}
            <PressableScale style={styles.confirmHabitButton} onPress={() => { createHabit() }}>
                <MaterialCommunityIcons name="plus" size={35} color="white" />
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 20, textAlign: 'center', color: 'white', paddingLeft: 10, }}>ADD HABIT</Text>
            </PressableScale>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        marginLeft: Dimensions.get('window').width * 0.05,
        marginRight: Dimensions.get('window').width * 0.05,
    },
    inputName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 35,
    },
    iconCarousel: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
        paddingTop: 15,
    },
    icon: {
        borderRadius: 53 / 2,
        borderColor: '#3A602D',
        borderWidth: 2.7,
        width: 53,
        height: 53,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#3A602D',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmHabitButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        paddingLeft: 25,
        paddingRight: 35,
        height: 48,
        borderRadius: 50,
        backgroundColor: "#3A602D",
        justifyContent: 'center',
        marginTop: 40,
    }
})

export default NewHabitScreen;