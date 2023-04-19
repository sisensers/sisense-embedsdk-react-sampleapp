import React, { createRef } from 'react';

import { SisenseDashboardSettings, SisenseDashboardEmbedProps, SisenseDashboardEmbedStates } from './embedSdkTypes'

var embedSdk: any
var sisenseFrame: any
var sisenseContainerElementId: string = 'sisense-container'


let dashboardSettings: SisenseDashboardSettings = {
    showLeftPane: false,
    showRightPane: false,
    showToolbar: false
}

const loadEmbedSdk = (url: string) => {
    if (document.querySelector(`script[script-name="sisenseEmbedSdk"]`)) {
        return Promise.resolve(); // already exists
    }
    const script = document.createElement('script');
    script.src = url;
    script.setAttribute('script-name', 'sisenseEmbedSdk');
    document.head.appendChild(script);
    const promise = new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
    });
    return promise;
};

const openDashboard = (dashboardId: string, editMode = false) => {
    if (sisenseFrame && sisenseFrame.dashboard && sisenseFrame.dashboard.iframeReady) {
        sisenseFrame.dashboard.open(dashboardId, editMode)//.then(() => {
        //sisenseDashboard = sisenseFrame.dashboard
        //})
    }
}

const toggleShowLeftPane = (enabled: boolean) => {
    dashboardSettings.showLeftPane = enabled
    sisenseFrame.updateSettings(dashboardSettings)
}

const toggleShowRightPane = (enabled: boolean) => {
    dashboardSettings.showRightPane = enabled
    sisenseFrame.updateSettings(dashboardSettings)
}

const toggleShowToolbar = (enabled: boolean) => {
    dashboardSettings.showToolbar = enabled
    sisenseFrame.updateSettings(dashboardSettings)
}

const setTheme = (themeId: string) => {
    if (sisenseFrame && sisenseFrame.app) {
        sisenseFrame.app.setTheme(themeId).then(function () {
            console.debug('new theme applied: ', themeId);
        });
    }
}

const SisenseDashboardEmbed = class extends React.Component<SisenseDashboardEmbedProps, SisenseDashboardEmbedStates>
{
    sisenseContainerElement: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>()

    constructor(props: any) {
        super(props);
        this.state = {
            currentDashboard: undefined,
            isDashboardEditable: false
        };
        this._dashboardLoaded = this._dashboardLoaded.bind(this);
        this._setDashboardSettingsFromProps = this._setDashboardSettingsFromProps.bind(this);
    }

    render(): React.ReactNode {
        return (
            <div
                ref={this.sisenseContainerElement}
                id={sisenseContainerElementId}
                style={{ height: '80vh' }}
            >
            </div>
        )
    }

    _dashboardLoaded(args: any) {

        this.setState({
            currentDashboard: args.dashboard,
            isDashboardEditable: args.dashboard.userAuth.dashboards.toggle_edit_mode
        });

        let containerElement: any = this.sisenseContainerElement.current
        if (containerElement) {
            containerElement.getElementsByTagName('iframe')[0].style.height = '80vh'
        }

        //call custom onLoaded handler passed into props
        if (this.props.onDashboardLoaded) {
            this.props.onDashboardLoaded(this, args)
        }
    }

    _setDashboardSettingsFromProps() {
        sisenseFrame.updateSettings(dashboardSettings)
    }

    componentDidMount(): void {

        const embedSdkUrl = this.props.sisenseUrl + '/js/frame.js'

        loadEmbedSdk(embedSdkUrl).then(() => {
            embedSdk = (window as any)['sisense.embed']

            typeof (this.props.showLeftPane) === "undefined" ? dashboardSettings.showLeftPane = false : dashboardSettings.showLeftPane = this.props.showLeftPane
            typeof (this.props.showRightPane) === "undefined" ? dashboardSettings.showRightPane = false : dashboardSettings.showRightPane = this.props.showRightPane
            typeof (this.props.showToolbar) === "undefined" ? dashboardSettings.showToolbar = false : dashboardSettings.showToolbar = this.props.showToolbar

            if (this.props.dashboardId !== '' && this.sisenseContainerElement.current) {
                if (typeof (sisenseFrame) === "undefined") {
                    sisenseFrame = new embedSdk.SisenseFrame({
                        url: this.props.sisenseUrl,
                        dashboard: this.props.dashboardId,
                        settings: dashboardSettings,
                        theme: this.props.themeId,
                        volatile: this.props.volatile,
                    })

                    if(this.props.urlParams){
                        sisenseFrame._element.src += '&' + this.props.urlParams
                    }
                }

                sisenseFrame.render(this.sisenseContainerElement.current).then((dash: any) => {
                    if (sisenseFrame._state.dashboard !== this.props.dashboardId) {
                        openDashboard(this.props.dashboardId)
                    }
                    sisenseFrame.dashboard.on(embedSdk.enums.DashboardEventType.LOADED, this._dashboardLoaded)

                    //workaround for https://sisenseglobal.atlassian.net/browse/SNS-63556
                    sisenseFrame.widget.on(embedSdk.enums.WidgetEventType.LOADED, function () {
                        sisenseFrame.updateSettings({ showToolbar: true, showLeftPane: true, showRightPane: true })
                    });
                    sisenseFrame.widget.on(embedSdk.enums.WidgetEventType.UNLOADED, this._setDashboardSettingsFromProps);

                })

                //when dashboard is first loaded, pass dashboard object into onDashboardFirstLoaded handler fucntion, passed from parent via props
                if (this.props.onDashboardFirstLoaded) this.props.onDashboardFirstLoaded(sisenseFrame.dashboard)
            }
        });
    }

    componentDidUpdate(prevProps: SisenseDashboardEmbedProps) {
        if (this.props.showLeftPane !== prevProps.showLeftPane) {
            toggleShowLeftPane(this.props.showLeftPane || false);
        }
        if (this.props.showRightPane !== prevProps.showRightPane) {
            toggleShowRightPane(this.props.showRightPane || false);
        }
        if (this.props.showToolbar !== prevProps.showToolbar) {
            toggleShowToolbar(this.props.showToolbar || false);
        }
        if (this.props.dashboardId !== prevProps.dashboardId || this.props.editMode !== prevProps.editMode) {
            openDashboard(this.props.dashboardId, this.props.editMode)
        }
        if (this.props.themeId !== prevProps.themeId) {
            setTheme(this.props.themeId || '')
        }
        if (this.props.volatile !== prevProps.volatile) {
            //only possible to delete and recreate sisenseFrame??
        }
    }

    componentWillUnmount(): void {
        if (sisenseFrame && sisenseFrame.dashboard){
            sisenseFrame.dashboard.off(embedSdk.enums.DashboardEventType.LOADED, this._dashboardLoaded)
        }
        // clean up anything needed
        // - cleaning everything has performance impact between different pages as need to reload embedSDK
        if (this.props.unmountShouldDestroySisenseFrame) {
            sisenseFrame = undefined
        }
        if (this.props.unmountShouldUnloadEmbedSdk) {
            embedSdk = undefined
            delete (window as any)['sisense.embed']
            let embedSdkTags = document.querySelectorAll('[script-name="sisenseEmbedSdk"]');
            embedSdkTags.forEach((tag) => {
                tag.remove();
            });

        }
    }
}

export default SisenseDashboardEmbed

export type { SisenseDashboardSettings, SisenseDashboardEmbedProps, SisenseDashboardEmbedStates }