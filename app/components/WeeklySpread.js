import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { db, auth } from '../../firebase';
import { collection, query, doc, Timestamp, where, getDocs, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function WeeklySpread({ habitid }) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [current, onCurrentChange] = useState(0);
    const [completed, onCompletedChange] = useState(new Map());
    const [completedDate, onCompletedDateChange] = useState([]);
    const [listener, onListenerChange] = useState(undefined)


    const smel = async () => {
        const d = new Date();
        const monday = new Date();
        onCurrentChange(d.getDay() - 1);
        monday.setDate(d.getDate() - d.getDay());
        monday.setHours(0, 0, 0, 0);

        //get the habit entries and map them to dates
        const completedRef = collection(db, "habit-entries");
        const completedQuery = query(completedRef, where("habit-id", "==", habitid), where("timestamp", ">", Timestamp.fromDate(monday)));
        const completeReload = () => onSnapshot(completedQuery, (querySnapshot) => {
            const newCompleted = new Map();
            querySnapshot.forEach((doc) => {
                newCompleted.set(doc.id, doc.data());
            })
            onCompletedChange(newCompleted);
        })
        onListenerChange(completeReload);
    }

    useEffect(() => {
        return () => {
            if (listener) {
                listener();
            }
        }
    }, [listener])

    useEffect(() => {
        smel();
    }, [habitid]);

    useEffect(() => {
        const newCompletedDate = new Map();
        Array.from(completed.entries()).forEach((completed) => {
            newCompletedDate.set(completed[0], (((completed[1].timestamp.toDate().getDay() - 1) % 7) + 7) % 7)
        })
        onCompletedDateChange(newCompletedDate)
        // onCompletedDateChange(Array.from(completed.values()).flatMap((completed) => (
        //     completed.timestamp.toDate().getDay() - 1
        // )))
    }, [completed]);

    getDayDate = (indexOfDay) => {
        const d = new Date();
        d.setDate(d.getDate() + indexOfDay - current);
        return d;
    }

    dayStatus = (today) => {
        if (Array.from(completedDate.values()).includes(today)) {
            return <MaterialCommunityIcons name="check" size={25} color={today == current ? 'white' : '#3A602D'} />
        } else {
            return <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, color: today == current ? 'white' : '#3A602D' }}>{days[today][0]}</Text>
        }
    }

    const pressedDay = async (today) => {
        i = days.indexOf(today);
        if (i <= current) {
            if (Array.from(completedDate.values()).includes(i)) {
                //get the habit entry associated with the day
                const dayRef = await deleteDoc(doc(db, 'habit-entries', [...completedDate.entries()]
                    .filter(({ 1: v }) => v === i).map(([k]) => k)[0]))
            }
            else {
                const dayRef = await addDoc(collection(db, 'habit-entries'), {
                    "habit-id": habitid,
                    "user-id": auth.currentUser.uid,
                    timestamp: Timestamp.fromDate(getDayDate(i))
                });
            }
        }
    }

    return (
        <View style={styles.container}>
            {days.map(day => (
                <View key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Pressable onPress={() => { pressedDay(day) }}>
                        <View id={days.indexOf(day)} style={[styles.dayCircle, { backgroundColor: days.indexOf(day) == current ? '#3A602D' : 'white', borderStyle: days.indexOf(day) > current ? 'dashed' : 'solid' }]}>
                            {/* <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, color: days.indexOf(day) == current ? 'white' : '#3A602D' }}>{day[0]}</Text> */}
                            {dayStatus(days.indexOf(day))}
                        </View>
                    </Pressable>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 13, marginTop: 5 }}>
                        {getDayDate(days.indexOf(day)).getDate().toString()}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 2,
        // borderColor: 'red',
    },
    dayCircle: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#3A602D',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default WeeklySpread;