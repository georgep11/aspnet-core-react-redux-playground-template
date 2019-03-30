﻿import { toast } from 'react-toastify';
import * as SignalR from '@aspnet/signalr';
import { renderToastifyMsg } from '../../utils/renderToastifyMsg';

/**
 * SignalR defaults
 */
const signalrService = {
    BASE_URL: 'http://localhost:56717/hubs/users',
    CONNECTION_DELAY: 0,
    HUB_MESSAGE_DELAY: 3000,
    HUB_MESSAGE_TITLE: 'Hub Message',
    LOGIN_USER_EVENT: 'UserLogin',
    LOGOUT_USER_EVENT: 'UserLogout',
    CLOSE_EVENT: 'CloseAllConnections',
    TOASTIFY_ICON: 'info'
};

/**
 * SignalR API abstraction layer communication - configures/manages hub connections (typescript singleton pattern)
 */
class SignalRService {
    private _isConnected: boolean = false;
    private _hubConnection!: SignalR.HubConnection;
    private static _signalRService: SignalRService;

    private constructor() {
        this.createConnection();
        this.registerOnServerEvents();
    }

    public static get Instance(): SignalRService {
        return this._signalRService || (this._signalRService = new this());
    }

    public startConnection(): void {
        // HubConnection.state does not exist in versions of  <= 1.0.0
        // Had to downgrade since there is an existing bug around server-side rendering and some typeings
        // Also need to define absolute path for hub url and not just /hubs/users in lower packages
        // Uncomment after bug is resolved and package @aspnet/signalr is upgraded to latest / remove _isConnected code
        //if (this._hubConnection.state === SignalR.HubConnectionState.Connected)
        //    return;

        if (this._isConnected)
            return;

        setTimeout(() => {
            this._hubConnection.start()
                .then(() => {
                    this._isConnected = true;
                })
                .catch((error) => {
                    console.error(error.toString());
                });
        }, signalrService.CONNECTION_DELAY);
    }

    private createConnection(): void {
        this._hubConnection = new SignalR.HubConnectionBuilder()
            .withUrl(signalrService.BASE_URL)
            .build();
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on(signalrService.LOGIN_USER_EVENT, () => {
            setTimeout(() => {
                toast.info(renderToastifyMsg('A user has logged in (SignalR)', signalrService.TOASTIFY_ICON));
            }, signalrService.HUB_MESSAGE_DELAY);
        });

        this._hubConnection.on(signalrService.LOGOUT_USER_EVENT, () => {
            setTimeout(() => {
                toast.info(renderToastifyMsg('A user has logged out (SignalR)', signalrService.TOASTIFY_ICON));
            }, signalrService.HUB_MESSAGE_DELAY);
        });

        this._hubConnection.on(signalrService.CLOSE_EVENT, (reason: string) => {
            this._hubConnection.stop().then(() => {
                setTimeout(() => {
                    this._isConnected = false;
                    toast.info(renderToastifyMsg(`All hub connections closed (SignalR) - ${reason}`, signalrService.TOASTIFY_ICON));
                }, signalrService.HUB_MESSAGE_DELAY);
            });
        });
    }
}

export const SignalRApi = SignalRService.Instance;