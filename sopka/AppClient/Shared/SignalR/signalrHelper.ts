import * as signalR from "@aspnet/signalr";

export default class SignalRHelper {

    private static connection: signalR.HubConnection | null = null;
    private static observers: string[] = [];

    public static async connect() {
        if (SignalRHelper.connection == null) {
            SignalRHelper.connection = new signalR.HubConnectionBuilder()
                .withUrl(window.baseUrl + "companyhub")
                .configureLogging(signalR.LogLevel.Debug)
                .build();
            
            await SignalRHelper.start();
        }
    }    
    
    public static async start() {
        try {
            if (SignalRHelper.connection) {
                await SignalRHelper.connection.start();
            }

        } catch (err) {
            console.warn(err);
            setTimeout(() => {
                if (SignalRHelper.connection) {
                    SignalRHelper.connection.start();
                }
            }, 5000);
        }

        if (SignalRHelper.connection) {
            SignalRHelper.connection.onclose(async () => {
                if (SignalRHelper.connection) {
                    await SignalRHelper.connection.start();
                }
            });
        }
    }
    public static subscribe(entity: string, callback: ({method, payload, connectionId}:
                     {method: string, payload: any, connectionId: string|undefined}) => void) {
        if (SignalRHelper.connection) {
            if (SignalRHelper.observers.includes(entity)) {
                throw new Error(`${entity} observer already exists`);
            }

            SignalRHelper.connection.on(entity, (method, payload, connectionId) => {
                callback({
                    method,
                    payload,
                    connectionId
                });
            });
            this.observers.push(entity);
        } else {
            throw new Error("No connection");
        }
    }

    public static unsubscribe(entity: string) {
        if (SignalRHelper.connection){
            SignalRHelper.connection.off(entity);
        }
    }

    public static isMyConnection(connectionid?: string): boolean {
        if (SignalRHelper.connection && connectionid) {
            if (SignalRHelper.connection.connectionId) {
                return SignalRHelper.connection.connectionId === connectionid;
            }
        }
        return false;
    }
}
