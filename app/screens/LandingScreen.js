import { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp, getCountFromServer } from "firebase/firestore";
import CircularProgress from 'react-native-circular-progress-indicator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { reload } from 'firebase/auth';
import WeeklySpread from '../components/WeeklySpread';

function LandingScreen(props) {
    const [name, onChangeName] = useState('');
    const [encouragment, onEncouragmentChange] = useState('Almost there!');
    const [habits, onHabitsChange] = useState(new Map());
    const [completedToday, onCompletedTodayChange] = useState(0);

    useEffect(() => {
        console.log('RELOAD LANDING');
        //Get the username for the header
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "user", uid);
        getUser(userRef);

        //Get the habits for the user
        const habitsRef = collection(db, "habits");
        const habitsQuery = query(habitsRef, where("user-id", "==", uid));
        getHabits(habitsQuery).then(() => {
            // //Get the habits completed today
            const completedRef = collection(db, "habit-entries");

            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const timestamp = Timestamp.fromDate(startOfToday);
            const completedQuery = query(completedRef, where("user-id", "==", uid), where("timestamp", ">", timestamp));
            getCompleted(completedQuery);
        });


    }, []);

    const getUser = async (docRef) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            onChangeName(docSnap.data().name);
        }
        else {
            props.navigation.navigate('LogIn');
        }
    }

    const getHabits = async (q) => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const newHabits = habits;
            newHabits.set(doc.id, doc.data());
            onHabitsChange(newHabits);
        })
    }

    const getCompleted = async (q) => {
        const snapshot = await getCountFromServer(q);
        onCompletedTodayChange(snapshot.data().count);
    }

    const getPercentage = (x, y) => {
        percent = (x / y) * 100;
        return percent
    }

    return (
        <View>
            {/* // Screen Background */}
            <Image source={require('../assets/blobby.png')} style={styles.blobby} />

            <SafeAreaView style={styles.container}>
                {/* Header and welcome subheader: */}
                <Text style={{ fontFamily: 'Poppins-ExtraBold', fontSize: 40, color: '#3A602D', paddingBottom: 7 }}>Hi, {name}!</Text>
                <Text style={{ fontFamily: 'Poppins', fontSize: 18, paddingBottom: 20 }}>Your habits at a glance</Text>

                {/* Summary Pill */}
                <View style={styles.summaryBackground}>
                    <View style={styles.summary}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins', fontSize: 16, color: 'white' }}>{encouragment}</Text>
                            <Text style={{ fontFamily: 'Poppins', fontSize: 16, color: "#D9D9D9" }}>{completedToday}/{habits.size} daily habits completed</Text>
                        </View>
                        <CircularProgress
                            value={(completedToday / habits.size) * 100}
                            radius={36}
                            valueSuffix={'%'}
                            progressValueColor={'#fff'}
                            activeStrokeColor={'#fff'}
                            inActiveStrokeColor={'#28441E'}
                            activeStrokeWidth={8}
                            progressValueStyle={{ fontWeight: '700' }}
                        />
                    </View>
                </View>
                {/* Text preceding the individual habit sections: */}
                <Text style={{ fontFamily: 'Poppins', fontSize: 18 }}>Your weekly goals:</Text>

                {/* Individual Weekly habit sections: */}
                {Array.from(habits.entries()).map(entry => (
                    <View id={entry[0]} style={styles.weeklyHabit}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.icon}>
                                    <MaterialCommunityIcons name={entry[1].icon} size={35} color='#3A602D' />
                                </View>
                                <Text style={{ fontFamily: 'Poppins', fontSize: 18 }}>{entry[1].title}</Text>
                            </View>
                            <Pressable onPress={() => { console.log('pressed:', entry[1].title) }}>
                                <MaterialCommunityIcons name="chevron-right" size={35} color="#3A602D" />
                            </Pressable>
                        </View>

                        {/* The spread of the week + dates checked */}
                        <WeeklySpread>
                        </WeeklySpread>
                    </View>
                ))
                }
            </SafeAreaView >
        </View >
    );
}

const styles = StyleSheet.create({
    blobby: {
        position: 'absolute',
        right: 0,
    },
    container: {
        // borderColor: 'red',
        // borderWidth: 3,
        marginLeft: Dimensions.get('window').width * 0.05, // 5 percentage of the screen width
        marginRight: Dimensions.get('window').width * 0.05,
        marginTop: Dimensions.get('window').height * 0.1,
    },
    summaryBackground: {
        backgroundColor: '#3A602D',
        width: '100%',
        height: 100,
        borderRadius: 15,
        marginBottom: 20
    },
    summary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 13,
        paddingLeft: 20,
        paddingRight: 20
    },
    weeklyHabit: {
        // borderWidth: 2,
        // borderColor: 'red',
        marginTop: 15,
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
    }
});

export default LandingScreen;