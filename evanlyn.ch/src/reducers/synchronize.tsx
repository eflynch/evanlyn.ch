
const synchronize = (state:string, action:any) => {
    if (action === undefined) {
        return "ok"
    }
    switch (action.type) {
        case 'REMOTESYNC':
            return "pending";
        case 'REMOTESYNC_ERROR':
            return "failed"
        case 'REMOTESYNC_OK':
            return "ok"
        default:
            return state;
    }
}
export default synchronize;
