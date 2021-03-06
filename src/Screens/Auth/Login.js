import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {loginUser} from '../../Redux/Action/auth';
// import { Icon} from 'native-base';

import logo from '../../Assets/loginLogo.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        password: '',
      },
      showToast: false,
      isLoading: false,
      device_id: '',
    };
  }

  handleSignup = () => {
    this.props.navigation.navigate('Register');
  };

  handleChange = (name, value) => {
    let newFormData = {...this.state.formData};
    newFormData[name] = value;
    this.setState({
      formData: newFormData,
    });
  };

  handleSubmit = async () => {
    const {formData, device_id} = this.state;
    await this.props
      .dispatch(loginUser(formData.username, formData.password, device_id))
      .then(async res => {
        if (res.action.payload.data.status === 400) {
          this.setState({formData: {username: '', password: ''}});
          ToastAndroid.show(
            `${res.action.payload.message}`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        } else {
          const tokenUser = this.props.auth.User.token;
          const user_id = this.props.auth.User.data[0].id.toString();
          const avatar = this.props.auth.User.data[0].photo.toString();
          const name = this.props.auth.User.data[0].fullname.toString();
          console.warn(avatar, name);
          await AsyncStorage.setItem('tokenUser', tokenUser);
          await AsyncStorage.setItem('logged', 'user');
          await AsyncStorage.setItem('user_id', user_id);
          await AsyncStorage.setItem('avatar', avatar);
          await AsyncStorage.setItem('name', name);
          ToastAndroid.show(
            `${res.action.payload.data.message}`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          this.props.navigation.navigate('Home');
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount = async () => {
    const device_id = await AsyncStorage.getItem('idponsel');
    this.setState({device_id});
  };

  render() {
    const {isLoading, formData} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.content}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>
              Please login if you already a member
            </Text>
            <TextInput
              placeholder="Username"
              keyboardType="default"
              value={formData.username}
              onChangeText={text => this.handleChange('username', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={text => this.handleChange('password', text)}
              style={styles.input}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={this.handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.center}>
              <Text style={styles.bottomText}>
                Don't have an account ? &nbsp;
                <Text
                  style={styles.bottomTextLink}
                  onPress={() => this.props.navigation.navigate('Register')}>
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1AB0D3',
  },
  content: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  title: {
    marginBottom: 30,
    color: '#F3F1F3',
    alignSelf: 'center',
    fontSize: 15,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ddd6f3',
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: 160,
    borderRadius: 20,
  },
  loginButton: {
    backgroundColor: '#1C8CD1',
    height: 45,
    fontSize: 20,
    marginVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    alignSelf: 'center',
  },
  bottomText: {
    fontSize: 15,
    color: '#ccc',
  },
  bottomTextLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Login);
