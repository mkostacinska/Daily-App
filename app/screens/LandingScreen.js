import { useEffect, useState } from 'react';
import { Image, Text, View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";

function LandingScreen(props) {
    console.log('reload landing');
    const [name, onChangeName] = useState('');
    const [encouragment, onEncouragmentChange] = useState('Almost there!');

    useEffect(() => {
        const uid = auth.currentUser.uid;
        const docRef = doc(db, "user", uid);
        getUser(docRef);
    })

    const getUser = async (docRef) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            onChangeName(docSnap.data().name);
        }
        else {
            props.navigation.navigate('LogIn');
        }
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
                        <Text style={{ padding: 20, fontFamily: 'Poppins', fontSize: 15, color: 'white' }}>{encouragment}</Text>
                    </View>

                </View>
            </SafeAreaView>
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
    },
    summary: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default LandingScreen;