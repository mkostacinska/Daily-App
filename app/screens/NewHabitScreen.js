import { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, Pressable, Text, StyleSheet, View, TextInput, Dimensions, ScrollView } from 'react-native';
import PressableScale from '../components/PressableScale';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function NewHabitScreen(props) {
    const [habitName, onChangeHabitName] = useState('');
    const [icon, onChangeIcon] = useState('');
    const [remindDays, onChangeRemindDays] = useState([]);
    const icons = ['alarm', 'application-brackets-outline', 'arm-flex-outline',
        'bathtub-outline', 'bed-king-outline', 'book-open-outline',
        'bookshelf', 'calculator', 'candy-off', 'carrot', 'check', 'chef-hat',
        'code-tags', 'fountain-pen', 'draw-pen', 'run', 'beer-outline'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const chooseIcon = (i) => {
        onChangeIcon(i);
    }

    useEffect(() => {
    }, [remindDays])

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

    return (
        <KeyboardAvoidingView>
            <View style={[styles.container, {
                marginTop: Dimensions.get('window').height * 0.05,
            }]}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>Name your habit</Text>
                <TextInput
                    placeholder="New Habit"
                    value={habitName}
                    onChangeText={onChangeHabitName}
                    style={styles.inputName} />
            </View>
            <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1, marginTop: 20 }} />
            <View style={[styles.container, { marginTop: 20 }]}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>Pick an icon for your habit</Text>
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
            <View style={styles.container}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>When would you like to be reminded?</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    {days.map((d) => (
                        <Pressable onPress={() => { addRemoveDay(d) }}>
                            <View key={d} style={[styles.dayCircle, { backgroundColor: remindDays.includes(d) ? '#3A602D' : 'white' }]}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 18, color: remindDays.includes(d) ? 'white' : '#3A602D' }}>{d[0]}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
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
    }
})

export default NewHabitScreen;