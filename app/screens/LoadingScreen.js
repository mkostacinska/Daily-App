import { prodErrorMap } from 'firebase/auth';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { auth } from '../../firebase';


function LoadingScreen(props) {
    useEffect(() => {
        auth.onAuthStateChanged((a) => {
            console.log(auth.currentUser);

            if (auth.currentUser) {
                props.navigation.navigate("Landing");
            }
            else {
                props.navigation.navigate("SignUp");
            }
        });

    }, []);

    return (
        <Text>HE</Text>
    );
}

export default LoadingScreen;