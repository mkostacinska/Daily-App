import React from "react"
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native"

const PressableScale = ({ scale, style, children, ...otherProps }) => {
    return (
        <Pressable style={({ pressed }) => [style, { transform: [{ scale: pressed ? (scale ?? 1.03) : 1 }] }]} {...otherProps}>
            {children}
        </Pressable>
    )
}

export default PressableScale;