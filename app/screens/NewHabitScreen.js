import { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, Text, StyleSheet, View, TextInput, Dimensions } from 'react-native';
import PressableScale from '../components/PressableScale';
function NewHabitScreen(props) {
    const [habitName, onChangeHabitName] = useState('');

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
            </View>
        </KeyboardAvoidingView>
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
    }
})

export default NewHabitScreen;