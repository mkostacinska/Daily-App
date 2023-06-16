import { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp, getCountFromServer, onSnapshot } from "firebase/firestore";
import CircularProgress from 'react-native-circular-progress-indicator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { reload } from 'firebase/auth';
import WeeklySpread from '../components/WeeklySpread';
import PressableScale from '../components/PressableScale';
import BottomSheet from '@gorhom/bottom-sheet';

function LandingScreen(props) {
    const [name, onChangeName] = useState('');
    const [encouragment, onEncouragmentChange] = useState('Almost there!');
    const [habits, onHabitsChange] = useState(new Map());
    const [completedToday, onCompletedTodayChange] = useState(0);

    useEffect(() => {
        //Get the username for the header
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "user", uid);
        getUser(userRef);

        //Get the habits for the user
        const habitsRef = collection(db, "habits");
        const habitsQuery = query(habitsRef, where("user-id", "==", uid));
        let completedRefresh;
        onCompletedTodayChange(0);
        getHabits(habitsQuery).then(() => {
            // //Get the habits completed today
            const completedRef = collection(db, "habit-entries");
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const timestamp = Timestamp.fromDate(startOfToday);
            const completedQuery = query(completedRef, where("user-id", "==", uid), where("timestamp", ">", timestamp));

            //potentially worth a refactor 
            completedRefresh = onSnapshot(completedQuery, (snapshot) => {
                let count = 0
                snapshot.forEach((doc) => {
                    count += 1
                })
                onCompletedTodayChange(count);
            })
        });

        return () => {
            if (completedRefresh) {
                completedRefresh();
            }
            onCompletedTodayChange(0);
        }
    }, []);

    // very aware that this is not very good! you win some you lose some !
    useEffect(() => {
        props.navigation.addListener('focus', () => {
            //Get the username for the header
            const uid = auth.currentUser.uid;
            const userRef = doc(db, "user", uid);
            getUser(userRef);

            //Get the habits for the user
            const habitsRef = collection(db, "habits");
            const habitsQuery = query(habitsRef, where("user-id", "==", uid));
            let completedRefresh;
            onCompletedTodayChange(0);
            getHabits(habitsQuery).then(() => {
                // //Get the habits completed today
                const completedRef = collection(db, "habit-entries");
                const startOfToday = new Date();
                startOfToday.setHours(0, 0, 0, 0);
                const timestamp = Timestamp.fromDate(startOfToday);
                const completedQuery = query(completedRef, where("user-id", "==", uid), where("timestamp", ">", timestamp));

                //potentially worth a refactor 
                completedRefresh = onSnapshot(completedQuery, (snapshot) => {
                    let count = 0
                    snapshot.forEach((doc) => {
                        count += 1
                    })
                    onCompletedTodayChange(count);
                })
            });

            return () => {
                if (completedRefresh) {
                    completedRefresh();
                }
                onCompletedTodayChange(0);
            }
        });
    }, [props.navigation]);

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
        const newHabits = new Map();
        querySnapshot.forEach((doc) => {
            newHabits.set(doc.id, doc.data());
        })
        onHabitsChange(newHabits);
    }

    return (
        <View>
            {/* // Screen Background */}
            <Image source={require('../assets/blobby.png')} style={styles.blobby} />
            <ScrollView>
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
                    {/* <Text>{Array.from(habits.entries()).length}</Text> */}
                    <View style={{ height: 350 }}>
                        {habits && Array.from(habits.entries()).map(entry => (
                            <View key={entry[0]} style={styles.weeklyHabit}>
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
                                <WeeklySpread habitid={entry[0]}>
                                </WeeklySpread>
                            </View>
                        ))
                        }
                    </View>
                </SafeAreaView >
            </ScrollView >
            <PressableScale style={styles.newHabitButton} onPress={() => { props.navigation.navigate("NewHabit") }}>
                <MaterialCommunityIcons name="plus" size={35} color="white" />
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 20, textAlign: 'center', color: 'white', paddingLeft: 10, }}>CREATE</Text>
            </PressableScale>
        </View>
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
    },
    newHabitButton: {
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
    },
});

export default LandingScreen;