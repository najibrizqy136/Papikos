import React,{Fragment} from 'react'
import {Text,Button} from 'react-native'


export default class Home extends React.Component{
    static navigationOptions = {
        header: null,
    };
     render(){
         return(
             <>
                <Text>Home : On Development</Text>
                <Button onPress = {()=>this.props.navigation.push('ProductMap')} title='Search'/>
             </>
             
         )
     }
}