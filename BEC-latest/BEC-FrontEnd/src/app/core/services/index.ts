import { LocalStorageService } from './local-storage.service'
import { ValidatorService } from './validator.service';
import { MessageService } from './message.service';
import { LoadingScreenService } from "./loading-screen.service";
import { NotificationService } from "./notification.service"

export const services = [
    LocalStorageService,
    MessageService,
    ValidatorService,
    LoadingScreenService,
    NotificationService

];

export * from "./local-storage.service";
export * from "./message.service";
export * from "./validator.service";
export * from "./loading-screen.service";
export * from "./notification.service"
