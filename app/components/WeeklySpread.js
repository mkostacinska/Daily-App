import { getDefaultEmulatorHost } from '@firebase/util';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { db, auth } from '../../firebase';
import { collection, query, Timestamp, where, getDocs } from "firebase/firestore";

function WeeklySpread(props) {
    const days = ["Monday", "Tuesday", "Wwednesday", "Tthursday", "Friday", "Saturday", "Sunday"];
    const [current, onCurrentChange] = useState(0);
    const [completed, onCompletedChange] = useState(new Map());

    useEffect(() => {
        const d = new Date();
        const monday = new Date();
        const uid = auth.currentUser.uid;
        onCurrentChange(d.getDay());
        monday.setDate(d.getDate() - d.getDay());
        monday.setHours(0, 0, 0, 0);

        const completedRef = collection(db, "habit-entries");
        const completedQuery = query(completedRef, where("user-id", "==", uid), where("timestamp", ">", Timestamp.fromDate(monday)));
        getWeek(completedQuery)
    }, []);

    getDayDate = (indexOfDay) => {
        const d = new Date();
        d.setDate(d.getDate() + indexOfDay - current);
        return d;
    }

    dayStatus = (today) => {
        if (getDayDate)
    }

    getWeek = async (q) => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const newCompleted = completed;
            newCompleted.set(doc.id, doc.data());
            onCompletedChange(newCompleted);
            console.log(doc.data())
        })
    }

    return (
        <View style={styles.container}>
            {days.map(day => (
                <View key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <View id={days.indexOf(day)} style={[styles.dayCircle, { backgroundColor: days.indexOf(day) == current ? '#3A602D' : 'white', borderStyle: days.indexOf(day) > current ? 'dashed' : 'solid' }]}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, color: days.indexOf(day) == current ? 'white' : '#3A602D' }}>{day[0]}</Text>
                    </View>
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