
import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import CodePush from '@react-native-oh-tpl/react-native-code-push';
import ProgressBarModal from './ProgressBarModal';
class App extends Component<any,any>{
    constructor(props:any) {
        super(props);
        this.state={
            progressModalVisible:false,
            syncMessage:'',
            progress:{}
        }
    }
    componentDidMount() {
        console.log('开始检查更新')
        this.syncImmediate(); //开始检查更新
    }
    syncImmediate() {
        CodePush.sync(
            {
                updateDialog: {
                    appendReleaseDescription: true, //是否显示更新description，默认为false
                    descriptionPrefix: '更新内容：', //更新说明的前缀。 默认是” Description:
                    mandatoryContinueButtonLabel: '立即更新', //强制更新的按钮文字，默认为continue
                    mandatoryUpdateMessage: '', //- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
                    optionalIgnoreButtonLabel: '稍后', //非强制更新时，取消按钮文字,默认是ignore
                    optionalInstallButtonLabel: '后台更新', //非强制更新时，确认文字. Defaults to “Install”
                    optionalUpdateMessage: '有新版本了，是否更新？', //非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
                    title: '更新提示', //要显示的更新通知的标题. Defaults to “Update available”.
                },
            },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this),
        );
    }

    codePushStatusDidChange(syncStatus:string|number) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({syncMessage: 'Checking for update.'});
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({syncMessage: 'Downloading package.',progressModalVisible:true});
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({syncMessage: 'Awaiting user action.'});
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({syncMessage: 'Installing update.',progressModalVisible:true});
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({syncMessage: 'App up to date.', progress: false});
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({syncMessage: 'Update cancelled by user.', progress: false,});
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({syncMessage: 'Update installed and will be applied on restart.', progress: false,});
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({syncMessage: 'An unknown error occurred.', progress: false,});
                break;
        }
    }

    codePushDownloadDidProgress(progress:any) {
        this.setState({progress});
    }


    render(){
        let progressView;
        if (this.state.progress) {
            let total:any = (this.state.progress.totalSize/(1024*1024)).toFixed(2);
            let received:any =(this.state.progress.receiveSize/(1024*1024)).toFixed(2);
            let progress:number = (received/total)*100;
                  progressView = (
                      <ProgressBarModal
                          progress={progress}
                          totalPackageSize={total}
                          receivedPackageSize={received}
                          progressModalVisible={this.state.progressModalVisible}
                      />
                      
                  );
        }
        return(
            <View style={styles.container}>
                <Text style={styles.welcome}>欢迎使用热更新--test!</Text>
                <Text>SyncStatus: { this.state.syncMessage}</Text>
                <Text>{this.state.progressModalVisible.toString()}</Text>
                <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
                    <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
                </TouchableOpacity>
                { progressView }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        paddingTop: 10,
    },
    welcome:{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    syncButton: {
        color: 'green',
        fontSize: 17,
    },
})

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};


export default CodePush(codePushOptions)(App);
