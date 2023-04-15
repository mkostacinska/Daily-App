import { useEffect, useState, useRef } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Pressable, PressableProps, Dimensions, KeyboardAvoidingView, Keyboard, Animated, Platform, navigation, TouchableHighlight } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import PressableScale from '../components/PressableScale';
import LoginScreen from './LoginScreen';
import { firebaseApp, auth } from '../../firebase';


function WelcomeScreen(props) {
    const [name, onChangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const headerSize = useRef(new Animated.Value(45)).current;
    const marginSize = useRef(new Animated.Value(45)).current;

    const createUser = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('CREATE USER ERROR:', `${errorCode}, ${errorMessage}`);
            });
    }


    useEffect(() => {
        console.log("reload");

        const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
            //Shrink header size and margin size to avoid overlap
            Animated.parallel([
                Animated.timing(headerSize, {
                    toValue: 30,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(marginSize, {
                    toValue: 10,
                    duration: 500,
                    useNativeDriver: false,
                })]).start();


            console.log('keyboard up');
        });

        const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
            Animated.parallel([
                Animated.timing(headerSize, {
                    toValue: 45,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(marginSize, {
                    toValue: 45,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ]).start();

            console.log('keyboard down');
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <ImageBackground source={require("../assets/background.png")} style={styles.background}>
            {/* The wrapper view container for the text, all the entry fields and the button */}
            <KeyboardAvoidingView style={styles.contentWrapper} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                {/* Header and Login redirector */}
                <View>
                    <Animated.Text style={{ fontFamily: 'Poppins-ExtraBold', fontSize: headerSize, textAlign: 'center', color: '#3A602D' }}>Create new Account</Animated.Text>
                    <Pressable onPress={() => { props.navigation.navigate("LogIn") }}><Animated.Text style={{ fontFamily: 'OpenSans', fontSize: 15, textAlign: 'center', marginBottom: marginSize, }}>Already Registered? <Text style={{ textDecorationLine: 'underline' }}>Login</Text></Animated.Text></Pressable>
                </View>

                {/* Input section: name, email and password fields */}
                <Text style={{ fontFamily: 'OpenSans', fontSize: 11, marginLeft: 18, marginBottom: 5 }}>Please enter your name</Text>
                <TextInput style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="John Doe" />

                <Text style={{ fontFamily: 'OpenSans', fontSize: 11, marginLeft: 18, marginBottom: 5 }}>Please enter your email</Text>
                <TextInput style={styles.input}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder="example@email.com" />

                <Text style={{ fontFamily: 'OpenSans', fontSize: 11, marginLeft: 18, marginBottom: 5 }}>Please enter your password</Text>
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="password" />

                {/* Sign Up button */}
                <PressableScale style={styles.registerButton} onPress={createUser}>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 20, textAlign: 'center', color: 'white' }}> SIGN UP</Text>
                </PressableScale>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
    },
    contentWrapper: {
        // borderWidth: 3,
        // borderColor: "red",
        marginLeft: Dimensions.get('window').width * 0.05, // 5 percentage of the screen width
        marginRight: Dimensions.get('window').width * 0.05,
    },
    newAccountText: {
        width: '100%',
        alignItems: "center",
    },
    input: {
        height: 48,
        borderWidth: 1.3,
        padding: 10,
        paddingLeft: 18,
        borderRadius: 50,
        marginBottom: 17,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
    },
    registerButton: {
        alignSelf: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        height: 48,
        borderRadius: 50,
        backgroundColor: "#3A602D",
        justifyContent: 'center',
        marginTop: 40,
    },
})

export default WelcomeScreen;