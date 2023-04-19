export type SisenseDashboardSettings = {
    showToolbar?: boolean
    showLeftPane?: boolean
    showRightPane?: boolean
};

export type SisenseDashboardEmbedProps = {
    sisenseUrl: string,
    urlParams?: string,
    dashboardId: string,
    showLeftPane?: boolean,
    showRightPane?: boolean,
    showToolbar?: boolean,
    editMode?: boolean,
    themeId?: string,
    volatile?: boolean,
    onDashboardLoaded?: (event: any, args: any) => void
    onDashboardFirstLoaded?: (loadedDashboard: any) => void
    unmountShouldDestroySisenseFrame?: boolean
    unmountShouldUnloadEmbedSdk?: boolean
}

export type SisenseDashboardEmbedStates = {
    currentDashboard: any,
    isDashboardEditable: boolean
}